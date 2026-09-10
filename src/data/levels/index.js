import unit1 from "./section-1/unit-1.json" with { type: "json" };
import unit2 from "./section-1/unit-2.json" with { type: "json" };
import unit3 from "./section-1/unit-3.json" with { type: "json" };
import unit4 from "./section-2/unit-1.json" with { type: "json" };

/**
 * Normalizes a level object supporting the explicit hierarchy:
 * Section -> Unit -> Level -> Lesson -> Activity -> Question
 */
function normalizeLevel(level, unit) {
    // If level specifies explicit lessons, extract activities from each lesson;
    // otherwise fallback to level.activities and synthesize a default lesson container
    const rawLessons = Array.isArray(level.lessons)
        ? level.lessons
        : Array.isArray(level.activities)
            ? [{
                id: `${level.id}_lesson_01`,
                title: level.title || level.name,
                learningObjective: level.learningObjective || "",
                activities: level.activities
              }]
            : [];

    const lessons = rawLessons.map((lsn) => ({
        ...lsn,
        levelId: level.id,
        unitId: level.unitId || unit.id,
        sectionId: unit.sectionId || "section-1",
        sectionTitle: unit.sectionTitle || "Section 1: Foundations",
        activities: (lsn.activities || []).map((act) => {
            const isFinalActivity = Boolean(act.isFinalTask || act.activityRole === "unit_mastery");
            const activityRole = act.activityRole || (isFinalActivity ? "unit_mastery" : "guided_practice");

            const normalizedQuestions = (act.questions || []).map((q) => {
                const isFinal = Boolean(
                    q.isFinalTask ||
                    isFinalActivity ||
                    q.activityRole === "unit_mastery" ||
                    activityRole === "unit_mastery"
                );
                const role = q.activityRole || activityRole;

                return {
                    ...q,
                    activityId: act.id,
                    activityType: act.activityType || act.type || "recognition",
                    activityRole: role,
                    isFinalTask: isFinal,
                    activityObjective: act.learningObjective || level.learningObjective || "",
                    sectionId: unit.sectionId || "section-1",
                    sectionTitle: unit.sectionTitle || "Section 1: Foundations",
                    unitId: level.unitId || unit.id,
                    levelId: level.id,
                    lessonId: lsn.id
                };
            });

            return {
                ...act,
                lessonId: lsn.id,
                levelId: level.id,
                unitId: level.unitId || unit.id,
                sectionId: unit.sectionId || "section-1",
                activityRole,
                isFinalTask: isFinalActivity,
                questions: normalizedQuestions
            };
        })
    }));

    const activities = lessons.flatMap((lsn) => lsn.activities || []);
    const questions = activities.flatMap((act) => act.questions || []);

    const normalized = {
        ...level,
        unitId: level.unitId || unit.id,
        unit_id: level.unitId || unit.id,
        sectionId: unit.sectionId || "section-1",
        sectionTitle: unit.sectionTitle || "Section 1: Foundations",
        title: level.title || level.name,
        lesson_title: level.title || level.name,
        lessonTitle: level.title || level.name,
        xp: level.xpReward || level.xp || 15,
        xpReward: level.xpReward || level.xp || 15,
        xp_reward: level.xpReward || level.xp || 15,
        unlocked: Boolean(level.unlocked),
        learningObjective: level.learningObjective || "",
        lessons,
        activities,
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
export const rawUnits = [unit1, unit2, unit3, unit4];
export const allUnits = rawUnits.map(normalizeUnit);

// Flattened registry of all individual levels across units
export const allLevels = allUnits.flatMap((unit) => unit.levels);

// Backward-compatible alias for lessons
export const allLessons = allLevels;
