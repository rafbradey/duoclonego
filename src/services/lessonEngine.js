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
                    return parsedMatches.some(
                        (m) => String(m.left).trim().toLowerCase() === leftNorm &&
                               String(m.right).trim().toLowerCase() === rightNorm
                    );
                } else {
                    const matchedVal = parsedMatches[pair.left] ?? parsedMatches[leftNorm];
                    return matchedVal && String(matchedVal).trim().toLowerCase() === rightNorm;
                }
            });
        }

        const formattedCorrect = question.pairs.map((p) => `${p.left} ↔ ${p.right}`).join(" | ");

        return {
            isCorrect,
            selectedAnswer,
            correctAnswer: formattedCorrect,
            explanation: question.explanation || "",
            relatedDrug: question.relatedDrug || ""
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
                relatedDrug: targetTallMan || question.relatedDrug || ""
            };
        }

        // Guided Mode: Scaffolding allows segment input with case/whitespace tolerance
        const expectedSegment = String(question.expectedSegment || "").trim().toUpperCase();
        const inputUpper = inputTrimmed.toUpperCase();
        const fullReconstructed = `${question.prefix || ""}${inputTrimmed}${question.suffix || ""}`;
        const targetTallManUpper = targetTallMan.toUpperCase();

        const isCorrect = Boolean(
            (expectedSegment && inputUpper === expectedSegment) ||
            (targetTallMan && inputUpper === targetTallManUpper) ||
            (targetTallMan && fullReconstructed.toUpperCase() === targetTallManUpper && inputUpper.length === expectedSegment.length)
        );

        return {
            isCorrect,
            selectedAnswer: inputTrimmed,
            correctAnswer: question.tallManName || expectedSegment,
            tallManName: question.tallManName || "",
            isMastery: false,
            explanation: question.explanation || "",
            relatedDrug: question.tallManName || question.relatedDrug || ""
        };
    }

    const cleanSelected = String(selectedAnswer).trim().toLowerCase();
    const cleanCorrect = String(question.correctAnswer).trim().toLowerCase();
    const isCorrect = cleanSelected === cleanCorrect;

    return {
        isCorrect,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        relatedDrug: question.relatedDrug
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
        totalQuestions: questions.length,
        answers: [],
        correctCount: 0,
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
 * @returns {Object} { nextSession, evaluation }
 */
export function recordSessionAnswer(
    session,
    question,
    selectedAnswer,
    { forcedOutcome = null } = {}
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

    const updatedAnswers = [
        ...session.answers,
        {
            questionId: question.id,
            prompt: question.prompt,
            selectedAnswer,
            correctAnswer: evaluation.correctAnswer || question.correctAnswer,
            isCorrect,
            explanation: question.explanation
        }
    ];

    const updatedCorrectCount = isCorrect ? session.correctCount + 1 : session.correctCount;
    const isLastQuestion = session.currentIndex + 1 >= session.totalQuestions;

    const nextSession = {
        ...session,
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
