import assert from 'node:assert';
import fs from 'node:fs';
import { allUnits, allLevels } from '../src/data/levels/index.js';
import { evaluateAnswer } from '../src/services/lessonEngine.js';

console.log('=== 1. Testing Deferred Theoretical Questions Archive ===');
const archivePath = 'src/data/curriculum/deferredTheoreticalQuestions.json';
assert(fs.existsSync(archivePath), 'Archive file must exist');
const archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
assert(Array.isArray(archive.archivedQuestions), 'archivedQuestions must be an array');
assert.strictEqual(archive.archivedQuestions.length, 11, 'Must contain exactly 11 archived theoretical questions');
archive.archivedQuestions.forEach((q) => {
    assert(q.id, 'Archived question must have an ID');
    assert(q.deferredCategory, `Archived question ${q.id} must have deferredCategory`);
    assert(q.deferredReason, `Archived question ${q.id} must have deferredReason`);
});
console.log(`Verified ${archive.archivedQuestions.length} archived theoretical questions with reasons.`);

console.log('\n=== 2. Testing Active Curriculum Questions Scope ===');
// Forbidden theoretical patterns in prompts
const theoreticalPatterns = [
    /Why are .* designated as high-alert/i,
    /primary indication of/i,
    /What is .* indicated for/i,
    /Why did the FDA/i,
    /primary clinical risk if .* is accidentally dispensed/i,
    /primary clinical difference/i,
    /represents a documented LASA hazard between an analgesic and/i,
    /are recognized by ISMP as a Look-Alike/i,
    /primary risk factor for medication errors/i,
    /Which population is .* specifically formulated for/i
];

let totalActiveQuestions = 0;
const allowedActivityTypes = new Set([
    'identification',
    'distinction',
    'construction',
    'situational',
    'recognition', // backward-compatible alias for identification
    'retrieval'
]);

allUnits.forEach((unit) => {
    console.log(`Checking Unit: ${unit.id} (${unit.title})`);
    unit.levels.forEach((lvl) => {
        assert(Array.isArray(lvl.questions), `Level ${lvl.id} must have questions array`);
        lvl.questions.forEach((q) => {
            totalActiveQuestions++;
            // Check that prompt does NOT match any theoretical questions
            theoreticalPatterns.forEach((pattern) => {
                assert(
                    !pattern.test(q.prompt),
                    `Question ${q.id} contains theoretical pattern: "${q.prompt}"`
                );
            });

            // Verify activityType is in allowed set
            assert(
                allowedActivityTypes.has(q.activityType),
                `Question ${q.id} has disallowed activityType: ${q.activityType}`
            );

            // If situational, verify scenario exists
            if (q.activityType === 'situational') {
                assert(
                    typeof q.scenario === 'string' && q.scenario.length > 10,
                    `Situational question ${q.id} must contain a descriptive scenario`
                );
                assert(
                    Array.isArray(q.choices) && q.choices.length >= 2,
                    `Situational question ${q.id} must have at least 2 choices`
                );
                assert(q.correctAnswer, `Situational question ${q.id} must have correctAnswer`);
            }
        });
    });
});
console.log(`Verified ${totalActiveQuestions} active questions across all units — 0 theoretical questions detected.`);

console.log('\n=== 3. Testing Situational Questions Evaluation ===');
const situationalQuestions = allLevels.flatMap((lvl) =>
    lvl.questions.filter((q) => q.activityType === 'situational')
);
assert(situationalQuestions.length >= 4, `Expected at least 4 situational questions, found ${situationalQuestions.length}`);

situationalQuestions.forEach((q) => {
    // Test correct answer
    const correctRes = evaluateAnswer(q, q.correctAnswer);
    assert.strictEqual(correctRes.isCorrect, true, `Situational ${q.id} must be correct for correctAnswer`);

    // Test incorrect answer
    const wrongChoice = q.choices.find(
        (c) => String(c).trim().toLowerCase() !== String(q.correctAnswer).trim().toLowerCase()
    );
    assert(wrongChoice, `Situational question ${q.id} must have a wrong choice`);
    const incorrectRes = evaluateAnswer(q, wrongChoice);
    assert.strictEqual(incorrectRes.isCorrect, false, `Situational ${q.id} must be incorrect for ${wrongChoice}`);
});
console.log(`Evaluated ${situationalQuestions.length} situational questions: all passed!`);

console.log('\n=== 4. Testing Unit Concluding Mastery Tasks ===');
allUnits.forEach((unit) => {
    const finalLevel = unit.levels[unit.levels.length - 1];
    const finalQuestion = finalLevel.questions[finalLevel.questions.length - 1];

    assert.strictEqual(finalQuestion.type, 'tall_man', `Unit ${unit.id} final task must be tall_man`);
    assert.strictEqual(finalQuestion.isFinalTask, true, `Unit ${unit.id} final task must be isFinalTask`);
    assert.strictEqual(finalQuestion.activityRole, 'unit_mastery', `Unit ${unit.id} final task must be unit_mastery`);
    assert.strictEqual(finalQuestion.scaffold, false, `Unit ${unit.id} final task must have scaffold: false`);

    // Strict case sensitive match
    const exactMatch = evaluateAnswer(finalQuestion, finalQuestion.tallManName);
    assert.strictEqual(exactMatch.isCorrect, true, `${finalQuestion.id} must accept exact Tall Man casing`);

    const lowerMatch = evaluateAnswer(finalQuestion, finalQuestion.tallManName.toLowerCase());
    assert.strictEqual(lowerMatch.isCorrect, false, `${finalQuestion.id} must reject all-lowercase casing`);

    const upperMatch = evaluateAnswer(finalQuestion, finalQuestion.tallManName.toUpperCase());
    // Only should be true if the target is entirely uppercase, otherwise false
    if (finalQuestion.tallManName !== finalQuestion.tallManName.toUpperCase()) {
        assert.strictEqual(upperMatch.isCorrect, false, `${finalQuestion.id} must reject all-uppercase casing`);
    }
});
console.log('All 4 unit final mastery tasks verified as strict unassisted Tall Man retrieval!');

console.log('\n=== 5. Testing Guided Scaffolding Preservation ===');
const guidedQ = allLevels.flatMap((lvl) => lvl.questions).find((q) => q.id === 'q201');
assert(guidedQ, 'q201 must exist');
assert.strictEqual(guidedQ.type, 'tall_man');
assert.notStrictEqual(guidedQ.isFinalTask, true);
assert.notStrictEqual(guidedQ.scaffold, false);

// In guided mode, lowercase segment should be accepted with tolerance
const guidedLower = evaluateAnswer(guidedQ, guidedQ.expectedSegment.toLowerCase());
assert.strictEqual(guidedLower.isCorrect, true, 'Guided mode must accept lowercase expectedSegment');
console.log('Guided scaffolding preserved on earlier learning levels.');

console.log('\nALL AUDIT & TAXONOMY TESTS PASSED SUCCESSFULLY!\n');
