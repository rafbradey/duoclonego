import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, BookOpen, CheckCircle, Lock, Sparkles, Star } from "lucide-react";
import { getUnits } from "../../services/unitService.js";
import { getCurrentUser } from "../../services/userService.js";
import RightInfoBar from "../../components/RightInfoBar/RightInfoBar.jsx";
import GuidebookModal from "../../components/GuidebookModal/GuidebookModal.jsx";
import "./Learn.css";

function Learn() {
    const [units, setUnits] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [guidebookState, setGuidebookState] = useState({
        isOpen: false,
        levelId: 1,
        levelTitle: "Level 1"
    });

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            try {
                const [unitsData, userData] = await Promise.all([
                    getUnits(),
                    getCurrentUser()
                ]);
                if (isMounted) {
                    setUnits(unitsData || []);
                    setUser(userData);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load learning data:", err);
                if (isMounted) setLoading(false);
            }
        }
        loadData();

        const handleUserUpdated = (e) => {
            if (e.detail?.user) {
                setUser(e.detail.user);
            }
        };
        window.addEventListener("duoclongo:user-updated", handleUserUpdated);

        return () => {
            isMounted = false;
            window.removeEventListener("duoclongo:user-updated", handleUserUpdated);
        };
    }, []);

    const isLevelCompleted = (levelId) => {
        if (!user || !Array.isArray(user.completed_lessons)) return false;
        const cleanId = String(levelId);
        const legacyId = cleanId.replace(/^level_/, "lesson_");
        const modernId = cleanId.replace(/^lesson_/, "level_");
        return (
            user.completed_lessons.includes(cleanId) ||
            user.completed_lessons.includes(legacyId) ||
            user.completed_lessons.includes(modernId)
        );
    };

    const isLevelUnlocked = (level, idx, unitIdx, arr) => {
        if (isLevelCompleted(level.id)) return true;
        if (unitIdx === 0 && idx === 0) return true;

        if (idx > 0) {
            return isLevelCompleted(arr[idx - 1]?.id);
        }

        if (idx === 0 && unitIdx > 0) {
            const prevUnit = units[unitIdx - 1];
            const prevLevels = prevUnit?.levels || prevUnit?.lessons || [];
            const lastPrevLevel = prevLevels[prevLevels.length - 1];
            if (lastPrevLevel && isLevelCompleted(lastPrevLevel.id)) {
                return true;
            }
        }

        return Boolean(level.unlocked);
    };

    return (
        <div className="learn-layout">
            <div className="learn-content-column">
                {loading ? (
                    <div className="learn-loading body-text-muted">Loading learning path...</div>
                ) : (
                    <div className="learn-units-container">
                        {units.map((unit, unitIdx) => (
                            <section key={unit.id} className="unit-section" aria-labelledby={`unit-${unit.id}-title`}>
                                <div className="unit-banner">
                                    <div className="unit-banner-info">
                                        <div className="unit-header-meta">
                                            <ArrowLeft size={20} className="unit-back-icon" />
                                            <h2 id={`unit-${unit.id}-title`} className="unit-title heading-md">
                                                {unit.title}
                                            </h2>
                                        </div>
                                        <p className="unit-description">{unit.description}</p>
                                    </div>

                                    <button
                                        type="button"
                                        className="unit-guidebook-btn"
                                        onClick={() => setGuidebookState({
                                            isOpen: true,
                                            levelId: unit.unit_number || 1,
                                            levelTitle: unit.title
                                        })}
                                        aria-label="View Guidebook"
                                    >
                                        <BookOpen size={20} />
                                        <span>GUIDEBOOK</span>
                                    </button>
                                </div>

                                <div className="unit-divider">
                                    <Sparkles size={16} className="unit-divider-icon" />
                                    <span>{unit.unit_message}</span>
                                </div>

                                <div className="lesson-tree-container">
                                    {(unit.levels || unit.lessons || []).map((level, idx, arr) => {
                                        const isCompleted = isLevelCompleted(level.id);
                                        const isUnlocked = isLevelUnlocked(level, idx, unitIdx, arr);
                                        const isActive = isUnlocked && !isCompleted;

                                        return (
                                            <div key={level.id} className="lesson-node-wrapper">
                                                {isCompleted ? (
                                                    <Link
                                                        to={`/lesson/${level.id}`}
                                                        className="lesson-node-btn lesson-node-completed"
                                                        aria-label={`Review Level ${level.levelNumber || idx + 1}: ${level.title}`}
                                                        title={`${level.learningObjective || level.title} (Completed - Click to review)`}
                                                    >
                                                        <div className="lesson-node-icon-wrapper">
                                                            <CheckCircle size={30} />
                                                        </div>
                                                        <span className="lesson-node-title">{level.title}</span>
                                                        <span className="lesson-node-xp xp-completed">&#10003; DONE</span>
                                                    </Link>
                                                ) : isActive ? (
                                                    <Link
                                                        to={`/lesson/${level.id}`}
                                                        className="lesson-node-btn lesson-node-active"
                                                        aria-label={`Start Level ${level.levelNumber || idx + 1}: ${level.title}`}
                                                        title={level.learningObjective || level.title}
                                                    >
                                                        <div className="lesson-node-icon-wrapper">
                                                            <Star size={30} fill="currentColor" />
                                                        </div>
                                                        <span className="lesson-node-title">{level.title}</span>
                                                        <span className="lesson-node-xp">+{level.xp} XP</span>
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="lesson-node-btn lesson-node-locked"
                                                        disabled
                                                        aria-label={`Level ${level.levelNumber || idx + 1}: ${level.title} is locked`}
                                                        title={level.learningObjective || level.title}
                                                    >
                                                        <div className="lesson-node-icon-wrapper">
                                                            <Lock size={26} />
                                                        </div>
                                                        <span className="lesson-node-title">{level.title}</span>
                                                    </button>
                                                )}
                                                {idx < arr.length - 1 && (
                                                    <div className={`lesson-path-connector ${isCompleted ? "completed" : ""}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            <div className="learn-rail-column">
                <RightInfoBar />
            </div>

            <GuidebookModal
                isOpen={guidebookState.isOpen}
                onClose={() => setGuidebookState((prev) => ({ ...prev, isOpen: false }))}
                levelId={guidebookState.levelId}
                levelTitle={guidebookState.levelTitle}
            />
        </div>
    );
}

export default Learn;