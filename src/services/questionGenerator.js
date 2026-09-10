import lasaPairsData from "../data/lasaPairs.json" with { type: "json" };

/**
 * Question Generator Service.
 * Generates the 3 core Duoclongo question types from reusable, authoritative LASA pair records:
 * - Type A: Tall Man Lettering Recognition
 * - Type B: LASA Pair Recognition
 * - Type C: Pair Memorization & Interactive Matching
 * - Type D: Unassisted Tall Man Mastery Capstone
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
 * Generates a Type A: Tall Man Lettering Recognition question.
 * The learner identifies the correct Tall Man capitalization for a target medication.
 */
export function generateTallManRecognitionQuestion(lasaRecord, { drugSide = "A", idSuffix = "" } = {}) {
    const targetDrug = drugSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const counterpartDrug = drugSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;
    const distractors = drugSide === "A" ? (lasaRecord.tallManDistractorsA || []) : (lasaRecord.tallManDistractorsB || []);

    const choices = shuffleArray([targetDrug.tallManName, ...distractors.slice(0, 3)]);

    return {
        id: `q_tm_${lasaRecord.id}_${drugSide}${idSuffix ? `_${idSuffix}` : ""}`,
        type: "multiple_choice",
        activityType: "construction",
        learningObjective: "Recognize the correct ISMP/FDA Tall Man lettering representation.",
        lasaId: lasaRecord.id,
        prompt: `Which is the correct Tall Man lettering for ${targetDrug.genericName || targetDrug.brandName}?`,
        choices,
        correctAnswer: targetDrug.tallManName,
        explanation: `${targetDrug.tallManName} uses capitalized Tall Man lettering to distinguish it from its confusable counterpart ${counterpartDrug.tallManName || counterpartDrug.genericName}. (${lasaRecord.distinguishingFeature || "ISMP 2023"})`,
        relatedDrug: targetDrug.tallManName
    };
}

/**
 * Generates a Type B: LASA Pair Recognition question.
 * The learner identifies which medication forms a documented LASA confusion pair with the prompt drug.
 */
export function generateLasaPairRecognitionQuestion(lasaRecord, { promptSide = "A", idSuffix = "" } = {}) {
    const promptDrug = promptSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const correctDrug = promptSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;
    const distractors = lasaRecord.distractors || [];

    const promptDisplayName = promptDrug.tallManName || promptDrug.brandName || promptDrug.genericName;
    const correctDisplayName = correctDrug.tallManName || correctDrug.brandName || correctDrug.genericName;

    const choices = shuffleArray([correctDisplayName, ...distractors.slice(0, 3)]);

    return {
        id: `q_pair_${lasaRecord.id}_${promptSide}${idSuffix ? `_${idSuffix}` : ""}`,
        type: "multiple_choice",
        activityType: "identification",
        learningObjective: "Identify documented Look-Alike / Sound-Alike medication counterparts.",
        lasaId: lasaRecord.id,
        prompt: `Which medication is commonly confused with ${promptDisplayName}?`,
        choices,
        correctAnswer: correctDisplayName,
        explanation: `${promptDisplayName} and ${correctDisplayName} form a documented ISMP LASA pair due to ${lasaRecord.distinguishingFeature || "look-alike / sound-alike orthography"}.`,
        relatedDrug: promptDisplayName
    };
}

/**
 * Generates a Type C: Pair Memorization & Interactive Tap-to-Match question.
 * Connects 3–4 confusable pairs for active memory consolidation.
 */
export function generateMatchingQuestion(lasaRecords, { id = "q_match_001" } = {}) {
    const pairs = lasaRecords.slice(0, 4).map((record) => {
        const left = record.drugA.tallManName || record.drugA.genericName;
        const right = record.drugB.tallManName || record.drugB.genericName;
        return { left, right };
    });

    const explanation = pairs.map((p) => `${p.left} ↔ ${p.right}`).join("; ");

    return {
        id,
        type: "matching",
        activityType: "distinction",
        learningObjective: "Match each medication with its documented confusable counterpart.",
        prompt: "Match each medication with its documented confusable counterpart:",
        pairs,
        explanation: `Documented ISMP LASA pairs: ${explanation}.`,
        relatedDrug: pairs[0]?.left || ""
    };
}

/**
 * Generates a Type D: Unassisted Unit Mastery Capstone Tall Man task.
 * The learner independently constructs/types the full Tall Man name without hints.
 */
export function generateTallManMasteryQuestion(lasaRecord, { drugSide = "A", idSuffix = "" } = {}) {
    const targetDrug = drugSide === "A" ? lasaRecord.drugA : lasaRecord.drugB;
    const counterpartDrug = drugSide === "A" ? lasaRecord.drugB : lasaRecord.drugA;

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
        prefix: "",
        expectedSegment: targetDrug.tallManName,
        suffix: "",
        explanation: `${targetDrug.tallManName} capitalizes distinguishing letters to disrupt orthographic confusion with ${counterpartDrug.tallManName || counterpartDrug.genericName}.`,
        relatedDrug: targetDrug.tallManName
    };
}

const pairIndex = new Map(lasaPairsData.pairs.map((p) => [p.id, p]));

/**
 * Retrieves a verified LASA pair by its ID (e.g., 'lasa_001').
 * @param {string} id
 * @returns {Object|null}
 */
export function getLasaPairById(id) {
    return pairIndex.get(id) || null;
}

/**
 * Retrieves multiple LASA pairs by their IDs.
 * @param {string[]} ids
 * @returns {Object[]}
 */
export function getLasaPairsByIds(ids) {
    if (!Array.isArray(ids)) return [];
    return ids.map((id) => pairIndex.get(id)).filter(Boolean);
}

/**
 * Generates a comprehensive activity and question set for a level based on its assigned LASA pairs.
 * @param {Object} level - Level object containing id, levelNumber, type, etc.
 * @param {Object[]} pairRecords - Array of >= 5 authoritative LASA pairs
 * @returns {{ activities: Object[], questions: Object[] }}
 */
export function generateLevelContent(level, pairRecords) {
    if (!Array.isArray(pairRecords) || pairRecords.length === 0) {
        return { activities: [], questions: [] };
    }

    const isMastery = Boolean(level.type === "unit_mastery" || level.id?.includes("mastery"));
    const lvlNum = level.levelNumber || 1;

    // 1. Level 1: Pair Recognition (Type B questions for all pairs)
    if (lvlNum === 1 && !isMastery) {
        const questions = [];
        pairRecords.forEach((pair, idx) => {
            questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "A", idSuffix: `${level.id}_${idx}` }));
            if (pair.drugB) {
                questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "B", idSuffix: `${level.id}_${idx}` }));
            }
        });

        const activity = {
            id: `act_${level.id}_recognition`,
            activityType: "identification",
            activityRole: "guided_practice",
            learningObjective: "Recognize documented Look-Alike / Sound-Alike medication counterparts from verified ISMP pairs.",
            sessionQuestionCount: Math.min(questions.length, 5),
            questions
        };

        return {
            activities: [activity],
            questions
        };
    }

    // 2. Level 2: Tall Man Lettering (Type A questions for all pairs)
    if (lvlNum === 2 && !isMastery) {
        const questions = [];
        pairRecords.forEach((pair, idx) => {
            if (pair.drugA?.tallManName && pair.drugA.tallManName !== pair.drugA.genericName) {
                questions.push(generateTallManRecognitionQuestion(pair, { drugSide: "A", idSuffix: `${level.id}_${idx}` }));
            }
            if (pair.drugB?.tallManName && pair.drugB.tallManName !== pair.drugB.genericName) {
                questions.push(generateTallManRecognitionQuestion(pair, { drugSide: "B", idSuffix: `${level.id}_${idx}` }));
            }
        });

        // If fewer than 5 tall man specific names, supplement with pair recognition
        if (questions.length < 5) {
            pairRecords.forEach((pair, idx) => {
                questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "A", idSuffix: `supp_${idx}` }));
            });
        }

        const activity = {
            id: `act_${level.id}_tall_man`,
            activityType: "construction",
            activityRole: "guided_practice",
            learningObjective: "Identify and construct correct Tall Man capitalization to differentiate high-risk look-alike drug names.",
            sessionQuestionCount: Math.min(questions.length, 5),
            questions
        };

        return {
            activities: [activity],
            questions
        };
    }

    // 3. Level 3: Memorization & Discrimination (Mixed Type B + Type C Matching)
    if (lvlNum === 3 && !isMastery) {
        const mcQuestions = pairRecords.map((pair, idx) =>
            generateLasaPairRecognitionQuestion(pair, { promptSide: idx % 2 === 0 ? "A" : "B", idSuffix: `disc_${idx}` })
        );

        const matchQuestion = generateMatchingQuestion(pairRecords, { id: `q_match_${level.id}` });

        const reviewActivity = {
            id: `act_${level.id}_discrimination`,
            activityType: "distinction",
            activityRole: "guided_practice",
            learningObjective: "Differentiate subtle orthographic differences and recall confusable medication pairs from memory.",
            sessionQuestionCount: 4,
            questions: mcQuestions
        };

        const matchingActivity = {
            id: `act_${level.id}_matching`,
            activityType: "distinction",
            activityRole: "guided_practice",
            learningObjective: "Match each medication with its documented confusable counterpart.",
            sessionQuestionCount: 1,
            questions: [matchQuestion]
        };

        return {
            activities: [reviewActivity, matchingActivity],
            questions: [...mcQuestions, matchQuestion]
        };
    }

    // 4. Level 4: Unit Mastery (Review of all 5+ pairs + 1 Unassisted Capstone Task)
    const reviewQuestions = pairRecords.map((pair, idx) =>
        generateLasaPairRecognitionQuestion(pair, { promptSide: idx % 2 === 0 ? "A" : "B", idSuffix: `mastery_rev_${idx}` })
    );

    const capstoneTargetPair = pairRecords.find((p) => p.drugA?.tallManName && p.drugA.tallManName !== p.drugA.genericName) || pairRecords[0];
    const capstoneQuestion = generateTallManMasteryQuestion(capstoneTargetPair, { drugSide: "A", idSuffix: "capstone" });

    const masteryReviewActivity = {
        id: `act_${level.id}_review`,
        activityType: "distinction",
        activityRole: "unit_mastery",
        learningObjective: "Comprehensive review of all unit LASA pairs.",
        sessionQuestionCount: 4,
        questions: reviewQuestions
    };

    const capstoneActivity = {
        id: `act_${level.id}_capstone`,
        activityType: "construction",
        activityRole: "unit_mastery",
        isFinalTask: true,
        learningObjective: `Independently construct the exact Tall Man lettering for ${capstoneTargetPair.drugA?.genericName || "target medication"} without scaffolding.`,
        sessionQuestionCount: 1,
        questions: [capstoneQuestion]
    };

    return {
        activities: [masteryReviewActivity, capstoneActivity],
        questions: [...reviewQuestions, capstoneQuestion]
    };
}

