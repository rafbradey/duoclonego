import { Link } from "react-router";
import { Award, Target, CheckCircle, XCircle, Sparkles, BookOpen } from "lucide-react";
import Mascot from "../Mascot/Mascot.jsx";
import { calculateLessonXP } from "../../services/lessonEngine.js";
import "./LessonCompletion.css";

function LessonCompletion({ session, lesson }) {
    if (!session || !lesson) return null;

    const totalQuestions = session.totalQuestions || 1;
    const correctCount = session.correctCount || 0;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const xpEarned = calculateLessonXP(lesson, correctCount, totalQuestions);

    const mascotType = accuracy >= 80 ? "maracas" : "default";
    const mascotAnimation = accuracy >= 80 ? "dance" : "bounce";

    return (
        <div className="completion-root">
            <div className="completion-card duo-card">
                <div className="completion-mascot-wrapper">
                    <Mascot mascotType={mascotType} size={150} animationType={mascotAnimation} />
                </div>

                <div className="completion-badge">
                    <Sparkles size={16} />
                    <span>LESSON COMPLETE</span>
                </div>

                <h1 className="heading-xl completion-title">
                    {accuracy === 100 ? "Perfect Score!" : "Great Practice!"}
                </h1>

                <p className="body-text-muted completion-subtitle">
                    You practiced critical LASA medication recognition in <strong>{lesson.title}</strong>.
                </p>

                <div className="completion-stats-grid">
                    <div className="completion-stat-card">
                        <div className="completion-stat-icon-block xp-accent">
                            <Award size={26} />
                        </div>
                        <div className="completion-stat-text">
                            <span className="completion-stat-num">+{xpEarned} XP</span>
                            <span className="completion-stat-label">Total XP</span>
                        </div>
                    </div>

                    <div className="completion-stat-card">
                        <div className="completion-stat-icon-block target-accent">
                            <Target size={26} />
                        </div>
                        <div className="completion-stat-text">
                            <span className="completion-stat-num">{accuracy}%</span>
                            <span className="completion-stat-label">Accuracy</span>
                        </div>
                    </div>
                </div>

                <div className="completion-review-section">
                    <h3 className="completion-review-heading">Session Breakdown</h3>
                    <div className="completion-answers-list">
                        {session.answers.map((ans, idx) => (
                            <div key={idx} className="completion-answer-row">
                                <div className="completion-ans-icon">
                                    {ans.isCorrect ? (
                                        <CheckCircle size={20} className="check-success" />
                                    ) : (
                                        <XCircle size={20} className="cross-danger" />
                                    )}
                                </div>
                                <span className="completion-ans-prompt">{ans.prompt}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="completion-actions">
                    <Link to="/learn" className="duo-button duo-button-primary completion-btn">
                        <BookOpen size={18} />
                        <span>CONTINUE TO DASHBOARD</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LessonCompletion;
