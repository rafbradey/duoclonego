import { Dumbbell, Sparkles } from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import "./Practice.css";

function Practice() {
    return (
        <div className="subpage-container">
            <header className="subpage-header">
                <div className="subpage-title-badge">
                    <Dumbbell size={24} className="subpage-badge-icon" />
                    <h1 className="heading-lg">Practice Hub</h1>
                </div>
                <p className="body-text-muted">
                    Strengthen your recall on confused Look-Alike, Sound-Alike drug pairs.
                </p>
            </header>

            <main className="subpage-content">
                <div className="subpage-feature-card duo-card">
                    <Mascot mascotType="normal" size={130} animationType="wiggle" />
                    <div className="phase-pill">
                        <Sparkles size={14} />
                        <span>SCHEDULED FOR PHASE 3</span>
                    </div>
                    <h2 className="heading-md">Targeted LASA Review</h2>
                    <p className="body-text-muted">
                        Practice mode will let you review past mistakes, practice high-risk LASA pairs, and reinforce drug distinctions through retrieval practice.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Practice;