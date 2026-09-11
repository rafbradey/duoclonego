import { allLevels, allLessons, allUnits } from "../data/levels/index.js";

/**
 * Retrieves all levels across all sections and units.
 * @returns {Promise<Array>} Array of level definitions
 */
export async function getLevels() {
    return allLevels;
}

/**
 * Retrieves a level by its unique identifier.
 * Also supports legacy lesson ID queries for backward compatibility.
 * @param {string} levelId - Level or lesson ID (e.g. 'level_001' or 'lesson_001')
 * @returns {Promise<Object|null>} Level object or null
 */
export async function getLevelById(levelId) {
    if (!levelId) return null;

    // First direct match
    const directMatch = allLevels.find((l) => l.id === levelId);
    if (directMatch) return directMatch;

    // Legacy fallback (e.g. lesson_001 -> level_001)
    const normalizedId = levelId.replace(/^lesson_/, "level_");
    const fallbackMatch = allLevels.find((l) => l.id === normalizedId);
    return fallbackMatch || null;
}

/**
 * Checks whether a level is unlocked according to Duoclongo's progression rules:
 * - Level 1 of Unit 1 is always unlocked
 * - Normal levels require the previous normal level in that unit to be completed
 * - Unit Mastery requires all normal levels in that unit to be completed
 * - Level 1 of subsequent units requires the previous unit's mastery to be completed
 *
 * @param {string|Object} levelOrId - Level object or level ID
 * @param {Object} user - User profile containing completed_lessons
 * @returns {boolean} Whether the level is unlocked
 */
export function isLevelUnlocked(levelOrId, user) {
    if (!levelOrId) return false;
    const levelId = typeof levelOrId === "string" ? levelOrId : levelOrId.id;
    const completed = Array.isArray(user?.completed_lessons) ? user.completed_lessons : [];

    const isCompleted = (id) => {
        if (!id) return false;
        const clean = String(id);
        const legacy = clean.replace(/^level_/, "lesson_");
        const modern = clean.replace(/^lesson_/, "level_");
        return completed.includes(clean) || completed.includes(legacy) || completed.includes(modern);
    };

    if (isCompleted(levelId)) return true;

    for (let uIdx = 0; uIdx < allUnits.length; uIdx++) {
        const unit = allUnits[uIdx];
        const normalLevels = unit.normalLevels || (unit.levels || []).filter((l) => l.type === "level");
        const mastery = unit.masteryLevel || (unit.levels || []).find((l) => l.type === "unit_mastery");

        const normalIdx = normalLevels.findIndex((l) => l.id === levelId);
        if (normalIdx !== -1) {
            // Level 1 of Unit 1 is always unlocked
            if (uIdx === 0 && normalIdx === 0) return true;

            // Level 2 or 3 in unit: unlocked when previous level is completed
            if (normalIdx > 0) {
                return isCompleted(normalLevels[normalIdx - 1]?.id);
            }

            // Level 1 of Unit 2, 3, 4: unlocked when previous unit's mastery challenge is completed
            if (normalIdx === 0 && uIdx > 0) {
                const prevUnit = allUnits[uIdx - 1];
                const prevMastery = prevUnit?.masteryLevel || (prevUnit?.levels || []).find((l) => l.type === "unit_mastery");
                return prevMastery ? isCompleted(prevMastery.id) : false;
            }
        }

        if (mastery && mastery.id === levelId) {
            // Unit Mastery unlocked when all normal levels of that unit are completed
            return normalLevels.length > 0 && normalLevels.every((l) => isCompleted(l.id));
        }
    }

    return false;
}

/**
 * Resolves the next consecutive level in the curriculum.
 * Returns null if the current level is the final level of the entire curriculum.
 *
 * @param {string} currentLessonOrLevelId - Current level or lesson ID
 * @param {Object} user - User profile to evaluate unlock status
 * @returns {{ level: Object, route: string, isUnlocked: boolean }|null}
 */
export function getNextLevel(currentLessonOrLevelId, user) {
    if (!currentLessonOrLevelId) return null;
    const cleanId = String(currentLessonOrLevelId);
    const modernId = cleanId.replace(/^lesson_/, "level_");

    const idx = allLevels.findIndex((l) => l.id === cleanId || l.id === modernId);
    if (idx === -1 || idx >= allLevels.length - 1) {
        return null; // Final level of the curriculum or not found
    }

    const nextLevel = allLevels[idx + 1];

    // Evaluate unlock state assuming the current level has just been completed
    const effectiveUser = user ? {
        ...user,
        completed_lessons: Array.isArray(user.completed_lessons)
            ? (user.completed_lessons.includes(cleanId) || user.completed_lessons.includes(modernId)
                ? user.completed_lessons
                : [...user.completed_lessons, cleanId])
            : [cleanId]
    } : null;

    const unlocked = isLevelUnlocked(nextLevel.id, effectiveUser);

    let route = `/lesson/${nextLevel.id}`;
    if (nextLevel.type === "unit_mastery" || nextLevel.isMasteryLevel) {
        const unitNumber = nextLevel.unitNumber || (nextLevel.unitId ? String(nextLevel.unitId).replace(/\D/g, "") : "1");
        route = `/unit/${unitNumber}/mastery`;
    }

    return {
        level: nextLevel,
        route,
        isUnlocked: unlocked
    };
}

/**
 * Retrieves all levels belonging to a specific unit.
 * @param {string} unitId - Unit identifier (e.g. 'unit_001')
 * @returns {Promise<Array>} Array of levels in the unit
 */
export async function getLevelsByUnit(unitId) {
    return allLevels.filter((l) => l.unit_id === unitId || l.unitId === unitId);
}

/**
 * Legacy getter: Retrieves all lessons (aliased to levels).
 * @deprecated Prefer getLevels()
 * @returns {Promise<Array>} Array of lessons
 */
export async function getLessons() {
    return allLessons;
}

/**
 * Legacy getter: Retrieves a lesson by ID (aliased to getLevelById).
 * @deprecated Prefer getLevelById()
 * @param {string} lessonId
 * @returns {Promise<Object|null>}
 */
export async function getLessonById(lessonId) {
    return getLevelById(lessonId);
}

/**
 * Legacy getter: Retrieves lessons by unit.
 * @deprecated Prefer getLevelsByUnit()
 * @param {string} unitId
 * @returns {Promise<Array>}
 */
export async function getLessonsByUnit(unitId) {
    return getLevelsByUnit(unitId);
}
