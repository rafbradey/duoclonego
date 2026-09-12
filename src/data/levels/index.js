import unit1 from "./section-1/unit-1.json" with { type: "json" };
import unit2 from "./section-1/unit-2.json" with { type: "json" };
import unit3 from "./section-1/unit-3.json" with { type: "json" };
import unit4 from "./section-2/unit-1.json" with { type: "json" };
import { getLasaPairsByIds } from "../../services/questionGenerator.js";

/**
 * Normalizes a level object supporting the explicit hierarchy:
 * Section -> Unit -> Level -> Lesson -> Activity -> Question
 */
function normalizeLevel(level, unit) {
    const isMastery = Boolean(
        level.type === "unit_mastery" ||
        level.id?.includes("mastery")
    );
    const levelType = isMastery ? "unit_mastery" : (level.type || "level");

    const sectionNumMatch = (unit.sectionId || "").match(/\d+/);
    const sectionNumber = sectionNumMatch ? Number(sectionNumMatch[0]) : 1;
    const unitNumber = unit.unitNumber || unit.unit_number || (unit.id ? Number(unit.id.replace(/\D/g, "")) : 1);
    const unitTitle = unit.description || unit.title || `Unit ${unitNumber}`;

    const levelNumber = isMastery
        ? "M"
        : (level.levelNumber || (level.id?.match(/\d+/) ? Number(level.id.match(/\d+/)[0]) : 1));
    const levelTitle = level.title || level.name || (isMastery ? "Unit Mastery Challenge" : `Level ${levelNumber}`);

    const originLabel = isMastery
        ? `Section ${sectionNumber} • Unit Mastery • Unit ${unitNumber}`
        : `Section ${sectionNumber} • Level ${levelNumber} • Unit ${unitNumber}`;

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
        sectionNumber,
        sectionTitle: unit.sectionTitle || "Section 1: Foundations",
        activities: (lsn.activities || []).map((act) => {
            const isFinalActivity = Boolean(act.isFinalTask || act.id?.includes("capstone"));
            const activityRole = act.activityRole || (isFinalActivity ? "unit_mastery" : "guided_practice");

            const normalizedQuestions = (act.questions || []).map((q) => {
                const isFinal = Boolean(
                    q.isFinalTask ||
                    isFinalActivity ||
                    q.id?.includes("capstone")
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
                    sectionNumber,
                    sectionTitle: unit.sectionTitle || "Section 1: Foundations",
                    unitId: level.unitId || unit.id,
                    unitNumber,
                    unitTitle,
                    levelId: level.id,
                    levelNumber,
                    levelTitle,
                    isMastery,
                    originLabel,
                    lessonId: lsn.id
                };
            });

            return {
                ...act,
                lessonId: lsn.id,
                levelId: level.id,
                unitId: level.unitId || unit.id,
                sectionId: unit.sectionId || "section-1",
                sectionNumber,
                unitNumber,
                levelNumber,
                activityRole,
                isFinalTask: isFinalActivity,
                questions: normalizedQuestions
            };
        })
    }));

    const activities = lessons.flatMap((lsn) => lsn.activities || []);
    const questions = activities.flatMap((act) => act.questions || []);

    const lasaPairIds = Array.isArray(level.lasaPairIds) && level.lasaPairIds.length > 0
        ? level.lasaPairIds
        : (Array.isArray(unit.lasaPairs) ? unit.lasaPairs.map((p) => p.id) : []);
    const lasaPairs = getLasaPairsByIds(lasaPairIds);

    const normalized = {
        ...level,
        type: levelType,
        isMasteryLevel: isMastery,
        unitId: level.unitId || unit.id,
        unit_id: level.unitId || unit.id,
        unitNumber,
        unitTitle,
        sectionId: unit.sectionId || "section-1",
        sectionNumber,
        sectionTitle: unit.sectionTitle || "Section 1: Foundations",
        levelNumber,
        levelTitle,
        title: level.title || level.name,
        lesson_title: level.title || level.name,
        lessonTitle: level.title || level.name,
        xp: level.xpReward || level.xp || (isMastery ? 25 : 15),
        xpReward: level.xpReward || level.xp || (isMastery ? 25 : 15),
        xp_reward: level.xpReward || level.xp || (isMastery ? 25 : 15),
        unlocked: Boolean(level.unlocked),
        learningObjective: level.learningObjective || "",
        originLabel,
        lasaPairIds,
        lasaPairs,
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
    const normalLevels = levels.filter((lvl) => lvl.type === "level");
    const masteryLevel = levels.find((lvl) => lvl.type === "unit_mastery") || null;

    const sectionNumMatch = (unit.sectionId || "").match(/\d+/);
    const sectionNumber = sectionNumMatch ? Number(sectionNumMatch[0]) : 1;
    const unitNumber = unit.unitNumber || unit.unit_number || (unit.id ? Number(unit.id.replace(/\D/g, "")) : 1);

    return {
        ...unit,
        sectionNumber,
        unitNumber,
        unit_message: unit.unitMessage || unit.unit_message || "",
        unitMessage: unit.unitMessage || unit.unit_message || "",
        subtitle: unit.subtitle || "",
        lasaPairs: unit.lasaPairs || [],
        levels,
        lessons,
        normalLevels,
        masteryLevel
    };
}

// Registry of all units across sections
export const rawUnits = [unit1, unit2, unit3, unit4];
export const allUnits = rawUnits.map(normalizeUnit);

// Flattened registry of all individual levels across units
export const allLevels = allUnits.flatMap((unit) => unit.levels);

// Backward-compatible alias for lessons
export const allLessons = allLevels;

// Global question origin lookup maps
export const questionOriginMap = new Map();
export const lasaOriginMap = new Map();

allLevels.forEach((lvl) => {
    (lvl.questions || []).forEach((q) => {
        if (q && q.id) {
            const origin = {
                sectionNumber: q.sectionNumber || lvl.sectionNumber || 1,
                sectionTitle: q.sectionTitle || lvl.sectionTitle || "Section 1",
                unitNumber: q.unitNumber || lvl.unitNumber || 1,
                unitTitle: q.unitTitle || lvl.unitTitle || `Unit ${q.unitNumber || 1}`,
                levelNumber: q.levelNumber || lvl.levelNumber || 1,
                levelTitle: q.levelTitle || lvl.levelTitle || `Level ${q.levelNumber || 1}`,
                isMastery: Boolean(q.isMastery || lvl.isMasteryLevel),
                originLabel: q.originLabel || lvl.originLabel
            };
            questionOriginMap.set(q.id, origin);
            if (q.lasaId && !lasaOriginMap.has(q.lasaId)) {
                lasaOriginMap.set(q.lasaId, origin);
            }
        }
    });
});

/**
 * Formats a question origin object into user-facing curriculum path text.
 * Follows Learning Path UI terminology: "Section 1 • Level 1 • Unit 2"
 *
 * @param {Object} origin
 * @returns {string}
 */
export function formatQuestionOrigin(origin) {
    if (!origin) return "";
    if (origin.originLabel) return origin.originLabel;
    const isMastery = Boolean(origin.isMastery || origin.levelNumber === "M" || origin.type === "unit_mastery");
    const secNum = origin.sectionNumber || 1;
    const unitNum = origin.unitNumber || 1;
    if (isMastery) {
        return `Section ${secNum} • Unit Mastery • Unit ${unitNum}`;
    }
    const lvlNum = origin.levelNumber || 1;
    return `Section ${secNum} • Level ${lvlNum} • Unit ${unitNum}`;
}

/**
 * Resolves the Learning Path origin for a given question object or question ID.
 *
 * @param {Object|string} questionOrId - Question object or question ID
 * @returns {Object|null}
 */
export function getQuestionOrigin(questionOrId) {
    if (!questionOrId) return null;
    if (typeof questionOrId === "object" && questionOrId.originLabel) {
        return {
            sectionNumber: questionOrId.sectionNumber || 1,
            sectionTitle: questionOrId.sectionTitle || "Section 1",
            unitNumber: questionOrId.unitNumber || 1,
            unitTitle: questionOrId.unitTitle || `Unit ${questionOrId.unitNumber || 1}`,
            levelNumber: questionOrId.levelNumber || 1,
            levelTitle: questionOrId.levelTitle || `Level ${questionOrId.levelNumber || 1}`,
            isMastery: Boolean(questionOrId.isMastery),
            originLabel: questionOrId.originLabel
        };
    }
    const qId = typeof questionOrId === "string" ? questionOrId : questionOrId.id;
    if (qId && questionOriginMap.has(qId)) {
        return questionOriginMap.get(qId);
    }
    if (typeof questionOrId === "object" && questionOrId.lasaId && lasaOriginMap.has(questionOrId.lasaId)) {
        return lasaOriginMap.get(questionOrId.lasaId);
    }
    return null;
}
