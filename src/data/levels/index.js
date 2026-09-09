import unit1 from "./section-1/unit-1.json" with { type: "json" };
import unit2 from "./section-1/unit-2.json" with { type: "json" };

/**
 * Normalizes a unit object to ensure backward and forward property compatibility
 * across camelCase and legacy snake_case callers.
 */
function normalizeUnit(unit) {
    const lessons = (unit.lessons || []).map((lesson) => ({
        ...lesson,
        lesson_title: lesson.lessonTitle || lesson.title,
        title: lesson.title || lesson.lessonTitle,
        unit_id: lesson.unitId || unit.id,
        unitId: lesson.unitId || unit.id,
        xp: lesson.xpReward || lesson.xp || 15,
        xpReward: lesson.xpReward || lesson.xp || 15,
        xp_reward: lesson.xpReward || lesson.xp || 15
    }));

    return {
        ...unit,
        unit_message: unit.unitMessage || unit.unit_message || "",
        unitMessage: unit.unitMessage || unit.unit_message || "",
        lessons
    };
}

// Registry of all units across sections
export const rawUnits = [unit1, unit2];
export const allUnits = rawUnits.map(normalizeUnit);

// Flattened registry of all individual lessons across units
export const allLessons = allUnits.flatMap((unit) => unit.lessons);
