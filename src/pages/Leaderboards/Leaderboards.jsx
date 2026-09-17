import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import {
    Trophy,
    Medal,
    Crown,
    Flame,
    Clock,
    Shield,
    ChevronUp,
    ChevronDown,
    Minus,
    Sparkles,
    BookOpen,
    Loader2
} from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import { getCurrentUser } from "../../services/userService.js";
import {
    getWeeklyCohortStandings,
    getTimeUntilWeeklyReset,
    LEAGUE_TIERS
} from "../../services/leaderboardService.js";
import "./Leaderboards.css";

function LeagueIcon({ tierId, size = 20 }) {
    switch (tierId) {
        case "diamond":
            return <Sparkles size={size} />;
        case "ruby":
        case "gold":
        case "sapphire":
            return <Crown size={size} />;
        case "silver":
            return <Medal size={size} />;
        default:
            return <Shield size={size} />;
    }
}

function Leaderboards() {
    const [user, setUser] = useState(null);
    const [standingsData, setStandingsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLeagueId, setSelectedLeagueId] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(getTimeUntilWeeklyReset().formatted);

    useEffect(() => {
        let isMounted = true;

        async function loadLeaderboard() {
            try {
                const currentUser = await getCurrentUser();
                if (!isMounted) return;
                setUser(currentUser);

                const data = await getWeeklyCohortStandings(currentUser);
                if (isMounted) {
                    setStandingsData(data);
                    setSelectedLeagueId(data.league.id);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load leaderboard:", err);
                if (isMounted) setLoading(false);
            }
        }

        loadLeaderboard();

        // Update timer every minute
        const timerInterval = setInterval(() => {
            setTimeRemaining(getTimeUntilWeeklyReset().formatted);
        }, 60000);

        const handleUserUpdate = async (e) => {
            if (e.detail?.user) {
                setUser(e.detail.user);
                const updatedData = await getWeeklyCohortStandings(e.detail.user);
                if (isMounted) {
                    setStandingsData(updatedData);
                }
            }
        };

        window.addEventListener("duoclongo:user-updated", handleUserUpdate);

        return () => {
            isMounted = false;
            clearInterval(timerInterval);
            window.removeEventListener("duoclongo:user-updated", handleUserUpdate);
        };
    }, []);

    const currentLeague = standingsData?.league;
    const standings = useMemo(() => standingsData?.standings || [], [standingsData]);
    const userRank = standingsData?.userRank || 1;
    const userZone = standingsData?.userZone || "neutral";

    // Split top 3 for podium
    const podiumData = useMemo(() => {
        if (standings.length < 3) return null;
        return {
            first: standings[0],
            second: standings[1],
            third: standings[2]
        };
    }, [standings]);

    if (loading) {
        return (
            <div className="leaderboard-loading-container">
                <Loader2 size={40} className="leaderboard-spinner" />
                <p className="body-text-muted">Loading Weekly League Standings...</p>
            </div>
        );
    }

    return (
        <div className="leaderboards-container">
            {/* Header with Active League Badge & Weekly Timer */}
            <div
                className="league-hero-card"
                style={{
                    borderColor: currentLeague?.borderColor || "var(--color-border)",
                    background: `linear-gradient(180deg, ${currentLeague?.bgColor || "rgba(255,255,255,0.04)"} 0%, var(--color-surface) 100%)`
                }}
            >
                <div className="league-hero-main">
                    <div
                        className="league-badge-pill"
                        style={{
                            color: currentLeague?.badgeColor || "var(--color-primary)",
                            borderColor: currentLeague?.borderColor || "var(--color-border)"
                        }}
                    >
                        <LeagueIcon tierId={currentLeague?.id} size={22} />
                        <span className="league-badge-text">{currentLeague?.name}</span>
                    </div>

                    <h1 className="heading-xl league-title">{currentLeague?.name}</h1>
                    <p className="body-text-muted league-subtitle">
                        {currentLeague?.description || "Compete weekly with your pharmacology cohort."}
                    </p>

                    <div className="league-timer-pill">
                        <Clock size={16} />
                        <span>{timeRemaining}</span>
                    </div>
                </div>

                <div className="league-mascot-wrap">
                    <Mascot mascotType="trophy" size={105} animationType="bounce" />
                </div>
            </div>

            {/* League Tier Navigation / Progression Bar */}
            <div className="league-tiers-bar" role="tablist" aria-label="League Tiers">
                {LEAGUE_TIERS.map((tier) => {
                    const isCurrent = tier.id === currentLeague?.id;
                    const isSelected = tier.id === selectedLeagueId;
                    return (
                        <button
                            key={tier.id}
                            role="tab"
                            aria-selected={isSelected}
                            className={`league-tier-tab ${isCurrent ? "is-current" : ""} ${isSelected ? "is-selected" : ""}`}
                            style={{
                                "--tier-color": tier.badgeColor
                            }}
                            onClick={() => setSelectedLeagueId(tier.id)}
                        >
                            <span className="league-tab-icon">
                                <LeagueIcon tierId={tier.id} size={16} />
                            </span>
                            <span className="league-tab-name">{tier.name.replace(" League", "")}</span>
                            {isCurrent && <span className="current-league-dot" title="Your current league" />}
                        </button>
                    );
                })}
            </div>

            {/* Top 3 Podium Showcase */}
            {podiumData && (
                <section className="podium-section" aria-label="Top 3 Learners">
                    {/* Rank 2 (Silver) */}
                    <div className="podium-slot rank-2">
                        <div className="podium-avatar-wrap">
                            <span className="podium-medal-badge silver">2</span>
                            <div className="podium-avatar-ring">
                                <span className="podium-avatar-initials">
                                    {podiumData.second.displayName.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="podium-name-wrap">
                            <span className="podium-name">{podiumData.second.displayName}</span>
                            {podiumData.second.isCurrentUser && <span className="you-tag">YOU</span>}
                        </div>
                        <span className="podium-xp">{podiumData.second.xp} XP</span>
                        <div className="podium-pedestal pedestal-2">
                            <span className="pedestal-rank">2</span>
                        </div>
                    </div>

                    {/* Rank 1 (Gold) */}
                    <div className="podium-slot rank-1">
                        <Crown size={28} className="podium-crown-icon" />
                        <div className="podium-avatar-wrap">
                            <span className="podium-medal-badge gold">1</span>
                            <div className="podium-avatar-ring gold-ring">
                                <span className="podium-avatar-initials">
                                    {podiumData.first.displayName.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="podium-name-wrap">
                            <span className="podium-name">{podiumData.first.displayName}</span>
                            {podiumData.first.isCurrentUser && <span className="you-tag">YOU</span>}
                        </div>
                        <span className="podium-xp">{podiumData.first.xp} XP</span>
                        <div className="podium-pedestal pedestal-1">
                            <Trophy size={20} className="pedestal-trophy" />
                            <span className="pedestal-rank">1</span>
                        </div>
                    </div>

                    {/* Rank 3 (Bronze) */}
                    <div className="podium-slot rank-3">
                        <div className="podium-avatar-wrap">
                            <span className="podium-medal-badge bronze">3</span>
                            <div className="podium-avatar-ring">
                                <span className="podium-avatar-initials">
                                    {podiumData.third.displayName.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="podium-name-wrap">
                            <span className="podium-name">{podiumData.third.displayName}</span>
                            {podiumData.third.isCurrentUser && <span className="you-tag">YOU</span>}
                        </div>
                        <span className="podium-xp">{podiumData.third.xp} XP</span>
                        <div className="podium-pedestal pedestal-3">
                            <span className="pedestal-rank">3</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Standings Table */}
            <main className="leaderboard-table-card duo-card">
                <div className="table-header-row">
                    <span className="col-rank">#</span>
                    <span className="col-user">Learner</span>
                    <span className="col-xp">XP</span>
                </div>

                <div className="standings-list" role="list">
                    {standings.map((learner, index) => {
                        const showPromoDivider =
                            currentLeague?.promoRank > 0 &&
                            index === currentLeague.promoRank;

                        const showDemoDivider =
                            currentLeague?.demoRank > 0 &&
                            index === standings.length - currentLeague.demoRank;

                        return (
                            <div key={learner.id} className="standings-row-wrapper">
                                {showPromoDivider && (
                                    <div className="zone-divider promotion">
                                        <ChevronUp size={16} />
                                        <span>PROMOTION ZONE (TOP {currentLeague.promoRank} ADVANCE)</span>
                                    </div>
                                )}

                                {showDemoDivider && (
                                    <div className="zone-divider demotion">
                                        <ChevronDown size={16} />
                                        <span>DEMOTION ZONE (DROPS TO PREVIOUS LEAGUE)</span>
                                    </div>
                                )}

                                <div
                                    role="listitem"
                                    className={`standings-row ${learner.isCurrentUser ? "is-current-user" : ""} ${learner.zone}`}
                                >
                                    <div className="standings-col-rank">
                                        <span className={`rank-number rank-${learner.rank}`}>
                                            {learner.rank}
                                        </span>
                                    </div>

                                    <div className="standings-col-user">
                                        <div className="user-avatar-circle">
                                            {learner.displayName.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="user-text-meta">
                                            <span className="user-display-name">
                                                {learner.displayName}
                                                {learner.isCurrentUser && (
                                                    <span className="you-tag">YOU</span>
                                                )}
                                            </span>
                                            <span className="user-handle">@{learner.username}</span>
                                        </div>
                                    </div>

                                    <div className="standings-col-xp">
                                        <Flame size={15} className="xp-flame-icon" />
                                        <span className="xp-number">{learner.xp}</span>
                                        <span className="xp-unit">XP</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Sticky Current User Status Bar */}
            <footer className="sticky-user-bar">
                <div className="sticky-user-content">
                    <div className="sticky-user-info">
                        <span className="sticky-user-rank">#{userRank}</span>
                        <div className="sticky-user-name">
                            <span>{user?.display_name || "You"}</span>
                            <span className="sticky-user-zone">
                                {userZone === "promotion" && (
                                    <span className="zone-tag promo">
                                        <ChevronUp size={14} /> Promotion Zone
                                    </span>
                                )}
                                {userZone === "demotion" && (
                                    <span className="zone-tag demo">
                                        <ChevronDown size={14} /> Demotion Zone
                                    </span>
                                )}
                                {userZone === "neutral" && (
                                    <span className="zone-tag neutral">
                                        <Minus size={14} /> Safe
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="sticky-user-action">
                        <span className="sticky-user-xp">{user?.xp || 0} XP</span>
                        <Link to="/learn" className="duo-button duo-button-primary sticky-practice-btn">
                            <BookOpen size={16} />
                            <span>Earn XP</span>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Leaderboards;