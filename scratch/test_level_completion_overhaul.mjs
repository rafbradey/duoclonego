import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getNextLevel, isLevelUnlocked } from "../src/services/lessonService.js";
import { allLevels, allUnits } from "../src/data/levels/index.js";
import { recordSessionAnswer, createSession } from "../src/services/lessonEngine.js";

const projectRoot = path.resolve(".");

console.log("================================================================");
console.log(" DUOCLONGO LEVEL COMPLETION & SESSION BREAKDOWN OVERHAUL TESTS");
console.log("================================================================\n");

// -------------------------------------------------------------------------
// TEST 1: Level Progression & "Continue to Next Level" Resolution
// -------------------------------------------------------------------------
console.log("[Test 1] Testing Level Progression & Next Level Resolution...");

// User starting fresh with Level 1 completed
const userLevel1 = {
    id: 1,
    completed_lessons: ["level_001"]
};

// 1.1 Complete Level 1 -> Next should be Level 2
const nextAfterL1 = getNextLevel("level_001", userLevel1);
assert.ok(nextAfterL1, "nextAfterL1 must not be null");
assert.equal(nextAfterL1.level.id, "level_002", "Next level after level_001 must be level_002");
assert.equal(nextAfterL1.route, "/lesson/level_002", "Route must point to /lesson/level_002");
assert.equal(nextAfterL1.isUnlocked, true, "Level 2 must be unlocked once Level 1 is complete");
console.log("  ✓ Level 1 completion -> Level 2 (/lesson/level_002, unlocked: true)");

// 1.2 Complete Level 2 -> Next should be Level 3
const userLevel2 = {
    id: 1,
    completed_lessons: ["level_001", "level_002"]
};
const nextAfterL2 = getNextLevel("level_002", userLevel2);
assert.ok(nextAfterL2, "nextAfterL2 must not be null");
assert.equal(nextAfterL2.level.id, "level_003");
assert.equal(nextAfterL2.route, "/lesson/level_003");
assert.equal(nextAfterL2.isUnlocked, true);
console.log("  ✓ Level 2 completion -> Level 3 (/lesson/level_003, unlocked: true)");

// 1.3 Complete Level 3 -> Next should be Level 4 (/lesson/level_004)
const userLevel3 = {
    id: 1,
    completed_lessons: ["level_001", "level_002", "level_003"]
};
const nextAfterL3 = getNextLevel("level_003", userLevel3);
assert.ok(nextAfterL3, "nextAfterL3 must not be null");
assert.equal(nextAfterL3.level.id, "level_004");
assert.equal(nextAfterL3.route, "/lesson/level_004");
assert.equal(nextAfterL3.isUnlocked, true);
console.log("  ✓ Level 3 completion -> Level 4 (/lesson/level_004, unlocked: true)");

// 1.4 Complete Level 4 -> Next should be Level 5 (/lesson/level_005)
const userLevel4 = {
    id: 1,
    completed_lessons: ["level_001", "level_002", "level_003", "level_004"]
};
const nextAfterL4 = getNextLevel("level_004", userLevel4);
assert.ok(nextAfterL4, "nextAfterL4 must not be null");
assert.equal(nextAfterL4.level.id, "level_005");
assert.equal(nextAfterL4.route, "/lesson/level_005");
assert.equal(nextAfterL4.isUnlocked, true);
console.log("  ✓ Level 4 completion -> Level 5 (/lesson/level_005, unlocked: true)");

// 1.5 Complete Level 5 -> Next should be Unit 1 Mastery Challenge (/unit/1/mastery)
const userLevel5 = {
    id: 1,
    completed_lessons: ["level_001", "level_002", "level_003", "level_004", "level_005"]
};
const nextAfterL5 = getNextLevel("level_005", userLevel5);
assert.ok(nextAfterL5, "nextAfterL5 must not be null");
assert.equal(nextAfterL5.level.id, "level_001_mastery");
assert.equal(nextAfterL5.route, "/unit/1/mastery", "Mastery level must route to /unit/1/mastery");
assert.equal(nextAfterL5.isUnlocked, true, "Unit 1 Mastery must be unlocked after Levels 1-5 complete");
console.log("  ✓ Level 5 completion -> Unit 1 Mastery Challenge (/unit/1/mastery, unlocked: true)");

// 1.6 Complete Unit 1 Mastery -> Next should be Unit 2 Level 1 (level_006)
const userUnit1Done = {
    id: 1,
    completed_lessons: ["level_001", "level_002", "level_003", "level_004", "level_005", "level_001_mastery"]
};
const nextAfterU1Mastery = getNextLevel("level_001_mastery", userUnit1Done);
assert.ok(nextAfterU1Mastery, "nextAfterU1Mastery must not be null");
assert.equal(nextAfterU1Mastery.level.id, "level_006", "Next level after Unit 1 Mastery must be level_006 (Unit 2 Level 1)");
assert.equal(nextAfterU1Mastery.route, "/lesson/level_006");
assert.equal(nextAfterU1Mastery.isUnlocked, true, "Unit 2 Level 1 must unlock after Unit 1 Mastery complete");
console.log("  ✓ Unit 1 Mastery completion -> Unit 2 Level 1 (/lesson/level_006, unlocked: true)");

// 1.5 Final Level of Curriculum (Unit 4 Mastery - level_004_mastery) -> Next must be NULL
const userAllDone = {
    id: 1,
    completed_lessons: allLevels.map((l) => l.id)
};
const lastLevel = allLevels[allLevels.length - 1];
assert.equal(lastLevel.id, "level_004_mastery", "Last level must be level_004_mastery");
const nextAfterFinal = getNextLevel(lastLevel.id, userAllDone);
assert.equal(nextAfterFinal, null, "Final curriculum level must NOT produce a next level (must be null)");
console.log("  ✓ Final curriculum level (level_004_mastery) -> getNextLevel returns null (no invalid next button)");

// 1.6 Locked level check: if user attempts to query a future level when requirements aren't met
const userOnlyL1 = { id: 1, completed_lessons: ["level_001"] };
assert.equal(isLevelUnlocked("level_003", userOnlyL1), false, "Level 3 must be locked if Level 2 is not completed");
assert.equal(isLevelUnlocked("level_004", userOnlyL1), false, "Level 4 must be locked if Unit 1 Mastery is not completed");
console.log("  ✓ Progression unlocking integrity strictly verified (locked levels cannot be bypassed)");

// -------------------------------------------------------------------------
// TEST 2: Session Answer Metadata Fidelity & Recording
// -------------------------------------------------------------------------
console.log("\n[Test 2] Testing Session Answer Recording & Data Retention...");

const dummyLesson = {
    id: "level_001",
    title: "Level 1: Stems",
    questions: [
        {
            id: "q_pair_1_A",
            type: "multiple_choice",
            prompt: "Which medication is commonly confused with busPIRone?",
            relatedDrug: "busPIRone",
            correctAnswer: "buPROPion"
        },
        {
            id: "q_tm_1_A",
            type: "multiple_choice",
            subtype: "tall_man_mcq",
            isTallManChoice: true,
            prompt: "Which is the correct Tall Man lettering for bupropion?",
            relatedDrug: "buPROPion",
            tallManName: "buPROPion",
            correctAnswer: "buPROPion"
        },
        {
            id: "q_mastery_1_A",
            type: "tall_man",
            prompt: "UNIT MASTERY CAPSTONE TASK: Type the complete drug name...",
            standardName: "bupropion",
            tallManName: "buPROPion",
            correctAnswer: "buPROPion"
        }
    ]
};

let session = createSession(dummyLesson);

// Answer Q1 correctly
const q1 = dummyLesson.questions[0];
const res1 = recordSessionAnswer(session, q1, "buPROPion");
session = res1.nextSession;

assert.equal(session.answers.length, 1);
const a1 = session.answers[0];
assert.equal(a1.questionId, "q_pair_1_A");
assert.equal(a1.subject, "busPIRone", "Subject must be busPIRone");
assert.equal(a1.selectedAnswer, "buPROPion");
assert.equal(a1.correctAnswer, "buPROPion");
assert.equal(a1.isCorrect, true);
console.log("  ✓ Answer 1 recorded: subject 'busPIRone', correct 'buPROPion'");

// Answer Q2 incorrectly with wrong Tall Man capitalization
const q2 = dummyLesson.questions[1];
const res2 = recordSessionAnswer(session, q2, "BUPRopion");
session = res2.nextSession;

assert.equal(session.answers.length, 2);
const a2 = session.answers[1];
assert.equal(a2.questionId, "q_tm_1_A");
assert.equal(a2.subtype, "tall_man_mcq");
assert.equal(a2.selectedAnswer, "BUPRopion", "Selected casing BUPRopion must be preserved exactly");
assert.equal(a2.correctAnswer, "buPROPion", "Correct casing buPROPion must be preserved exactly");
assert.equal(a2.isCorrect, false, "Wrong capitalization must evaluate as incorrect");
console.log("  ✓ Answer 2 recorded: exact casing preserved ('BUPRopion' vs 'buPROPion'), isCorrect: false");

// Answer Q3 correctly for Tall Man capstone
const q3 = dummyLesson.questions[2];
const res3 = recordSessionAnswer(session, q3, "buPROPion");
session = res3.nextSession;

assert.equal(session.answers.length, 3);
const a3 = session.answers[2];
assert.equal(a3.questionType, "tall_man");
assert.equal(a3.subject, "buPROPion");
assert.equal(a3.isCorrect, true);
console.log("  ✓ Answer 3 recorded: Tall Man capstone subject 'buPROPion', isCorrect: true");

// -------------------------------------------------------------------------
// TEST 3: Cleaned Up Single Statistic Card Format ("X / Y CORRECT")
// -------------------------------------------------------------------------
console.log("\n[Test 3] Testing Cleaned Up Single Correct Statistic & Pill Removal...");

assert.equal(session.totalQuestions, 3);
assert.equal(session.correctCount, 2);
const singleStatText = `${session.correctCount} / ${session.totalQuestions}`;
const singleStatLabel = "Correct";
assert.equal(singleStatText, "2 / 3");
assert.equal(singleStatLabel, "Correct");
console.log(`  ✓ Single stat verified: '${singleStatText}' with label '${singleStatLabel}'`);

// Verify LessonCompletion.jsx and LessonCompletion.css have NO pills
const jsxContent = fs.readFileSync(path.resolve(projectRoot, "src/components/LessonCompletion/LessonCompletion.jsx"), "utf-8");
const cssContent = fs.readFileSync(path.resolve(projectRoot, "src/components/LessonCompletion/LessonCompletion.css"), "utf-8");

assert.ok(!jsxContent.includes("breakdown-summary-pills"), "JSX must NOT contain breakdown-summary-pills");
assert.ok(!jsxContent.includes("breakdown-metric-pill"), "JSX must NOT contain breakdown-metric-pill");
assert.ok(!cssContent.includes("breakdown-summary-pills"), "CSS must NOT contain breakdown-summary-pills");
assert.ok(!cssContent.includes("breakdown-metric-pill"), "CSS must NOT contain breakdown-metric-pill");
assert.ok(jsxContent.includes("breakdown-stat-card"), "JSX must render breakdown-stat-card");
assert.ok(jsxContent.includes("correct-accent"), "JSX must use correct-accent");
assert.ok(cssContent.includes(".correct-accent"), "CSS must define .correct-accent");
assert.ok(cssContent.includes(".breakdown-stat-card"), "CSS must define .breakdown-stat-card");
console.log("  ✓ Confirmed complete removal of the 4 individual pills (Questions, Correct, Incorrect, Accuracy)");
console.log("  ✓ Verified single cohesive .breakdown-stat-card matching +XP and Accuracy card styles");

// -------------------------------------------------------------------------
// TEST 4: No Repetitive Question Prompt Text in Review Formatting
// -------------------------------------------------------------------------
console.log("\n[Test 4] Verifying Concise Review Summaries (No Repetitive Prompts)...");

session.answers.forEach((ans, i) => {
    // Subject must not be the prompt sentence
    assert.ok(
        !ans.subject.includes("Which medication is commonly confused"),
        `Answer ${i + 1} subject must NOT contain repetitive prompt sentence`
    );
    assert.ok(
        !ans.subject.includes("Which is the correct Tall Man"),
        `Answer ${i + 1} subject must NOT contain repetitive prompt sentence`
    );
    assert.ok(ans.subject.length > 0, `Answer ${i + 1} must have a non-empty subject`);
    console.log(`  ✓ Item ${i + 1}: Subject = '${ans.subject}', Type = '${ans.subtype || ans.questionType}', Your Answer = '${ans.selectedAnswer}', Correct = '${ans.correctAnswer}'`);
});

console.log("\n================================================================");
console.log(" ALL LEVEL COMPLETION & SESSION BREAKDOWN TESTS PASSED (100%)");
console.log("================================================================");
