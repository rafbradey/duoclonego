import { allLevels, allLessons } from "../data/levels/index.js";

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
