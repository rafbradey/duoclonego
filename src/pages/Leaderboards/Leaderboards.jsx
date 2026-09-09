import { Medal, Sparkles } from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";

function Leaderboards() {
    return (
        <div className="subpage-container">
            <header className="subpage-header">
                <div className="subpage-title-badge">
                    <Medal size={24} className="subpage-badge-icon" />
                    <h1 className="heading-lg">Leaderboards</h1>
                </div>
                <p className="body-text-muted">
                    Climb the tiers and practice consistently with other pharmacology learners.
                </p>
            </header>

            <main className="subpage-content">
                <div className="subpage-feature-card duo-card">
                    <Mascot mascotType="shadow" size={130} animationType="pulse" />
                    <div className="phase-pill">
                        <Sparkles size={14} />
                        <span>SCHEDULED FOR PHASE 5</span>
                    </div>
                    <h2 className="heading-md">Weekly Cohort Leagues</h2>
                    <p className="body-text-muted">
                        Leaderboard mechanics will be introduced after persistent user accounts and progress tracking are established in Phases 4 & 5.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Leaderboards;