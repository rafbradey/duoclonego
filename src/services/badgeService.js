import { allUnits } from "../data/levels/index.js";

const getMasteredCount = (user) => {
    if (!user || !user.srs_records) return 0;
    return Object.values(user.srs_records).filter((rec) => rec && rec.stage >= 3).length;
};

/**
 * Canonical registry of Duoclongo Achievements & Badges.
 * All badges are aligned strictly with the 50 verified FDA/ISMP Look-Alike / Sound-Alike medication pairs
 * and core curriculum progression milestones.
 */
export const BADGES_REGISTRY = [
    {
        id: "badge_tall_man_first",
        title: "First Distinction",
        tier: "bronze",
        category: "tall_man",
        iconName: "Pencil",
        description: "Complete your first lesson and recognize official Tall Man lettering.",
        targetValue: 1,
        calculateProgress: (user) => {
            const completed = user?.completed_lessons?.length || 0;
            return {
                currentValue: Math.min(1, completed),
                targetValue: 1,
                percentage: completed >= 1 ? 100 : 0,
                isUnlocked: completed >= 1
            };
        }
    },
    {
        id: "badge_stem_specialist",
        title: "Stem Specialist",
        tier: "bronze",
        category: "curriculum",
        iconName: "Layers",
        description: "Master Unit 1: Look-Alike Stems & Generic Confusions (buPROPion, hydrALAZINE, predniSONE).",
        targetValue: 4,
        calculateProgress: (user) => {
            const unit1 = allUnits.find((u) => u.id === "unit_001") || allUnits[0];
            const unitLevels = unit1?.levels || [];
            const completed = (user?.completed_lessons || []).filter((id) =>
                unitLevels.some((lvl) => lvl.id === id)
            ).length;
            const isUnlocked = Boolean(
                unit1?.masteryLevel && user?.completed_lessons?.includes(unit1.masteryLevel.id)
            );
            return {
                currentValue: completed,
                targetValue: unitLevels.length || 4,
                percentage: isUnlocked ? 100 : Math.round((completed / (unitLevels.length || 4)) * 100),
                isUnlocked
            };
        }
    },
    {
        id: "badge_oncology_sentinel",
        title: "Oncology Sentinel",
        tier: "silver",
        category: "curriculum",
        iconName: "ShieldAlert",
        description: "Master Unit 2: High-Alert & Oncology/Critical Care Pairs (CARBOplatin, vinBLAStine, epiNEPHrine).",
        targetValue: 4,
        calculateProgress: (user) => {
            const unit2 = allUnits.find((u) => u.id === "unit_002") || allUnits[1];
            const unitLevels = unit2?.levels || [];
            const completed = (user?.completed_lessons || []).filter((id) =>
                unitLevels.some((lvl) => lvl.id === id)
            ).length;
            const isUnlocked = Boolean(
                unit2?.masteryLevel && user?.completed_lessons?.includes(unit2.masteryLevel.id)
            );
            return {
                currentValue: completed,
                targetValue: unitLevels.length || 4,
                percentage: isUnlocked ? 100 : Math.round((completed / (unitLevels.length || 4)) * 100),
                isUnlocked
            };
        }
    },
    {
        id: "badge_suffix_master",
        title: "Suffix Master",
        tier: "silver",
        category: "curriculum",
        iconName: "Sparkles",
        description: "Master Unit 3: Suffix Distinctions & Antimicrobial/CNS Look-Alikes (ceFAZolin, fentaNYL).",
        targetValue: 4,
        calculateProgress: (user) => {
            const unit3 = allUnits.find((u) => u.id === "unit_003") || allUnits[2];
            const unitLevels = unit3?.levels || [];
            const completed = (user?.completed_lessons || []).filter((id) =>
                unitLevels.some((lvl) => lvl.id === id)
            ).length;
            const isUnlocked = Boolean(
                unit3?.masteryLevel && user?.completed_lessons?.includes(unit3.masteryLevel.id)
            );
            return {
                currentValue: completed,
                targetValue: unitLevels.length || 4,
                percentage: isUnlocked ? 100 : Math.round((completed / (unitLevels.length || 4)) * 100),
                isUnlocked
            };
        }
    },
    {
        id: "badge_brand_guardian",
        title: "Brand Guardian",
        tier: "gold",
        category: "curriculum",
        iconName: "Award",
        description: "Master Unit 4: High-Risk Brand Name Look-Alikes & Formulations (Humalog, ZyPREXA, TopAMAX).",
        targetValue: 4,
        calculateProgress: (user) => {
            const unit4 = allUnits.find((u) => u.id === "unit_004") || allUnits[3];
            const unitLevels = unit4?.levels || [];
            const completed = (user?.completed_lessons || []).filter((id) =>
                unitLevels.some((lvl) => lvl.id === id)
            ).length;
            const isUnlocked = Boolean(
                unit4?.masteryLevel && user?.completed_lessons?.includes(unit4.masteryLevel.id)
            );
            return {
                currentValue: completed,
                targetValue: unitLevels.length || 4,
                percentage: isUnlocked ? 100 : Math.round((completed / (unitLevels.length || 4)) * 100),
                isUnlocked
            };
        }
    },
    {
        id: "badge_mastery_capstone",
        title: "Capstone Conqueror",
        tier: "gold",
        category: "mastery",
        iconName: "Trophy",
        description: "Successfully complete a Unit Mastery Challenge with 100% unassisted Tall Man construction.",
        targetValue: 1,
        calculateProgress: (user) => {
            const completedLessons = user?.completed_lessons || [];
            const masteryCompleted = allUnits.filter((u) =>
                u.masteryLevel && completedLessons.includes(u.masteryLevel.id)
            ).length;
            return {
                currentValue: Math.min(1, masteryCompleted),
                targetValue: 1,
                percentage: masteryCompleted >= 1 ? 100 : 0,
                isUnlocked: masteryCompleted >= 1
            };
        }
    },
    {
        id: "badge_srs_scholar",
        title: "Memory Scholar",
        tier: "silver",
        category: "retention",
        iconName: "Brain",
        description: "Retain and master 5 verified LASA pairs to Stage 3 in Spaced Repetition (SRS).",
        targetValue: 5,
        calculateProgress: (user) => {
            const masteredCount = getMasteredCount(user);
            const target = 5;
            return {
                currentValue: Math.min(target, masteredCount),
                targetValue: target,
                percentage: Math.min(100, Math.round((masteredCount / target) * 100)),
                isUnlocked: masteredCount >= target
            };
        }
    },
    {
        id: "badge_srs_champion",
        title: "Memory Champion",
        tier: "gold",
        category: "retention",
        iconName: "Flame",
        description: "Retain and master 15 verified LASA pairs to Stage 3 in Spaced Repetition (SRS).",
        targetValue: 15,
        calculateProgress: (user) => {
            const masteredCount = getMasteredCount(user);
            const target = 15;
            return {
                currentValue: Math.min(target, masteredCount),
                targetValue: target,
                percentage: Math.min(100, Math.round((masteredCount / target) * 100)),
                isUnlocked: masteredCount >= target
            };
        }
    },
    {
        id: "badge_remediation_hero",
        title: "Mistake Crusher",
        tier: "bronze",
        category: "practice",
        iconName: "CheckCircle",
        description: "Complete at least 3 practice sessions and keep your flagged mistakes queue clear.",
        targetValue: 3,
        calculateProgress: (user) => {
            const sessions = user?.practice_sessions_completed || 0;
            const mistakes = (user?.mistakes_queue || []).length;
            const isUnlocked = sessions >= 3 && mistakes === 0;
            return {
                currentValue: Math.min(3, sessions),
                targetValue: 3,
                percentage: isUnlocked ? 100 : Math.min(90, Math.round((sessions / 3) * 100)),
                isUnlocked
            };
        }
    },
    {
        id: "badge_lasa_grandmaster",
        title: "LASA Grandmaster",
        tier: "platinum",
        category: "mastery",
        iconName: "Crown",
        description: "Complete all 4 curriculum units and master at least 25 canonical LASA pairs.",
        targetValue: 4,
        calculateProgress: (user) => {
            const completedLessons = user?.completed_lessons || [];
            const unitsMastered = allUnits.filter((u) =>
                u.masteryLevel && completedLessons.includes(u.masteryLevel.id)
            ).length;
            const masteredPairs = getMasteredCount(user);
            const isUnlocked = unitsMastered >= 4 && masteredPairs >= 25;
            const pct = Math.min(100, Math.round(((unitsMastered / 4) * 0.6 + (Math.min(25, masteredPairs) / 25) * 0.4) * 100));
            return {
                currentValue: unitsMastered,
                targetValue: 4,
                percentage: isUnlocked ? 100 : pct,
                isUnlocked
            };
        }
    }
];

/**
 * Evaluates all badges against the user's progress.
 * @param {Object} user - Current user object
 * @returns {{ badges: Object[], unlockedCount: number, totalCount: number, completionPercentage: number }}
 */
export function getUserBadges(user) {
    if (!user) {
        return {
            badges: BADGES_REGISTRY.map((b) => ({
                ...b,
                currentValue: 0,
                targetValue: b.targetValue,
                percentage: 0,
                isUnlocked: false
            })),
            unlockedCount: 0,
            totalCount: BADGES_REGISTRY.length,
            completionPercentage: 0
        };
    }

    const evaluated = BADGES_REGISTRY.map((badge) => {
        const progress = badge.calculateProgress(user);
        return {
            id: badge.id,
            title: badge.title,
            tier: badge.tier,
            category: badge.category,
            iconName: badge.iconName,
            description: badge.description,
            currentValue: progress.currentValue,
            targetValue: progress.targetValue,
            percentage: progress.percentage,
            isUnlocked: progress.isUnlocked
        };
    });

    const unlockedCount = evaluated.filter((b) => b.isUnlocked).length;
    const totalCount = evaluated.length;
    const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

    return {
        badges: evaluated,
        unlockedCount,
        totalCount,
        completionPercentage
    };
}

/**
 * Checks for any newly unlocked badges by comparing before/after state.
 * @param {Object} prevUser - Previous user state
 * @param {Object} nextUser - Updated user state
 * @returns {Object[]} Array of newly unlocked badge definitions
 */
export function getNewlyUnlockedBadges(prevUser, nextUser) {
    if (!nextUser) return [];

    const prevEvaluation = getUserBadges(prevUser);
    const nextEvaluation = getUserBadges(nextUser);

    const prevUnlockedIds = new Set(
        prevEvaluation.badges.filter((b) => b.isUnlocked).map((b) => b.id)
    );

    return nextEvaluation.badges.filter((b) => b.isUnlocked && !prevUnlockedIds.has(b.id));
}
