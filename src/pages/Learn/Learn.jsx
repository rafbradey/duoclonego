import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, BookOpen, CheckCircle, Lock, Sparkles } from "lucide-react";
import { getUnits } from "../../services/unitService.js";
import RightInfoBar from "../../components/RightInfoBar/RightInfoBar.jsx";
import GuidebookModal from "../../components/GuidebookModal/GuidebookModal.jsx";
import "./Learn.css";

function Learn() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guidebookState, setGuidebookState] = useState({
        isOpen: false,
        levelId: 1,
        levelTitle: "Level 1"
    });

    useEffect(() => {
        let isMounted = true;
        async function loadUnits() {
            try {
                const data = await getUnits();
                if (isMounted) {
                    setUnits(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load units:", err);
                if (isMounted) setLoading(false);
            }
        }
        loadUnits();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="learn-layout">
            <div className="learn-content-column">
                {loading ? (
                    <div className="learn-loading body-text-muted">Loading learning path...</div>
                ) : (
                    <div className="learn-units-container">
                        {units.map((unit) => (
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
                                        const isUnlocked = level.unlocked;

                                        return (
                                            <div key={level.id} className="lesson-node-wrapper">
                                                {isUnlocked ? (
                                                    <Link
                                                        to={`/lesson/${level.id}`}
                                                        className="lesson-node-btn lesson-node-active"
                                                        aria-label={`Start Level ${level.levelNumber || idx + 1}: ${level.title}`}
                                                        title={level.learningObjective || level.title}
                                                    >
                                                        <div className="lesson-node-icon-wrapper">
                                                            <CheckCircle size={28} />
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
                                                    <div className="lesson-path-connector" />
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