import unit1 from "./section-1/unit-1.json" with { type: "json" };
import unit2 from "./section-1/unit-2.json" with { type: "json" };

/**
 * Normalizes a level object and flattens activity questions for evaluation.
 */
function normalizeLevel(level, unit) {
    const questions = (level.activities || []).flatMap((act) => act.questions || []);

    const normalized = {
        ...level,
        unitId: level.unitId || unit.id,
        unit_id: level.unitId || unit.id,
        title: level.title || level.name,
        lesson_title: level.title || level.name,
        lessonTitle: level.title || level.name,
        xp: level.xpReward || level.xp || 15,
        xpReward: level.xpReward || level.xp || 15,
        xp_reward: level.xpReward || level.xp || 15,
        unlocked: Boolean(level.unlocked),
        learningObjective: level.learningObjective || "",
        questions
    };

    return normalized;
}

/**
 * Normalizes a unit object to ensure backward and forward property compatibility
 * across camelCase, legacy snake_case, and levels/lessons accessors.
 */
function normalizeUnit(unit) {
    // Each unit contains a configurable number of levels (unit.levels)
    const rawLevels = Array.isArray(unit.levels)
        ? unit.levels
        : Array.isArray(unit.lessons)
            ? unit.lessons
            : [];

    const levels = rawLevels.map((lvl) => normalizeLevel(lvl, unit));

    // Lessons alias pointing to normalized levels for seamless backward compatibility
    const lessons = levels;

    return {
        ...unit,
        unit_message: unit.unitMessage || unit.unit_message || "",
        unitMessage: unit.unitMessage || unit.unit_message || "",
        levels,
        lessons
    };
}

// Registry of all units across sections
export const rawUnits = [unit1, unit2];
export const allUnits = rawUnits.map(normalizeUnit);

// Flattened registry of all individual levels across units
export const allLevels = allUnits.flatMap((unit) => unit.levels);

// Backward-compatible alias for lessons
export const allLessons = allLevels;
