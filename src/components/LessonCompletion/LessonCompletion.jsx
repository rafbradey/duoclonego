import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
    Award,
    Target,
    CheckCircle,
    XCircle,
    Sparkles,
    BookOpen,
    Dumbbell,
    Trophy,
    ArrowRight,
    Check,
    X
} from "lucide-react";
import Mascot from "../Mascot/Mascot.jsx";
import { calculateLessonXP } from "../../services/lessonEngine.js";
import { getCurrentUser, updateUserProgress } from "../../services/userService.js";
import { getNewlyUnlockedBadges } from "../../services/badgeService.js";
import { getNextLevel } from "../../services/lessonService.js";
import { allLevels } from "../../data/levels/index.js";
import "./LessonCompletion.css";

// In-memory lookup map for all curriculum questions to reliably resolve subjects
const questionsById = new Map();
allLevels.forEach((lvl) => {
    (lvl.questions || []).forEach((q) => {
        if (q?.id) questionsById.set(q.id, q);
    });
});

/**
 * Extracts the primary medication subject and question category label.
 * Strictly avoids repetitive sentence prompts like "Which medication is commonly confused with...".
 */
function resolveQuestionMeta(ans) {
    const refQ = ans?.questionId ? questionsById.get(ans.questionId) : null;
    const qType = ans?.questionType || refQ?.type || "multiple_choice";
    const subtype = ans?.subtype || refQ?.subtype || (refQ?.isTallManChoice ? "tall_man_mcq" : "");

    let subject = ans?.subject || refQ?.relatedDrug || refQ?.tallManName || refQ?.standardName || "";

    if (!subject && ans?.prompt) {
        const prompt = ans.prompt;
        const confusedMatch = prompt.match(/confused with\s+([A-Za-z0-9-]+)/i);
        if (confusedMatch) {
            subject = confusedMatch[1];
        } else {
            const tallManMatch = prompt.match(/lettering for\s+([A-Za-z0-9-]+)/i);
            if (tallManMatch) {
                subject = tallManMatch[1];
            } else {
                const counterpartMatch = prompt.match(/counterpart of\s+([A-Za-z0-9-]+)/i);
                if (counterpartMatch) {
                    subject = counterpartMatch[1];
                }
            }
        }
    }

    let category = "LASA Pair";
    if (subtype === "tall_man_mcq" || qType === "tall_man" || refQ?.isTallManChoice) {
        if (qType === "tall_man") {
            category = refQ?.scaffold ? "Tall Man Fill-in" : "Tall Man Mastery";
        } else {
            category = "Tall Man Lettering";
        }
    } else if (qType === "matching") {
        category = "Tap-to-Match";
        if (!subject) subject = "LASA Medication Pairs";
    } else if (qType === "sound_alike") {
        category = subtype === "read_back" ? "Oral Read-Back" : "Sound-Alike Audio";
    }

    return {
        subject: subject || "Medication Review",
        category,
        qType
    };
}

function LessonCompletion({ session, lesson }) {
    const hasAwarded = useRef(false);
    const [user, setUser] = useState(null);
    const [newBadges, setNewBadges] = useState([]);

    const isPractice = Boolean(lesson?.isPractice);
    const isMastery = Boolean(lesson?.type === "unit_mastery" || lesson?.isMasteryLevel);
    const totalQuestions = session?.totalQuestions || session?.answers?.length || 1;
    const correctCount = session?.correctCount || 0;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const xpEarned = lesson ? calculateLessonXP(lesson, correctCount, totalQuestions) : 0;

    useEffect(() => {
        let isMounted = true;
        getCurrentUser().then((u) => {
            if (isMounted && u) setUser(u);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!hasAwarded.current && session && lesson) {
            hasAwarded.current = true;
            async function awardProgress() {
                try {
                    const prevUser = await getCurrentUser();
                    const updatedUser = await updateUserProgress({
                        xpToAdd: xpEarned,
                        completedLessonId: isPractice ? null : lesson.id,
                        practiceSessionCompleted: isPractice
                    });
                    if (updatedUser) {
                        setUser(updatedUser);
                    }
                    if (prevUser && updatedUser) {
                        const unlocked = getNewlyUnlockedBadges(prevUser, updatedUser);
                        if (unlocked.length > 0) {
                            setNewBadges(unlocked);
                        }
                    }
                } catch (err) {
                    console.error("Failed to update user progress on completion:", err);
                }
            }
            awardProgress();
        }
    }, [session, lesson, xpEarned, isPractice]);

    // Determine next level in the curriculum hierarchy
    const nextLevelInfo = (!isPractice && lesson?.id) ? getNextLevel(lesson.id, user) : null;

    if (!session || !lesson) return null;

    const mascotType = accuracy >= 80 ? "maracas" : "default";
    const mascotAnimation = accuracy >= 80 ? "dance" : "bounce";

    return (
        <div className="completion-root">
            <div className="completion-card duo-card">
                <div className="completion-mascot-wrapper">
                    <Mascot mascotType={mascotType} size={150} animationType={mascotAnimation} />
                </div>

                <div className={`completion-badge ${isMastery ? "completion-badge-mastery" : ""}`}>
                    <Sparkles size={16} />
                    <span>{isPractice ? "PRACTICE COMPLETE" : isMastery ? "🏆 UNIT MASTERED!" : "LESSON COMPLETE"}</span>
                </div>

                <h1 className="heading-xl completion-title">
                    {isMastery
                        ? (accuracy === 100 ? "Unit Mastered!" : "Mastery Challenge Complete!")
                        : (accuracy === 100 ? "Perfect Recall!" : "Great Practice!")}
                </h1>

                <p className="body-text-muted completion-subtitle">
                    {isPractice
                        ? `You completed a targeted retrieval review in ${lesson.title}.`
                        : isMastery
                            ? `Outstanding! You conquered the unassisted review and Tall Man capstone for ${lesson.title}.`
                            : `You practiced critical LASA medication recognition in ${lesson.title}.`}
                </p>

                <div className="completion-stats-grid">
                    <div className="completion-stat-card">
                        <div className="completion-stat-icon-block xp-accent">
                            <Award size={26} />
                        </div>
                        <div className="completion-stat-text">
                            <span className="completion-stat-num">+{xpEarned} XP</span>
                            <span className="completion-stat-label">XP Earned</span>
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

                {/* UNLOCKED BADGES CELEBRATION */}
                {newBadges.length > 0 && (
                    <div className="completion-unlocked-card">
                        <div className="completion-unlocked-header">
                            <Trophy size={20} className="completion-trophy-gold" />
                            <span className="completion-unlocked-title">New Badge Unlocked!</span>
                        </div>
                        <div className="completion-unlocked-items">
                            {newBadges.map((badge) => (
                                <div key={badge.id} className="completion-unlocked-badge-pill">
                                    <span className="unlocked-badge-name">{badge.title}</span>
                                    <span className="unlocked-badge-desc">{badge.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* OVERHAULED SESSION BREAKDOWN */}
                <div className="completion-breakdown-section" aria-label="Session Breakdown">
                    <div className="breakdown-header-block">
                        <h2 className="completion-breakdown-heading">Session Breakdown</h2>
                        <p className="breakdown-subtitle">Review your answers</p>
                    </div>

                    <div className="completion-stat-card breakdown-stat-card">
                        <div className="completion-stat-icon-block correct-accent">
                            <CheckCircle size={26} />
                        </div>
                        <div className="completion-stat-text">
                            <span className="completion-stat-num">{correctCount} / {totalQuestions}</span>
                            <span className="completion-stat-label">Correct</span>
                        </div>
                    </div>

                    <div className="breakdown-cards-list">
                        {session.answers.map((ans, idx) => {
                            const { subject, category, qType } = resolveQuestionMeta(ans);
                            const isCorrect = Boolean(ans.isCorrect);

                            // Format displayed answers for matching vs single selections
                            let selectedDisplay = ans.selectedAnswer;
                            let correctDisplay = ans.correctAnswer;

                            if (qType === "matching") {
                                selectedDisplay = isCorrect ? "All pairs matched correctly" : "Incomplete or mismatched pairs";
                                correctDisplay = ans.correctAnswer || "Documented ISMP LASA pairs";
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`breakdown-card ${isCorrect ? "breakdown-card-correct" : "breakdown-card-incorrect"}`}
                                >
                                    <div className="breakdown-card-header">
                                        <div className="breakdown-card-title-block">
                                            <span className="breakdown-subject">{subject}</span>
                                            <span className="breakdown-category-badge">{category}</span>
                                        </div>
                                        <div className="breakdown-status-badge">
                                            {isCorrect ? (
                                                <span className="status-pill status-correct">
                                                    <CheckCircle size={15} />
                                                    <span>CORRECT</span>
                                                </span>
                                            ) : (
                                                <span className="status-pill status-incorrect">
                                                    <XCircle size={15} />
                                                    <span>INCORRECT</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="breakdown-answers-grid">
                                        {/* Learner's Selected Answer */}
                                        <div className={`breakdown-answer-row ${isCorrect ? "row-correct" : "row-incorrect"}`}>
                                            <span className="breakdown-row-label">Your answer:</span>
                                            <div className="breakdown-row-val-wrap">
                                                <span className={`breakdown-val ${!isCorrect ? "val-missed" : ""}`}>
                                                    {selectedDisplay}
                                                </span>
                                                {isCorrect ? (
                                                    <Check size={16} className="icon-mark-correct" />
                                                ) : (
                                                    <X size={16} className="icon-mark-incorrect" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Verified Correct Answer (shown when incorrect to guide remediation) */}
                                        {!isCorrect && (
                                            <div className="breakdown-answer-row row-solution">
                                                <span className="breakdown-row-label">Correct answer:</span>
                                                <div className="breakdown-row-val-wrap">
                                                    <span className="breakdown-val val-solution">
                                                        {correctDisplay}
                                                    </span>
                                                    <Check size={16} className="icon-mark-correct" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* PROGRESSION ACTIONS */}
                <div className="completion-actions-container">
                    {isPractice ? (
                        <Link to="/practice" className="duo-button duo-button-primary completion-btn">
                            <Dumbbell size={18} />
                            <span>RETURN TO PRACTICE HUB</span>
                        </Link>
                    ) : nextLevelInfo && nextLevelInfo.isUnlocked ? (
                        <div className="completion-actions-hierarchy">
                            <Link
                                to={nextLevelInfo.route}
                                className="duo-button duo-button-primary completion-btn completion-btn-next"
                            >
                                <span>CONTINUE TO NEXT LEVEL</span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/learn"
                                className="duo-button duo-button-outline completion-btn completion-btn-secondary"
                            >
                                <BookOpen size={18} />
                                <span>CONTINUE TO DASHBOARD</span>
                            </Link>
                        </div>
                    ) : (
                        <Link to="/learn" className="duo-button duo-button-primary completion-btn">
                            <BookOpen size={18} />
                            <span>CONTINUE TO DASHBOARD</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LessonCompletion;

