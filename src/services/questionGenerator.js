import lasaPairsData from "../data/lasaPairs.json" with { type: "json" };

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
 */
export function generateMatchingQuestion(lasaRecords, { id = "q_match_001" } = {}) {
    const pairs = lasaRecords.slice(0, 4).map((record) => {
        const left = record.drugA.tallManName || record.drugA.genericName;
        const right = record.drugB.tallManName || record.drugB.genericName;
        return { left, right };
    });

    const explanation = pairs.map((p) => `${p.left} ↔ ${p.right}`).join("; ");
    const firstRecord = lasaRecords[0] || {};
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
 * Enforces:
 * - Minimum 5 pairs per lesson/level where dataset supports it
 * - Strict question type formats and metadata
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
            questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "A", idSuffix: `${level.id}_${idx}a` }));
            if (pair.drugB) {
                questions.push(generateLasaPairRecognitionQuestion(pair, { promptSide: "B", idSuffix: `${level.id}_${idx}b` }));
            }
        });

        const activity = {
            id: `act_${level.id}_recognition`,
            activityType: "identification",
            activityRole: "guided_practice",
            learningObjective: "Recognize documented Look-Alike / Sound-Alike medication counterparts from verified ISMP/FDA pairs.",
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
                questions.push(generateTallManRecognitionQuestion(pair, { drugSide: "A", idSuffix: `${level.id}_${idx}a` }));
            }
            if (pair.drugB?.tallManName && pair.drugB.tallManName !== pair.drugB.genericName) {
                questions.push(generateTallManRecognitionQuestion(pair, { drugSide: "B", idSuffix: `${level.id}_${idx}b` }));
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
            learningObjective: "Identify correct Tall Man capitalization to differentiate high-risk look-alike drug names.",
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

    // 4. Level 4: Unit Mastery (Tall Man Lettering Construction)
    const tallManQuestions = [];
    pairRecords.forEach((pair, idx) => {
        if (pair.drugA?.tallManName) {
            tallManQuestions.push(generateTallManMasteryQuestion(pair, { drugSide: "A", idSuffix: `${level.id}_${idx}a` }));
        }
        if (pair.drugB?.tallManName) {
            tallManQuestions.push(generateTallManMasteryQuestion(pair, { drugSide: "B", idSuffix: `${level.id}_${idx}b` }));
        }
    });

    if (tallManQuestions.length < 5) {
        pairRecords.forEach((pair, idx) => {
            tallManQuestions.push(generateTallManMasteryQuestion(pair, { drugSide: "A", idSuffix: `extra_${idx}a` }));
            tallManQuestions.push(generateTallManMasteryQuestion(pair, { drugSide: "B", idSuffix: `extra_${idx}b` }));
        });
    }

    const masteryActivity = {
        id: `act_${level.id}_tall_man_mastery`,
        activityType: "construction",
        activityRole: "unit_mastery",
        isFinalTask: true,
        learningObjective: "Demonstrate complete unassisted mastery by constructing exact Tall Man lettering for unit medications without scaffolding.",
        sessionQuestionCount: 5,
        questions: tallManQuestions
    };

    return {
        activities: [masteryActivity],
        questions: tallManQuestions
    };
}
