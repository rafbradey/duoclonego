import lasaPairsData from "../data/lasaPairs.json" with { type: "json" };
import { getUnitApplicableTallManTerms } from "./curriculumCoverageService.js";

/**
 * Question Generator Service.
 * Generates the 3 core Duoclongo question types strictly from verified LASA pair records:
 * - Type A: Tall Man Lettering Recognition (Capitalization distinction of the SAME drug)
 * - Type B: LASA Pair Recognition (Identifies verified look-alike counterpart)
 * - Type C: Pair Memorization & Interactive Tap-to-Match (Consolidates confusable pairs)
 * - Type D: Unassisted Tall Man Mastery Capstone (Constructed response)
 *
 * Adheres strictly to the three-tier data separation:
 * Tier A: Learning Data (medication names, Tall Man forms, LASA pairs)
 * Tier B: Feedback Metadata (risk_summary, post-answer insight only)
 * Tier C: Source/Verification Metadata (proof_reference, source, source_url)
 */

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * Deterministic fallback generator for Tall Man capitalization distractors
 * of the SAME medication name.
 */
function getSameDrugCapitalizationVariants(tallMan) {
    const rawLower = tallMan.toLowerCase();
    const len = rawLower.length;
    const candidates = [];

    const isBrand = tallMan[0] >= "A" && tallMan[0] <= "Z" && tallMan.length > 1;

    // Pattern 1: Prefix capitalization
    const p1End = Math.min(len - 1, Math.max(2, Math.floor(len * 0.45)));
    candidates.push(rawLower.slice(0, p1End).toUpperCase() + rawLower.slice(p1End));

    // Pattern 2: Suffix capitalization
    const p2Start = Math.max(1, Math.floor(len * 0.55));
    candidates.push(rawLower.slice(0, p2Start) + rawLower.slice(p2Start).toUpperCase());

    // Pattern 3: Short suffix capitalization
    if (len >= 6) {
        candidates.push(rawLower.slice(0, len - 3) + rawLower.slice(len - 3).toUpperCase());
    }

    // Pattern 4: Middle letters capitalized
    const midStart = Math.max(1, Math.floor(len * 0.25));
    const midEnd = Math.min(len - 1, midStart + Math.max(2, Math.floor(len * 0.4)));
    candidates.push(rawLower.slice(0, midStart) + rawLower.slice(midStart, midEnd).toUpperCase() + rawLower.slice(midEnd));

    const unique = [];
    for (let c of candidates) {
        if (isBrand && c[0] >= "a" && c[0] <= "z") {
            c = c[0].toUpperCase() + c.slice(1);
        }
        if (c !== tallMan && !unique.includes(c)) {
            unique.push(c);
        }
        if (unique.length === 3) break;
    }

    return unique;
}

/**
 * Generates a Type A: Tall Man Lettering Recognition question.
 * The learner identifies the correct Tall Man capitalization for a target medication.
 * Strict Rule: Choices MUST be capitalization variants of the SAME medication name.
 */
export function generateTallManRecognitionQuestion(lasaRecord, { drugSide = "A", idSuffix = "" } = {}) {
    const targetDrug = drugSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const counterpartDrug = drugSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;

    const rawDistractors = drugSide === "A"
        ? (lasaRecord.tallManDistractorsA || [])
        : (lasaRecord.tallManDistractorsB || []);

    const distractors = rawDistractors.length >= 3
        ? rawDistractors.slice(0, 3)
        : getSameDrugCapitalizationVariants(targetDrug.tallManName);

    const choices = shuffleArray([targetDrug.tallManName, ...distractors.slice(0, 3)]);
    const pairDisplay = `${lasaRecord.drugA?.tallManName || ""} ↔ ${lasaRecord.drugB?.tallManName || ""}`;

    return {
        id: `q_tm_${lasaRecord.id}_${drugSide}${idSuffix ? `_${idSuffix}` : ""}`,
        type: "multiple_choice",
        subtype: "tall_man_mcq",
        isTallManChoice: true,
        activityType: "construction",
        learningObjective: "Recognize the correct ISMP/FDA Tall Man lettering representation.",
        lasaId: lasaRecord.id,
        prompt: `Which is the correct Tall Man lettering for ${targetDrug.genericName || targetDrug.brandName || targetDrug.tallManName}?`,
        choices,
        correctAnswer: targetDrug.tallManName,
        explanation: `${targetDrug.tallManName} uses capitalized Tall Man lettering to distinguish it from its confusable counterpart ${counterpartDrug.tallManName || counterpartDrug.genericName}.`,
        relatedDrug: targetDrug.tallManName,
        // Tier B: Feedback metadata (post-answer only)
        riskSummary: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        feedbackFact: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        // Tier C: Source / Verification metadata
        source: lasaRecord.source || "FDA Name Differentiation Project & ISMP Tall Man List",
        sourceCitation: lasaRecord.sourceCitation || "",
        sourceUrl: lasaRecord.sourceUrl || "",
        pairDisplay
    };
}

/**
 * Generates a Type B: LASA Pair Recognition question.
 * The learner identifies which medication forms a documented LASA confusion pair with the prompt drug.
 * Choices consist of the real counterpart and real drug names from the canonical dataset.
 */
export function generateLasaPairRecognitionQuestion(lasaRecord, { promptSide = "A", idSuffix = "" } = {}) {
    const promptDrug = promptSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const correctDrug = promptSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;
    const distractors = lasaRecord.distractors || [];

    const promptDisplayName = promptDrug.tallManName || promptDrug.brandName || promptDrug.genericName;
    const correctDisplayName = correctDrug.tallManName || correctDrug.brandName || correctDrug.genericName;

    const choices = shuffleArray([correctDisplayName, ...distractors.slice(0, 3)]);
    const pairDisplay = `${lasaRecord.drugA?.tallManName || ""} ↔ ${lasaRecord.drugB?.tallManName || ""}`;

    return {
        id: `q_pair_${lasaRecord.id}_${promptSide}${idSuffix ? `_${idSuffix}` : ""}`,
        type: "multiple_choice",
        activityType: "identification",
        learningObjective: "Identify documented Look-Alike / Sound-Alike medication counterparts.",
        lasaId: lasaRecord.id,
        prompt: `Which medication is commonly confused with ${promptDisplayName}?`,
        choices,
        correctAnswer: correctDisplayName,
        explanation: `${promptDisplayName} and ${correctDisplayName} form a documented ISMP/FDA LASA pair.`,
        relatedDrug: promptDisplayName,
        // Tier B: Feedback metadata
        riskSummary: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        feedbackFact: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        // Tier C: Source / Verification metadata
        source: lasaRecord.source || "FDA Name Differentiation Project & ISMP Tall Man List",
        sourceCitation: lasaRecord.sourceCitation || "",
        sourceUrl: lasaRecord.sourceUrl || "",
        pairDisplay
    };
}

/**
 * Generates a Type C: Pair Memorization & Interactive Tap-to-Match question.
 * Connects 3–4 confusable pairs for active memory consolidation.
/**
 * Normalizes an array of matching pairs to ensure:
 * 1. Each PRIMARY medication represents exactly ONE medication.
 * 2. If a pair was provided with compound names (e.g. "A / B" or "A ↔ B"), it is split into single medication items.
 * 3. No duplicate medication names appear in the left column.
 *
 * @param {Array} rawPairs - Array of raw pair items
 * @returns {Array} Clean array of { left, right } pairs
 */
export function normalizeMatchingPairs(rawPairs) {
    if (!Array.isArray(rawPairs)) return [];

    const normalized = [];
    const usedLeft = new Set();
    const usedRight = new Set();

    for (const item of rawPairs) {
        if (!item) continue;

        let left = item.left || item.primary || (item.drugA ? (item.drugA.tallManName || item.drugA.genericName) : "");
        let right = item.right || item.counterpart || (item.drugB ? (item.drugB.tallManName || item.drugB.genericName) : "");

        if (!left && typeof item === "string") {
            left = item;
        }

        // If left contains a compound delimiter like " / ", " ↔ ", or " - " (when separating two drugs)
        if (typeof left === "string" && (left.includes(" / ") || left.includes(" ↔ "))) {
            const separator = left.includes(" / ") ? " / " : " ↔ ";
            const parts = left.split(separator).map((s) => s.trim()).filter(Boolean);

            if (parts.length >= 2) {
                // If right is not provided, the compound string contained both medications of the pair
                if (!right) {
                    left = parts[0];
                    right = parts[1];
                } else if (typeof right === "string" && (right.includes(" / ") || right.includes(" ↔ "))) {
                    // Both left and right are compound: split 1-to-1
                    const rParts = right.split(right.includes(" / ") ? " / " : " ↔ ").map((s) => s.trim()).filter(Boolean);
                    parts.forEach((p, idx) => {
                        const r = rParts[idx] || rParts[0];
                        const pLower = p.toLowerCase();
                        if (!usedLeft.has(pLower)) {
                            usedLeft.add(pLower);
                            normalized.push({ left: p, right: r });
                        }
                    });
                    continue;
                } else {
                    // Left contains multiple medications matching to a shared information/counterpart item
                    parts.forEach((p) => {
                        const pLower = p.toLowerCase();
                        if (!usedLeft.has(pLower)) {
                            usedLeft.add(pLower);
                            normalized.push({ left: p, right });
                        }
                    });
                    continue;
                }
            }
        }

        if (left && right) {
            let leftStr = String(left).trim();
            let rightStr = String(right).trim();
            let leftLower = leftStr.toLowerCase();
            let rightLower = rightStr.toLowerCase();

            // If left drug is already in left column, but right is not, swap sides to prevent duplicate
            if (usedLeft.has(leftLower) && !usedLeft.has(rightLower) && !usedRight.has(leftLower)) {
                [leftStr, rightStr] = [rightStr, leftStr];
                [leftLower, rightLower] = [rightLower, leftLower];
            } else if (usedRight.has(rightLower) && !usedLeft.has(rightLower) && !usedRight.has(leftLower)) {
                // If right drug is already in right column, swap sides if left is free on right and right is free on left
                [leftStr, rightStr] = [rightStr, leftStr];
                [leftLower, rightLower] = [rightLower, leftLower];
            }

            if (!usedLeft.has(leftLower) && !usedRight.has(rightLower)) {
                usedLeft.add(leftLower);
                usedRight.add(rightLower);
                normalized.push({ left: leftStr, right: rightStr, lasaId: item.lasaId || item.id });
            }
        }
    }

    return normalized;
}

/**
 * Generates a Type C: Pair Memorization & Interactive Tap-to-Match question.
 * Connects 3–4 confusable pairs for active memory consolidation.
 */
export function generateMatchingQuestion(lasaRecords, { id = "q_match_001" } = {}) {
    const rawPairs = (lasaRecords || []).map((record) => {
        const left = record.drugA?.tallManName || record.drugA?.genericName || record.left || "";
        const right = record.drugB?.tallManName || record.drugB?.genericName || record.right || "";
        return { left, right, lasaId: record.id };
    });

    const pairs = normalizeMatchingPairs(rawPairs).slice(0, 4);

    const explanation = pairs.map((p) => `${p.left} ↔ ${p.right}`).join("; ");
    const firstRecord = (lasaRecords && lasaRecords[0]) || {};
    const pairDisplay = pairs.map((p) => `${p.left} ↔ ${p.right}`).join(", ");

    return {
        id,
        type: "matching",
        activityType: "distinction",
        learningObjective: "Match each medication with its documented confusable counterpart.",
        prompt: "Match each medication with its documented confusable counterpart:",
        pairs,
        explanation: `Documented ISMP LASA pairs: ${explanation}.`,
        relatedDrug: pairs[0]?.left || "",
        // Tier B: Feedback metadata
        riskSummary: firstRecord.riskSummary || firstRecord.distinguishingFeature || "",
        feedbackFact: firstRecord.riskSummary || firstRecord.distinguishingFeature || "",
        // Tier C: Source / Verification metadata
        source: firstRecord.source || "FDA Name Differentiation Project & ISMP Tall Man List",
        sourceCitation: firstRecord.sourceCitation || "",
        sourceUrl: firstRecord.sourceUrl || "",
        pairDisplay
    };
}

/**
 * Generates a Type D: Unassisted Unit Mastery Capstone Tall Man task.
 * The learner independently constructs/types the full Tall Man name without hints.
 */
/**
 * Decomposes a canonical Tall Man medication name into:
 * - prefix: Lowercase leading stem
 * - expectedSegment: Distinguishing uppercase Tall Man segment
 * - suffix: Trailing lowercase stem or modifier (e.g. ' R')
 * Grounded 100% in canonical Tall Man strings.
 *
 * @param {string} name - Canonical Tall Man name (e.g. 'clonazePAM', 'DOBUtamine', 'CeleBREX')
 * @returns {{ prefix: string, expectedSegment: string, suffix: string }}
 */
export function decomposeTallMan(name) {
    if (!name || typeof name !== "string") {
        return { prefix: "", expectedSegment: "", suffix: "" };
    }
    // Brand name with initial capital followed by lowercase, then uppercase Tall Man:
    // e.g. CeleBREX -> prefix: "Cele", expectedSegment: "BREX", suffix: ""
    const matchBrand = name.match(/^([A-Z][a-z]+)([A-Z0-9-]+)(.*)$/);
    if (matchBrand) {
        return {
            prefix: matchBrand[1],
            expectedSegment: matchBrand[2],
            suffix: matchBrand[3] || ""
        };
    }
    // Generic with lowercase prefix, uppercase Tall Man, and optional suffix:
    // e.g. clonazePAM -> prefix: "clonaze", expectedSegment: "PAM", suffix: ""
    // e.g. buPROPion -> prefix: "bu", expectedSegment: "PROP", suffix: "ion"
    // e.g. DOBUtamine -> prefix: "", expectedSegment: "DOBU", suffix: "tamine"
    const matchGeneric = name.match(/^([a-z]*)([A-Z0-9-]+)(.*)$/);
    if (matchGeneric) {
        return {
            prefix: matchGeneric[1],
            expectedSegment: matchGeneric[2],
            suffix: matchGeneric[3] || ""
        };
    }
    return { prefix: "", expectedSegment: name, suffix: "" };
}

/**
 * Generates a Guided Retrieval Tall Man Fill-in-the-Blank question.
 * Requires the learner to actively produce the distinguishing uppercase segment
 * while preserving prefix/suffix context framing (e.g. clonaze____ -> PAM).
 *
 * @param {Object} lasaRecord - Canonical LASA pair record
 * @param {Object} [options]
 * @param {"A"|"B"} [options.drugSide="A"]
 * @param {string} [options.idSuffix=""]
 * @returns {Object} Tall Man Fill-in-the-Blank question definition
 */
export function generateTallManScaffoldQuestion(lasaRecord, { drugSide = "A", idSuffix = "" } = {}) {
    const targetDrug = drugSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const counterpartDrug = drugSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;
    const pairDisplay = `${lasaRecord.drugA?.tallManName || ""} ↔ ${lasaRecord.drugB?.tallManName || ""}`;
    const tallMan = targetDrug.tallManName || targetDrug.genericName || targetDrug.brandName;
    const { prefix, expectedSegment, suffix } = decomposeTallMan(tallMan);

    return {
        id: `q_scaffold_${lasaRecord.id}_${drugSide}${idSuffix ? `_${idSuffix}` : ""}`,
        type: "tall_man",
        subtype: "tall_man_fill_in",
        activityRole: "guided_practice",
        scaffold: true,
        isFinalTask: false,
        lasaId: lasaRecord.id,
        prompt: `Convert this medication name to Tall Man lettering by entering the capitalized letters (${prefix || ""}___${suffix || ""}):`,
        standardName: targetDrug.genericName || targetDrug.brandName,
        tallManName: tallMan,
        prefix,
        expectedSegment,
        suffix,
        correctAnswer: expectedSegment,
        explanation: `${tallMan} capitalizes the distinguishing segment "${expectedSegment}" to disrupt confusion with ${counterpartDrug.tallManName || counterpartDrug.genericName}.`,
        relatedDrug: tallMan,
        riskSummary: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        feedbackFact: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        source: lasaRecord.source || "FDA Name Differentiation Project & ISMP Tall Man List",
        sourceCitation: lasaRecord.sourceCitation || "",
        sourceUrl: lasaRecord.sourceUrl || "",
        pairDisplay
    };
}

/**
 * Generates a Type D: Unassisted Unit Mastery Capstone Tall Man task.
 * The learner independently constructs/types the full Tall Man name without hints.
 */
export function generateTallManMasteryQuestion(lasaRecord, { drugSide = "A", idSuffix = "" } = {}) {
    const targetDrug = drugSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const counterpartDrug = drugSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;
    const pairDisplay = `${lasaRecord.drugA?.tallManName || ""} ↔ ${lasaRecord.drugB?.tallManName || ""}`;

    return {
        id: `q_mastery_${lasaRecord.id}_${drugSide}${idSuffix ? `_${idSuffix}` : ""}`,
        type: "tall_man",
        activityRole: "unit_mastery",
        isFinalTask: true,
        scaffold: false,
        lasaId: lasaRecord.id,
        prompt: "UNIT MASTERY CAPSTONE TASK: Type the complete drug name using correct Tall Man lettering (capitalizing the specific distinguishing letters):",
        standardName: targetDrug.genericName || targetDrug.brandName,
        tallManName: targetDrug.tallManName,
        correctAnswer: targetDrug.tallManName,
        prefix: "",
        expectedSegment: targetDrug.tallManName,
        suffix: "",
        explanation: `${targetDrug.tallManName} capitalizes distinguishing letters to disrupt orthographic confusion with ${counterpartDrug.tallManName || counterpartDrug.genericName}.`,
        relatedDrug: targetDrug.tallManName,
        // Tier B: Feedback metadata
        riskSummary: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        feedbackFact: lasaRecord.riskSummary || lasaRecord.distinguishingFeature || "",
        // Tier C: Source / Verification metadata
        source: lasaRecord.source || "FDA Name Differentiation Project & ISMP Tall Man List",
        sourceCitation: lasaRecord.sourceCitation || "",
        sourceUrl: lasaRecord.sourceUrl || "",
        pairDisplay
    };
}

const pairIndex = new Map();
lasaPairsData.pairs.forEach((p) => {
    pairIndex.set(p.id, p);
    if (p.numericId !== undefined) {
        pairIndex.set(String(p.numericId), p);
        pairIndex.set(Number(p.numericId), p);
    }
});

/**
 * Retrieves all canonical LASA pairs.
 * @returns {Object[]}
 */
export function getAllLasaPairs() {
    return lasaPairsData.pairs;
}

/**
 * Retrieves a verified LASA pair by its ID (e.g., 'lasa_001' or 1).
 * @param {string|number} id
 * @returns {Object|null}
 */
export function getLasaPairById(id) {
    if (id === null || id === undefined) return null;
    return pairIndex.get(id) || pairIndex.get(String(id)) || null;
}

/**
 * Retrieves multiple LASA pairs by their IDs.
 * @param {Array<string|number>} ids
 * @returns {Object[]}
 */
export function getLasaPairsByIds(ids) {
    if (!Array.isArray(ids)) return [];
    return ids.map((id) => getLasaPairById(id)).filter(Boolean);
}

/**
 * Generates a comprehensive activity and question set for a level based on its assigned LASA pairs.
 * Follows the 6-Level Curriculum Architecture (5 Instructional Levels + Unit Mastery):
 * - Level 1: Supported Pair Recognition (Visual Pair & on-demand pronunciation)
 * - Level 2: Orthographic Distinction: Part A (Tall Man Batch A)
 * - Level 3: Orthographic Distinction: Part B & Acoustic Discrimination (Tall Man Batch B + verified sound-alikes)
 * - Level 4: Guided Retrieval & Scaffolding (Tall Man Fill-in-the-Blank for all applicable terms)
 * - Level 5: Memory Consolidation & Verbal Verification (Tap-to-Match + Telephone Read-Back)
 * - Unit Mastery: Mixed Capstone Synthesis (Tests ONLY previously introduced and practiced items)
 *
 * @param {Object} level - Level object containing id, levelNumber, type, etc.
 * @param {Object[]} pairRecords - Array of authoritative LASA pairs in this unit
 * @returns {{ activities: Object[], questions: Object[] }}
 */
export function generateLevelContent(level, pairRecords) {
    if (!Array.isArray(pairRecords) || pairRecords.length === 0) {
        return { activities: [], questions: [] };
    }

    const isMastery = Boolean(level.type === "unit_mastery" || level.id?.includes("mastery"));
    const lvlNum = level.levelNumber || 1;

    const applicableTerms = getUnitApplicableTallManTerms(pairRecords);
    const splitIdx = Math.ceil(applicableTerms.length / 2);
    const batchA = applicableTerms.slice(0, splitIdx);
    const batchB = applicableTerms.slice(splitIdx);
    const verifiedSoundAlikePairs = pairRecords.filter((p) => Boolean(p.verifiedSoundAlike));

    // 1. Level 1: Supported Pair Recognition (visual + on-demand pronunciation)
    if (lvlNum === 1 && !isMastery) {
        const questions = [];
        pairRecords.forEach((pair, idx) => {
            questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "A", idSuffix: `${level.id}_${idx}a` }));
            if (pair.drugB) {
                questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "B", idSuffix: `${level.id}_${idx}b` }));
            }
        });

        const activity = {
            id: `act_${level.id}_recognition`,
            activityType: "identification",
            activityRole: "guided_practice",
            learningObjective: "Recognize documented Look-Alike / Sound-Alike medication counterparts with visual and auditory pronunciation support.",
            sessionQuestionCount: Math.min(questions.length, 6),
            questions
        };

        return { activities: [activity], questions };
    }

    // 2. Level 2: Orthographic Distinction: Part A (Tall Man Batch A)
    if (lvlNum === 2 && !isMastery) {
        const questions = [];
        batchA.forEach((termItem, idx) => {
            const pair = pairRecords.find((p) => p.id === termItem.pairId);
            if (pair) {
                questions.push(generateTallManRecognitionQuestion(pair, { drugSide: termItem.side, idSuffix: `${level.id}_${idx}` }));
            }
        });

        // Fallback supplement if batchA is small
        if (questions.length < 6) {
            pairRecords.forEach((pair, idx) => {
                questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "A", idSuffix: `supp_${idx}` }));
            });
        }

        const activity = {
            id: `act_${level.id}_tall_man_batch_a`,
            activityType: "construction",
            activityRole: "guided_practice",
            learningObjective: "Identify correct ISMP/FDA Tall Man capitalization to differentiate look-alike medications (Batch A).",
            sessionQuestionCount: Math.min(questions.length, 6),
            questions
        };

        return { activities: [activity], questions };
    }

    // 3. Level 3: Orthographic Distinction: Part B & Acoustic Discrimination
    if (lvlNum === 3 && !isMastery) {
        const tallManQuestions = [];
        batchB.forEach((termItem, idx) => {
            const pair = pairRecords.find((p) => p.id === termItem.pairId);
            if (pair) {
                tallManQuestions.push(generateTallManRecognitionQuestion(pair, { drugSide: termItem.side, idSuffix: `${level.id}_${idx}` }));
            }
        });

        const tallManActivity = {
            id: `act_${level.id}_tall_man_batch_b`,
            activityType: "construction",
            activityRole: "guided_practice",
            learningObjective: "Identify correct ISMP/FDA Tall Man capitalization to differentiate look-alike medications (Batch B).",
            sessionQuestionCount: Math.min(tallManQuestions.length, 4),
            questions: tallManQuestions
        };

        // Acoustic Sound-Alike Discrimination strictly for verified sound-alike pairs
        const soundQuestions = [];
        verifiedSoundAlikePairs.forEach((pair, idx) => {
            const sq = generateSoundAlikeQuestion(pair, {
                drugSide: idx % 2 === 0 ? "A" : "B",
                subtype: "acoustic_mcq",
                idSuffix: `${level.id}_snd_${idx}`
            });
            if (sq) soundQuestions.push(sq);
        });

        const soundActivity = {
            id: `act_${level.id}_acoustic_discrimination`,
            activityType: "acoustic_discrimination",
            activityRole: "guided_practice",
            learningObjective: "Distinguish spoken Sound-Alike medication names through acoustic discrimination.",
            sessionQuestionCount: Math.min(soundQuestions.length, 2),
            questions: soundQuestions
        };

        const activities = soundQuestions.length > 0 ? [tallManActivity, soundActivity] : [tallManActivity];
        const allQuestions = [...tallManQuestions, ...soundQuestions];

        return { activities, questions: allQuestions };
    }

    // 4. Level 4: Guided Retrieval & Scaffolding (Tall Man Fill-in-the-Blank)
    if (lvlNum === 4 && !isMastery) {
        const scaffoldQuestions = [];
        applicableTerms.forEach((termItem, idx) => {
            const pair = pairRecords.find((p) => p.id === termItem.pairId);
            if (pair) {
                scaffoldQuestions.push(generateTallManScaffoldQuestion(pair, { drugSide: termItem.side, idSuffix: `${level.id}_${idx}` }));
            }
        });

        const fillInActivity = {
            id: `act_${level.id}_guided_fill_in`,
            activityType: "construction",
            activityRole: "guided_practice",
            learningObjective: "Actively construct distinguishing Tall Man segments before unassisted recall.",
            sessionQuestionCount: Math.min(scaffoldQuestions.length, 6),
            questions: scaffoldQuestions
        };

        return { activities: [fillInActivity], questions: scaffoldQuestions };
    }

    // 5. Level 5: Memory Consolidation & Verbal Verification
    if (lvlNum === 5 && !isMastery) {
        // Activity 1: Matching
        const matchQuestions = [];
        for (let i = 0; i < pairRecords.length; i += 4) {
            const chunk = pairRecords.slice(i, i + 4);
            if (chunk.length >= 2) {
                matchQuestions.push(generateMatchingQuestion(chunk, { id: `q_match_${level.id}_${i}` }));
            }
        }

        const matchingActivity = {
            id: `act_${level.id}_matching`,
            activityType: "distinction",
            activityRole: "guided_practice",
            learningObjective: "Match each medication with its documented confusable counterpart.",
            sessionQuestionCount: Math.min(matchQuestions.length, 2),
            questions: matchQuestions
        };

        // Activity 2: Simulated Telephone Read-Back for verified sound-alike pairs
        const readBackQuestions = [];
        verifiedSoundAlikePairs.forEach((pair, idx) => {
            const rb = generateSoundAlikeQuestion(pair, {
                drugSide: idx % 2 === 0 ? "A" : "B",
                subtype: "read_back",
                idSuffix: `${level.id}_rb_${idx}`
            });
            if (rb) readBackQuestions.push(rb);
        });

        const readBackActivity = {
            id: `act_${level.id}_read_back`,
            activityType: "acoustic_discrimination",
            activityRole: "guided_practice",
            learningObjective: "Verify oral prescription statements through accurate verbal read-back recognition.",
            sessionQuestionCount: Math.min(readBackQuestions.length, 4),
            questions: readBackQuestions
        };

        const activities = readBackQuestions.length > 0 ? [matchingActivity, readBackActivity] : [matchingActivity];
        const allQuestions = [...matchQuestions, ...readBackQuestions];

        return { activities, questions: allQuestions };
    }

    // 6. Unit Mastery: Mixed Capstone Synthesis
    // Activity 1: Unassisted Tall Man Construction (2 questions)
    const unassistedQuestions = [];
    applicableTerms.forEach((termItem, idx) => {
        const pair = pairRecords.find((p) => p.id === termItem.pairId);
        if (pair) {
            unassistedQuestions.push(generateTallManMasteryQuestion(pair, { drugSide: termItem.side, idSuffix: `${level.id}_${idx}` }));
        }
    });

    const unassistedActivity = {
        id: `act_${level.id}_unassisted_tall_man`,
        activityType: "construction",
        activityRole: "unit_mastery",
        isFinalTask: true,
        learningObjective: "Demonstrate complete unassisted mastery by constructing exact Tall Man lettering from memory.",
        sessionQuestionCount: 2,
        questions: unassistedQuestions
    };

    // Activity 2: Guided Retrieval Check (2 questions)
    const guidedQuestions = [];
    applicableTerms.forEach((termItem, idx) => {
        const pair = pairRecords.find((p) => p.id === termItem.pairId);
        if (pair) {
            guidedQuestions.push(generateTallManScaffoldQuestion(pair, { drugSide: termItem.side, idSuffix: `mst_sc_${idx}` }));
        }
    });

    const guidedActivity = {
        id: `act_${level.id}_guided_check`,
        activityType: "construction",
        activityRole: "unit_mastery",
        learningObjective: "Confirm accurate segment retrieval under test conditions.",
        sessionQuestionCount: 2,
        questions: guidedQuestions.length > 0 ? guidedQuestions : unassistedQuestions
    };

    // Activity 3: Simulated Educational Read-Back for verified sound-alikes (1 question)
    const readBackQuestions = [];
    verifiedSoundAlikePairs.forEach((pair, idx) => {
        const rb = generateSoundAlikeQuestion(pair, {
            drugSide: idx % 2 === 0 ? "A" : "B",
            subtype: "read_back",
            idSuffix: `mst_rb_${idx}`
        });
        if (rb) readBackQuestions.push(rb);
    });

    const readBackActivity = {
        id: `act_${level.id}_read_back_mastery`,
        activityType: "acoustic_discrimination",
        activityRole: "unit_mastery",
        learningObjective: "Demonstrate accurate verbal read-back recognition without visual crutches.",
        sessionQuestionCount: 1,
        questions: readBackQuestions.length > 0 ? readBackQuestions : unassistedQuestions.slice(0, 1)
    };

    // Activity 4: High-Stakes Pair Discrimination (1 question)
    const discriminationQuestions = pairRecords.map((pair, idx) =>
        generateLasaPairRecognitionQuestion(pair, {
            promptSide: idx % 2 === 0 ? "A" : "B",
            idSuffix: `mst_disc_${idx}`
        })
    );

    const discriminationActivity = {
        id: `act_${level.id}_pair_discrimination`,
        activityType: "distinction",
        activityRole: "unit_mastery",
        learningObjective: "Discriminate high-risk confusable counterparts.",
        sessionQuestionCount: 1,
        questions: discriminationQuestions
    };

    const activities = readBackQuestions.length > 0
        ? [unassistedActivity, guidedActivity, readBackActivity, discriminationActivity]
        : [unassistedActivity, guidedActivity, discriminationActivity];

    const allMasteryQuestions = [
        ...unassistedQuestions,
        ...guidedQuestions,
        ...readBackQuestions,
        ...discriminationQuestions
    ];

    return { activities, questions: allMasteryQuestions };
}

/**
 * Generates a Sound-Alike Acoustic / Oral Read-Back Practice Question.
 * Supported subtypes:
 * - "acoustic_mcq": Learner listens to a spoken drug name and discriminates from phonetic sound-alikes.
 * - "read_back": Simulates a verbal prescription order received over the phone; learner verifies and reads back the exact drug.
 *
 * Strict Guard: Look-alike-only pairs will NEVER receive a sound-alike question.
 * Returns null if the pair is not verified sound-alike.
 *
 * @param {Object} lasaRecord - Canonical LASA pair record
 * @param {Object} [options]
 * @param {"A"|"B"} [options.drugSide="A"] - Drug side
 * @param {"acoustic_mcq"|"read_back"} [options.subtype="acoustic_mcq"] - Question format
 * @param {string} [options.idSuffix=""] - Unique suffix
 * @returns {Object|null} Sound-Alike Question definition or null
 */
export function generateSoundAlikeQuestion(lasaRecord, { drugSide = "A", subtype = "acoustic_mcq", idSuffix = "" } = {}) {
    if (!lasaRecord || !lasaRecord.verifiedSoundAlike) {
        return null;
    }

    const targetDrug = drugSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const counterpartDrug = drugSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;


    const targetName = targetDrug.tallManName || targetDrug.genericName || targetDrug.brandName;
    const counterpartName = counterpartDrug.tallManName || counterpartDrug.genericName || counterpartDrug.brandName;

    const distractors = [];
    if (counterpartName && counterpartName !== targetName) {
        distractors.push(counterpartName);
    }

    const allPairs = Array.isArray(lasaPairsData.pairs) ? lasaPairsData.pairs : (Array.isArray(lasaPairsData) ? lasaPairsData : []);
    for (const otherPair of allPairs) {
        if (otherPair.id !== lasaRecord.id) {
            const nameA = otherPair.drugA?.tallManName || otherPair.drugA?.genericName;
            const nameB = otherPair.drugB?.tallManName || otherPair.drugB?.genericName;
            if (nameA && nameA !== targetName && !distractors.includes(nameA)) {
                distractors.push(nameA);
            }
            if (distractors.length >= 3) break;
            if (nameB && nameB !== targetName && !distractors.includes(nameB)) {
                distractors.push(nameB);
            }
            if (distractors.length >= 3) break;
        }
    }

    const choices = shuffleArray([targetName, ...distractors.slice(0, 3)]);
    const isReadBack = subtype === "read_back";

    const prompt = isReadBack
        ? "You received an oral prescription order over the phone. Listen to the order and verify the correct medication to read back:"
        : "Listen to the spoken medication name and identify the correct drug:";

    const learningObjective = isReadBack
        ? "Verify accurate oral read-back of confusable sound-alike medication orders."
        : "Distinguish spoken Sound-Alike medication names through acoustic discrimination.";

    const spokenText = targetDrug.tallManName || targetDrug.brandName || targetDrug.genericName || targetName;
    const canonicalDrugId = `${lasaRecord.id}_${drugSide.toLowerCase()}`;

    const pairDisplay = `${lasaRecord.drugA?.tallManName || ""} ↔ ${lasaRecord.drugB?.tallManName || ""}`;

    return {
        id: `q_sound_${lasaRecord.id}_${drugSide}_${subtype}${idSuffix ? `_${idSuffix}` : ""}`,
        type: "sound_alike",
        subtype,
        spokenText,
        canonicalDrugId,
        spokenDrug: targetName,
        drugToPronounce: targetDrug.genericName || targetDrug.brandName || targetName,
        prompt,
        choices,
        correctAnswer: targetName,
        relatedDrug: targetName,
        pairDisplay,
        lasaId: lasaRecord.id,
        activityType: "acoustic_discrimination",
        learningObjective,
        explanation: `${targetName} is phonetically confusable with ${counterpartName}. In oral and telephone communications, phonetic ambiguity frequently causes critical administration errors without explicit verbal read-back.`,
        riskSummary: lasaRecord.riskSummary || lasaRecord.feedbackFact || "",
        source: lasaRecord.source || "ISMP List of Confused Drug Names",
        sourceCitation: lasaRecord.sourceCitation || "ISMP List of Confused Drug Names",
        sourceUrl: lasaRecord.sourceUrl || "https://www.ismp.org/recommendations/confused-drug-names-list"
    };
}
