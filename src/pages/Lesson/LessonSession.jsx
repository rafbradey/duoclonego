import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { X, BookOpen, AlertCircle } from "lucide-react";
import { getLessonById } from "../../services/lessonService.js";
import { createSession, recordSessionAnswer } from "../../services/lessonEngine.js";
import MultipleChoiceQuestion from "../../components/QuestionCard/MultipleChoiceQuestion.jsx";
import FeedbackDrawer from "../../components/FeedbackDrawer/FeedbackDrawer.jsx";
import LessonCompletion from "../../components/LessonCompletion/LessonCompletion.jsx";
import "./LessonSession.css";

function LessonSession() {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [session, setSession] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function loadLesson() {
            setLoading(true);
            try {
                const data = await getLessonById(lessonId);
                if (isMounted) {
                    if (data) {
                        setLesson(data);
                        setSession(createSession(data));
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load lesson:", err);
                if (isMounted) setLoading(false);
            }
        }
        loadLesson();
        return () => { isMounted = false; };
    }, [lessonId]);

    const handleExit = () => {
        if (!session?.isCompleted && session?.currentIndex > 0) {
            const confirmExit = window.confirm(
                "Are you sure you want to quit? Your current session progress will not be saved."
            );
            if (!confirmExit) return;
        }
        navigate("/learn");
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer || isSubmitted || !lesson || !session) return;

        const currentQuestion = lesson.questions[session.currentIndex];
        const { nextSession, evaluation } = recordSessionAnswer(
            session,
            currentQuestion,
            selectedAnswer
        );

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
                        We couldn&apos;t find lesson &quot;{lessonId}&quot; in the learning curriculum.
                    </p>
                    <Link to="/learn" className="duo-button duo-button-primary">
                        <BookOpen size={18} />
                        <span>RETURN TO LEARN</span>
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

                <span className="lesson-runner-counter">
                    {session.currentIndex + 1} / {session.totalQuestions}
                </span>
            </header>

            <main className="lesson-runner-content">
                <MultipleChoiceQuestion
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
