import { allLevels } from "../data/levels/index.js";
import { getCurrentUser, updateUserProgress } from "./userService.js";

/**
 * Shuffles an array using the modern Fisher-Yates algorithm.
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array copy
 */
function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * Generates a practice review session tailored to the user's progress.
 * Pulls questions from completed and unlocked levels so learners only
 * review concepts they have encountered.
 *
 * @param {Object} options
 * @param {"quick"|"mistakes"} [options.mode="quick"] - Practice mode
 * @param {number} [options.count=5] - Number of questions for the session
 * @returns {Promise<Object>} Synthetic lesson object ready for LessonSession
 */
export async function generatePracticeSession({ mode = "quick", count = 5 } = {}) {
    const user = await getCurrentUser();
    const completedSet = new Set(user?.completed_lessons || []);
    const mistakesQueue = Array.isArray(user?.mistakes_queue) ? user.mistakes_queue : [];

    // Harvest all pool questions from levels the user has unlocked or completed
    let poolQuestions = [];

    // Filter levels: include completed levels, plus the first level by default
    const eligibleLevels = allLevels.filter((lvl) => {
        const isCompleted = completedSet.has(lvl.id) ||
            completedSet.has(String(lvl.id).replace(/^level_/, "lesson_")) ||
            completedSet.has(String(lvl.id).replace(/^lesson_/, "level_"));
        return isCompleted || lvl.unlocked;
    });

    // Fallback: If user has no completed/unlocked levels yet, use the first available level
    const sourceLevels = eligibleLevels.length > 0 ? eligibleLevels : allLevels.slice(0, 1);

    sourceLevels.forEach((lvl) => {
        if (Array.isArray(lvl.questions)) {
            poolQuestions.push(...lvl.questions);
        }
    });

    // De-duplicate questions by ID
    const uniqueMap = new Map();
    poolQuestions.forEach((q) => {
        if (q && q.id && !uniqueMap.has(q.id)) {
            uniqueMap.set(q.id, q);
        }
    });
    let candidates = Array.from(uniqueMap.values());

    // If "mistakes" mode is requested, prioritize or filter by questions in mistakesQueue
    if (mode === "mistakes") {
        const mistakeCandidates = candidates.filter((q) => mistakesQueue.includes(q.id));
        if (mistakeCandidates.length > 0) {
            candidates = mistakeCandidates;
        }
    }

    // Shuffle and pick the requested count
    const shuffled = shuffleArray(candidates);
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    const isMistakesMode = mode === "mistakes";
    return {
        id: "practice",
        practiceMode: mode,
        title: isMistakesMode ? "Mistakes Review" : "Quick Practice",
        description: isMistakesMode
            ? "Target and correct confusable pairs missed in previous sessions."
            : "Quick retrieval practice drawn from your completed LASA curriculum.",
        isPractice: true,
        xpReward: 10,
        questions: selectedQuestions
    };
}

/**
 * Evaluates answer outcomes during practice to maintain the user's mistakes queue.
 * @param {string} questionId - ID of the question
 * @param {boolean} isCorrect - Whether the question was answered correctly
 */
export async function recordPracticeOutcome(questionId, isCorrect) {
    if (!questionId) return;

    if (isCorrect) {
        // If answered correctly, remove from mistakes queue if it was present
        await updateUserProgress({ mistakeToRemove: questionId });
    } else {
        // If incorrect, add to mistakes queue for future targeted review
        await updateUserProgress({ mistakeToAdd: questionId });
    }
}
