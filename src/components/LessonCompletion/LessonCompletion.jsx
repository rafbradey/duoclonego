import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
    Award,
    Target,
    Sparkles,
    Trophy,
    ArrowRight,
    Check,
    X,
    ChevronRight,
    Layers,
    Dumbbell
} from "lucide-react";
import Mascot from "../Mascot/Mascot.jsx";
import { calculateLessonXP } from "../../services/lessonEngine.js";
import { getCurrentUser, updateUserProgress, restoreHeart } from "../../services/userService.js";
import { getNewlyUnlockedBadges } from "../../services/badgeService.js";
import { getNextLevel } from "../../services/lessonService.js";
import { allLevels } from "../../data/levels/index.js";
import diamondIcon from "../../assets/items/diamond.png";
import heartIcon from "../../assets/items/heart.png";
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
 * Avoids repetitive sentence prompts like "Which medication is commonly confused with...".
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
        qType,
        explanation: ans?.explanation || refQ?.explanation || ""
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
    const gemsEarned = isPractice ? 5 : isMastery ? 25 : 15;

    const [heartRestored, setHeartRestored] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItem = (idx) => {
        setExpandedItems((prev) => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const toggleAll = () => {
        const answers = session?.answers || [];
        const allOpen = answers.length > 0 && answers.every((_, i) => expandedItems[i]);
        if (allOpen) {
            setExpandedItems({});
        } else {
            const nextState = {};
            answers.forEach((_, i) => {
                nextState[i] = true;
            });
            setExpandedItems(nextState);
        }
    };

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
                        diamondsToAdd: gemsEarned,
                        completedLessonId: isPractice ? null : lesson.id,
                        practiceSessionCompleted: isPractice
                    });
                    if (updatedUser) {
                        setUser(updatedUser);
                    }
                    if (isPractice && prevUser && typeof prevUser.hearts === "number" && prevUser.hearts < 5) {
                        const newHearts = await restoreHeart(1);
                        setHeartRestored(true);
                        setUser((prev) => (prev ? { ...prev, hearts: newHearts } : prev));
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
    }, [session, lesson, xpEarned, gemsEarned, isPractice]);

    // Determine next level in the curriculum hierarchy
    const nextLevelInfo = (!isPractice && lesson?.id) ? getNextLevel(lesson.id, user) : null;

    if (!session || !lesson) return null;

    const mascotType = accuracy >= 80 ? "maracas" : "default";
    const mascotAnimation = accuracy >= 80 ? "dance" : "bounce";

    return (
        <div className="completion-root">
            <div className="completion-card duo-card">
                {/* 1. Ambient Celebratory Mascot Hero (Option A+ Minimalist Hybrid) */}
                <div className="completion-hero">
                    <div className="completion-mascot-glow">
                        <Mascot mascotType={mascotType} size={135} animationType={mascotAnimation} />
                    </div>

                    <div className="completion-header-text">
                        <div className="completion-badge-tag">
                            <Sparkles size={14} />
                            <span>
                                {isPractice
                                    ? "PRACTICE COMPLETED"
                                    : isMastery
                                    ? "🏆 UNIT MASTERED"
                                    : "LEVEL COMPLETED"}
                            </span>
                        </div>
                        <h1 className="completion-title">
                            {isMastery
                                ? (accuracy === 100 ? "Mastery Challenge Conquered!" : "Unit Mastered!")
                                : (accuracy === 100 ? "100% Perfect Retention!" : "Great Session!")}
                        </h1>
                        <p className="completion-subtitle">
                            {isPractice
                                ? `You completed retrieval review for ${lesson.title}`
                                : `You completed retrieval training for `}
                            {!isPractice && <strong>{lesson.title}</strong>}
                        </p>
                    </div>
                </div>

                {/* 2. Unified Rich Stat Ribbon (Option A+ Seamless Bar with Dividers) */}
                <div className="completion-stats-ribbon">
                    <div className="stat-item xp-accent">
                        <div className="stat-bubble">
                            <Award size={18} />
                        </div>
                        <div className="stat-meta">
                            <span className="stat-val">+{xpEarned} XP</span>
                            <span className="stat-lbl">Earned</span>
                        </div>
                    </div>

                    <div className="stat-divider" />

                    <div className="stat-item gem-accent">
                        <div className="stat-bubble">
                            <img src={diamondIcon} alt="Gems" className="stat-gem-img-tiny" />
                        </div>
                        <div className="stat-meta">
                            <span className="stat-val">+{gemsEarned}</span>
                            <span className="stat-lbl">Gems</span>
                        </div>
                    </div>

                    <div className="stat-divider" />

                    <div className="stat-item target-accent">
                        <div className="stat-bubble">
                            <Target size={18} />
                        </div>
                        <div className="stat-meta">
                            <span className="stat-val">{accuracy}%</span>
                            <span className="stat-lbl">Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Heart restored notice if practice session restored heart */}
                {heartRestored && (
                    <div className="completion-heart-restore-pill">
                        <img src={heartIcon} alt="Heart" className="restore-heart-icon" />
                        <span>+1 Heart Restored via Practice!</span>
                    </div>
                )}

                {/* Unlocked Badges celebration */}
                {newBadges.length > 0 && (
                    <div className="completion-unlocked-banner">
                        <Trophy size={20} className="trophy-gold" />
                        <div className="unlocked-text">
                            <strong>{newBadges[0].title}</strong>
                            <span>{newBadges[0].description}</span>
                        </div>
                    </div>
                )}

                {/* 3. Primary & Secondary Actions (Duolingo 3D Button + Clean Text Link) */}
                <div className="completion-actions">
                    {isPractice ? (
                        <>
                            <Link to="/practice" className="duo-button duo-button-primary completion-btn-large">
                                <Dumbbell size={18} />
                                <span>RETURN TO PRACTICE HUB</span>
                            </Link>
                            <Link to="/learn" className="completion-text-link">
                                Return to Dashboard
                            </Link>
                        </>
                    ) : nextLevelInfo && nextLevelInfo.isUnlocked ? (
                        <>
                            <Link to={nextLevelInfo.route} className="duo-button duo-button-primary completion-btn-large">
                                <span>CONTINUE TO NEXT LEVEL</span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/learn" className="completion-text-link">
                                Return to Dashboard
                            </Link>
                        </>
                    ) : (
                        <Link to="/learn" className="duo-button duo-button-primary completion-btn-large">
                            <span>CONTINUE TO DASHBOARD</span>
                            <ArrowRight size={18} />
                        </Link>
                    )}
                </div>

                {/* 4. Interactive Review Drawer with Toggle Details Button */}
                <div className="completion-review-pane">
                    <div className="review-section-header">
                        <div className="review-header-title-block">
                            <span className="review-title">Session Breakdown</span>
                            <span className="review-count-tag">{correctCount} / {totalQuestions} Correct</span>
                        </div>
                        <button
                            type="button"
                            className="review-expand-all-btn"
                            onClick={toggleAll}
                            title="Toggle all question details"
                        >
                            <Layers size={13} />
                            <span>Toggle Details</span>
                        </button>
                    </div>

                    <div className="review-accordion-list" role="list">
                        {session.answers.map((ans, idx) => {
                            const { subject, category, qType, explanation } = resolveQuestionMeta(ans);
                            const isCorrect = Boolean(ans.isCorrect);
                            const isExpanded = Boolean(expandedItems[idx]);

                            let selectedDisplay = ans.selectedAnswer;
                            let correctDisplay = ans.correctAnswer;

                            if (qType === "matching") {
                                selectedDisplay = isCorrect ? "All pairs matched correctly" : "Incomplete or mismatched pairs";
                                correctDisplay = ans.correctAnswer || "Documented ISMP LASA pairs";
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`accordion-item-wrap ${isCorrect ? "item-correct" : "item-incorrect"}`}
                                    role="listitem"
                                >
                                    <button
                                        type="button"
                                        className="accordion-trigger-row"
                                        onClick={() => toggleItem(idx)}
                                        aria-expanded={isExpanded}
                                        aria-controls={`breakdown-content-${idx}`}
                                    >
                                        <div className="accordion-left-meta">
                                            <ChevronRight
                                                size={16}
                                                className={`accordion-chevron-icon ${isExpanded ? "open" : ""}`}
                                            />
                                            <span className="accordion-subject-text">{subject}</span>
                                            <span className="accordion-category-badge">{category}</span>
                                        </div>
                                        <div className="accordion-right-meta">
                                            <span className={`status-pill ${isCorrect ? "status-correct" : "status-incorrect"}`}>
                                                {isCorrect ? (
                                                    <>
                                                        <Check size={12} strokeWidth={3} />
                                                        <span>CORRECT</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X size={12} strokeWidth={3} />
                                                        <span>INCORRECT</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div
                                            id={`breakdown-content-${idx}`}
                                            className="accordion-detail-drawer"
                                        >
                                            <div className="detail-answer-box">
                                                <div className={`detail-line ${isCorrect ? "line-correct" : "line-incorrect"}`}>
                                                    <span className="detail-lbl">Your answer:</span>
                                                    <div className="detail-val-group">
                                                        <span className={`detail-val ${!isCorrect ? "val-struck" : ""}`}>{selectedDisplay}</span>
                                                        {isCorrect ? (
                                                            <Check size={14} className="icon-check-green" />
                                                        ) : (
                                                            <X size={14} className="icon-cross-red" />
                                                        )}
                                                    </div>
                                                </div>

                                                {!isCorrect && (
                                                    <div className="detail-line line-solution">
                                                        <span className="detail-lbl">Correct answer:</span>
                                                        <div className="detail-val-group">
                                                            <span className="detail-val val-highlight">{correctDisplay}</span>
                                                            <Check size={14} className="icon-check-green" />
                                                        </div>
                                                    </div>
                                                )}

                                                {explanation && (
                                                    <div className="detail-explanation-card">
                                                        <span className="explanation-badge">Clinical Rationale:</span>
                                                        <p className="explanation-body">{explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LessonCompletion;
