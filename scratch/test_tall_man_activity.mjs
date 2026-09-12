import assert from "node:assert/strict";
import { allLevels } from "../src/data/levels/index.js";
import { evaluateAnswer, recordSessionAnswer, createSession } from "../src/services/lessonEngine.js";

console.log("=== Testing Tall Man Activity Architecture & Evaluation ===");

// 1. Verify level_002 loads with activity metadata preserved
const level2 = allLevels.find((lvl) => lvl.id === "level_002");
assert.ok(level2, "level_002 must exist in allLevels");
assert.ok(level2.questions.length >= 3, "level_002 should have >= 3 questions");

const q1 = level2.questions[0];
console.log("Q1 question metadata:", {
    id: q1.id,
    type: q1.type,
    activityType: q1.activityType,
    activityObjective: q1.activityObjective,
    standardName: q1.standardName,
    tallManName: q1.tallManName,
    prefix: q1.prefix,
    expectedSegment: q1.expectedSegment
});

assert.equal(q1.type, "tall_man", "Q1 type should be tall_man");
assert.equal(q1.activityType, "construction", "Q1 activityType should be construction");
assert.ok(q1.activityObjective, "Q1 should retain activityObjective");
assert.equal(q1.expectedSegment, "ZOLAMIDE");
assert.equal(q1.tallManName, "acetaZOLAMIDE");

// 2. Test evaluateAnswer for Tall Man questions
// A. Exact uppercase match
const evalExact = evaluateAnswer(q1, "ZOLAMIDE");
assert.equal(evalExact.isCorrect, true, "Exact uppercase match should be correct");
assert.equal(evalExact.correctAnswer, "acetaZOLAMIDE");
assert.equal(evalExact.tallManName, "acetaZOLAMIDE");

// B. Lowercase input (tolerance test)
const evalLower = evaluateAnswer(q1, "zolamide");
assert.equal(evalLower.isCorrect, true, "Lowercase input should be normalized and accepted");

// C. Extra whitespace (tolerance test)
const evalWhitespace = evaluateAnswer(q1, "   ZOLAMIDE   ");
assert.equal(evalWhitespace.isCorrect, true, "Whitespace should be trimmed and accepted");

// D. Full reconstructed Tall Man name (tolerance test)
const evalFullReconstructed = evaluateAnswer(q1, "acetaZOLAMIDE");
assert.equal(evalFullReconstructed.isCorrect, true, "Full reconstructed name should be accepted");

// E. Incorrect input
const evalWrong = evaluateAnswer(q1, "HEXAMIDE");
assert.equal(evalWrong.isCorrect, false, "Wrong segment should be marked incorrect");
assert.equal(evalWrong.correctAnswer, "acetaZOLAMIDE");

const evalTypo = evaluateAnswer(q1, "ZOLAMID");
assert.equal(evalTypo.isCorrect, false, "Typo segment should be marked incorrect");

// 3. Test Developer Override in recordSessionAnswer
const session = createSession(level2);

// Force correct on incorrect input
const { nextSession: sCorrect, evaluation: eCorrect } = recordSessionAnswer(
    session,
    q1,
    "WRONG_INPUT",
    { forcedOutcome: "correct" }
);
assert.equal(eCorrect.isCorrect, true, "Forced correct should evaluate to true even with wrong input");
assert.equal(sCorrect.correctCount, 1, "correctCount should increment with forced correct");

// Force incorrect on correct input
const { nextSession: sIncorrect, evaluation: eIncorrect } = recordSessionAnswer(
    session,
    q1,
    "ZOLAMIDE",
    { forcedOutcome: "incorrect" }
);
assert.equal(eIncorrect.isCorrect, false, "Forced incorrect should evaluate to false even with correct input");
assert.equal(sIncorrect.correctCount, 0, "correctCount should not increment with forced incorrect");

console.log("All unit assertions passed successfully!");
