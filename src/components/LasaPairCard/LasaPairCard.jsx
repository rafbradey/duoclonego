import { useState } from "react";
import TallManText from "../TallManText/TallManText.jsx";
import { AlertCircle, ArrowLeftRight, Volume2 } from "lucide-react";
import { playMedicationAudio } from "../../services/audioService.js";
import "./LasaPairCard.css";

function LasaPairCard({ pair, srsRecord = null, isDue = false, className = "" }) {
    const [speakingDrug, setSpeakingDrug] = useState(null);

    if (!pair) return null;

    const pairNumber = pair.id ? pair.id.replace(/^lasa[-_]0*/i, "") : "";
    const displayLabel = pairNumber ? `Pair #${pairNumber}` : "Medication Pair";

    let srsBadge = null;
    if (srsRecord) {
        if (srsRecord.stage >= 3) {
            srsBadge = <span className="lasa-srs-tag srs-mastered">Mastered</span>;
        } else if (isDue || srsRecord.stage === 0) {
            srsBadge = <span className="lasa-srs-tag srs-due">Due</span>;
        } else if (srsRecord.stage > 0) {
            srsBadge = <span className="lasa-srs-tag srs-learning">Stage {srsRecord.stage}</span>;
        }
    }

    const handlePronounce = (drugName) => {
        if (!drugName) return;
        setSpeakingDrug(drugName);
        playMedicationAudio(drugName, {
            rate: 1.0,
            onStart: () => setSpeakingDrug(drugName),
            onEnd: () => setSpeakingDrug(null),
            onError: () => setSpeakingDrug(null)
        });
    };

    return (
        <div className={`lasa-pair-card duo-card ${className}`}>
            <div className="lasa-card-header">
                <div className="lasa-card-header-left">
                    <span className="lasa-id-badge">{displayLabel}</span>
                    <span className="lasa-level-tag">Level {pair.level}</span>
                </div>
                {srsBadge}
            </div>

            <div className="lasa-comparison-row">
                <div className="lasa-drug-block">
                    <span className="lasa-drug-label">Primary Drug</span>
                    <div className="lasa-drug-title-row">
                        <h3 className="lasa-drug-name">
                            <TallManText name={pair.drugName} />
                        </h3>
                        <button
                            type="button"
                            className={`lasa-pronounce-btn ${speakingDrug === pair.drugName ? "speaking" : ""}`}
                            onClick={() => handlePronounce(pair.drugName)}
                            title={`Pronounce ${pair.drugName}`}
                            aria-label={`Pronounce ${pair.drugName}`}
                        >
                            <Volume2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="lasa-divider-icon" title="Look-Alike / Sound-Alike Pair">
                    <ArrowLeftRight size={20} />
                </div>

                <div className="lasa-drug-block">
                    <span className="lasa-drug-label">Confused With</span>
                    <div className="lasa-drug-title-row">
                        <h3 className="lasa-drug-name">
                            <TallManText name={pair.confusedDrugName} />
                        </h3>
                        <button
                            type="button"
                            className={`lasa-pronounce-btn ${speakingDrug === pair.confusedDrugName ? "speaking" : ""}`}
                            onClick={() => handlePronounce(pair.confusedDrugName)}
                            title={`Pronounce ${pair.confusedDrugName}`}
                            aria-label={`Pronounce ${pair.confusedDrugName}`}
                        >
                            <Volume2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="lasa-card-footer">
                <AlertCircle size={14} className="lasa-alert-icon" />
                <span className="lasa-footer-note">
                    {pair.sourceCitation || pair.source || "ISMP List of Confused Drug Names"}
                </span>
            </div>
        </div>
    );
}

export default LasaPairCard;
