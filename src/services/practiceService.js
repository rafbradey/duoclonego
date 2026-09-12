import { allLevels, getQuestionOrigin, lasaOriginMap } from "../data/levels/index.js";
import { getCurrentUser, recordSrsOutcome, getDueSrsPairs } from "./userService.js";
import { getLasaPairById, generateSoundAlikeQuestion } from "./questionGenerator.js";

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
 * Supported modes:
 * - "due": Spaced Repetition review prioritizing pairs due for retrieval
 * - "mistakes": Targeted remediation for flagged mistakes
 * - "audio": Sound-Alike acoustic discrimination & simulated oral telephone orders
 * - "quick": Broad randomized retrieval across unlocked curriculum
 *
 * @param {Object} options
 * @param {"quick"|"mistakes"|"due"|"audio"} [options.mode="quick"] - Practice mode
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

    const availableLasaIds = new Set();
    sourceLevels.forEach((lvl) => {
        if (Array.isArray(lvl.questions)) {
            poolQuestions.push(...lvl.questions);
            lvl.questions.forEach((q) => {
                if (q.lasaId) availableLasaIds.add(q.lasaId);
            });
        }
    });

    // Synthesize audio questions for available LASA pairs
    const audioCandidates = [];
    availableLasaIds.forEach((lasaId) => {
        const pair = getLasaPairById(lasaId);
        if (pair) {
            const audioMcq = generateSoundAlikeQuestion(pair, {
                drugSide: "A",
                subtype: "acoustic_mcq",
                idSuffix: `prc_${lasaId}_a`
            });
            const readBack = generateSoundAlikeQuestion(pair, {
                drugSide: "B",
                subtype: "read_back",
                idSuffix: `prc_${lasaId}_b`
            });
            if (audioMcq) audioCandidates.push(audioMcq);
            if (readBack) audioCandidates.push(readBack);
        }
    });

    // De-duplicate questions by ID
    const uniqueMap = new Map();
    poolQuestions.forEach((q) => {
        if (q && q.id && !uniqueMap.has(q.id)) {
            uniqueMap.set(q.id, q);
        }
    });
    const allCandidates = Array.from(uniqueMap.values());
    let selectedQuestions = [];

    if (mode === "audio") {
        // Sound-Alike Audio Mode: Exclusively acoustic discrimination and simulated oral orders
        const shuffledAudio = shuffleArray(audioCandidates);
        selectedQuestions = shuffledAudio.slice(0, count);

        // If not enough audio candidates, backfill with general candidates
        if (selectedQuestions.length < count) {
            const remaining = allCandidates.filter((q) => !selectedQuestions.some((s) => s.id === q.id));
            const backfill = shuffleArray(remaining).slice(0, count - selectedQuestions.length);
            selectedQuestions.push(...backfill);
        }
    } else if (mode === "due") {
        // Spaced Repetition Mode: Find questions for pairs whose nextReviewDue <= now
        const duePairs = getDueSrsPairs(user);
        const dueLasaIds = new Set(duePairs.map((p) => p.lasaId));

        const dueCandidates = allCandidates.filter((q) => q.lasaId && dueLasaIds.has(q.lasaId));
        const shuffledDue = shuffleArray(dueCandidates);

        selectedQuestions = shuffledDue.slice(0, count);

        // If fewer due questions than requested count, backfill with non-due candidates
        if (selectedQuestions.length < count) {
            const remaining = allCandidates.filter((q) => !selectedQuestions.some((s) => s.id === q.id));
            const backfill = shuffleArray(remaining).slice(0, count - selectedQuestions.length);
            selectedQuestions.push(...backfill);
        }
    } else if (mode === "mistakes") {
        // Mistakes Mode: Filter questions currently in the user's mistake queue
        const mistakeCandidates = allCandidates.filter((q) => mistakesQueue.includes(q.id));
        const shuffledMistakes = shuffleArray(mistakeCandidates);

        selectedQuestions = shuffledMistakes.slice(0, count);

        // If fewer mistake candidates than requested, backfill with general candidates
        if (selectedQuestions.length < count) {
            const remaining = allCandidates.filter((q) => !selectedQuestions.some((s) => s.id === q.id));
            const backfill = shuffleArray(remaining).slice(0, count - selectedQuestions.length);
            selectedQuestions.push(...backfill);
        }
    } else {
        // Quick Practice Mode: Broad random sample blending visual and acoustic retrieval
        const combinedPool = [...allCandidates, ...audioCandidates.slice(0, 4)];
        const shuffled = shuffleArray(combinedPool);
        selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // Attach exact Learning Path origin metadata to every practice question
    selectedQuestions = selectedQuestions.map((q) => {
        const origin = getQuestionOrigin(q) || (q.lasaId ? lasaOriginMap.get(q.lasaId) : null);
        if (origin) {
            return {
                ...q,
                ...origin,
                isPractice: true
            };
        }
        return {
            ...q,
            isPractice: true
        };
    });

    let title = "Quick Practice";
    let description = "Quick retrieval practice drawn from your completed LASA curriculum.";

    if (mode === "audio") {
        title = "Sound-Alike Audio Practice";
        description = "Sharpen oral telephone order comprehension and sound-alike discrimination by ear without visual cues.";
    } else if (mode === "due") {
        title = "Daily Spaced Review";
        description = "Target Look-Alike / Sound-Alike pairs scheduled for optimal long-term memory retention.";
    } else if (mode === "mistakes") {
        title = "Targeted Mistakes Review";
        description = "Target and correct confusable pairs missed in previous sessions to clear them from your queue.";
    }

    return {
        id: "practice",
        practiceMode: mode,
        title,
        description,
        isPractice: true,
        xpReward: 10,
        questions: selectedQuestions
    };
}

/**
 * Evaluates answer outcomes during practice to maintain the user's mistakes queue and SRS intervals.
 * @param {string} questionId - ID of the question
 * @param {boolean} isCorrect - Whether the question was answered correctly
 * @param {string} [lasaId] - Optional LASA pair ID
 */
export async function recordPracticeOutcome(questionId, isCorrect, lasaId = null) {
    if (!questionId && !lasaId) return;
    await recordSrsOutcome({
        questionId,
        lasaId,
        isCorrect
    });
}

/**
 * Unified answer outcome recorder callable from both normal curriculum lessons and practice sessions.
 * @param {Object} params
 * @param {string} params.questionId
 * @param {string} [params.lasaId]
 * @param {boolean} params.isCorrect
 * @param {boolean} [params.isPractice=false]
 */
export async function recordQuestionOutcome({ questionId, lasaId, isCorrect } = {}) {
    if (!questionId && !lasaId) return;
    await recordSrsOutcome({
        questionId,
        lasaId,
        isCorrect
    });
}
