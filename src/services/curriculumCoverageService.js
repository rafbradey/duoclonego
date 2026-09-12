/**
 * Curriculum Coverage Audit & Verification Service.
 *
 * Provides authoritative methods to inspect, audit, and guarantee the two core coverage rules:
 * 1. TALL MAN COVERAGE (TERM LEVEL): Every applicable medication term with canonical Tall Man
 *    representation receives >= 1 Tall Man challenge before Unit Mastery.
 * 2. SOUND-ALIKE COVERAGE (PAIR LEVEL): Every verified sound-alike pair receives >= 1 sound challenge
 *    before Unit Mastery. Look-alike-only pairs never receive artificial sound challenges.
 */

import { getLasaPairById } from "./questionGenerator.js";

/**
 * Checks if a drug name string exhibits canonical Tall Man capitalization
 * (i.e. distinguishing uppercase segments beyond a simple brand initial capital).
 *
 * @param {string} name - Medication name string
 * @returns {boolean}
 */
export function hasTallManLettering(name) {
    if (!name || typeof name !== "string") return false;
    const trimmed = name.trim();
    const lower = trimmed.toLowerCase();
    if (trimmed === lower) return false;

    // Check if more than just the first letter is capitalized,
    // or if a lowercase letter precedes a capital letter (e.g. buPROPion, clonazePAM)
    const upperChars = trimmed.split("").filter((c) => c >= "A" && c <= "Z");
    if (upperChars.length > 1) return true;
    if (upperChars.length === 1 && trimmed[0] >= "a" && trimmed[0] <= "z") return true;

    return false;
}

/**
 * Extracts all applicable medication terms with canonical Tall Man lettering from a set of pairs.
 * Tracks terms individually (TERM-based, Drug A and Drug B separately).
 *
 * @param {Object[]} pairRecords - Authoritative LASA pair records
 * @returns {Array<{ term: string, pairId: string, side: "A"|"B", drug: Object }>}
 */
export function getUnitApplicableTallManTerms(pairRecords) {
    if (!Array.isArray(pairRecords)) return [];
    const terms = [];

    pairRecords.forEach((rawPair) => {
        const pair = (rawPair.drugA && rawPair.drugB) ? rawPair : (getLasaPairById(rawPair.id) || rawPair);
        if (pair.drugA && hasTallManLettering(pair.drugA.tallManName)) {
            terms.push({
                term: pair.drugA.tallManName,
                pairId: pair.id,
                side: "A",
                drug: pair.drugA
            });
        }
        if (pair.drugB && hasTallManLettering(pair.drugB.tallManName)) {
            terms.push({
                term: pair.drugB.tallManName,
                pairId: pair.id,
                side: "B",
                drug: pair.drugB
            });
        }
    });

    return terms;
}

/**
 * Extracts all verified sound-alike pairs from a set of pairs.
 * (PAIR-based: look-alike-only pairs are excluded).
 *
 * @param {Object[]} pairRecords - Authoritative LASA pair records
 * @returns {Object[]}
 */
export function getUnitVerifiedSoundAlikePairs(pairRecords) {
    if (!Array.isArray(pairRecords)) return [];
    return pairRecords.map((rawPair) => {
        return (rawPair.drugA && rawPair.drugB) ? rawPair : (getLasaPairById(rawPair.id) || rawPair);
    }).filter((pair) => Boolean(pair.verifiedSoundAlike));
}

/**
 * Audits a unit's curriculum levels and questions against the mandatory coverage requirements.
 *
 * @param {Object} unit - Unit object containing levels, activities, questions, and lasaPairs
 * @returns {Object} Comprehensive audit report
 */
export function auditUnitCoverage(unit) {
    if (!unit) return null;

    const unitId = unit.id;
    const unitNumber = unit.unitNumber || unit.unit_number || 1;
    const rawPairs = Array.isArray(unit.lasaPairs) ? unit.lasaPairs : [];
    const pairs = rawPairs.map((p) => (p.drugA && p.drugB ? p : (getLasaPairById(p.id) || p)));

    // Resolve full pair records if unit.lasaPairs only has lightweight objects
    const applicableTallManTerms = getUnitApplicableTallManTerms(pairs);
    const verifiedSoundAlikePairs = getUnitVerifiedSoundAlikePairs(pairs);

    const levels = Array.isArray(unit.levels) ? unit.levels : [];
    const instructionalLevels = levels.filter(
        (lvl) => lvl.type !== "unit_mastery" && !lvl.isMasteryLevel && !lvl.id?.includes("mastery")
    );
    const masteryLevel = levels.find(
        (lvl) => lvl.type === "unit_mastery" || lvl.isMasteryLevel || lvl.id?.includes("mastery")
    );

    // Track instructional exposures (Levels 1 to 5)
    const coveredTallManTermSet = new Set();
    const coveredSoundAlikePairSet = new Set();
    const coveredLasaPairSet = new Set();
    const lookAlikeSoundViolations = [];

    instructionalLevels.forEach((lvl) => {
        const questions = Array.isArray(lvl.questions)
            ? lvl.questions
            : (lvl.activities || []).flatMap((a) => a.questions || []);

        questions.forEach((q) => {
            // Track LASA pair exposure
            if (q.lasaId) {
                coveredLasaPairSet.add(q.lasaId);
            }

            // Track Tall Man exposure
            const isTallManQuestion = Boolean(
                q.type === "tall_man" ||
                q.subtype === "tall_man_mcq" ||
                q.subtype === "tall_man_fill_in" ||
                q.isTallManChoice
            );

            if (isTallManQuestion) {
                const term = q.tallManName || q.correctAnswer || q.relatedDrug;
                if (term && hasTallManLettering(term)) {
                    coveredTallManTermSet.add(term);
                }
            }

            // Track Sound-Alike exposure
            const isSoundQuestion = Boolean(
                q.type === "sound_alike" ||
                q.subtype === "acoustic_mcq" ||
                q.subtype === "read_back" ||
                q.activityType === "acoustic_discrimination"
            );

            if (isSoundQuestion && q.lasaId) {
                // Verify that the pair is actually verified sound-alike
                const pairRecord = pairs.find((p) => p.id === q.lasaId);
                if (pairRecord && !pairRecord.verifiedSoundAlike) {
                    lookAlikeSoundViolations.push({
                        questionId: q.id,
                        lasaId: q.lasaId,
                        levelId: lvl.id,
                        reason: "Look-alike-only pair received sound-alike challenge"
                    });
                } else {
                    coveredSoundAlikePairSet.add(q.lasaId);
                }
            }
        });
    });

    // Check Unit Mastery: Mastery must NOT introduce required content for the first time
    const masteryViolations = [];
    if (masteryLevel) {
        const masteryQuestions = Array.isArray(masteryLevel.questions)
            ? masteryLevel.questions
            : (masteryLevel.activities || []).flatMap((a) => a.questions || []);

        masteryQuestions.forEach((q) => {
            if (q.lasaId && !coveredLasaPairSet.has(q.lasaId)) {
                masteryViolations.push({
                    questionId: q.id,
                    lasaId: q.lasaId,
                    reason: `Mastery introduced LASA pair ${q.lasaId} for the first time`
                });
            }

            const isTallManQuestion = Boolean(
                q.type === "tall_man" ||
                q.subtype === "tall_man_mcq" ||
                q.subtype === "tall_man_fill_in" ||
                q.isTallManChoice
            );

            if (isTallManQuestion) {
                const term = q.tallManName || q.correctAnswer || q.relatedDrug;
                if (term && hasTallManLettering(term) && !coveredTallManTermSet.has(term)) {
                    masteryViolations.push({
                        questionId: q.id,
                        term,
                        reason: `Mastery introduced Tall Man term "${term}" for the first time`
                    });
                }
            }

            const isSoundQuestion = Boolean(
                q.type === "sound_alike" ||
                q.subtype === "acoustic_mcq" ||
                q.subtype === "read_back"
            );

            if (isSoundQuestion && q.lasaId && !coveredSoundAlikePairSet.has(q.lasaId)) {
                masteryViolations.push({
                    questionId: q.id,
                    lasaId: q.lasaId,
                    reason: `Mastery introduced sound-alike pair ${q.lasaId} for the first time`
                });
            }
        });
    }

    // Uncovered items
    const uncoveredTallManTerms = applicableTallManTerms.filter(
        (t) => !coveredTallManTermSet.has(t.term)
    );
    const uncoveredSoundAlikePairs = verifiedSoundAlikePairs.filter(
        (p) => !coveredSoundAlikePairSet.has(p.id)
    );
    const uncoveredLasaPairs = pairs.filter(
        (p) => !coveredLasaPairSet.has(p.id)
    );

    const totalTallMan = applicableTallManTerms.length;
    const coveredTallManCount = totalTallMan - uncoveredTallManTerms.length;
    const tallManCoveragePct = totalTallMan > 0
        ? Math.round((coveredTallManCount / totalTallMan) * 100)
        : 100;

    const totalSoundAlike = verifiedSoundAlikePairs.length;
    const coveredSoundAlikeCount = totalSoundAlike - uncoveredSoundAlikePairs.length;
    const soundAlikeCoveragePct = totalSoundAlike > 0
        ? Math.round((coveredSoundAlikeCount / totalSoundAlike) * 100)
        : 100;

    return {
        unitId,
        unitNumber,
        instructionalLevelsCount: instructionalLevels.length,
        hasMasteryLevel: Boolean(masteryLevel),
        totalApplicableTallManTerms: totalTallMan,
        coveredTallManTermsCount: coveredTallManCount,
        coveredTallManTerms: Array.from(coveredTallManTermSet),
        uncoveredTallManTerms,
        tallManCoveragePct,
        totalVerifiedSoundAlikePairs: totalSoundAlike,
        coveredSoundAlikePairsCount: coveredSoundAlikeCount,
        coveredSoundAlikePairs: Array.from(coveredSoundAlikePairSet),
        uncoveredSoundAlikePairs,
        soundAlikeCoveragePct,
        totalLasaPairs: pairs.length,
        coveredLasaPairsCount: coveredLasaPairSet.size,
        uncoveredLasaPairs,
        lookAlikeSoundViolations,
        masteryViolations,
        isFullyCovered: (
            tallManCoveragePct === 100 &&
            soundAlikeCoveragePct === 100 &&
            uncoveredLasaPairs.length === 0 &&
            lookAlikeSoundViolations.length === 0 &&
            masteryViolations.length === 0
        )
    };
}
