/**
 * Pure domain logic for lesson evaluation, scoring, and session progression.
 * Independent of React UI components to enable direct unit testing.
 */

/**
 * Evaluates a user's answer against the question's correct answer.
 * @param {Object} question - The question object
 * @param {string} selectedAnswer - The answer selected by the user
 * @returns {Object} Evaluation result including correctness and educational explanation
 */
export function evaluateAnswer(question, selectedAnswer) {
    if (!question || selectedAnswer === undefined || selectedAnswer === null) {
        return {
            isCorrect: false,
            selectedAnswer: "",
            correctAnswer: question?.correctAnswer || "",
            explanation: question?.explanation || "",
            relatedDrug: question?.relatedDrug || ""
        };
    }

    // Common metadata attachments
    const commonMetadata = {
        riskSummary: question.riskSummary || question.feedbackFact || "",
        sourceUrl: question.sourceUrl || "",
        sourceCitation: question.sourceCitation || "",
        source: question.source || "",
        pairDisplay: question.pairDisplay || ""
    };

    // Special handling for tap-to-match pair questions
    if (question.type === "matching" && Array.isArray(question.pairs)) {
        let parsedMatches = selectedAnswer;
        if (typeof selectedAnswer === "string") {
            try {
                parsedMatches = JSON.parse(selectedAnswer);
            } catch {
                parsedMatches = null;
            }
        }

        let isCorrect = false;
        if (parsedMatches && typeof parsedMatches === "object") {
            isCorrect = question.pairs.every((pair) => {
                const leftNorm = String(pair.left).trim().toLowerCase();
                const rightNorm = String(pair.right).trim().toLowerCase();

                if (Array.isArray(parsedMatches)) {
                    return parsedMatches.some((m) => {
                        const ml = String(m.left).trim().toLowerCase();
                        const mr = String(m.right).trim().toLowerCase();
                        return (ml === leftNorm && mr === rightNorm) || (ml === rightNorm && mr === leftNorm);
                    });
                } else {
                    const matchedVal = parsedMatches[pair.left] ?? parsedMatches[leftNorm];
                    const matchedRev = Object.keys(parsedMatches).find(
                        (k) => String(parsedMatches[k]).trim().toLowerCase() === leftNorm
                    );
                    return (matchedVal && (String(matchedVal).trim().toLowerCase() === rightNorm || String(matchedVal).trim().toLowerCase() === leftNorm)) ||
                           (matchedRev && String(matchedRev).trim().toLowerCase() === rightNorm);
                }
            });
        }

        const formattedCorrect = question.pairs.map((p) => `${p.left} ↔ ${p.right}`).join(" | ");

        return {
            isCorrect,
            selectedAnswer,
            correctAnswer: formattedCorrect,
            explanation: question.explanation || "",
            relatedDrug: question.relatedDrug || "",
            ...commonMetadata
        };
    }

    // Special handling for constructed-response Tall Man lettering questions
    if (question.type === "tall_man") {
        const isMastery = Boolean(
            question.isFinalTask ||
            question.activityRole === "unit_mastery" ||
            question.scaffold === false
        );

        const inputTrimmed = String(selectedAnswer).trim();
        const targetTallMan = String(question.tallManName || "").trim();

        if (isMastery) {
            // Unit Mastery Mode: Learner must independently produce the full Tall Man name.
            // Capitalization is strictly evaluated (case-sensitive) to test orthographic retrieval.
            const isCorrect = inputTrimmed === targetTallMan;

            return {
                isCorrect,
                selectedAnswer: inputTrimmed,
                correctAnswer: targetTallMan,
                tallManName: targetTallMan,
                isMastery: true,
                explanation: question.explanation || "",
                relatedDrug: targetTallMan || question.relatedDrug || "",
                ...commonMetadata
            };
        }

        // Guided Mode: Scaffolding requires exact canonical Tall Man capitalization of the segment
        const expectedSegment = String(question.expectedSegment || "").trim();
        const fullReconstructed = `${question.prefix || ""}${inputTrimmed}${question.suffix || ""}`;

        const isCorrect = Boolean(
            (expectedSegment && inputTrimmed === expectedSegment) ||
            (targetTallMan && inputTrimmed === targetTallMan) ||
            (targetTallMan && fullReconstructed === targetTallMan)
        );

        return {
            isCorrect,
            selectedAnswer: inputTrimmed,
            correctAnswer: question.tallManName || expectedSegment,
            tallManName: question.tallManName || "",
            isMastery: false,
            explanation: question.explanation || "",
            relatedDrug: question.tallManName || question.relatedDrug || "",
            ...commonMetadata
        };
    }

    // Detect if this is a Tall Man multiple choice question testing capitalization:
    // When options are capitalization variations of the same text or subtype is tall_man_mcq,
    // evaluate strictly case-sensitive.
    const isTallManMCQ = Boolean(
        question.subtype === "tall_man_mcq" ||
        question.isTallManChoice ||
        (Array.isArray(question.choices) &&
         question.choices.length > 1 &&
         new Set(question.choices.map((c) => String(c).trim().toLowerCase())).size === 1)
    );

    let isCorrect;
    if (isTallManMCQ) {
        isCorrect = String(selectedAnswer).trim() === String(question.correctAnswer).trim();
    } else {
        const cleanSelected = String(selectedAnswer).trim().toLowerCase();
        const cleanCorrect = String(question.correctAnswer).trim().toLowerCase();
        isCorrect = cleanSelected === cleanCorrect;
    }

    return {
        isCorrect,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        relatedDrug: question.relatedDrug,
        ...commonMetadata
    };
}

/**
 * Calculates XP earned from a completed lesson.
 * @param {Object} lesson - Lesson definition
 * @param {number} correctCount - Number of correctly answered questions
 * @param {number} totalQuestions - Total questions in the lesson
 * @returns {number} Calculated XP reward
 */
export function calculateLessonXP(lesson, correctCount, totalQuestions) {
    const baseReward = Number(lesson?.xp_reward) || 10;
    if (totalQuestions <= 0) return 0;

    const accuracyRatio = Math.max(0, Math.min(1, correctCount / totalQuestions));
    const earnedBase = Math.round(baseReward * accuracyRatio);

    // Accuracy bonus: +5 XP for 100% accuracy
    const perfectBonus = correctCount === totalQuestions ? 5 : 0;

    return Math.max(5, earnedBase + perfectBonus);
}

/**
 * Fisher-Yates array shuffle.
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Dynamically prepares a lesson/level for a practice or learning session.
 * Samples questions from each activity's authored question pool respecting learning objectives,
 * prevents immediate duplicate LASA pairs across the session, and randomizes multiple-choice options.
 *
 * @param {Object} level - Normalized level or lesson definition
 * @param {Object} [options]
 * @param {boolean} [options.shuffleOptions=true] - Whether to shuffle multiple choice options
 * @returns {Object} Prepared session lesson instance with selected questions
 */
export function prepareSessionLesson(level, { shuffleOptions = true, userHistory = null } = {}) {
    if (!level) return null;
    if (level.isPractice || level.isSessionPrepared) {
        return level;
    }

    const rawActivities = Array.isArray(level.activities) ? level.activities : [];
    if (rawActivities.length === 0) {
        return {
            ...level,
            isSessionPrepared: true
        };
    }

    const usedLasaIds = new Set();
    const usedTallManTerms = new Set();
    const usedSoundPairs = new Set();

    if (userHistory) {
        if (Array.isArray(userHistory.encounteredTallManTerms)) {
            userHistory.encounteredTallManTerms.forEach((t) => usedTallManTerms.add(t));
        }
        if (Array.isArray(userHistory.encounteredSoundPairs)) {
            userHistory.encounteredSoundPairs.forEach((p) => usedSoundPairs.add(p));
        }
        if (Array.isArray(userHistory.encounteredLasaIds)) {
            userHistory.encounteredLasaIds.forEach((id) => usedLasaIds.add(id));
        }
    }

    const sessionActivities = [];

    for (const activity of rawActivities) {
        const candidateQuestions = Array.isArray(activity.questions) ? activity.questions : [];
        if (candidateQuestions.length === 0) {
            sessionActivities.push({ ...activity, questions: [] });
            continue;
        }

        // Target count for this activity (prioritizes explicit sessionQuestionCount)
        const targetCount = activity.sessionQuestionCount
            ? activity.sessionQuestionCount
            : (activity.isFinalTask && candidateQuestions.length === 1 ? 1 : Math.min(candidateQuestions.length, 6));

        // Determine if activity tests Tall Man, Sound-Alike, or LASA Pair
        const isTallMan = candidateQuestions.some(
            (q) => q.type === "tall_man" || q.subtype === "tall_man_mcq" || q.subtype === "tall_man_fill_in" || q.isTallManChoice
        );
        const isSound = candidateQuestions.some(
            (q) => q.type === "sound_alike" || q.subtype === "acoustic_mcq" || q.subtype === "read_back"
        );

        let uncoveredCandidates;
        if (isTallMan) {
            uncoveredCandidates = candidateQuestions.filter((q) => {
                const term = q.tallManName || q.correctAnswer || q.relatedDrug;
                return term && !usedTallManTerms.has(term);
            });
        } else if (isSound) {
            uncoveredCandidates = candidateQuestions.filter((q) => q.lasaId && !usedSoundPairs.has(q.lasaId));
        } else {
            uncoveredCandidates = candidateQuestions.filter((q) => !q.lasaId || !usedLasaIds.has(q.lasaId));
        }

        let selectedQuestions = [];
        if (uncoveredCandidates.length >= targetCount) {
            selectedQuestions = shuffleArray(uncoveredCandidates).slice(0, targetCount);
        } else {
            // Take all uncovered first (shuffled), then sample remainder from reinforcement pool
            selectedQuestions = shuffleArray(uncoveredCandidates);
            const remainingPool = candidateQuestions.filter((q) => !selectedQuestions.includes(q));
            const needed = targetCount - selectedQuestions.length;
            if (needed > 0 && remainingPool.length > 0) {
                selectedQuestions.push(...shuffleArray(remainingPool).slice(0, needed));
            }
        }

        // Record used items for subsequent activities in this session
        selectedQuestions.forEach((q) => {
            if (q.lasaId) usedLasaIds.add(q.lasaId);
            const term = q.tallManName || (q.isTallManChoice ? q.correctAnswer : null);
            if (term) usedTallManTerms.add(term);
            if (q.type === "sound_alike" && q.lasaId) usedSoundPairs.add(q.lasaId);
        });

        // Process options/choices for each selected question
        const preparedQuestions = selectedQuestions.map((q) => {
            const questionCopy = { ...q };

            // Handle multiple-choice options shuffling
            if (shuffleOptions && Array.isArray(questionCopy.choices) && questionCopy.choices.length > 1) {
                questionCopy.choices = shuffleArray(questionCopy.choices);
                if (Array.isArray(questionCopy.options)) {
                    questionCopy.options = [...questionCopy.choices];
                }
            }

            return questionCopy;
        });

        sessionActivities.push({
            ...activity,
            questions: preparedQuestions
        });
    }

    const flattenedQuestions = sessionActivities.flatMap((a) => a.questions);

    return {
        ...level,
        isSessionPrepared: true,
        activities: sessionActivities,
        questions: flattenedQuestions,
        totalQuestions: flattenedQuestions.length
    };
}

/**
 * Initializes a new lesson session.
 * @param {Object} lesson - Lesson object containing questions
 * @returns {Object} Initialized session state
 */
export function createSession(lesson) {
    const questions = Array.isArray(lesson?.questions) ? lesson.questions : [];
    return {
        lessonId: lesson?.id || "",
        lessonTitle: lesson?.title || "",
        currentIndex: 0,
        initialQuestionCount: questions.length,
        totalQuestions: questions.length,
        answers: [],
        correctCount: 0,
        masteredQuestionIds: [],
        isCompleted: false,
        startedAt: Date.now(),
        completedAt: null
    };
}

/**
 * Advances session with a recorded answer.
 * @param {Object} session - Current session state
 * @param {Object} question - Current question
 * @param {string} selectedAnswer - Selected answer
 * @param {Object} [options] - Optional processing options
 * @param {"correct"|"incorrect"|null} [options.forcedOutcome] - Developer testing override
 * @param {number|null} [options.nextTotalQuestions] - Updated queue length when questions are re-queued
 * @returns {Object} { nextSession, evaluation }
 */
export function recordSessionAnswer(
    session,
    question,
    selectedAnswer,
    { forcedOutcome = null, nextTotalQuestions = null } = {}
) {
    let evaluation = evaluateAnswer(question, selectedAnswer);

    // Apply developer testing override if specified
    if (forcedOutcome === "correct") {
        evaluation = {
            ...evaluation,
            isCorrect: true
        };
    } else if (forcedOutcome === "incorrect") {
        evaluation = {
            ...evaluation,
            isCorrect: false
        };
    }

    const isCorrect = evaluation.isCorrect;

    const subject = question.relatedDrug ||
                    question.tallManName ||
                    question.standardName ||
                    (question.pairs && question.pairs[0] ? `${question.pairs[0].left} ↔ ${question.pairs[0].right}` : "") ||
                    "";

    const updatedAnswers = [
        ...session.answers,
        {
            questionId: question.id,
            questionType: question.type || "multiple_choice",
            subtype: question.subtype || (question.isTallManChoice ? "tall_man_mcq" : ""),
            activityRole: question.activityRole || "",
            subject,
            targetDrug: question.tallManName || question.standardName || question.relatedDrug || "",
            prompt: question.prompt,
            selectedAnswer,
            correctAnswer: evaluation.correctAnswer || question.correctAnswer,
            isCorrect,
            isRetry: Boolean(question.isRetry),
            explanation: question.explanation,
            pairs: question.pairs || null
        }
    ];

    const updatedCorrectCount = isCorrect ? session.correctCount + 1 : session.correctCount;
    
    // Track distinct mastered questions
    const qKey = question.id || question.prompt || String(session.currentIndex);
    const existingMastered = Array.isArray(session.masteredQuestionIds) ? session.masteredQuestionIds : [];
    const updatedMastered = isCorrect && !existingMastered.includes(qKey)
        ? [...existingMastered, qKey]
        : existingMastered;

    const totalQ = typeof nextTotalQuestions === "number" ? nextTotalQuestions : session.totalQuestions;
    const isLastQuestion = session.currentIndex + 1 >= totalQ;

    const nextSession = {
        ...session,
        totalQuestions: totalQ,
        masteredQuestionIds: updatedMastered,
        answers: updatedAnswers,
        correctCount: updatedCorrectCount,
        isCompleted: isLastQuestion,
        completedAt: isLastQuestion ? Date.now() : null
    };

    return {
        nextSession,
        evaluation
    };
}
