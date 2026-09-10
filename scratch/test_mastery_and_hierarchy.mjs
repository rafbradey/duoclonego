import assert from "node:assert/strict";
import { allUnits, allLevels } from "../src/data/levels/index.js";
import { evaluateAnswer, recordSessionAnswer, createSession } from "../src/services/lessonEngine.js";

console.log("=== 1. Testing Section & Unit Hierarchy ===");

assert.equal(allUnits.length, 4, "Should have 4 units across Section 1 and Section 2");
const unit1 = allUnits.find((u) => u.id === "unit_001");
const unit2 = allUnits.find((u) => u.id === "unit_002");
const unit3 = allUnits.find((u) => u.id === "unit_003");
const unit4 = allUnits.find((u) => u.id === "unit_004");

assert.ok(unit1 && unit2 && unit3 && unit4, "All 4 units must be present");
assert.equal(unit1.sectionId, "section-1");
assert.equal(unit2.sectionId, "section-1");
assert.equal(unit3.sectionId, "section-1");
assert.equal(unit4.sectionId, "section-2");

// Verify Level counts
assert.equal(unit1.levels.length, 3, "Unit 1 should have 3 levels");
assert.equal(unit2.levels.length, 3, "Unit 2 should have 3 levels (level_203 added)");
assert.equal(unit3.levels.length, 3, "Unit 3 should have 3 levels");
assert.equal(unit4.levels.length, 1, "Unit 4 should have 1 level (level_401 in Section 2)");

console.log("=== 2. Testing Section -> Unit -> Level -> Lesson -> Activity -> Question Pipeline ===");

for (const unit of allUnits) {
    for (const level of unit.levels) {
        assert.ok(Array.isArray(level.lessons), `Level ${level.id} must have lessons array`);
        assert.ok(level.lessons.length > 0, `Level ${level.id} must contain at least one lesson`);

        for (const lesson of level.lessons) {
            assert.ok(Array.isArray(lesson.activities), `Lesson ${lesson.id} must have activities`);

            for (const activity of lesson.activities) {
                assert.ok(Array.isArray(activity.questions), `Activity ${activity.id} must have questions`);

                for (const q of activity.questions) {
                    assert.ok(q.sectionId, `Question ${q.id} must inherit sectionId`);
                    assert.ok(q.unitId, `Question ${q.id} must inherit unitId`);
                    assert.ok(q.levelId, `Question ${q.id} must inherit levelId`);
                    assert.ok(q.activityRole, `Question ${q.id} must have activityRole`);
                }
            }
        }
    }
}

console.log("Hierarchy validation passed!");

console.log("=== 3. Testing Final Task of Every Unit ===");

for (const unit of allUnits) {
    const lastLevel = unit.levels[unit.levels.length - 1];
    const finalQuestion = lastLevel.questions[lastLevel.questions.length - 1];

    console.log(`Unit ${unit.id} final question:`, {
        id: finalQuestion.id,
        type: finalQuestion.type,
        activityRole: finalQuestion.activityRole,
        isFinalTask: finalQuestion.isFinalTask,
        standardName: finalQuestion.standardName,
        tallManName: finalQuestion.tallManName
    });

    assert.equal(finalQuestion.type, "tall_man", `Unit ${unit.id} final task must be tall_man`);
    assert.equal(finalQuestion.activityRole, "unit_mastery", `Unit ${unit.id} final task must have activityRole: "unit_mastery"`);
    assert.equal(finalQuestion.isFinalTask, true, `Unit ${unit.id} final task must have isFinalTask: true`);
    assert.equal(finalQuestion.scaffold, false, `Unit ${unit.id} final task must have scaffold: false`);
}

console.log("=== 4. Testing No-Hint Mastery Evaluation (Strict Case Sensitivity) ===");

const unit1FinalQ = unit1.levels[2].questions[unit1.levels[2].questions.length - 1];
assert.equal(unit1FinalQ.tallManName, "predniSONE");

// Exact case match
const resExact = evaluateAnswer(unit1FinalQ, "predniSONE");
assert.equal(resExact.isCorrect, true, "Exact match predniSONE must be correct");
assert.equal(resExact.isMastery, true);

// Whitespace trimmed exact match
const resTrimmed = evaluateAnswer(unit1FinalQ, "   predniSONE   ");
assert.equal(resTrimmed.isCorrect, true, "Whitespace trimmed predniSONE must be correct");

// All lowercase (No baby mode forgiveness)
const resLower = evaluateAnswer(unit1FinalQ, "prednisone");
assert.equal(resLower.isCorrect, false, "All lowercase prednisone must fail mastery task");

// All uppercase (Not Tall Man)
const resUpper = evaluateAnswer(unit1FinalQ, "PREDNISONE");
assert.equal(resUpper.isCorrect, false, "All uppercase PREDNISONE must fail mastery task");

// Confusable counterpart
const resWrong = evaluateAnswer(unit1FinalQ, "prednisoLONE");
assert.equal(resWrong.isCorrect, false, "Confusable counterpart must fail");

// Partial segment only
const resSegmentOnly = evaluateAnswer(unit1FinalQ, "SONE");
assert.equal(resSegmentOnly.isCorrect, false, "Partial segment only must fail in unassisted mastery mode");

console.log("Mastery evaluation passed!");

console.log("=== 5. Testing Guided Scaffolding Preservation on Level 002 ===");

const guidedQ = allLevels.find((l) => l.id === "level_002").questions[0];
assert.equal(guidedQ.id, "q201");
assert.notEqual(guidedQ.activityRole, "unit_mastery");

const resGuidedExact = evaluateAnswer(guidedQ, "ZOLAMIDE");
assert.equal(resGuidedExact.isCorrect, true);
assert.equal(resGuidedExact.isMastery, false);

const resGuidedLower = evaluateAnswer(guidedQ, "zolamide");
assert.equal(resGuidedLower.isCorrect, true, "Guided mode permits lowercase segment");

console.log("Guided mode preservation passed!");

console.log("=== 6. Testing Developer Override on Mastery Questions ===");

const session = createSession(unit1.levels[2]);

// Override correct
const { nextSession: s1, evaluation: e1 } = recordSessionAnswer(
    session,
    unit1FinalQ,
    "prednisone", // wrong casing
    { forcedOutcome: "correct" }
);
assert.equal(e1.isCorrect, true, "Developer override correct forces isCorrect: true");
assert.equal(s1.correctCount, 1);

// Override incorrect
const { nextSession: s2, evaluation: e2 } = recordSessionAnswer(
    session,
    unit1FinalQ,
    "predniSONE", // correct answer
    { forcedOutcome: "incorrect" }
);
assert.equal(e2.isCorrect, false, "Developer override incorrect forces isCorrect: false");
assert.equal(s2.correctCount, 0);

console.log("Developer override passed!");
console.log("\nALL TESTS PASSED SUCCESSFULLY!");
