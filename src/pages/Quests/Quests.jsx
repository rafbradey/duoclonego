import { Trophy, Sparkles } from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import "../Practice/Practice.css";

function Quests() {
    return (
        <div className="subpage-container">
            <header className="subpage-header">
                <div className="subpage-title-badge">
                    <Trophy size={24} className="subpage-badge-icon" />
                    <h1 className="heading-lg">Daily Quests</h1>
                </div>
                <p className="body-text-muted">
                    Complete learning challenges to earn gems, XP, and badges.
                </p>
            </header>

            <main className="subpage-content">
                <div className="subpage-feature-card duo-card">
                    <Mascot mascotType="maracas" size={130} animationType="bounce" />
                    <div className="phase-pill">
                        <Sparkles size={14} />
                        <span>SCHEDULED FOR PHASE 5</span>
                    </div>
                    <h2 className="heading-md">Gamified Learning Quests</h2>
                    <p className="body-text-muted">
                        Daily quests and achievement rewards will be connected to your actual lesson completions and LASA accuracy once the core learning engine is in place.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Quests;