import usersData from "../data/user.json" with { type: "json" };

// In-memory active user state (cloned from prototype data) to allow local updates
let currentUser = usersData && usersData.length > 0 ? { ...usersData[0] } : null;

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
 * Updates current user progression stats (XP, streaks, hearts, completed lessons).
 * Prepares the architecture for persistent progress tracking.
 * @param {Object} updates
 * @param {number} [updates.xpToAdd] - Amount of XP to increment
 * @param {number} [updates.heartsChange] - Delta for hearts count
 * @param {string} [updates.completedLessonId] - Lesson ID to append to completed list
 * @returns {Promise<Object|null>} Updated user object
 */
export async function updateUserProgress({ xpToAdd = 0, heartsChange = 0, completedLessonId = null } = {}) {
    if (!currentUser) return null;

    const completedLessons = Array.isArray(currentUser.completed_lessons)
        ? [...currentUser.completed_lessons]
        : [];

    if (completedLessonId && !completedLessons.includes(completedLessonId)) {
        completedLessons.push(completedLessonId);
    }

    currentUser = {
        ...currentUser,
        xp: Math.max(0, (currentUser.xp || 0) + xpToAdd),
        hearts: Math.max(0, (currentUser.hearts || 5) + heartsChange),
        completed_lessons: completedLessons
    };

    return { ...currentUser };
}