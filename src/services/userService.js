import { getUserBadges } from "./badgeService.js";
import { supabase, isSupabaseConfigured } from "./supabaseClient.js";
import { onAuthStateChange } from "./authService.js";
import {
    evaluateStreakOnLogin,
    calculateStreakOnActivity,
    getLocalTodayDate
} from "./streakService.js";

export const SRS_INTERVALS = {
    0: 0,                           // Stage 0: Due immediately (learning / unredeemed mistake)
    1: 24 * 60 * 60 * 1000,         // Stage 1: 24 hours (1 day)
    2: 72 * 60 * 60 * 1000,         // Stage 2: 72 hours (3 days)
    3: 7 * 24 * 60 * 60 * 1000     // Stage 3: 7 days (Mastered)
};

/**
 * Normalizes a user profile object, ensuring arrays and nested SRS dicts are properly typed.
 */
function normalizeUserData(raw) {
    if (!raw) return null;

    const today = new Date().toISOString().split("T")[0];

    return {
        id: raw.id,
        email: raw.email || "",
        username: raw.username || raw.email?.split("@")[0] || "learner",
        display_name: raw.display_name || raw.username || raw.email?.split("@")[0] || "Learner",
        avatar: raw.avatar || "default_male",
        level: typeof raw.level === "number" ? raw.level : 1,
        hearts: typeof raw.hearts === "number" ? raw.hearts : 5,
        streak: typeof raw.streak === "number" ? raw.streak : 1,
        xp: typeof raw.xp === "number" ? raw.xp : 0,
        diamonds: typeof raw.diamonds === "number" ? raw.diamonds : 1200,
        streak_freeze_count: typeof raw.streak_freeze_count === "number" ? raw.streak_freeze_count : 0,
        last_active_date: raw.last_active_date || today,
        completed_lessons: Array.isArray(raw.completed_lessons) ? raw.completed_lessons : [],
        unlocked_badges: Array.isArray(raw.unlocked_badges) ? raw.unlocked_badges : [],
        mistakes_queue: Array.isArray(raw.mistakes_queue) ? raw.mistakes_queue : [],
        claimed_quests: Array.isArray(raw.claimed_quests) ? raw.claimed_quests : [],
        practice_sessions_completed: typeof raw.practice_sessions_completed === "number"
            ? raw.practice_sessions_completed
            : 0,
        srs_records: raw.srs_records && typeof raw.srs_records === "object" ? raw.srs_records : {},
        owned_themes: Array.isArray(raw.owned_themes) ? raw.owned_themes : [],
        equipped_theme: typeof raw.equipped_theme === "string" ? raw.equipped_theme : null,
        is_cloud: true,
        created_at: raw.created_at || new Date().toISOString()
    };
}

// Auth readiness promise to prevent race conditions on startup
let authReadyResolver = null;
const authReadyPromise = new Promise((resolve) => {
    authReadyResolver = resolve;
});

// Single source of truth for the authenticated user profile in memory
let currentUser = null;
let currentAuthUser = null;
let isInitialized = false;

/**
 * Dispatches a custom event to notify subscribed components of user state updates.
 * @param {Object|null} user - Updated user object
 */
function notifyUserUpdated(user) {
    if (typeof window !== "undefined" && window.dispatchEvent) {
        const event = new CustomEvent("duoclongo:user-updated", {
            detail: { user: user ? { ...user } : null }
        });
        window.dispatchEvent(event);
    }
}

/**
 * Fetches user profile from Supabase `public.profiles`.
 * Creates profile row if missing for the authenticated user.
 */
async function fetchCloudProfile(authUser) {
    if (!authUser) return null;

    const baseAuthProfile = {
        id: authUser.id,
        email: authUser.email,
        username: authUser.user_metadata?.username || authUser.email?.split("@")[0] || "learner",
        display_name: authUser.user_metadata?.display_name || authUser.user_metadata?.username || authUser.email?.split("@")[0] || "Learner",
        avatar: authUser.user_metadata?.avatar || "default_male",
        xp: 0,
        hearts: 5,
        streak: 1,
        diamonds: 1200,
        streak_freeze_count: 0,
        last_active_date: new Date().toISOString().split("T")[0],
        completed_lessons: [],
        unlocked_badges: [],
        mistakes_queue: [],
        practice_sessions_completed: 0,
        srs_records: {},
        owned_themes: [],
        equipped_theme: null,
        is_cloud: true
    };

    if (!supabase) {
        return normalizeUserData(baseAuthProfile);
    }

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .maybeSingle();

        let profile = null;

        if (data && !error) {
            console.log("[DEBUG fetchCloudProfile] Supabase returned data.diamonds:", data.diamonds, "| full data keys:", Object.keys(data));
            profile = normalizeUserData({ ...baseAuthProfile, ...data, is_cloud: true });
        } else {
            // If row does not exist in profiles table yet, insert the initial record
            const { data: inserted, error: insertError } = await supabase
                .from("profiles")
                .insert([{
                    id: baseAuthProfile.id,
                    email: baseAuthProfile.email,
                    username: baseAuthProfile.username,
                    display_name: baseAuthProfile.display_name,
                    avatar: baseAuthProfile.avatar,
                    xp: baseAuthProfile.xp,
                    hearts: baseAuthProfile.hearts,
                    streak: baseAuthProfile.streak,
                    diamonds: baseAuthProfile.diamonds,
                    streak_freeze_count: baseAuthProfile.streak_freeze_count,
                    last_active_date: baseAuthProfile.last_active_date,
                    completed_lessons: baseAuthProfile.completed_lessons,
                    unlocked_badges: baseAuthProfile.unlocked_badges,
                    mistakes_queue: baseAuthProfile.mistakes_queue,
                    practice_sessions_completed: baseAuthProfile.practice_sessions_completed,
                    srs_records: baseAuthProfile.srs_records
                }])
                .select()
                .maybeSingle();

            if (inserted && !insertError) {
                profile = normalizeUserData({ ...baseAuthProfile, ...inserted, is_cloud: true });
            } else {
                profile = normalizeUserData(baseAuthProfile);
            }
        }

        if (typeof localStorage !== "undefined" && authUser?.id) {
            try {
                const cachedClaims = localStorage.getItem(`duoclongo_claimed_quests_${authUser.id}`);
                if (cachedClaims) {
                    profile.claimed_quests = JSON.parse(cachedClaims);
                }
                const cachedOwned = localStorage.getItem(`duoclongo_owned_themes_${authUser.id}`);
                if (cachedOwned) {
                    const parsed = JSON.parse(cachedOwned);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        profile.owned_themes = Array.from(new Set([...(profile.owned_themes || []), ...parsed]));
                    }
                }
                const cachedEquipped = localStorage.getItem(`duoclongo_equipped_theme_${authUser.id}`)
                    || localStorage.getItem("duoclongo_active_theme");
                if (cachedEquipped && cachedEquipped !== "default") {
                    profile.equipped_theme = cachedEquipped;
                }
            } catch {
                // Ignore storage read errors
            }
        }

        // Dynamically evaluate calendar streak and streak freezes on login
        const streakEval = evaluateStreakOnLogin(profile);
        if (streakEval.needsUpdate) {
            profile.streak = streakEval.streak;
            profile.streak_freeze_count = streakEval.streak_freeze_count;
            profile.last_active_date = streakEval.last_active_date;
            syncToCloud(profile);
        }

        return profile;
    } catch (err) {
        console.warn("Notice in fetchCloudProfile (fallback to base auth profile):", err);
        const fallback = normalizeUserData(baseAuthProfile);
        if (typeof localStorage !== "undefined" && authUser?.id) {
            try {
                const cachedOwned = localStorage.getItem(`duoclongo_owned_themes_${authUser.id}`);
                if (cachedOwned) {
                    const parsed = JSON.parse(cachedOwned);
                    if (Array.isArray(parsed)) fallback.owned_themes = parsed;
                }
                const cachedEquipped = localStorage.getItem(`duoclongo_equipped_theme_${authUser.id}`)
                    || localStorage.getItem("duoclongo_active_theme");
                if (cachedEquipped && cachedEquipped !== "default") {
                    fallback.equipped_theme = cachedEquipped;
                }
            } catch {
                // Ignore storage read errors
            }
        }
        const streakEval = evaluateStreakOnLogin(fallback);
        if (streakEval.needsUpdate) {
            fallback.streak = streakEval.streak;
            fallback.streak_freeze_count = streakEval.streak_freeze_count;
            fallback.last_active_date = streakEval.last_active_date;
        }
        return fallback;
    }
}

/**
 * Asynchronously syncs in-memory updates directly to the Supabase database.
 */
async function syncToCloud(user) {
    if (!supabase || !currentAuthUser || !user) return;

    try {
        const payload = {
            level: user.level,
            hearts: user.hearts,
            streak: user.streak,
            xp: user.xp,
            diamonds: user.diamonds,
            streak_freeze_count: user.streak_freeze_count ?? 0,
            last_active_date: user.last_active_date || new Date().toISOString().split("T")[0],
            completed_lessons: user.completed_lessons,
            unlocked_badges: user.unlocked_badges,
            mistakes_queue: user.mistakes_queue,
            practice_sessions_completed: user.practice_sessions_completed,
            srs_records: user.srs_records,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from("profiles")
            .update(payload)
            .eq("id", currentAuthUser.id);

        if (error) {
            console.warn("[DEBUG syncToCloud] full payload FAILED:", error.message, "| diamonds sent:", payload.diamonds);
            // Retry with only core fields that are guaranteed to exist in the schema
            const corePayload = {
                level: user.level,
                hearts: user.hearts,
                streak: user.streak,
                xp: user.xp,
                diamonds: user.diamonds,
                completed_lessons: user.completed_lessons,
                unlocked_badges: user.unlocked_badges,
                mistakes_queue: user.mistakes_queue,
                practice_sessions_completed: user.practice_sessions_completed,
                srs_records: user.srs_records,
                updated_at: new Date().toISOString()
            };
            const { error: retryError } = await supabase
                .from("profiles")
                .update(corePayload)
                .eq("id", currentAuthUser.id);
            if (retryError) {
                console.warn("[DEBUG syncToCloud] core retry ALSO FAILED:", retryError.message);
            } else {
                console.log("[DEBUG syncToCloud] core retry SUCCEEDED, diamonds:", corePayload.diamonds);
            }
        } else {
            console.log("[DEBUG syncToCloud] full payload SUCCEEDED, diamonds:", payload.diamonds);
        }
    } catch (err) {
        console.error("Exception while syncing profile to cloud:", err);
    }

    // Persist theme data to localStorage (not in Supabase schema)
    if (typeof localStorage !== "undefined" && currentAuthUser?.id) {
        try {
            const userId = currentAuthUser.id;
            if (Array.isArray(user.owned_themes)) {
                localStorage.setItem(`duoclongo_owned_themes_${userId}`, JSON.stringify(user.owned_themes));
            }
            if (user.equipped_theme) {
                localStorage.setItem(`duoclongo_equipped_theme_${userId}`, user.equipped_theme);
                localStorage.setItem("duoclongo_active_theme", user.equipped_theme);
            } else {
                localStorage.removeItem(`duoclongo_equipped_theme_${userId}`);
                localStorage.removeItem("duoclongo_active_theme");
            }
        } catch {
            // Ignore storage write errors
        }
    }
}


/**
 * Initializes authentication listener and establishes reliable single source of truth.
 */
export async function initializeUserAuth() {
    if (isInitialized) {
        await authReadyPromise;
        return currentUser;
    }
    isInitialized = true;

    if (!isSupabaseConfigured || !supabase) {
        currentUser = null;
        currentAuthUser = null;
        authReadyResolver?.();
        return null;
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.user) {
            currentAuthUser = session.user;
            const cloudProfile = await fetchCloudProfile(session.user);
            currentUser = cloudProfile;
            notifyUserUpdated(currentUser);
        } else {
            currentAuthUser = null;
            currentUser = null;
            notifyUserUpdated(null);
        }
    } catch (err) {
        console.warn("Failed to get initial session:", err);
        currentAuthUser = null;
        currentUser = null;
    } finally {
        authReadyResolver?.();
    }

    // Handle all Supabase authentication lifecycle events
    onAuthStateChange(async (event, session) => {
        const hasUser = Boolean(session && session.user);

        if (
            (event === "SIGNED_IN" ||
             event === "INITIAL_SESSION" ||
             event === "USER_UPDATED") &&
            hasUser
        ) {
            currentAuthUser = session.user;
            const cloudProfile = await fetchCloudProfile(session.user);
            currentUser = cloudProfile;
            notifyUserUpdated(currentUser);
        } else if (event === "TOKEN_REFRESHED" && hasUser) {
            // Only update the auth token reference — do NOT re-fetch the profile
            // from Supabase, which would overwrite in-memory state (diamonds, themes, etc.)
            currentAuthUser = session.user;
        } else if (event === "SIGNED_OUT" || (!hasUser && event !== "INITIAL_SESSION")) {
            currentAuthUser = null;
            currentUser = null;
            notifyUserUpdated(null);
        }
    });

    return currentUser;
}

// Auto-run initialization in browser environments
if (typeof window !== "undefined") {
    initializeUserAuth().catch((err) => {
        console.error("initializeUserAuth error:", err);
        authReadyResolver?.();
    });
} else {
    authReadyResolver?.();
}

/**
 * Retrieves the currently active authenticated user profile.
 * Returns null if the user is unauthenticated.
 * @returns {Promise<Object|null>} The active user object or null
 */
export async function getCurrentUser() {
    await authReadyPromise;
    return currentUser ? { ...currentUser } : null;
}

/**
 * Checks if the current user is authenticated.
 * Under Option A, every valid application user is authenticated via Supabase.
 * @returns {boolean}
 */
export function isUserCloudSynced() {
    return Boolean(currentUser);
}

/**
 * Retrieves a user by unique identifier from Supabase.
 * @param {string|number} id - User identifier
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserById(id) {
    const stringId = String(id);
    if (currentUser && String(currentUser.id) === stringId) {
        return { ...currentUser };
    }
    if (!supabase) return null;

    try {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", stringId)
            .maybeSingle();

        return data ? normalizeUserData(data) : null;
    } catch {
        return null;
    }
}

/**
 * Updates current user progression stats (XP, streaks, hearts, completed lessons, mistakes).
 * Directly persists changes to Supabase and updates in-memory cache.
 *
 * @param {Object} updates
 * @param {number} [updates.xpToAdd] - Amount of XP to increment
 * @param {number} [updates.heartsChange] - Delta for hearts count
 * @param {number} [updates.diamondsToAdd] - Amount of diamonds/gems to increment
 * @param {number} [updates.diamondsChange] - Delta for diamonds/gems count
 * @param {string} [updates.completedLessonId] - Lesson or Level ID to append to completed list
 * @param {string} [updates.mistakeToAdd] - Question ID to add to mistakes queue
 * @param {string} [updates.mistakeToRemove] - Question ID to remove from mistakes queue
 * @param {boolean} [updates.practiceSessionCompleted] - Whether a practice review was completed
 * @param {Object} [updates.levelAttempt] - Optional audit details ({ level_id, score, accuracy })
 * @returns {Promise<Object|null>} Updated user object
 */
export async function updateUserProgress({
    xpToAdd = 0,
    heartsChange = 0,
    diamondsToAdd = 0,
    diamondsChange = 0,
    completedLessonId = null,
    mistakeToAdd = null,
    mistakeToRemove = null,
    practiceSessionCompleted = false,
    levelAttempt = null,
    claimedQuestsUpdate = null
} = {}) {
    if (!currentUser) return null;

    const completedLessons = Array.isArray(currentUser.completed_lessons)
        ? [...currentUser.completed_lessons]
        : [];

    if (completedLessonId && !completedLessons.includes(completedLessonId)) {
        completedLessons.push(completedLessonId);
    }

    let mistakesQueue = Array.isArray(currentUser.mistakes_queue)
        ? [...currentUser.mistakes_queue]
        : [];

    if (mistakeToAdd && !mistakesQueue.includes(mistakeToAdd)) {
        mistakesQueue.push(mistakeToAdd);
    }

    if (mistakeToRemove) {
        mistakesQueue = mistakesQueue.filter((id) => id !== mistakeToRemove);
    }

    const practiceCount = (currentUser.practice_sessions_completed || 0) +
        (practiceSessionCompleted ? 1 : 0);

    const netDiamondsChange = diamondsToAdd + diamondsChange;
    const today = getLocalTodayDate();

    // Dynamically calculate streak transition when learner completes an activity
    const isLearningActivity = xpToAdd > 0 || Boolean(completedLessonId) || practiceSessionCompleted;
    let newStreak = currentUser.streak ?? 1;
    let newFreezes = currentUser.streak_freeze_count ?? 0;
    let newLastActive = currentUser.last_active_date || today;

    if (isLearningActivity) {
        const streakResult = calculateStreakOnActivity(currentUser);
        newStreak = streakResult.newStreak;
        newFreezes = streakResult.newFreezes;
        newLastActive = streakResult.lastActiveDate;
    }

    const claimedQuests = claimedQuestsUpdate || (Array.isArray(currentUser.claimed_quests) ? [...currentUser.claimed_quests] : []);
    if (claimedQuestsUpdate && typeof localStorage !== "undefined" && currentAuthUser?.id) {
        try {
            localStorage.setItem(`duoclongo_claimed_quests_${currentAuthUser.id}`, JSON.stringify(claimedQuestsUpdate));
        } catch {
            // Ignore storage write errors
        }
    }

    const updatedUser = {
        ...currentUser,
        xp: Math.max(0, (currentUser.xp || 0) + xpToAdd),
        hearts: Math.max(0, (currentUser.hearts || 5) + heartsChange),
        diamonds: Math.max(0, (currentUser.diamonds ?? 1200) + netDiamondsChange),
        streak: newStreak,
        streak_freeze_count: newFreezes,
        last_active_date: newLastActive,
        completed_lessons: completedLessons,
        mistakes_queue: mistakesQueue,
        practice_sessions_completed: practiceCount,
        claimed_quests: claimedQuests
    };

    const badgeInfo = getUserBadges(updatedUser);
    updatedUser.unlocked_badges = badgeInfo.badges.filter((b) => b.isUnlocked).map((b) => b.id);

    currentUser = updatedUser;
    notifyUserUpdated(currentUser);

    // Persist directly to Supabase
    syncToCloud(currentUser);

    // Record level attempt audit log if provided
    if (levelAttempt && supabase && currentAuthUser) {
        supabase
            .from("level_attempts")
            .insert([{
                user_id: currentAuthUser.id,
                level_id: levelAttempt.level_id || completedLessonId || "unknown",
                score: levelAttempt.score || 0,
                accuracy: levelAttempt.accuracy || 100.0,
                xp_earned: xpToAdd
            }])
            .then(({ error }) => {
                if (error) console.warn("Failed to record level attempt in Supabase:", error);
            })
            .catch((err) => console.warn("Error logging level attempt:", err));
    }

    return { ...currentUser };
}

/**
 * Records an answer outcome for a specific LASA pair in the Leitner SRS engine.
 * Automatically manages intervals, stage promotions/demotions, and the mistakes queue.
 *
 * @param {Object} params
 * @param {string} params.lasaId - Unique identifier of the LASA pair (e.g., 'lasa_001')
 * @param {boolean} params.isCorrect - Whether the question was answered correctly
 * @param {string} [params.questionId] - Optional question ID to remove/add from mistakes queue
 * @returns {Promise<Object|null>} Updated user object
 */
export async function recordSrsOutcome({ lasaId, isCorrect, questionId } = {}) {
    if (!currentUser) return null;
    const now = Date.now();

    const srsRecords = { ...(currentUser.srs_records || {}) };
    let mistakesQueue = Array.isArray(currentUser.mistakes_queue)
        ? [...currentUser.mistakes_queue]
        : [];

    if (lasaId) {
        const currentRecord = srsRecords[lasaId] || {
            lasaId,
            stage: 0,
            consecutiveCorrect: 0,
            lastReviewed: 0,
            nextReviewDue: 0,
            mistakeCount: 0,
            successCount: 0
        };

        if (isCorrect) {
            const nextStage = Math.min(3, currentRecord.stage + 1);
            const interval = SRS_INTERVALS[nextStage] || SRS_INTERVALS[3];
            srsRecords[lasaId] = {
                ...currentRecord,
                stage: nextStage,
                consecutiveCorrect: (currentRecord.consecutiveCorrect || 0) + 1,
                lastReviewed: now,
                nextReviewDue: now + interval,
                successCount: (currentRecord.successCount || 0) + 1
            };
        } else {
            srsRecords[lasaId] = {
                ...currentRecord,
                stage: 0,
                consecutiveCorrect: 0,
                lastReviewed: now,
                nextReviewDue: now, // Due immediately
                mistakeCount: (currentRecord.mistakeCount || 0) + 1
            };
        }
    }

    if (questionId) {
        if (isCorrect) {
            mistakesQueue = mistakesQueue.filter((id) => id !== questionId);
        } else {
            if (!mistakesQueue.includes(questionId)) {
                mistakesQueue.push(questionId);
            }
        }
    }

    const updatedUser = {
        ...currentUser,
        srs_records: srsRecords,
        mistakes_queue: mistakesQueue
    };

    const badgeInfo = getUserBadges(updatedUser);
    updatedUser.unlocked_badges = badgeInfo.badges.filter((b) => b.isUnlocked).map((b) => b.id);

    currentUser = updatedUser;
    notifyUserUpdated(currentUser);

    // Direct cloud update
    syncToCloud(currentUser);

    return { ...currentUser };
}

/**
 * Returns all LASA pairs currently due for Spaced Repetition review.
 * @param {Object} user - User object
 * @returns {Array} Array of due SRS records
 */
export function getDueSrsPairs(user) {
    if (!user || !user.srs_records) return [];
    const now = Date.now();
    return Object.values(user.srs_records).filter(
        (rec) => rec && typeof rec.nextReviewDue === "number" && rec.nextReviewDue <= now
    );
}

/**
 * Returns the count of fully mastered LASA pairs (Stage 3).
 * @param {Object} user - User object
 * @returns {number} Mastered pairs count
 */
export function getMasteredPairsCount(user) {
    if (!user || !user.srs_records) return 0;
    return Object.values(user.srs_records).filter((rec) => rec && rec.stage >= 3).length;
}

/**
 * Resets user progress back to defaults.
 * @returns {Promise<Object|null>} Reset user object
 */
export async function resetUserProgress() {
    if (!currentUser || !currentAuthUser || !supabase) return null;

    try {
        const { data, error } = await supabase
            .from("profiles")
            .update({
                xp: 0,
                hearts: 5,
                streak: 1,
                diamonds: 1200,
                completed_lessons: [],
                unlocked_badges: [],
                mistakes_queue: [],
                practice_sessions_completed: 0,
                srs_records: {},
                updated_at: new Date().toISOString()
            })
            .eq("id", currentAuthUser.id)
            .select()
            .maybeSingle();

        if (data && !error) {
            currentUser = normalizeUserData(data);
        } else {
            currentUser = {
                ...currentUser,
                xp: 0,
                hearts: 5,
                streak: 1,
                diamonds: 1200,
                completed_lessons: [],
                unlocked_badges: [],
                mistakes_queue: [],
                practice_sessions_completed: 0,
                srs_records: {}
            };
        }
        notifyUserUpdated(currentUser);
        return currentUser ? { ...currentUser } : null;
    } catch (err) {
        console.warn("Failed to reset cloud profile:", err);
        return currentUser;
    }
}

/**
 * Manually updates the cached in-memory user profile and dispatches change notification.
 * Useful for synchronized services such as the Shop to reconcile purchased items instantly.
 *
 * @param {Object} partialOrFullUser - Partial or full updated user object
 * @param {Object} [options]
 * @param {boolean} [options.syncCloud=false] - Whether to sync immediately to Supabase
 * @returns {Object|null} Updated user object
 */
export function setUserProfileCache(partialOrFullUser, { syncCloud = false } = {}) {
    if (!partialOrFullUser) return currentUser;

    currentUser = normalizeUserData({
        ...(currentUser || {
            id: "user-cache",
            email: "guest@duoclongo.local",
            username: "learner",
            display_name: "Learner",
            avatar: "default_male",
            xp: 0,
            hearts: 5,
            streak: 1,
            diamonds: 1200,
            streak_freeze_count: 0,
            last_active_date: new Date().toISOString().split("T")[0],
            completed_lessons: [],
            unlocked_badges: [],
            mistakes_queue: [],
            practice_sessions_completed: 0,
            srs_records: {},
            owned_themes: [],
            equipped_theme: null
        }),
        ...partialOrFullUser
    });

    notifyUserUpdated(currentUser);

    if (syncCloud && currentAuthUser) {
        syncToCloud(currentUser);
    }

    return { ...currentUser };
}

/**
 * Claims a daily quest reward (Gems & XP) for the active user.
 * Prevents multiple claims on the same calendar day for the same quest.
 *
 * @param {string} questId - ID of the completed quest
 * @param {number} [xpReward] - XP awarded
 * @param {number} [gemsReward] - Gems awarded
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function claimDailyQuest(questId, xpReward = 0, gemsReward = 0) {
    if (!currentUser) {
        throw new Error("You must be logged in to claim quest rewards.");
    }

    const today = getLocalTodayDate();
    const claimKey = `${today}:${questId}`;
    const claimed = Array.isArray(currentUser.claimed_quests) ? [...currentUser.claimed_quests] : [];

    if (claimed.includes(claimKey)) {
        throw new Error("Quest reward has already been claimed for today.");
    }

    const updatedClaims = [...claimed, claimKey];
    await updateUserProgress({
        xpToAdd: xpReward,
        diamondsToAdd: gemsReward,
        claimedQuestsUpdate: updatedClaims
    });

    return {
        success: true,
        message: `Claimed +${gemsReward} Gems and +${xpReward} XP!`
    };
}

/**
 * Deducts 1 heart from the active user's profile upon an incorrect answer in a standard lesson.
 * Minimum heart count is 0.
 *
 * @returns {Promise<number>} Updated hearts count
 */
export async function deductHeart() {
    if (!currentUser) return 5;

    const currentHearts = typeof currentUser.hearts === "number" ? currentUser.hearts : 5;
    const newHearts = Math.max(0, currentHearts - 1);

    currentUser = {
        ...currentUser,
        hearts: newHearts
    };

    notifyUserUpdated(currentUser);
    syncToCloud(currentUser);

    return newHearts;
}

/**
 * Restores hearts for the active user's profile (e.g. upon completing a practice session).
 * Maximum heart count is 5.
 *
 * @param {number} [amount=1] - Number of hearts to restore
 * @returns {Promise<number>} Updated hearts count
 */
export async function restoreHeart(amount = 1) {
    if (!currentUser) return 5;

    const currentHearts = typeof currentUser.hearts === "number" ? currentUser.hearts : 5;
    const newHearts = Math.min(5, currentHearts + Math.max(1, amount));

    currentUser = {
        ...currentUser,
        hearts: newHearts
    };

    notifyUserUpdated(currentUser);
    syncToCloud(currentUser);

    return newHearts;
}

/**
 * Applies a theme attribute to document.documentElement.
 * When themeId is null, empty, or 'default', removes the attribute so classic dark mode applies.
 *
 * @param {string|null} themeId
 */
export function applyThemeToDocument(themeId) {
    if (typeof document === "undefined") return;
    const target = (!themeId || themeId === "default") ? null : themeId;

    if (!target) {
        document.documentElement.removeAttribute("data-theme");
        document.body?.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", target);
        document.body?.setAttribute("data-theme", target);
    }
}

/**
 * Retrieves the active equipped theme ID from user profile or local storage.
 *
 * @returns {string|null}
 */
export function getActiveEquippedTheme() {
    if (currentUser?.equipped_theme) {
        return currentUser.equipped_theme;
    }
    if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("duoclongo_active_theme");
        return stored && stored !== "default" ? stored : null;
    }
    return null;
}

/**
 * Equips an owned site theme, updates profile state, persists, and immediately sets data-theme.
 *
 * @param {string|null} themeId - ID of theme to equip, or null/'default' to unequip/reset
 * @returns {Promise<{ success: boolean, equipped_theme: string|null }>}
 */
export async function equipTheme(themeId) {
    const targetTheme = (!themeId || themeId === "default") ? null : themeId;
    const userId = currentUser?.id || "guest";

    let storedOwned = [];
    if (typeof localStorage !== "undefined") {
        try {
            storedOwned = JSON.parse(localStorage.getItem(`duoclongo_owned_themes_${userId}`) || "[]");
        } catch {}
    }

    if (!currentUser) {
        // Guest mode fallback
        applyThemeToDocument(targetTheme);
        if (typeof localStorage !== "undefined") {
            if (targetTheme) {
                localStorage.setItem("duoclongo_active_theme", targetTheme);
            } else {
                localStorage.removeItem("duoclongo_active_theme");
            }
        }
        return { success: true, equipped_theme: targetTheme };
    }

    const effectiveOwned = Array.from(new Set([...(currentUser.owned_themes || []), ...storedOwned]));
    currentUser.owned_themes = effectiveOwned;

    // Verify ownership if equipping a custom theme
    if (targetTheme && !effectiveOwned.includes(targetTheme)) {
        throw new Error("You must purchase this theme from the Shop before equipping it.");
    }

    currentUser = {
        ...currentUser,
        equipped_theme: targetTheme
    };

    applyThemeToDocument(targetTheme);

    if (typeof localStorage !== "undefined") {
        if (targetTheme) {
            localStorage.setItem(`duoclongo_equipped_theme_${userId}`, targetTheme);
            localStorage.setItem("duoclongo_active_theme", targetTheme);
        } else {
            localStorage.removeItem(`duoclongo_equipped_theme_${userId}`);
            localStorage.removeItem("duoclongo_active_theme");
        }
    }

    notifyUserUpdated(currentUser);
    syncToCloud(currentUser);

    return {
        success: true,
        equipped_theme: targetTheme
    };
}