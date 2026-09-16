import assert from "node:assert";
import {
    SRS_INTERVALS,
    getCurrentUser,
    isUserCloudSynced,
    updateUserProgress,
    recordSrsOutcome,
    getDueSrsPairs,
    getMasteredPairsCount
} from "../src/services/userService.js";
import { AUTH_STATUS } from "../src/context/authConstants.js";
import { isSupabaseConfigured } from "../src/services/supabaseClient.js";

async function runVerification() {
    console.log("=== Running Duoclongo Option A Architecture Verifications ===");

    // 1. Verify Auth Constants
    console.log("1. Checking Auth Status definitions...");
    assert.strictEqual(AUTH_STATUS.INITIALIZING, "INITIALIZING");
    assert.strictEqual(AUTH_STATUS.AUTHENTICATED, "AUTHENTICATED");
    assert.strictEqual(AUTH_STATUS.UNAUTHENTICATED, "UNAUTHENTICATED");
    console.log("   PASS: 3 distinct auth states defined.");

    // 2. Verify Unauthenticated Behavior (no guest mode)
    console.log("2. Checking Unauthenticated User State (Option A requirement)...");
    const user = await getCurrentUser();
    assert.strictEqual(user, null, "Expected getCurrentUser() to be null when unauthenticated.");
    assert.strictEqual(isUserCloudSynced(), false, "Expected isUserCloudSynced() to be false when unauthenticated.");
    console.log("   PASS: Zero guest identity leakage. getCurrentUser() returned null.");

    // 3. Verify Guarded Progress Updates
    console.log("3. Checking Progress Updates while unauthenticated...");
    const updated = await updateUserProgress({ xpToAdd: 20 });
    assert.strictEqual(updated, null, "Unauthenticated progress updates should return null safely.");
    const srsUpdated = await recordSrsOutcome({ lasaId: "lasa_001", isCorrect: true });
    assert.strictEqual(srsUpdated, null, "Unauthenticated SRS updates should return null safely.");
    console.log("   PASS: Unauthenticated progress writes safely rejected.");

    // 4. Verify SRS Data Queries on null user
    console.log("4. Checking SRS queries on unauthenticated user...");
    const due = getDueSrsPairs(null);
    assert.deepStrictEqual(due, [], "Expected due pairs to be empty for null user.");
    const mastered = getMasteredPairsCount(null);
    assert.strictEqual(mastered, 0, "Expected mastered count to be 0 for null user.");
    console.log("   PASS: SRS helpers handle unauthenticated state safely.");

    // 5. Verify SRS Leitner intervals
    console.log("5. Checking SRS intervals...");
    assert.strictEqual(SRS_INTERVALS[0], 0);
    assert.strictEqual(SRS_INTERVALS[1], 86400000);
    assert.strictEqual(SRS_INTERVALS[2], 259200000);
    assert.strictEqual(SRS_INTERVALS[3], 604800000);
    console.log("   PASS: Leitner spaced repetition intervals intact.");

    // 6. Supabase configuration check
    console.log("6. Checking Supabase configuration state...");
    console.log(`   isSupabaseConfigured: ${isSupabaseConfigured}`);

    console.log("\n=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY ===");
}

runVerification().catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
});
