import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import {
    Trophy,
    Sparkles,
    CheckCircle2,
    Clock,
    Flame,
    Gem,
    BookOpen,
    ArrowRight,
    Target,
    Layers,
    ShieldAlert,
    Pencil,
    Medal,
    Crown
} from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import { getCurrentUser } from "../../services/userService.js";
import { getUserBadges } from "../../services/badgeService.js";
import "./Quests.css";

function QuestIcon({ iconName, size = 20 }) {
    switch (iconName) {
        case "Pencil": return <Pencil size={size} />;
        case "Layers": return <Layers size={size} />;
        case "ShieldAlert": return <ShieldAlert size={size} />;
        case "Sparkles": return <Sparkles size={size} />;
        case "Flame": return <Flame size={size} />;
        case "Crown": return <Crown size={size} />;
        case "BookOpen": return <BookOpen size={size} />;
        case "Target": return <Target size={size} />;
        default: return <Medal size={size} />;
    }
}

function Quests() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function loadUser() {
            try {
                const data = await getCurrentUser();
                if (isMounted && data) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Failed to load user in Quests:", err);
            }
        }
        loadUser();

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

    // Evaluate live daily quests based on user activity
    const dailyQuests = useMemo(() => {
        const completedLessonsCount = user?.completed_lessons?.length || 0;
        const practiceCompleted = user?.practice_sessions_completed || 0;
        const currentXp = user?.xp || 0;

        return [
            {
                id: "quest_daily_lesson",
                title: "Daily Focus",
                desc: "Complete any lesson in the curriculum today.",
                icon: <BookOpen size={22} />,
                colorClass: "color-green",
                current: completedLessonsCount > 0 ? 1 : 0,
                target: 1,
                isCompleted: completedLessonsCount > 0,
                xpReward: 15,
                gemsReward: 5
            },
            {
                id: "quest_srs_review",
                title: "Spaced Repetition Review",
                desc: "Complete 1 practice review session to reinforce memory.",
                icon: <Target size={22} />,
                colorClass: "color-blue",
                current: practiceCompleted > 0 ? 1 : 0,
                target: 1,
                isCompleted: practiceCompleted > 0,
                xpReward: 20,
                gemsReward: 10
            },
            {
                id: "quest_xp_target",
                title: "XP Power Goal",
                desc: "Earn at least 30 XP across lessons and practice.",
                icon: <Flame size={22} />,
                colorClass: "color-yellow",
                current: Math.min(30, currentXp),
                target: 30,
                isCompleted: currentXp >= 30,
                xpReward: 25,
                gemsReward: 15
            }
        ];
    }, [user]);

    // Live Badge Milestones
    const badgeData = useMemo(() => getUserBadges(user), [user]);

    return (
        <div className="quests-container">
            {/* Header Card */}
            <div className="quests-header-card">
                <div className="quests-header-text">
                    <div className="quests-header-title-wrap">
                        <Trophy size={28} className="quests-header-icon" />
                        <h1 className="heading-lg">Daily Quests & Milestones</h1>
                    </div>
                    <p className="quests-header-subtitle">
                        Complete daily challenges and earn achievements as you master 50 canonical FDA/ISMP Look-Alike Sound-Alike medication pairs.
                    </p>
                </div>
                <div className="quests-mascot-wrap">
                    <Mascot mascotType="maracas" size={110} animationType="bounce" />
                </div>
            </div>

            {/* SECTION 1: DAILY QUESTS */}
            <section className="quests-section" aria-labelledby="daily-quests-title">
                <div className="quests-section-header">
                    <div className="quests-section-title-wrap">
                        <Flame size={20} style={{ color: "var(--color-secondary)" }} />
                        <h2 id="daily-quests-title">Today's Quests</h2>
                    </div>
                    <div className="quests-reset-timer">
                        <Clock size={14} />
                        <span>Resets daily at midnight</span>
                    </div>
                </div>

                <div className="daily-quests-list">
                    {dailyQuests.map((quest) => {
                        const pct = Math.min(100, Math.round((quest.current / quest.target) * 100));
                        return (
                            <div
                                key={quest.id}
                                className={`quest-card ${quest.isCompleted ? "completed" : ""}`}
                            >
                                <div className="quest-left">
                                    <div className={`quest-icon-wrap ${quest.colorClass}`}>
                                        {quest.icon}
                                    </div>
                                    <div className="quest-details">
                                        <div className="quest-title-row">
                                            <h3 className="quest-name">{quest.title}</h3>
                                            <span className="quest-progress-text">
                                                {quest.current} / {quest.target}
                                            </span>
                                        </div>
                                        <p className="quest-desc">{quest.desc}</p>
                                        <div className="quest-progress-track">
                                            <div
                                                className={`quest-progress-fill ${quest.colorClass}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="quest-right">
                                    <div className="quest-reward-pill">
                                        <Gem size={13} />
                                        <span>+{quest.gemsReward}</span>
                                        <span>•</span>
                                        <span>+{quest.xpReward} XP</span>
                                    </div>
                                    {quest.isCompleted ? (
                                        <span className="quest-status-badge done">
                                            <CheckCircle2 size={16} /> Completed
                                        </span>
                                    ) : (
                                        <span className="quest-status-badge in-progress">
                                            In Progress
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* SECTION 2: LASA MILESTONES & BADGES PREVIEW */}
            <section className="quests-section" aria-labelledby="milestones-title">
                <div className="quests-section-header">
                    <div className="quests-section-title-wrap">
                        <Sparkles size={20} style={{ color: "#ffd700" }} />
                        <h2 id="milestones-title">LASA Mastery Milestones</h2>
                    </div>
                    <Link to="/profile" className="profile-learn-link">
                        <span>View All {badgeData.totalCount} Badges</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="milestones-grid">
                    {badgeData.badges.slice(0, 6).map((badge) => (
                        <Link
                            key={badge.id}
                            to="/profile"
                            className={`milestone-card ${badge.isUnlocked ? "unlocked" : "locked"}`}
                        >
                            <div className={`milestone-icon-wrap badge-icon-disc tier-${badge.tier}`}>
                                <QuestIcon iconName={badge.iconName} size={20} />
                            </div>
                            <div className="milestone-card-content">
                                <div className="milestone-header">
                                    <span className={`badge-tier-pill tier-${badge.tier}`}>
                                        {badge.tier.toUpperCase()}
                                    </span>
                                    {badge.isUnlocked ? (
                                        <span className="badge-status-pill unlocked">
                                            <CheckCircle2 size={12} /> Done
                                        </span>
                                    ) : (
                                        <span className="badge-status-pill locked">
                                            {badge.currentValue}/{badge.targetValue}
                                        </span>
                                    )}
                                </div>
                                <h3 className="milestone-title">{badge.title}</h3>
                                <p className="milestone-desc">{badge.description}</p>
                                {!badge.isUnlocked && (
                                    <div className="milestone-progress-track">
                                        <div
                                            className="milestone-progress-fill"
                                            style={{ width: `${badge.percentage}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Quests;