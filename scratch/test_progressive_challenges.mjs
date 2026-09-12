import assert from "node:assert/strict";
import { decomposeTallMan, generateTallManScaffoldQuestion, getAllLasaPairs, getLasaPairById } from "../src/services/questionGenerator.js";
import { evaluateAnswer, prepareSessionLesson } from "../src/services/lessonEngine.js";
import { getLevelById } from "../src/services/lessonService.js";
import { allUnits } from "../src/data/levels/index.js";

console.log("===============================================================");
console.log("TEST SUITE: Progressive Challenges Architecture Verification");
console.log("===============================================================");

// 1. Tall Man Decomposition Test
console.log("\n[Test 1] Testing canonical Tall Man affix decomposition...");
const allPairs = getAllLasaPairs();
let checkedCount = 0;

for (const pair of allPairs) {
    for (const drug of [pair.drugA, pair.drugB]) {
        const tm = drug?.tallManName;
        if (tm && tm !== drug.genericName) {
            const { prefix, expectedSegment, suffix } = decomposeTallMan(tm);
            const reconstructed = (prefix || "") + expectedSegment + (suffix || "");
            assert.equal(reconstructed, tm, `Reconstructed string must equal canonical: ${tm}`);
            assert.ok(expectedSegment && expectedSegment.length > 0, `Expected segment must not be empty for ${tm}`);
            checkedCount++;
        }
    }
}
console.log(`✓ Successfully verified 100% lossless decomposition across ${checkedCount} canonical Tall Man names.`);

// 2. Guided Retrieval Fill-in-the-Blank Evaluation
console.log("\n[Test 2] Testing Guided Retrieval fill-in-the-blank evaluation...");
const pair1 = getLasaPairById("lasa_001") || allPairs[0];
const fillInQ = generateTallManScaffoldQuestion(pair1, { drugSide: "A", idSuffix: "test" });

assert.equal(fillInQ.type, "tall_man", "Type must be tall_man");
assert.equal(fillInQ.subtype, "tall_man_fill_in", "Subtype must be tall_man_fill_in");
assert.equal(fillInQ.scaffold, true, "Scaffold must be true");
assert.ok(fillInQ.expectedSegment, "Expected segment must be present");
assert.equal(fillInQ.correctAnswer, fillInQ.expectedSegment, "Correct answer must equal expected segment");

// Test correct uppercase segment
const evalCorrect = evaluateAnswer(fillInQ, fillInQ.expectedSegment);
assert.equal(evalCorrect.isCorrect, true, "Uppercase segment must evaluate as correct");

// Test case-sensitive rejection of lowercase input
const evalLower = evaluateAnswer(fillInQ, fillInQ.expectedSegment.toLowerCase());
assert.equal(evalLower.isCorrect, false, "Lowercase segment must be rejected (case-sensitive Tall Man requirement)");

// Test full reconstructed name with correct Tall Man casing
const fullValid = `${fillInQ.prefix || ""}${fillInQ.expectedSegment}${fillInQ.suffix || ""}`;
const evalFull = evaluateAnswer(fillInQ, fullValid);
assert.equal(evalFull.isCorrect, true, "Full reconstructed name with correct casing must be accepted");
console.log(`✓ Tall Man Fill-in-the-Blank evaluated correctly for ${fillInQ.tallManName} (${fillInQ.prefix}___${fillInQ.suffix} -> ${fillInQ.expectedSegment}).`);

// 3. Curriculum Structure & Progressive Challenge Verification across all 4 units
console.log("\n[Test 3] Verifying progressive challenge distribution across all 4 units and 24 levels...");
assert.equal(allUnits.length, 4, "Curriculum must contain 4 units");

for (const unit of allUnits) {
    console.log(`\nVerifying Unit ${unit.unitNumber} (${unit.id})...`);
    assert.equal(unit.levels.length, 6, `Unit ${unit.id} must have 6 levels (5 instructional + Mastery)`);

    // Level 1: Supported Recognition
    const l1 = unit.levels[0];
    assert.equal(l1.levelNumber, 1);
    const l1Session = prepareSessionLesson(l1);
    assert.equal(l1Session.questions.length, 6, "Level 1 session must contain 6 questions");
    assert.ok(l1Session.questions.every((q) => q.type === "multiple_choice"), "Level 1 questions must be multiple_choice (pair recognition)");
    console.log(`  ✓ Level 1 (${l1.id}): Supported Pair Recognition verified (6 questions sampled from pool of ${l1.questions.length}).`);

    // Level 2: Tall Man Batch A
    const l2 = unit.levels[1];
    assert.equal(l2.levelNumber, 2);
    const l2Session = prepareSessionLesson(l2);
    assert.equal(l2Session.questions.length, 6, "Level 2 session must contain 6 questions");
    const hasTallManMcqA = l2.questions.some((q) => q.subtype === "tall_man_mcq");
    assert.ok(hasTallManMcqA, "Level 2 must contain Tall Man recognition questions");
    console.log(`  ✓ Level 2 (${l2.id}): Tall Man Batch A verified.`);

    // Level 3: Tall Man Batch B + Acoustic Discrimination
    const l3 = unit.levels[2];
    assert.equal(l3.levelNumber, 3);
    const l3Session = prepareSessionLesson(l3);
    assert.equal(l3Session.questions.length, 6, "Level 3 session must contain 6 questions");
    const hasTallManMcqB = l3.questions.some((q) => q.subtype === "tall_man_mcq");
    const hasSoundAlike = l3.questions.some((q) => q.type === "sound_alike" && q.subtype === "acoustic_mcq");
    assert.ok(hasTallManMcqB, "Level 3 must contain Tall Man recognition questions (Batch B)");
    assert.ok(hasSoundAlike, "Level 3 must contain sound-alike acoustic discrimination questions");
    console.log(`  ✓ Level 3 (${l3.id}): Tall Man Batch B & Acoustic Discrimination verified.`);

    // Level 4: Guided Retrieval (Fill-in)
    const l4 = unit.levels[3];
    assert.equal(l4.levelNumber, 4);
    const l4Session = prepareSessionLesson(l4);
    assert.equal(l4Session.questions.length, 6, "Level 4 session must contain 6 questions");
    const hasFillIn = l4Session.questions.some((q) => q.type === "tall_man" && q.scaffold === true);
    assert.ok(hasFillIn, "Level 4 session must contain Tall Man fill-in-the-blank questions");
    console.log(`  ✓ Level 4 (${l4.id}): Guided Retrieval fill-in-the-blank verified.`);

    // Level 5: Memory Consolidation (Matching + Read-Back)
    const l5 = unit.levels[4];
    assert.equal(l5.levelNumber, 5);
    const l5Session = prepareSessionLesson(l5);
    assert.equal(l5Session.questions.length, 6, "Level 5 session must contain 6 questions");
    const hasMatching = l5Session.questions.some((q) => q.type === "matching");
    const hasReadBack = l5Session.questions.some((q) => q.type === "sound_alike" && q.subtype === "read_back");
    assert.ok(hasMatching, "Level 5 session must contain Matching questions");
    assert.ok(hasReadBack, "Level 5 session must contain Read-Back questions");
    console.log(`  ✓ Level 5 (${l5.id}): Memory Consolidation (Matching + Read-Back) verified.`);

    // Unit Mastery: Mixed Mastery
    const mastery = unit.levels[5];
    assert.ok(mastery.isMasteryLevel || mastery.type === "unit_mastery");
    const masterySession = prepareSessionLesson(mastery);
    assert.equal(masterySession.questions.length, 6, "Unit Mastery session must contain 6 questions");
    const hasUnassisted = masterySession.questions.some((q) => q.type === "tall_man" && q.scaffold === false);
    const hasMasteryFillIn = masterySession.questions.some((q) => q.type === "tall_man" && q.scaffold === true);
    const hasMasteryReadBack = masterySession.questions.some((q) => q.type === "sound_alike");
    const hasMasteryDiscrim = masterySession.questions.some((q) => q.type === "multiple_choice");
    assert.ok(hasUnassisted, "Unit Mastery must test unassisted typing");
    assert.ok(hasMasteryFillIn, "Unit Mastery must test guided retrieval");
    assert.ok(hasMasteryReadBack, "Unit Mastery must test oral verification");
    assert.ok(hasMasteryDiscrim, "Unit Mastery must test counterpart discrimination");
    console.log(`  ✓ Unit Mastery (${mastery.id}): Mixed Mastery synthesis verified across all practiced challenge types.`);
}

console.log("\n===============================================================");
console.log("ALL PROGRESSIVE CHALLENGE ARCHITECTURE TESTS PASSED (100%)");
console.log("===============================================================");
