/**
 * Streak Service for Duoclongo
 *
 * Handles calendar-based daily streak calculation, rollover, and
 * automatic Streak Freeze consumption when a learner misses a day.
 */

/**
 * Returns today's calendar date formatted as YYYY-MM-DD in local time.
 * @returns {string} e.g. "2026-09-17"
 */
export function getLocalTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Computes difference in calendar days between two "YYYY-MM-DD" date strings.
 * @param {string} dateStrA - Earlier or comparison date
 * @param {string} dateStrB - Later date (defaults to today)
 * @returns {number} Number of days elapsed (positive if B is later than A)
 */
export function getCalendarDaysDiff(dateStrA, dateStrB = getLocalTodayDate()) {
    if (!dateStrA) return 999;
    if (dateStrA === dateStrB) return 0;

    const [yA, mA, dA] = dateStrA.split("-").map(Number);
    const [yB, mB, dB] = dateStrB.split("-").map(Number);

    const utcA = Date.UTC(yA, mA - 1, dA);
    const utcB = Date.UTC(yB, mB - 1, dB);

    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((utcB - utcA) / msPerDay);
}

/**
 * Evaluates streak status on user login or profile load (before practicing).
 *
 * Scenarios:
 * - Days diff = 0: Already practiced today. Streak safe.
 * - Days diff = 1: Practiced yesterday, pending today's practice. Streak safe.
 * - Days diff = 2: Missed yesterday!
 *     - If streak_freeze_count > 0: Consume 1 freeze. Set last_active_date to yesterday. Streak preserved!
 *     - If streak_freeze_count === 0: Streak broken. Resets streak to 0 (pending today's lesson to restart at 1).
 * - Days diff > 2: Missed 2+ days. Streak broken regardless of freeze. Resets streak to 0.
 *
 * @param {Object} user - User profile
 * @returns {{
 *   streak: number,
 *   streak_freeze_count: number,
 *   last_active_date: string,
 *   freezeConsumed: boolean,
 *   streakBroken: boolean,
 *   needsUpdate: boolean
 * }}
 */
export function evaluateStreakOnLogin(user) {
    if (!user) return { needsUpdate: false };

    const today = getLocalTodayDate();
    const lastActive = user.last_active_date || today;
    const diff = getCalendarDaysDiff(lastActive, today);

    const currentStreak = user.streak || 0;
    const currentFreezes = user.streak_freeze_count || 0;

    // Same day or consecutive day (waiting for today's practice)
    if (diff <= 1) {
        return {
            streak: currentStreak,
            streak_freeze_count: currentFreezes,
            last_active_date: lastActive,
            freezeConsumed: false,
            streakBroken: false,
            needsUpdate: false
        };
    }

    // Exactly 1 missed day (diff == 2)
    if (diff === 2) {
        if (currentFreezes > 0) {
            // Consume 1 freeze to protect the streak!
            // Pretend yesterday was covered by freeze so diff becomes 1
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yYear = yesterdayDate.getFullYear();
            const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, "0");
            const yDay = String(yesterdayDate.getDate()).padStart(2, "0");
            const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

            return {
                streak: currentStreak,
                streak_freeze_count: Math.max(0, currentFreezes - 1),
                last_active_date: yesterdayStr,
                freezeConsumed: true,
                streakBroken: false,
                needsUpdate: true
            };
        } else {
            // Streak broken
            return {
                streak: 0,
                streak_freeze_count: 0,
                last_active_date: lastActive,
                freezeConsumed: false,
                streakBroken: true,
                needsUpdate: true
            };
        }
    }

    // Missed 2 or more days (diff > 2)
    return {
        streak: 0,
        streak_freeze_count: currentFreezes,
        last_active_date: lastActive,
        freezeConsumed: false,
        streakBroken: true,
        needsUpdate: currentStreak > 0
    };
}

/**
 * Calculates new streak status after completing an active learning session (lesson, mastery, practice).
 *
 * Scenarios:
 * - Already practiced today (diff == 0): streak does not increment again today.
 * - Practiced yesterday (diff == 1): streak increments by +1.
 * - Missed 1 day (diff == 2):
 *     - If freeze was consumed, streak increments by +1.
 *     - If no freeze, streak restarts at 1.
 * - Missed 2+ days (diff > 2): streak restarts at 1.
 *
 * @param {Object} user - User profile
 * @returns {{
 *   newStreak: number,
 *   newFreezes: number,
 *   lastActiveDate: string,
 *   incremented: boolean,
 *   freezeUsed: boolean
 * }}
 */
export function calculateStreakOnActivity(user) {
    const today = getLocalTodayDate();
    const lastActive = user?.last_active_date;
    const currentStreak = user?.streak || 0;
    const currentFreezes = user?.streak_freeze_count || 0;

    if (!lastActive) {
        // First ever activity
        return {
            newStreak: 1,
            newFreezes: currentFreezes,
            lastActiveDate: today,
            incremented: true,
            freezeUsed: false
        };
    }

    const diff = getCalendarDaysDiff(lastActive, today);

    if (diff === 0) {
        // Already practiced today; keep streak unchanged
        return {
            newStreak: Math.max(1, currentStreak),
            newFreezes: currentFreezes,
            lastActiveDate: today,
            incremented: false,
            freezeUsed: false
        };
    }

    if (diff === 1) {
        // Consecutive day! Increment streak
        return {
            newStreak: currentStreak + 1,
            newFreezes: currentFreezes,
            lastActiveDate: today,
            incremented: true,
            freezeUsed: false
        };
    }

    if (diff === 2 && currentFreezes > 0) {
        // Missed yesterday but has freeze!
        return {
            newStreak: currentStreak + 1,
            newFreezes: currentFreezes - 1,
            lastActiveDate: today,
            incremented: true,
            freezeUsed: true
        };
    }

    // Diff > 1 without freeze or diff > 2: streak restarts at 1
    return {
        newStreak: 1,
        newFreezes: currentFreezes,
        lastActiveDate: today,
        incremented: true,
        freezeUsed: false
    };
}
