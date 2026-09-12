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
assert.equal(unit1.levels.length, 6, "Unit 1 should have 6 levels");
assert.equal(unit2.levels.length, 6, "Unit 2 should have 6 levels");
assert.equal(unit3.levels.length, 6, "Unit 3 should have 6 levels");
assert.equal(unit4.levels.length, 6, "Unit 4 should have 6 levels");

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
    const mastery = unit.masteryLevel || unit.levels[unit.levels.length - 1];
    const unassistedQ = mastery.questions.find((q) => q.type === "tall_man" && q.scaffold === false);
    assert.ok(unassistedQ, `Unit ${unit.id} must contain an unassisted tall_man question in mastery`);
    assert.equal(unassistedQ.type, "tall_man", `Unit ${unit.id} final task must be tall_man`);
    assert.equal(unassistedQ.activityRole, "unit_mastery", `Unit ${unit.id} final task must have activityRole: "unit_mastery"`);
    assert.equal(unassistedQ.isFinalTask, true, `Unit ${unit.id} final task must have isFinalTask: true`);
    assert.equal(unassistedQ.scaffold, false, `Unit ${unit.id} final task must have scaffold: false`);
}

console.log("=== 4. Testing No-Hint Mastery Evaluation (Strict Case Sensitivity) ===");

const unit1Mastery = unit1.masteryLevel || unit1.levels[5];
const unit1FinalQ = unit1Mastery.questions.find((q) => q.type === "tall_man" && q.scaffold === false);
const targetName = unit1FinalQ.tallManName;
assert.ok(targetName);

// Exact case match
const resExact = evaluateAnswer(unit1FinalQ, targetName);
assert.equal(resExact.isCorrect, true, `Exact match ${targetName} must be correct`);
assert.equal(resExact.isMastery, true);

// Whitespace trimmed exact match
const resTrimmed = evaluateAnswer(unit1FinalQ, `   ${targetName}   `);
assert.equal(resTrimmed.isCorrect, true, `Whitespace trimmed ${targetName} must be correct`);

// All lowercase (No baby mode forgiveness)
const resLower = evaluateAnswer(unit1FinalQ, targetName.toLowerCase());
assert.equal(resLower.isCorrect, false, `All lowercase ${targetName.toLowerCase()} must fail mastery task`);

// All uppercase (Not Tall Man)
const resUpper = evaluateAnswer(unit1FinalQ, targetName.toUpperCase());
assert.equal(resUpper.isCorrect, false, `All uppercase ${targetName.toUpperCase()} must fail mastery task`);

console.log("Mastery evaluation passed!");

console.log("=== 5. Testing Guided Scaffolding Preservation on Level 004 ===");

const guidedQ = allLevels.find((l) => l.id === "level_004").questions[0];
assert.notEqual(guidedQ.activityRole, "unit_mastery");

const resGuidedExact = evaluateAnswer(guidedQ, guidedQ.expectedSegment);
assert.equal(resGuidedExact.isCorrect, true);
assert.equal(resGuidedExact.isMastery, false);

console.log("Guided mode preservation passed!");

console.log("=== 6. Testing Developer Override on Mastery Questions ===");

const session = createSession(unit1Mastery);

// Override correct
const { nextSession: s1, evaluation: e1 } = recordSessionAnswer(
    session,
    unit1FinalQ,
    targetName.toLowerCase(), // wrong casing
    { forcedOutcome: "correct" }
);
assert.equal(e1.isCorrect, true, "Developer override correct forces isCorrect: true");
assert.equal(s1.correctCount, 1);

// Override incorrect
const { nextSession: s2, evaluation: e2 } = recordSessionAnswer(
    session,
    unit1FinalQ,
    targetName, // correct answer
    { forcedOutcome: "incorrect" }
);
assert.equal(e2.isCorrect, false, "Developer override incorrect forces isCorrect: false");
assert.equal(s2.correctCount, 0);

console.log("Developer override passed!");
console.log("\nALL TESTS PASSED SUCCESSFULLY!");
