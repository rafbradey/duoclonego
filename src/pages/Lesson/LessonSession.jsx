import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router";
import { X, BookOpen, AlertCircle, Sparkles, Wrench, Check } from "lucide-react";
import { getLessonById } from "../../services/lessonService.js";
import { getMasteryLevelByUnitId } from "../../services/unitService.js";
import { createSession, recordSessionAnswer, prepareSessionLesson, evaluateAnswer } from "../../services/lessonEngine.js";
import { getCurrentUser, deductHeart } from "../../services/userService.js";
import { generatePracticeSession, recordQuestionOutcome } from "../../services/practiceService.js";
import { playCorrectSound, playIncorrectSound } from "../../services/audioService.js";
import QuestionRenderer from "../../components/QuestionCard/QuestionRenderer.jsx";
import FeedbackDrawer from "../../components/FeedbackDrawer/FeedbackDrawer.jsx";
import LessonCompletion from "../../components/LessonCompletion/LessonCompletion.jsx";
import OutOfHeartsModal from "../../components/OutOfHeartsModal/OutOfHeartsModal.jsx";
import heartIcon from "../../assets/items/heart.png";
import "./LessonSession.css";

function LessonSession() {
    const { lessonId, unitId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [session, setSession] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hearts, setHearts] = useState(5);
    const [loading, setLoading] = useState(true);
    const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
    const [pendingOutOfHearts, setPendingOutOfHearts] = useState(false);

    const isPracticeMode = lessonId === "practice" || Boolean(lesson?.isPractice);

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            setLoading(true);
            try {
                if (unitId) {
                    const [masteryData, userData] = await Promise.all([
                        getMasteryLevelByUnitId(unitId),
                        getCurrentUser()
                    ]);
                    if (isMounted) {
                        if (masteryData) {
                            const prepared = prepareSessionLesson(masteryData);
                            setLesson(prepared);
                            setSession(createSession(prepared));
                        }
                        if (userData && userData.hearts !== undefined) {
                            setHearts(userData.hearts);
                            if (userData.hearts <= 0) {
                                setShowOutOfHeartsModal(true);
                            }
                        }
                        setLoading(false);
                    }
                } else if (lessonId === "practice") {
                    const practiceMode = searchParams.get("mode") || "quick";
                    const [practiceData, userData] = await Promise.all([
                        generatePracticeSession({ mode: practiceMode }),
                        getCurrentUser()
                    ]);
                    if (isMounted) {
                        if (practiceData) {
                            const prepared = prepareSessionLesson(practiceData);
                            setLesson(prepared);
                            setSession(createSession(prepared));
                        }
                        if (userData && userData.hearts !== undefined) {
                            setHearts(userData.hearts);
                        }
                        setLoading(false);
                    }
                } else {
                    const [lessonData, userData] = await Promise.all([
                        getLessonById(lessonId),
                        getCurrentUser()
                    ]);
                    if (isMounted) {
                        if (lessonData) {
                            const prepared = prepareSessionLesson(lessonData);
                            setLesson(prepared);
                            setSession(createSession(prepared));
                        }
                        if (userData && userData.hearts !== undefined) {
                            setHearts(userData.hearts);
                            if (userData.hearts <= 0) {
                                setShowOutOfHeartsModal(true);
                            }
                        }
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error("Failed to load lesson:", err);
                if (isMounted) setLoading(false);
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, [lessonId, unitId, searchParams]);

    const handleExit = () => {
        if (!session?.isCompleted && session?.currentIndex > 0) {
            const confirmExit = window.confirm(
                "Are you sure you want to quit? Your current session progress will not be saved."
            );
            if (!confirmExit) return;
        }
        if (isPracticeMode) {
            navigate("/practice");
        } else {
            navigate("/learn");
        }
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer || isSubmitted || !lesson || !session) return;

        const currentQuestion = lesson.questions[session.currentIndex];
        const initialEval = evaluateAnswer(currentQuestion, selectedAnswer);
        let nextQuestionsLength = lesson.questions.length;

        if (!initialEval.isCorrect) {
            const retryQuestion = {
                ...currentQuestion,
                isRetry: true,
                _retryInstanceId: `${currentQuestion.id || "q"}_retry_${Date.now()}`
            };
            const updatedQuestions = [...lesson.questions, retryQuestion];
            nextQuestionsLength = updatedQuestions.length;
            setLesson((prev) => ({
                ...prev,
                questions: updatedQuestions,
                totalQuestions: nextQuestionsLength
            }));

            if (!isPracticeMode) {
                deductHeart()
                    .then((newHearts) => {
                        setHearts(newHearts);
                        if (newHearts <= 0) {
                            setPendingOutOfHearts(true);
                        }
                    })
                    .catch((err) => console.error("Failed to deduct heart:", err));
            }
        }

        const { nextSession, evaluation } = recordSessionAnswer(
            session,
            currentQuestion,
            selectedAnswer,
            { nextTotalQuestions: nextQuestionsLength }
        );

        if (evaluation.isCorrect) {
            playCorrectSound();
        } else {
            playIncorrectSound();
        }

        if (currentQuestion?.id || currentQuestion?.lasaId) {
            recordQuestionOutcome({
                questionId: currentQuestion?.id,
                lasaId: currentQuestion?.lasaId,
                isCorrect: evaluation.isCorrect,
                isPractice: isPracticeMode
            }).catch((err) => {
                console.error("Failed to record question outcome:", err);
            });
        }

        setSession(nextSession);
        setCurrentEvaluation(evaluation);
        setIsSubmitted(true);
    };

    /**
     * Developer Override: forces the current question through
     * the answer evaluation flow as either correct or incorrect.
     * @param {"correct"|"incorrect"} forcedOutcome
     */
    const handleDeveloperOverride = (forcedOutcome) => {
        if (isSubmitted || !lesson || !session) return;

        const currentQuestion = lesson.questions[session.currentIndex];
        if (!currentQuestion) return;

        let devAnswer = selectedAnswer;
        if (!devAnswer) {
            if (currentQuestion.type === "matching" && Array.isArray(currentQuestion.pairs)) {
                const matchMap = {};
                if (forcedOutcome === "correct") {
                    currentQuestion.pairs.forEach((p) => {
                        matchMap[p.left] = p.right;
                    });
                } else {
                    if (currentQuestion.pairs.length >= 2) {
                        matchMap[currentQuestion.pairs[0].left] = currentQuestion.pairs[1].right;
                        matchMap[currentQuestion.pairs[1].left] = currentQuestion.pairs[0].right;
                    } else {
                        matchMap[currentQuestion.pairs[0].left] = "DEV_INCORRECT_MATCH";
                    }
                }
                devAnswer = JSON.stringify(matchMap);
            } else if (currentQuestion.type === "tall_man") {
                if (forcedOutcome === "correct") {
                    devAnswer = currentQuestion.tallManName || currentQuestion.expectedSegment || "CORRECT";
                } else {
                    devAnswer = currentQuestion.standardName || "WRONG";
                }
            } else {
                if (forcedOutcome === "correct") {
                    devAnswer = currentQuestion.correctAnswer || (currentQuestion.choices && currentQuestion.choices[0]) || "Correct";
                } else {
                    const wrongChoice = currentQuestion.choices?.find(
                        (c) => String(c).trim().toLowerCase() !== String(currentQuestion.correctAnswer).trim().toLowerCase()
                    );
                    devAnswer = wrongChoice || "Incorrect Option";
                }
            }
        }

        const willBeCorrect = forcedOutcome === "correct";
        let nextQuestionsLength = lesson.questions.length;

        if (!willBeCorrect) {
            const retryQuestion = {
                ...currentQuestion,
                isRetry: true,
                _retryInstanceId: `${currentQuestion.id || "q"}_retry_${Date.now()}`
            };
            const updatedQuestions = [...lesson.questions, retryQuestion];
            nextQuestionsLength = updatedQuestions.length;
            setLesson((prev) => ({
                ...prev,
                questions: updatedQuestions,
                totalQuestions: nextQuestionsLength
            }));

            if (!isPracticeMode) {
                deductHeart()
                    .then((newHearts) => {
                        setHearts(newHearts);
                        if (newHearts <= 0) {
                            setPendingOutOfHearts(true);
                        }
                    })
                    .catch((err) => console.error("Failed to deduct heart:", err));
            }
        }

        const { nextSession, evaluation } = recordSessionAnswer(
            session,
            currentQuestion,
            devAnswer,
            { forcedOutcome, nextTotalQuestions: nextQuestionsLength }
        );

        if (evaluation.isCorrect) {
            playCorrectSound();
        } else {
            playIncorrectSound();
        }

        if (currentQuestion?.id || currentQuestion?.lasaId) {
            recordQuestionOutcome({
                questionId: currentQuestion?.id,
                lasaId: currentQuestion?.lasaId,
                isCorrect: evaluation.isCorrect,
                isPractice: isPracticeMode
            }).catch((err) => {
                console.error("Failed to record question outcome:", err);
            });
        }

        setSelectedAnswer(devAnswer);
        setSession(nextSession);
        setCurrentEvaluation(evaluation);
        setIsSubmitted(true);
    };

    const handleContinue = () => {
        if (!session) return;

        // If user is out of hearts after reviewing feedback for this mistake, display OutOfHeartsModal
        if (pendingOutOfHearts) {
            setPendingOutOfHearts(false);
            setShowOutOfHeartsModal(true);
            return;
        }

        // If completed, keep session state and clear evaluation drawer so completion screen renders
        if (session.isCompleted) {
            setCurrentEvaluation(null);
            setIsSubmitted(false);
            return;
        }

        // Advance to next question
        setSession((prev) => ({
            ...prev,
            currentIndex: prev.currentIndex + 1
        }));
        setSelectedAnswer(null);
        setCurrentEvaluation(null);
        setIsSubmitted(false);
    };

    if (loading) {
        return (
            <div className="session-status-screen">
                <div className="body-text-muted">Loading lesson session...</div>
            </div>
        );
    }

    if (!lesson || !session) {
        return (
            <div className="session-status-screen">
                <div className="session-error-card duo-card">
                    <AlertCircle size={36} className="session-error-icon" />
                    <h1 className="heading-md">
                        {unitId ? "Unit Mastery Not Found" : "Lesson Not Found"}
                    </h1>
                    <p className="body-text-muted">
                        We couldn&apos;t find {isPracticeMode ? "practice questions" : unitId ? `mastery challenge for unit "${unitId}"` : `lesson "${lessonId}"`} in the learning curriculum.
                    </p>
                    <Link to={isPracticeMode ? "/practice" : "/learn"} className="duo-button duo-button-primary">
                        <BookOpen size={18} />
                        <span>{isPracticeMode ? "RETURN TO PRACTICE" : "RETURN TO LEARN"}</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Render completion celebration when all questions have been answered
    if (session.isCompleted && !currentEvaluation) {
        return <LessonCompletion session={session} lesson={lesson} />;
    }

    const currentQuestion = lesson.questions[session.currentIndex];
    const initialCount = session.initialQuestionCount || lesson.questions.length;
    const masteredCount = Array.isArray(session.masteredQuestionIds)
        ? session.masteredQuestionIds.length
        : session.correctCount;
    const progressPercent = initialCount > 0
        ? Math.min(100, Math.round((masteredCount / initialCount) * 100))
        : 0;

    return (
        <div className="lesson-runner-root">
            <header className="lesson-runner-header">
                <button
                    type="button"
                    onClick={handleExit}
                    className="lesson-runner-close-btn"
                    aria-label="Exit Lesson"
                >
                    <X size={26} />
                </button>

                <div className="lesson-runner-progress-track">
                    <div
                        className="lesson-runner-progress-bar"
                        style={{ width: `${progressPercent}%` }}
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>

                <div className="lesson-runner-header-right">
                    {isPracticeMode ? (
                        <span className="lesson-runner-practice-tag">
                            <Sparkles size={13} />
                            <span>PRACTICE</span>
                        </span>
                    ) : lesson.isMasteryLevel ? (
                        <span className="lesson-runner-mastery-tag">
                            <Sparkles size={13} />
                            <span>UNIT MASTERY</span>
                        </span>
                    ) : null}
                    <div
                        className="lesson-runner-hearts"
                        title={isPracticeMode ? "Practice Mode: Hearts are protected (no hearts lost)" : "Hearts Remaining"}
                    >
                        <img src={heartIcon} alt="Hearts" className="lesson-runner-heart-icon" />
                        <span className="lesson-runner-heart-count">{hearts}</span>
                    </div>
                </div>
            </header>

            {/* Temporary Developer Testing Override Panel (Dev Mode Only) */}
            {import.meta.env.DEV && (
                <aside className="dev-controls-panel duo-card" aria-label="Developer Testing Controls">
                    <div className="dev-controls-header">
                        <Wrench size={14} className="dev-controls-icon" />
                        <span className="dev-controls-title">Developer Controls</span>
                    </div>
                    <div className="dev-controls-actions">
                        <button
                            type="button"
                            onClick={() => handleDeveloperOverride("correct")}
                            disabled={isSubmitted}
                            className="duo-button dev-override-btn dev-btn-correct"
                            title="Force current question to evaluate as Correct"
                        >
                            <Check size={14} />
                            <span>ANSWER CORRECTLY</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDeveloperOverride("incorrect")}
                            disabled={isSubmitted}
                            className="duo-button dev-override-btn dev-btn-incorrect"
                            title="Force current question to evaluate as Incorrect"
                        >
                            <X size={14} />
                            <span>ANSWER INCORRECTLY</span>
                        </button>
                        <Link
                            to="/completion-preview"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="duo-button dev-override-btn dev-btn-preview"
                            title="Open Level Completion UI Preview concepts in a new tab"
                        >
                            <Sparkles size={14} />
                            <span>COMPLETION CONCEPTS</span>
                        </Link>
                    </div>
                </aside>
            )}

            <main className="lesson-runner-content">
                <QuestionRenderer
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelect={setSelectedAnswer}
                    onSubmit={handleCheckAnswer}
                    isSubmitted={isSubmitted}
                    isPracticeMode={isPracticeMode}
                />
            </main>

            {!currentEvaluation && (
                <footer className="lesson-runner-footer">
                    <div className="lesson-runner-footer-inner">
                        <button
                            type="button"
                            disabled={!selectedAnswer}
                            onClick={handleCheckAnswer}
                            className="duo-button duo-button-primary lesson-check-btn"
                        >
                            CHECK
                        </button>
                    </div>
                </footer>
            )}

            {currentEvaluation && (
                <FeedbackDrawer
                    evaluation={currentEvaluation}
                    question={currentQuestion}
                    onContinue={handleContinue}
                />
            )}

            <OutOfHeartsModal
                isOpen={showOutOfHeartsModal}
                onClose={() => {
                    setShowOutOfHeartsModal(false);
                    navigate(isPracticeMode ? "/practice" : "/learn");
                }}
            />
        </div>
    );
}

export default LessonSession;
