import { useParams, Link } from "react-router";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import "./LessonSession.css";

function LessonSession() {
    const { lessonId } = useParams();

    return (
        <div className="lesson-session-root">
            <header className="lesson-session-header">
                <Link to="/learn" className="lesson-back-btn" aria-label="Exit lesson and return to learn">
                    <ArrowLeft size={24} />
                    <span>EXIT</span>
                </Link>
                <div className="lesson-session-progress-bar">
                    <div className="lesson-session-progress-fill" style={{ width: "20%" }} />
                </div>
            </header>

            <main className="lesson-session-main">
                <div className="lesson-placeholder-card duo-card">
                    <div className="lesson-placeholder-mascot">
                        <Mascot mascotType="default" size={140} animationType="bounce" />
                    </div>

                    <div className="lesson-placeholder-badge">
                        <Sparkles size={16} />
                        <span>PHASE 2 FOUNDATION READY</span>
                    </div>

                    <h1 className="heading-lg">Lesson: {lessonId}</h1>
                    <p className="body-text-muted">
                        You have successfully reached the lesson session runner. The interactive LASA question engine, multiple-choice evaluator, and feedback drawers will be populated in <strong>Phase 2</strong> according to the master roadmap.
                    </p>

                    <div className="lesson-placeholder-actions">
                        <Link to="/learn" className="duo-button duo-button-primary">
                            <BookOpen size={18} />
                            RETURN TO DASHBOARD
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LessonSession;
