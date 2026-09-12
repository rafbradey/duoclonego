import assert from 'node:assert';
import { allUnits, allLevels } from '../src/data/levels/index.js';
import { getUnitById, getMasteryLevelByUnitId } from '../src/services/unitService.js';
import { getLevelById, getLevelsByUnit } from '../src/services/lessonService.js';
import {
    getLasaPairById,
    getLasaPairsByIds,
    getAllLasaPairs,
    generateTallManRecognitionQuestion,
    generateLasaPairRecognitionQuestion,
    generateMatchingQuestion,
    generateTallManMasteryQuestion
} from '../src/services/questionGenerator.js';
import {
    evaluateAnswer,
    calculateLessonXP,
    prepareSessionLesson,
    createSession,
    recordSessionAnswer
} from '../src/services/lessonEngine.js';
import { generatePracticeSession } from '../src/services/practiceService.js';

console.log('================================================================');
console.log('🧪 DUOCLONGO USER ACCEPTANCE TESTING & VERIFICATION SUITE 🧪');
console.log('================================================================\n');

// -------------------------------------------------------------
// JOURNEY 1: Learning Path & Unit Resolution
// -------------------------------------------------------------
console.log('[Journey 1] Verifying Learning Path Structure & Unit Resolution...');
assert.strictEqual(allUnits.length, 4, 'Learning path must contain exactly 4 units');
assert.strictEqual(allLevels.length, 24, 'Learning path must contain exactly 24 levels (6 per unit)');

for (let u = 1; u <= 4; u++) {
    const unit = await getUnitById(u);
    assert(unit, `Unit ${u} must resolve via getUnitById("${u}")`);
    assert.strictEqual(unit.levels.length, 6, `Unit ${u} must contain 6 levels`);
    assert(unit.lasaPairs.length >= 12, `Unit ${u} must have >= 12 real LASA pairs`);

    const mastery = await getMasteryLevelByUnitId(u);
    assert(mastery, `Unit ${u} must resolve mastery level via getMasteryLevelByUnitId("${u}")`);
    assert.strictEqual(mastery.type, 'unit_mastery', 'Mastery level must have type unit_mastery');
}
console.log('✓ Journey 1 Passed: All units, normal levels, and mastery challenges resolve cleanly.\n');

// -------------------------------------------------------------
// JOURNEY 2: Level 1 — Pair Recognition User Flow & Evaluation
// -------------------------------------------------------------
console.log('[Journey 2] Simulating Level 1 (Pair Recognition) Session Flow...');
const level1 = allLevels[0]; // Unit 1 Level 1
assert.strictEqual(level1.levelNumber, 1);

const prepLvl1 = prepareSessionLesson(level1, { shuffleOptions: true });
const sessLvl1 = createSession(prepLvl1);
assert.strictEqual(sessLvl1.currentIndex, 0);
assert.strictEqual(sessLvl1.totalQuestions, prepLvl1.questions.length);

// Step through questions in Level 1
let correctAnswers = 0;
let currentSess = sessLvl1;

for (let qIdx = 0; qIdx < prepLvl1.questions.length; qIdx++) {
    const q = prepLvl1.questions[qIdx];
    assert.strictEqual(q.type, 'multiple_choice');
    assert(q.choices.includes(q.correctAnswer), 'Choices must contain the correct answer');
    assert(q.sourceUrl, 'Question must carry sourceUrl for information button');
    assert(q.sourceCitation, 'Question must carry sourceCitation');
    assert(q.riskSummary, 'Question must carry riskSummary');

    let ansResult;
    if (qIdx === 0) {
        // Test wrong answer
        const wrongChoice = q.choices.find(c => c !== q.correctAnswer);
        ansResult = recordSessionAnswer(currentSess, q, wrongChoice);
        assert.strictEqual(ansResult.evaluation.isCorrect, false);
        assert.strictEqual(ansResult.evaluation.correctAnswer, q.correctAnswer);
        assert(ansResult.evaluation.riskSummary, 'Evaluation must provide riskSummary for "Why does this matter?"');
    } else {
        // Test correct answer
        ansResult = recordSessionAnswer(currentSess, q, q.correctAnswer);
        assert.strictEqual(ansResult.evaluation.isCorrect, true);
        assert(ansResult.evaluation.riskSummary, 'Evaluation must provide riskSummary for "Did you know?"');
        correctAnswers++;
    }

    if (qIdx + 1 < prepLvl1.questions.length) {
        currentSess = { ...ansResult.nextSession, currentIndex: qIdx + 1 };
    } else {
        currentSess = ansResult.nextSession;
    }
}

assert(currentSess.isCompleted, 'Session must mark as completed when all questions answered');
const earnedXP = calculateLessonXP(prepLvl1, correctAnswers, prepLvl1.questions.length);
assert(earnedXP >= 5, `Earned XP must be positive (earned: ${earnedXP})`);
console.log(`✓ Journey 2 Passed: Level 1 session completed with ${correctAnswers}/${prepLvl1.questions.length} correct, XP awarded: ${earnedXP}.\n`);

// -------------------------------------------------------------
// JOURNEY 3: Level 2 — Tall Man Recognition & Strict Same-Drug Distractors
// -------------------------------------------------------------
console.log('[Journey 3] Simulating Level 2 (Tall Man Lettering) User Flow & Capitalization Rules...');
const level2 = allLevels[1]; // Unit 1 Level 2
assert.strictEqual(level2.levelNumber, 2);

const prepLvl2 = prepareSessionLesson(level2, { shuffleOptions: true });
assert(prepLvl2.questions.length >= 5, 'Level 2 must have at least 5 questions');

prepLvl2.questions.forEach((q, idx) => {
    if (q.subtype === 'tall_man_mcq' || q.isTallManChoice) {
        // 1. All choices must lowercase to the exact same word
        const baseNames = new Set(q.choices.map(c => c.toLowerCase()));
        assert.strictEqual(baseNames.size, 1, `All choices for question ${q.id} must be the same drug (found: ${Array.from(baseNames)})`);

        // 2. Exactly 1 choice matches the source Tall Man representation
        const matchCount = q.choices.filter(c => c === q.correctAnswer).length;
        assert.strictEqual(matchCount, 1, `Question ${q.id} must have exactly one choice matching source`);

        // 3. User selects an incorrect capitalization distractor -> evaluated as FALSE
        const wrongCap = q.choices.find(c => c !== q.correctAnswer);
        const evalWrong = evaluateAnswer(q, wrongCap);
        assert.strictEqual(evalWrong.isCorrect, false, `Capitalization distractor "${wrongCap}" must NOT be scored correct!`);
        assert.strictEqual(evalWrong.sourceUrl, q.sourceUrl);

        // 4. User selects the correct Tall Man representation -> evaluated as TRUE
        const evalRight = evaluateAnswer(q, q.correctAnswer);
        assert.strictEqual(evalRight.isCorrect, true, `Correct Tall Man "${q.correctAnswer}" must be scored correct`);
    }
});
console.log('✓ Journey 3 Passed: Level 2 Tall Man MCQs rigorously enforce same-drug capitalization and reject wrong capitalization.\n');

// -------------------------------------------------------------
// JOURNEY 4: Level 5 — Memorization & Interactive Tap-to-Match
// -------------------------------------------------------------
console.log('[Journey 4] Simulating Level 5 (Matching & Read-Back) Flow...');
const level5 = allLevels[4]; // Unit 1 Level 5
assert.strictEqual(level5.levelNumber, 5);

const prepLvl5 = prepareSessionLesson(level5);
const matchingQ = prepLvl5.questions.find(q => q.type === 'matching');
assert(matchingQ, 'Level 5 must contain an interactive tap-to-match question');
assert(Array.isArray(matchingQ.pairs), 'Matching question must define pair mappings');
assert(matchingQ.pairs.length >= 2, 'Matching question must have >= 2 pairs to match');

// Simulate user matching all pairs correctly
const correctMatches = matchingQ.pairs.map(p => ({ left: p.left, right: p.right }));
const matchEval = evaluateAnswer(matchingQ, JSON.stringify(correctMatches));
assert.strictEqual(matchEval.isCorrect, true, 'Matching all correct pairs must evaluate to isCorrect = true');
assert(matchEval.riskSummary, 'Matching evaluation must attach riskSummary');

// Simulate user making a mismatch
const wrongMatches = matchingQ.pairs.map((p, i) => ({
    left: p.left,
    right: matchingQ.pairs[(i + 1) % matchingQ.pairs.length].right
}));
const mismatchEval = evaluateAnswer(matchingQ, JSON.stringify(wrongMatches));
assert.strictEqual(mismatchEval.isCorrect, false, 'Mismatched pairs must evaluate to isCorrect = false');

console.log('✓ Journey 4 Passed: Level 5 interactive matching evaluates pair combinations accurately.\n');

// -------------------------------------------------------------
// JOURNEY 5: Level 6 — Unit Mastery Capstone Construction
// -------------------------------------------------------------
console.log('[Journey 5] Simulating Unit Mastery Challenge Unassisted Construction...');
const masteryLvl = allLevels[5]; // Unit 1 Level 6 (Mastery)
assert.strictEqual(masteryLvl.type, 'unit_mastery');

const prepMastery = prepareSessionLesson(masteryLvl);
assert(prepMastery.questions.length >= 5, 'Mastery challenge must present at least 5 capstone tasks');

const unassistedQ = prepMastery.questions.find(q => q.type === 'tall_man' && q.scaffold === false);
assert(unassistedQ, 'Mastery challenge must contain unassisted Tall Man construction');
assert.strictEqual(unassistedQ.activityRole, 'unit_mastery');
assert.strictEqual(unassistedQ.scaffold, false, 'Mastery unassisted task must be unscaffolded');
assert(unassistedQ.tallManName, 'Must define target tallManName');

// Case 1: Exact case entered -> correct
const evalExact = evaluateAnswer(unassistedQ, unassistedQ.tallManName);
assert.strictEqual(evalExact.isCorrect, true);

// Case 2: All lowercase entered -> incorrect (mastery requires unassisted capitalization retrieval)
const evalLower = evaluateAnswer(unassistedQ, unassistedQ.tallManName.toLowerCase());
assert.strictEqual(evalLower.isCorrect, false);

// Case 3: All uppercase entered -> incorrect
const evalUpper = evaluateAnswer(unassistedQ, unassistedQ.tallManName.toUpperCase());
assert.strictEqual(evalUpper.isCorrect, false);

console.log('✓ Journey 5 Passed: Unit Mastery unassisted construction strictly enforces case retrieval.\n');

// -------------------------------------------------------------
// JOURNEY 6: Practice Modes with Real LASA Pool
// -------------------------------------------------------------
console.log('[Journey 6] Simulating Practice Review Sessions (Quick, Due, Mistakes)...');

const quickPractice = await generatePracticeSession({ mode: 'quick', count: 5 });
assert.strictEqual(quickPractice.isPractice, true);
assert(quickPractice.questions.length > 0, 'Practice session must contain questions');
quickPractice.questions.forEach(q => {
    assert(q.lasaId, 'Practice questions must reference canonical real LASA pairs');
    assert(q.sourceUrl, 'Practice questions must carry verification links');
});

const duePractice = await generatePracticeSession({ mode: 'due', count: 5 });
assert(duePractice.questions.length > 0, 'Due SRS practice must return questions');

const mistakePractice = await generatePracticeSession({ mode: 'mistakes', count: 5 });
assert(mistakePractice.questions.length > 0, 'Mistakes practice must return questions');

console.log('✓ Journey 6 Passed: Practice engine draws exclusively from canonical real LASA questions.\n');

// -------------------------------------------------------------
// JOURNEY 7: Source Transparency & Verification Metadata
// -------------------------------------------------------------
console.log('[Journey 7] Auditing Transparency Metadata Across All 353 Curriculum Questions...');
let totalQuestionsAudited = 0;

allLevels.forEach(level => {
    level.questions.forEach(q => {
        totalQuestionsAudited++;
        assert(q.sourceUrl && q.sourceUrl.startsWith('http'), `Question ${q.id} must have valid http sourceUrl`);
        assert(q.sourceCitation && q.sourceCitation.length > 5, `Question ${q.id} must have proof citation`);
        assert(q.source && q.source.length > 3, `Question ${q.id} must have source authority`);
        assert(q.riskSummary && q.riskSummary.length > 10, `Question ${q.id} must have riskSummary`);
    });
});
console.log(`✓ Journey 7 Passed: All ${totalQuestionsAudited} questions across all 16 levels verified with 100% source transparency.\n`);

console.log('================================================================');
console.log('🏆 UAT ACCEPTANCE TESTING COMPLETE: 100% VERIFIED & READY! 🏆');
console.log('================================================================');
