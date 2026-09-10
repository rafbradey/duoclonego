import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router";
import { X, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { getLessonById } from "../../services/lessonService.js";
import { createSession, recordSessionAnswer } from "../../services/lessonEngine.js";
import { getCurrentUser } from "../../services/userService.js";
import { generatePracticeSession, recordPracticeOutcome } from "../../services/practiceService.js";
import QuestionRenderer from "../../components/QuestionCard/QuestionRenderer.jsx";
import FeedbackDrawer from "../../components/FeedbackDrawer/FeedbackDrawer.jsx";
import LessonCompletion from "../../components/LessonCompletion/LessonCompletion.jsx";
import heartIcon from "../../assets/items/heart.png";
import "./LessonSession.css";

function LessonSession() {
    const { lessonId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [session, setSession] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hearts, setHearts] = useState(5);
    const [loading, setLoading] = useState(true);

    const isPracticeMode = lessonId === "practice" || Boolean(lesson?.isPractice);

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            setLoading(true);
            try {
                if (lessonId === "practice") {
                    const practiceMode = searchParams.get("mode") || "quick";
                    const [practiceData, userData] = await Promise.all([
                        generatePracticeSession({ mode: practiceMode }),
                        getCurrentUser()
                    ]);
                    if (isMounted) {
                        if (practiceData) {
                            setLesson(practiceData);
                            setSession(createSession(practiceData));
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
                            setLesson(lessonData);
                            setSession(createSession(lessonData));
                        }
                        if (userData && userData.hearts !== undefined) {
                            setHearts(userData.hearts);
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
    }, [lessonId, searchParams]);

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
        const { nextSession, evaluation } = recordSessionAnswer(
            session,
            currentQuestion,
            selectedAnswer
        );

        if (isPracticeMode && currentQuestion?.id) {
            recordPracticeOutcome(currentQuestion.id, evaluation.isCorrect).catch((err) => {
                console.error("Failed to record practice outcome:", err);
            });
        }

        setSession(nextSession);
        setCurrentEvaluation(evaluation);
        setIsSubmitted(true);
    };

    const handleContinue = () => {
        if (!session) return;

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
                    <h1 className="heading-md">Lesson Not Found</h1>
                    <p className="body-text-muted">
                        We couldn&apos;t find {isPracticeMode ? "practice questions" : `lesson "${lessonId}"`} in the learning curriculum.
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
    const progressPercent = session.totalQuestions > 0
        ? Math.round(((session.currentIndex + (isSubmitted ? 1 : 0)) / session.totalQuestions) * 100)
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
                    {isPracticeMode && (
                        <span className="lesson-runner-practice-tag">
                            <Sparkles size={13} />
                            <span>PRACTICE</span>
                        </span>
                    )}
                    <div
                        className="lesson-runner-hearts"
                        title={isPracticeMode ? "Practice Mode: Hearts are protected (no hearts lost)" : "Hearts Remaining"}
                    >
                        <img src={heartIcon} alt="Hearts" className="lesson-runner-heart-icon" />
                        <span className="lesson-runner-heart-count">{hearts}</span>
                    </div>
                </div>
            </header>

            <main className="lesson-runner-content">
                <QuestionRenderer
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelect={setSelectedAnswer}
                    isSubmitted={isSubmitted}
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
                    onContinue={handleContinue}
                />
            )}
        </div>
    );
}

export default LessonSession;
