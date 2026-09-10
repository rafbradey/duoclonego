import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    Dumbbell,
    Zap,
    RotateCcw,
    Sparkles,
    ShieldCheck,
    Award,
    BookOpen,
    ArrowRight
} from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import LasaPairCard from "../../components/LasaPairCard/LasaPairCard.jsx";
import { getCurrentUser } from "../../services/userService.js";
import { getAllLasaEntries } from "../../services/drugService.js";
import "./Practice.css";

function Practice() {
    const [user, setUser] = useState(null);
    const [lasaPairs, setLasaPairs] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function loadHubData() {
            setLoading(true);
            try {
                const [userData, entries] = await Promise.all([
                    getCurrentUser(),
                    getAllLasaEntries()
                ]);
                if (isMounted) {
                    setUser(userData);
                    setLasaPairs(entries || []);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load practice hub data:", err);
                if (isMounted) setLoading(false);
            }
        }
        loadHubData();
        return () => { isMounted = false; };
    }, []);

    const mistakesCount = user?.mistakes_queue?.length || 0;
    const practiceCompletedCount = user?.practice_sessions_completed || 0;

    const filteredPairs = selectedLevel === "all"
        ? lasaPairs
        : lasaPairs.filter((p) => String(p.level) === String(selectedLevel));

    if (loading) {
        return (
            <div className="practice-hub-container">
                <div className="body-text-muted" style={{ padding: "3rem 0", textAlign: "center" }}>
                    Loading Practice Hub...
                </div>
            </div>
        );
    }

    return (
        <div className="practice-hub-container">
            {/* Header Section */}
            <header className="practice-header">
                <div className="practice-title-group">
                    <div className="practice-badge-title">
                        <Dumbbell size={28} className="practice-badge-icon" />
                        <h1 className="heading-lg">Practice Hub</h1>
                    </div>
                    <p className="body-text-muted">
                        Strengthen clinical recognition of high-risk Look-Alike, Sound-Alike medications through active retrieval practice without losing hearts.
                    </p>
                </div>

                <div className="practice-header-mascot">
                    <Mascot mascotType="normal" size={110} animationType="bounce" />
                </div>
            </header>

            {/* Top Stat Overview Bar */}
            <section className="practice-stats-bar" aria-label="Practice Hub Statistics">
                <div className="practice-stat-card">
                    <div className="practice-stat-icon-wrapper xp">
                        <Award size={24} />
                    </div>
                    <div className="practice-stat-info">
                        <span className="practice-stat-value">{practiceCompletedCount}</span>
                        <span className="practice-stat-label">Reviews Finished</span>
                    </div>
                </div>

                <div className="practice-stat-card">
                    <div className="practice-stat-icon-wrapper mistakes">
                        <RotateCcw size={24} />
                    </div>
                    <div className="practice-stat-info">
                        <span className="practice-stat-value">{mistakesCount}</span>
                        <span className="practice-stat-label">Mistakes in Queue</span>
                    </div>
                </div>

                <div className="practice-stat-card">
                    <div className="practice-stat-icon-wrapper safe">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="practice-stat-info">
                        <span className="practice-stat-value">Safe Mode</span>
                        <span className="practice-stat-label">Zero Hearts Depleted</span>
                    </div>
                </div>
            </section>

            {/* Practice Modes Section */}
            <section className="practice-modes-section">
                <h2 className="practice-section-heading">
                    <Zap size={20} className="text-accent" />
                    <span>Choose Review Mode</span>
                </h2>

                <div className="practice-modes-grid">
                    {/* Quick Practice Mode Card */}
                    <div className="practice-mode-card quick-mode duo-card">
                        <div className="practice-card-top">
                            <div className="practice-card-header-row">
                                <div className="practice-mode-icon-pill">
                                    <Sparkles size={24} />
                                </div>
                                <span className="practice-mode-badge">+10 XP · 5 Questions</span>
                            </div>
                            <div className="practice-mode-info">
                                <h3 className="practice-mode-title">Quick Practice</h3>
                                <p className="practice-mode-desc">
                                    Randomized retrieval questions drawn from your unlocked curriculum levels. Fast, bite-sized recall exercises designed to build rapid recognition.
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/lesson/practice?mode=quick"
                            className="duo-button duo-button-primary practice-mode-action-btn"
                        >
                            <span>START QUICK PRACTICE</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    {/* Targeted Mistakes Review Mode Card */}
                    <div className="practice-mode-card mistakes-mode duo-card">
                        <div className="practice-card-top">
                            <div className="practice-card-header-row">
                                <div className="practice-mode-icon-pill">
                                    <RotateCcw size={24} />
                                </div>
                                <span className={`practice-mode-badge ${mistakesCount === 0 ? "badge-clean" : ""}`}>
                                    {mistakesCount > 0 ? `${mistakesCount} Flagged` : "Queue Clean"}
                                </span>
                            </div>
                            <div className="practice-mode-info">
                                <h3 className="practice-mode-title">Targeted Mistakes Review</h3>
                                <p className="practice-mode-desc">
                                    {mistakesCount > 0
                                        ? `You have ${mistakesCount} flagged question${mistakesCount === 1 ? "" : "s"} waiting for redemption. Review them now to clear them from your mistake queue.`
                                        : "Your mistake queue is currently clear! Any questions you miss during standard curriculum lessons will automatically be prioritized here."}
                                </p>
                            </div>
                        </div>

                        <Link
                            to={mistakesCount > 0 ? "/lesson/practice?mode=mistakes" : "/lesson/practice?mode=quick"}
                            className="duo-button duo-button-secondary practice-mode-action-btn"
                        >
                            <span>{mistakesCount > 0 ? "REVIEW MISTAKES" : "PRACTICE ANYWAY"}</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* LASA Pair Flashcards Reference Browser */}
            <section className="practice-reference-section">
                <div className="practice-ref-header-row">
                    <h2 className="practice-section-heading">
                        <BookOpen size={20} className="text-accent" />
                        <span>Confusable Medication Pairs Reference</span>
                    </h2>

                    <div className="practice-ref-filter-tabs" role="tablist" aria-label="Level filters">
                        {["all", "1", "2", "3"].map((lvl) => (
                            <button
                                key={lvl}
                                type="button"
                                role="tab"
                                aria-selected={selectedLevel === lvl}
                                className={`practice-ref-tab ${selectedLevel === lvl ? "active" : ""}`}
                                onClick={() => setSelectedLevel(lvl)}
                            >
                                {lvl === "all" ? "All Levels" : `Level ${lvl}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="practice-pairs-grid">
                    {filteredPairs.map((pair) => (
                        <LasaPairCard key={pair.id} pair={pair} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Practice;