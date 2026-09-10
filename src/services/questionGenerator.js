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
