import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, BookOpen, CheckCircle, Lock, Sparkles, Star, Trophy } from "lucide-react";
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

    const isNormalLevelUnlocked = (level, idx, unitIdx, normalLevels) => {
        if (isLevelCompleted(level.id)) return true;
        if (unitIdx === 0 && idx === 0) return true;

        if (idx > 0) {
            return isLevelCompleted(normalLevels[idx - 1]?.id);
        }

        if (idx === 0 && unitIdx > 0) {
            const prevUnit = units[unitIdx - 1];
            const prevMastery = prevUnit?.masteryLevel || (prevUnit?.levels || []).find((l) => l.type === "unit_mastery");
            if (prevMastery && isLevelCompleted(prevMastery.id)) {
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
                        {units.map((unit, unitIdx) => {
                            const normalLevels = unit.normalLevels || (unit.levels || []).filter((l) => l.type === "level");
                            const masteryLevel = unit.masteryLevel || (unit.levels || []).find((l) => l.type === "unit_mastery");

                            const isNormalSequenceDone = normalLevels.length > 0 && normalLevels.every((l) => isLevelCompleted(l.id));
                            const isMasteryCompleted = masteryLevel ? isLevelCompleted(masteryLevel.id) : false;
                            const isMasteryUnlocked = isNormalSequenceDone;
                            const isMasteryActive = isMasteryUnlocked && !isMasteryCompleted;
                            const masteryUnitParam = unit.unitNumber || unit.unit_number || unit.id.replace(/^unit_00?/, "");

                            return (
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
                                        {normalLevels.map((level, idx) => {
                                            const isCompleted = isLevelCompleted(level.id);
                                            const isUnlocked = isNormalLevelUnlocked(level, idx, unitIdx, normalLevels);
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
                                                    <div className={`lesson-path-connector ${isCompleted ? "completed" : ""}`} />
                                                </div>
                                            );
                                        })}

                                        {/* Dedicated Unit Mastery Level (4th Level) */}
                                        {masteryLevel && (
                                            <div className="unit-mastery-wrapper">
                                                <div className="unit-mastery-header-label">
                                                    <Trophy size={14} className="unit-mastery-label-icon" />
                                                    <span>UNIT MASTERY CHALLENGE</span>
                                                </div>

                                                {isMasteryCompleted ? (
                                                    <Link
                                                        to={`/unit/${masteryUnitParam}/mastery`}
                                                        className="unit-mastery-card unit-mastery-completed"
                                                        aria-label={`Review ${masteryLevel.title}`}
                                                    >
                                                        <div className="unit-mastery-icon-box">
                                                            <Trophy size={32} />
                                                        </div>
                                                        <div className="unit-mastery-info">
                                                            <div className="unit-mastery-title-row">
                                                                <span className="unit-mastery-tag">UNIT MASTERY</span>
                                                                <span className="unit-mastery-badge badge-done">&#10003; MASTERED</span>
                                                            </div>
                                                            <h3 className="unit-mastery-name">{masteryLevel.title}</h3>
                                                            <p className="unit-mastery-desc">Unit Mastered &bull; Click to replay capstone challenge</p>
                                                        </div>
                                                    </Link>
                                                ) : isMasteryActive ? (
                                                    <Link
                                                        to={`/unit/${masteryUnitParam}/mastery`}
                                                        className="unit-mastery-card unit-mastery-active"
                                                        aria-label={`Start ${masteryLevel.title}`}
                                                    >
                                                        <div className="unit-mastery-icon-box">
                                                            <Trophy size={32} />
                                                        </div>
                                                        <div className="unit-mastery-info">
                                                            <div className="unit-mastery-title-row">
                                                                <span className="unit-mastery-tag">CAPSTONE CHALLENGE</span>
                                                                <span className="unit-mastery-badge badge-xp">+{masteryLevel.xp} XP</span>
                                                            </div>
                                                            <h3 className="unit-mastery-name">{masteryLevel.title}</h3>
                                                            <p className="unit-mastery-desc">{masteryLevel.description}</p>
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <div
                                                        className="unit-mastery-card unit-mastery-locked"
                                                        aria-label={`${masteryLevel.title} is locked`}
                                                    >
                                                        <div className="unit-mastery-icon-box">
                                                            <Lock size={28} />
                                                        </div>
                                                        <div className="unit-mastery-info">
                                                            <div className="unit-mastery-title-row">
                                                                <span className="unit-mastery-tag">LOCKED CHALLENGE</span>
                                                                <span className="unit-mastery-badge badge-locked">LOCKED</span>
                                                            </div>
                                                            <h3 className="unit-mastery-name">{masteryLevel.title}</h3>
                                                            <p className="unit-mastery-desc">Complete Levels 1, 2, and 3 to unlock Unit Mastery</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
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