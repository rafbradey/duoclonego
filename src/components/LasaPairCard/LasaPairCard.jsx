import TallManText from "../TallManText/TallManText.jsx";
import { AlertCircle, ArrowLeftRight } from "lucide-react";
import "./LasaPairCard.css";

function LasaPairCard({ pair, className = "" }) {
    if (!pair) return null;

    return (
        <div className={`lasa-pair-card duo-card ${className}`}>
            <div className="lasa-card-header">
                <span className="lasa-id-badge">{pair.id}</span>
                <span className="lasa-level-tag">Level {pair.level}</span>
            </div>

            <div className="lasa-comparison-row">
                <div className="lasa-drug-block">
                    <span className="lasa-drug-label">Primary Drug</span>
                    <h3 className="lasa-drug-name">
                        <TallManText name={pair.drugName} />
                    </h3>
                </div>

                <div className="lasa-divider-icon" title="Look-Alike / Sound-Alike Pair">
                    <ArrowLeftRight size={20} />
                </div>

                <div className="lasa-drug-block">
                    <span className="lasa-drug-label">Confused With</span>
                    <h3 className="lasa-drug-name">
                        <TallManText name={pair.confusedDrugName} />
                    </h3>
                </div>
            </div>

            <div className="lasa-card-footer">
                <AlertCircle size={14} className="lasa-alert-icon" />
                <span className="lasa-footer-note">
                    ISMP 2023 Confused Drug Name Pair
                </span>
            </div>
        </div>
    );
}

export default LasaPairCard;
