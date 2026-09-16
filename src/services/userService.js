import usersData from "../data/user.json" with { type: "json" };
import { getUserBadges } from "./badgeService.js";
import { supabase, isSupabaseConfigured } from "./supabaseClient.js";
import { onAuthStateChange } from "./authService.js";

const STORAGE_KEY = "duoclongo_user_progress";

export const SRS_INTERVALS = {
    0: 0,                           // Stage 0: Due immediately (learning / unredeemed mistake)
    1: 24 * 60 * 60 * 1000,         // Stage 1: 24 hours (1 day)
    2: 72 * 60 * 60 * 1000,         // Stage 2: 72 hours (3 days)
    3: 7 * 24 * 60 * 60 * 1000     // Stage 3: 7 days (Mastered)
};

/**
 * Normalizes a user profile object, ensuring arrays and nested SRS dicts are properly typed.
 */
function normalizeUserData(raw, fallback = null) {
    if (!raw && !fallback) return null;
    const base = fallback || {};
    const src = raw || {};

    return {
        id: src.id || base.id || "guest",
        email: src.email || base.email || "guest@duoclongo.local",
        username: src.username || base.username || "guest_learner",
        display_name: src.display_name || base.display_name || "Guest Learner",
        avatar: src.avatar || base.avatar || "default_male",
        level: typeof src.level === "number" ? src.level : (base.level || 1),
        hearts: typeof src.hearts === "number" ? src.hearts : (base.hearts || 5),
        streak: typeof src.streak === "number" ? src.streak : (base.streak || 1),
        xp: typeof src.xp === "number" ? src.xp : (base.xp || 0),
        diamonds: typeof src.diamonds === "number" ? src.diamonds : (base.diamonds || 1200),
        completed_lessons: Array.isArray(src.completed_lessons)
            ? src.completed_lessons
            : (Array.isArray(base.completed_lessons) ? base.completed_lessons : []),
        unlocked_badges: Array.isArray(src.unlocked_badges)
            ? src.unlocked_badges
            : (Array.isArray(base.unlocked_badges) ? base.unlocked_badges : []),
        mistakes_queue: Array.isArray(src.mistakes_queue)
            ? src.mistakes_queue
            : (Array.isArray(base.mistakes_queue) ? base.mistakes_queue : []),
        practice_sessions_completed: typeof src.practice_sessions_completed === "number"
            ? src.practice_sessions_completed
            : (base.practice_sessions_completed || 0),
        srs_records: src.srs_records && typeof src.srs_records === "object"
            ? src.srs_records
            : (base.srs_records || {}),
        is_cloud: Boolean(src.is_cloud),
        created_at: src.created_at || base.created_at || new Date().toISOString()
    };
}

function loadPersistedGuestUser() {
    const rawDefault = usersData && usersData.length > 0 ? { ...usersData[0] } : null;
    if (typeof window === "undefined" || !window.localStorage) {
        return normalizeUserData(rawDefault);
    }
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return normalizeUserData(parsed, rawDefault);
        }
    } catch (e) {
        console.warn("Failed to load user from localStorage, falling back to default:", e);
    }
    return normalizeUserData(rawDefault);
}

function savePersistedUser(user) {
    if (typeof window !== "undefined" && window.localStorage && user) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch (e) {
            console.warn("Failed to persist user to localStorage:", e);
        }
    }
}

// In-memory active user state initialized from local cache
let currentUser = loadPersistedGuestUser();
let currentAuthUser = null;
let isInitialized = false;

/**
 * Dispatches a custom event to notify subscribed components of user state updates.
 * @param {Object} user - Updated user object
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
 * Creates profile if missing.
 */
async function fetchCloudProfile(authUser) {
    if (!supabase || !authUser) return null;

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .maybeSingle();

        if (error) {
            console.error("Error fetching cloud profile:", error);
            return null;
        }

        if (data) {
            return normalizeUserData({ ...data, is_cloud: true });
        }

        // If trigger has not run yet or profile row is absent, create it
        const fallbackProfile = {
            id: authUser.id,
            email: authUser.email,
            username: authUser.user_metadata?.username || authUser.email.split("@")[0],
            display_name: authUser.user_metadata?.display_name || authUser.email.split("@")[0],
            avatar: authUser.user_metadata?.avatar || "default_male",
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

        const { data: inserted, error: insertError } = await supabase
            .from("profiles")
            .insert([fallbackProfile])
            .select()
            .single();

        if (insertError) {
            console.warn("Could not insert fallback profile:", insertError);
            return normalizeUserData({ ...fallbackProfile, is_cloud: true });
        }

        return normalizeUserData({ ...inserted, is_cloud: true });
    } catch (err) {
        console.error("Unexpected error in fetchCloudProfile:", err);
        return null;
    }
}

/**
 * Asynchronously syncs in-memory updates to the Supabase database if logged in.
 */
async function syncToCloud(user) {
    if (!supabase || !currentAuthUser || !user || !user.is_cloud) return;

    try {
        const payload = {
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

        const { error } = await supabase
            .from("profiles")
            .update(payload)
            .eq("id", currentAuthUser.id);

        if (error) {
            console.warn("Failed to sync profile update to Supabase:", error);
        }
    } catch (err) {
        console.error("Exception while syncing profile to cloud:", err);
    }
}

/**
 * Initializes authentication listener to automatically sync between Supabase and local state.
 */
export async function initializeUserAuth() {
    if (isInitialized) return currentUser;
    isInitialized = true;

    if (!isSupabaseConfigured || !supabase) {
        return currentUser;
    }

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
            currentAuthUser = session.user;
            const cloudProfile = await fetchCloudProfile(session.user);
            if (cloudProfile) {
                currentUser = cloudProfile;
                savePersistedUser(currentUser);
                notifyUserUpdated(currentUser);
            }
        }
    } catch (err) {
        console.warn("Failed to check existing session on init:", err);
    }

    onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
            currentAuthUser = session.user;
            const cloudProfile = await fetchCloudProfile(session.user);
            if (cloudProfile) {
                currentUser = cloudProfile;
                savePersistedUser(currentUser);
                notifyUserUpdated(currentUser);
            }
        } else if (event === "SIGNED_OUT") {
            currentAuthUser = null;
            currentUser = loadPersistedGuestUser();
            currentUser.is_cloud = false;
            savePersistedUser(currentUser);
            notifyUserUpdated(currentUser);
        }
    });

    return currentUser;
}

// Auto-run initialization in browser environments
if (typeof window !== "undefined") {
    initializeUserAuth().catch(console.error);
}

/**
 * Merges local guest progress into the currently authenticated cloud profile.
 * Useful when a user studies as a guest and then creates an account or logs in.
 *
 * @returns {Promise<Object|null>} Updated cloud user object
 */
export async function syncLocalProgressToCloud() {
    if (!supabase || !currentAuthUser || !currentUser || !currentUser.is_cloud) {
        return currentUser;
    }

    const localGuest = loadPersistedGuestUser();
    if (!localGuest) return currentUser;

    const mergedCompleted = Array.from(new Set([
        ...(currentUser.completed_lessons || []),
        ...(localGuest.completed_lessons || [])
    ]));

    const mergedMistakes = Array.from(new Set([
        ...(currentUser.mistakes_queue || []),
        ...(localGuest.mistakes_queue || [])
    ]));

    const mergedSrs = {
        ...(localGuest.srs_records || {}),
        ...(currentUser.srs_records || {})
    };

    const updatedUser = {
        ...currentUser,
        xp: Math.max(currentUser.xp || 0, (currentUser.xp || 0) + (localGuest.xp || 0)),
        completed_lessons: mergedCompleted,
        mistakes_queue: mergedMistakes,
        srs_records: mergedSrs,
        practice_sessions_completed: Math.max(
            currentUser.practice_sessions_completed || 0,
            (currentUser.practice_sessions_completed || 0) + (localGuest.practice_sessions_completed || 0)
        )
    };

    const badgeInfo = getUserBadges(updatedUser);
    updatedUser.unlocked_badges = badgeInfo.badges.filter((b) => b.isUnlocked).map((b) => b.id);

    currentUser = updatedUser;
    savePersistedUser(currentUser);
    notifyUserUpdated(currentUser);
    await syncToCloud(currentUser);

    return { ...currentUser };
}

/**
 * Retrieves the currently active user profile.
 * Decouples UI components from raw storage representation.
 * @returns {Promise<Object|null>} The active user object or null
 */
export async function getCurrentUser() {
    return currentUser ? { ...currentUser } : null;
}

/**
 * Checks if the current user is authenticated with Supabase cloud sync.
 * @returns {boolean}
 */
export function isUserCloudSynced() {
    return Boolean(currentUser && currentUser.is_cloud && currentAuthUser);
}

/**
 * Retrieves a user by unique identifier.
 * @param {string|number} id - User identifier
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserById(id) {
    const stringId = String(id);
    if (currentUser && String(currentUser.id) === stringId) {
        return { ...currentUser };
    }
    const user = usersData.find((u) => String(u.id) === stringId);
    return user ? { ...user } : null;
}

/**
 * Legacy getter returning all users array.
 * @deprecated Prefer getCurrentUser() or getUserById()
 * @returns {Promise<Array>} Array of users
 */
export async function getUserInfo() {
    return usersData;
}

/**
 * Updates current user progression stats (XP, streaks, hearts, completed lessons, mistakes).
 * Persists changes locally, syncs to Supabase if logged in, and emits an update event.
 *
 * @param {Object} updates
 * @param {number} [updates.xpToAdd] - Amount of XP to increment
 * @param {number} [updates.heartsChange] - Delta for hearts count
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
    completedLessonId = null,
    mistakeToAdd = null,
    mistakeToRemove = null,
    practiceSessionCompleted = false,
    levelAttempt = null
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

    const updatedUser = {
        ...currentUser,
        xp: Math.max(0, (currentUser.xp || 0) + xpToAdd),
        hearts: Math.max(0, (currentUser.hearts || 5) + heartsChange),
        completed_lessons: completedLessons,
        mistakes_queue: mistakesQueue,
        practice_sessions_completed: practiceCount
    };

    const badgeInfo = getUserBadges(updatedUser);
    updatedUser.unlocked_badges = badgeInfo.badges.filter((b) => b.isUnlocked).map((b) => b.id);

    currentUser = updatedUser;
    savePersistedUser(currentUser);
    notifyUserUpdated(currentUser);

    // Sync to Supabase in the background
    if (currentUser.is_cloud) {
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
    savePersistedUser(currentUser);
    notifyUserUpdated(currentUser);

    // Sync to Supabase in the background if authenticated
    if (currentUser.is_cloud) {
        syncToCloud(currentUser);
    }

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
 * Resets user progress back to defaults. Useful for testing and demo flows.
 * @returns {Promise<Object|null>} Reset user object
 */
export async function resetUserProgress() {
    if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
    }
    const rawDefault = usersData && usersData.length > 0 ? { ...usersData[0] } : null;
    currentUser = normalizeUserData(rawDefault);
    currentUser.is_cloud = false;
    notifyUserUpdated(currentUser);

    // If logged in, also reset cloud profile
    if (currentAuthUser && supabase) {
        try {
            await supabase
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
                .eq("id", currentAuthUser.id);
        } catch (err) {
            console.warn("Failed to reset cloud profile:", err);
        }
    }

    return currentUser ? { ...currentUser } : null;
}