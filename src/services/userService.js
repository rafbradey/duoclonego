import usersData from "../data/user.json" with { type: "json" };

const STORAGE_KEY = "duoclongo_user_progress";

export const SRS_INTERVALS = {
    0: 0,                           // Stage 0: Due immediately (learning / unredeemed mistake)
    1: 24 * 60 * 60 * 1000,         // Stage 1: 24 hours (1 day)
    2: 72 * 60 * 60 * 1000,         // Stage 2: 72 hours (3 days)
    3: 7 * 24 * 60 * 60 * 1000     // Stage 3: 7 days (Mastered)
};

function loadPersistedUser() {
    const rawDefault = usersData && usersData.length > 0 ? { ...usersData[0] } : null;
    const defaultUser = rawDefault ? {
        ...rawDefault,
        completed_lessons: rawDefault.completed_lessons || [],
        mistakes_queue: rawDefault.mistakes_queue || [],
        practice_sessions_completed: rawDefault.practice_sessions_completed || 0,
        srs_records: rawDefault.srs_records || {}
    } : null;

    if (typeof window === "undefined" || !window.localStorage) {
        return defaultUser;
    }
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...defaultUser,
                ...parsed,
                // Ensure arrays and critical values are preserved
                completed_lessons: Array.isArray(parsed.completed_lessons)
                    ? parsed.completed_lessons
                    : defaultUser?.completed_lessons || [],
                mistakes_queue: Array.isArray(parsed.mistakes_queue)
                    ? parsed.mistakes_queue
                    : [],
                practice_sessions_completed: typeof parsed.practice_sessions_completed === "number"
                    ? parsed.practice_sessions_completed
                    : 0,
                srs_records: parsed.srs_records && typeof parsed.srs_records === "object"
                    ? parsed.srs_records
                    : {}
            };
        }
    } catch (e) {
        console.warn("Failed to load user from localStorage, falling back to default:", e);
    }
    return defaultUser;
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

// Active user state initialized from persistence or prototype data
let currentUser = loadPersistedUser();

/**
 * Dispatches a custom event to notify subscribed components of user state updates.
 * @param {Object} user - Updated user object
 */
function notifyUserUpdated(user) {
    if (typeof window !== "undefined" && window.dispatchEvent) {
        const event = new CustomEvent("duoclongo:user-updated", {
            detail: { user: { ...user } }
        });
        window.dispatchEvent(event);
    }
}

/**
 * Retrieves the currently active user profile.
 * Decouples UI components from raw array representation.
 * @returns {Promise<Object|null>} The active user object or null
 */
export async function getCurrentUser() {
    return currentUser ? { ...currentUser } : null;
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
 * Retained for backward compatibility during prototype migration.
 * @deprecated Prefer getCurrentUser() or getUserById()
 * @returns {Promise<Array>} Array of users
 */
export async function getUserInfo() {
    return usersData;
}

/**
 * Updates current user progression stats (XP, streaks, hearts, completed lessons, mistakes).
 * Persists changes to localStorage and emits an update event.
 * @param {Object} updates
 * @param {number} [updates.xpToAdd] - Amount of XP to increment
 * @param {number} [updates.heartsChange] - Delta for hearts count
 * @param {string} [updates.completedLessonId] - Lesson or Level ID to append to completed list
 * @param {string} [updates.mistakeToAdd] - Question ID to add to mistakes queue
 * @param {string} [updates.mistakeToRemove] - Question ID to remove from mistakes queue
 * @param {boolean} [updates.practiceSessionCompleted] - Whether a practice review was completed
 * @returns {Promise<Object|null>} Updated user object
 */
export async function updateUserProgress({
    xpToAdd = 0,
    heartsChange = 0,
    completedLessonId = null,
    mistakeToAdd = null,
    mistakeToRemove = null,
    practiceSessionCompleted = false
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

    currentUser = {
        ...currentUser,
        xp: Math.max(0, (currentUser.xp || 0) + xpToAdd),
        hearts: Math.max(0, (currentUser.hearts || 5) + heartsChange),
        completed_lessons: completedLessons,
        mistakes_queue: mistakesQueue,
        practice_sessions_completed: practiceCount
    };

    savePersistedUser(currentUser);
    notifyUserUpdated(currentUser);

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

    currentUser = {
        ...currentUser,
        srs_records: srsRecords,
        mistakes_queue: mistakesQueue
    };

    savePersistedUser(currentUser);
    notifyUserUpdated(currentUser);

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
    currentUser = rawDefault ? {
        ...rawDefault,
        completed_lessons: rawDefault.completed_lessons || [],
        mistakes_queue: rawDefault.mistakes_queue || [],
        practice_sessions_completed: rawDefault.practice_sessions_completed || 0,
        srs_records: rawDefault.srs_records || {}
    } : null;
    notifyUserUpdated(currentUser);
    return currentUser ? { ...currentUser } : null;
}