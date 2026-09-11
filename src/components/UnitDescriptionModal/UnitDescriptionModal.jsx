import { useEffect } from "react";
import { X, BookOpen, Award, CheckCircle2, Layers } from "lucide-react";
import "./UnitDescriptionModal.css";

function UnitDescriptionModal({ isOpen, onClose, unit }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !unit) return null;

    const normalLevels = unit.normalLevels || (unit.levels || []).filter((l) => l.type === "level");
    const masteryLevel = unit.masteryLevel || (unit.levels || []).find((l) => l.type === "unit_mastery");
    const totalXP = (unit.levels || []).reduce((sum, l) => sum + (l.xp || 15), 0);
    const pairsCount = (unit.lasaPairs || []).length;

    // Extract section number from sectionId if possible
    const sectionNumMatch = (unit.sectionId || "").match(/\d+/);
    const sectionNum = sectionNumMatch ? sectionNumMatch[0] : "1";
    const unitNum = unit.unitNumber || unit.unit_number || "1";

    return (
        <div
            className="unit-modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="unit-modal-title"
        >
            <div className="unit-modal-card" onClick={(e) => e.stopPropagation()}>
                <header className="unit-modal-header">
                    <div className="unit-modal-header-text">
                        <div className="unit-modal-badge">
                            SECTION {sectionNum} &bull; UNIT {unitNum}
                        </div>
                        <h2 id="unit-modal-title" className="unit-modal-title">
                            {unit.description || unit.title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="unit-modal-close-btn"
                        onClick={onClose}
                        aria-label="Close Unit Overview"
                    >
                        <X size={22} />
                    </button>
                </header>

                <div className="unit-modal-body">
                    {/* Educational Scope */}
                    <div className="unit-modal-section">
                        <h3 className="unit-modal-section-heading">
                            <BookOpen size={18} className="unit-modal-icon" />
                            Educational Scope
                        </h3>
                        <p className="unit-modal-description">
                            {unit.subtitle || unit.description}
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="unit-modal-stats-row">
                        <div className="unit-modal-stat-item">
                            <Layers size={18} className="unit-stat-icon" />
                            <div>
                                <span className="unit-stat-val">{(unit.levels || []).length}</span>
                                <span className="unit-stat-lbl">Levels</span>
                            </div>
                        </div>
                        <div className="unit-modal-stat-item">
                            <Award size={18} className="unit-stat-icon" />
                            <div>
                                <span className="unit-stat-val">+{totalXP} XP</span>
                                <span className="unit-stat-lbl">Available</span>
                            </div>
                        </div>
                        <div className="unit-modal-stat-item">
                            <CheckCircle2 size={18} className="unit-stat-icon" />
                            <div>
                                <span className="unit-stat-val">{pairsCount}</span>
                                <span className="unit-stat-lbl">LASA Pairs</span>
                            </div>
                        </div>
                    </div>

                    {/* Target LASA Pairs */}
                    {unit.lasaPairs && unit.lasaPairs.length > 0 && (
                        <div className="unit-modal-section">
                            <h3 className="unit-modal-section-heading">
                                Target ISMP LASA Pairs
                            </h3>
                            <div className="unit-modal-pairs-list">
                                {unit.lasaPairs.map((pair) => (
                                    <div key={pair.id} className="unit-modal-pair-chip">
                                        <div className="unit-pair-names">
                                            <span className="pair-primary">{pair.primary}</span>
                                            <span className="pair-vs">vs</span>
                                            <span className="pair-counterpart">{pair.counterpart}</span>
                                        </div>
                                        {pair.feature && (
                                            <span className="pair-feature-hint">{pair.feature}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Curriculum Levels Outline */}
                    <div className="unit-modal-section">
                        <h3 className="unit-modal-section-heading">
                            Curriculum Breakdown
                        </h3>
                        <div className="unit-modal-levels-list">
                            {normalLevels.map((lvl, idx) => (
                                <div key={lvl.id} className="unit-modal-level-row">
                                    <span className="unit-modal-lvl-number">Level {idx + 1}</span>
                                    <div className="unit-modal-lvl-details">
                                        <span className="unit-modal-lvl-title">{lvl.title}</span>
                                        {lvl.learningObjective && (
                                            <span className="unit-modal-lvl-obj">{lvl.learningObjective}</span>
                                        )}
                                    </div>
                                    <span className="unit-modal-lvl-xp">+{lvl.xp || 15} XP</span>
                                </div>
                            ))}
                            {masteryLevel && (
                                <div className="unit-modal-level-row unit-modal-mastery-row">
                                    <span className="unit-modal-lvl-number mastery-tag">Mastery</span>
                                    <div className="unit-modal-lvl-details">
                                        <span className="unit-modal-lvl-title">{masteryLevel.title}</span>
                                        <span className="unit-modal-lvl-obj">Unassisted rapid LASA identification challenge</span>
                                    </div>
                                    <span className="unit-modal-lvl-xp">+{masteryLevel.xp || 25} XP</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="unit-modal-footer">
                    <button
                        type="button"
                        className="unit-modal-btn-primary"
                        onClick={onClose}
                    >
                        Close Overview
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default UnitDescriptionModal;
