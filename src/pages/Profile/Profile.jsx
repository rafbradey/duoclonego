import { useMemo } from "react";
import { Link } from "react-router";
import {
    Shield,
    Flame,
    Gem,
    Award,
    Calendar,
    Brain,
    CheckCircle2,
    AlertCircle,
    Clock,
    Sparkles,
    BookOpen,
    ArrowRight,
    Medal,
    Lock,
    Trophy,
    Crown,
    ShieldAlert,
    Pencil,
    Layers,
    Cloud,
    LogOut
} from "lucide-react";
import {
    getDueSrsPairs,
    getMasteredPairsCount
} from "../../services/userService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { getUserBadges } from "../../services/badgeService.js";
import { allUnits, allLevels } from "../../data/levels/index.js";
import userAvatar from "../../assets/avatars/default_avatar_male.png";
import "./Profile.css";

function BadgeIcon({ iconName, size = 24 }) {
    switch (iconName) {
        case "Pencil": return <Pencil size={size} />;
        case "Layers": return <Layers size={size} />;
        case "ShieldAlert": return <ShieldAlert size={size} />;
        case "Sparkles": return <Sparkles size={size} />;
        case "Award": return <Award size={size} />;
        case "Trophy": return <Trophy size={size} />;
        case "Brain": return <Brain size={size} />;
        case "Flame": return <Flame size={size} />;
        case "CheckCircle": return <CheckCircle2 size={size} />;
        case "Crown": return <Crown size={size} />;
        default: return <Medal size={size} />;
    }
}

function Profile() {
    const { user, signOut } = useAuth();

    // Unique verified LASA pairs across all curriculum units
    const totalVerifiedPairs = useMemo(() => {
        const pairIdSet = new Set();
        allUnits.forEach((u) => {
            (u.lasaPairs || []).forEach((p) => {
                if (p?.id) pairIdSet.add(p.id);
            });
        });
        return Math.max(pairIdSet.size, 50);
    }, []);

    // Achievements & Badges analytics
    const badgeData = useMemo(() => getUserBadges(user), [user]);

    // Memory Stage Analytics from live SRS records
    const srsAnalytics = useMemo(() => {
        if (!user) {
            return {
                mastered: 0,
                due: 0,
                stage2: 0,
                stage1: 0,
                stage0: 0,
                mistakes: 0,
                masteredPct: 0
            };
        }

        const mastered = getMasteredPairsCount(user);
        const due = getDueSrsPairs(user).length;
        const mistakes = (user.mistakes_queue || []).length;
        const srsRecords = Object.values(user.srs_records || {});

        const stage2 = srsRecords.filter((r) => r.stage === 2).length;
        const stage1 = srsRecords.filter((r) => r.stage === 1).length;
        const stage0 = srsRecords.filter((r) => r.stage === 0).length;
        const masteredPct = Math.min(100, Math.round((mastered / totalVerifiedPairs) * 100));

        return {
            mastered,
            due,
            stage2,
            stage1,
            stage0,
            mistakes,
            masteredPct
        };
    }, [user, totalVerifiedPairs]);

    // Curriculum progress analytics
    const curriculumProgress = useMemo(() => {
        if (!user) {
            return {
                completedLevelsCount: 0,
                totalLevelsCount: allLevels.length,
                completedUnitsCount: 0,
                totalUnitsCount: allUnits.length,
                overallPct: 0,
                unitsData: []
            };
        }

        const completedLessons = user.completed_lessons || [];
        const completedLevelsCount = allLevels.filter((lvl) =>
            completedLessons.includes(lvl.id)
        ).length;

        const unitsData = allUnits.map((unit) => {
            const unitLevels = unit.levels || [];
            const completedInUnit = unitLevels.filter((lvl) =>
                completedLessons.includes(lvl.id)
            ).length;
            const isMastered = Boolean(
                unit.masteryLevel && completedLessons.includes(unit.masteryLevel.id)
            );
            const pct = unitLevels.length > 0
                ? Math.round((completedInUnit / unitLevels.length) * 100)
                : 0;

            return {
                id: unit.id,
                title: unit.title,
                subtitle: unit.subtitle || unit.description,
                color: unit.color || "#2dab69",
                completedCount: completedInUnit,
                totalCount: unitLevels.length,
                isMastered,
                percentage: pct
            };
        });

        const completedUnitsCount = unitsData.filter((u) => u.isMastered).length;
        const overallPct = allLevels.length > 0
            ? Math.round((completedLevelsCount / allLevels.length) * 100)
            : 0;

        return {
            completedLevelsCount,
            totalLevelsCount: allLevels.length,
            completedUnitsCount,
            totalUnitsCount: allUnits.length,
            overallPct,
            unitsData
        };
    }, [user]);

    if (!user) {
        return (
            <div className="profile-container">
                <div className="body-text-muted">Loading profile...</div>
            </div>
        );
    }

    const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    return (
        <div className="profile-container">
            {/* Header Card */}
            <header className="profile-header-card duo-card">
                <img
                    src={userAvatar}
                    alt={`${user.display_name}'s avatar`}
                    className="profile-avatar-large"
                />
                <div className="profile-info-block">
                    <div className="profile-name-row">
                        <h1 className="heading-lg">{user.display_name}</h1>
                        <span className="profile-sync-pill cloud" title="Progress is synced to Supabase cloud">
                            <Cloud size={13} />
                            <span>Cloud Synced</span>
                        </span>
                    </div>
                    <span className="profile-username-tag">@{user.username}</span>
                    <div className="profile-joined-date">
                        <Calendar size={16} />
                        <span>Joined {memberSince}</span>
                    </div>
                </div>

                <div className="profile-header-actions">
                    <button
                        type="button"
                        className="duo-button profile-signout-btn"
                        onClick={() => signOut()}
                        title="Sign out of your account"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </header>

            {/* Core Motivation Stats Grid */}
            <section className="profile-stats-grid" aria-label="Learner Achievements">
                <div className="profile-stat-card duo-card">
                    <div className="profile-stat-icon-wrapper flame-color">
                        <Flame size={26} />
                    </div>
                    <div className="profile-stat-text">
                        <span className="profile-stat-num">{user.streak}</span>
                        <span className="profile-stat-label">Day Streak</span>
                    </div>
                </div>

                <div className="profile-stat-card duo-card">
                    <div className="profile-stat-icon-wrapper gem-color">
                        <Gem size={26} />
                    </div>
                    <div className="profile-stat-text">
                        <span className="profile-stat-num">{user.diamonds}</span>
                        <span className="profile-stat-label">Gems Collected</span>
                    </div>
                </div>

                <div className="profile-stat-card duo-card">
                    <div className="profile-stat-icon-wrapper shield-color">
                        <Shield size={26} />
                    </div>
                    <div className="profile-stat-text">
                        <span className="profile-stat-num">Level {user.level}</span>
                        <span className="profile-stat-label">Mastery Rank</span>
                    </div>
                </div>

                <div className="profile-stat-card duo-card">
                    <div className="profile-stat-icon-wrapper xp-color">
                        <Award size={26} />
                    </div>
                    <div className="profile-stat-text">
                        <span className="profile-stat-num">{user.xp} XP</span>
                        <span className="profile-stat-label">Total Experience</span>
                    </div>
                </div>
            </section>

            {/* SECTION 1: LASA MEMORY RETENTION & SRS MASTERY */}
            <section className="profile-section-block duo-card" aria-labelledby="srs-retention-title">
                <div className="profile-section-header">
                    <div className="profile-section-title-wrap">
                        <Brain size={22} className="srs-header-icon" />
                        <div>
                            <h2 id="srs-retention-title" className="heading-md">LASA Memory &amp; Retention</h2>
                            <p className="body-text-muted profile-section-subtitle">
                                Spaced Repetition (SRS) memory strength across verified ISMP 2023 medication pairs.
                            </p>
                        </div>
                    </div>
                    <div className="srs-mastery-badge">
                        <Sparkles size={16} />
                        <span>{srsAnalytics.masteredPct}% Mastered</span>
                    </div>
                </div>

                {/* Big Mastery Progress Card */}
                <div className="srs-progress-card">
                    <div className="srs-progress-meta">
                        <div>
                            <span className="srs-progress-big-number">{srsAnalytics.mastered}</span>
                            <span className="srs-progress-total"> / {totalVerifiedPairs} Pairs</span>
                        </div>
                        <span className="srs-stage-label">Stage 3 (Mastered)</span>
                    </div>

                    {/* Multi-segment Memory Distribution Bar */}
                    <div
                        className="srs-multi-bar"
                        role="progressbar"
                        aria-valuenow={srsAnalytics.masteredPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="LASA memory strength progress"
                    >
                        <div
                            className="srs-bar-segment segment-mastered"
                            style={{ width: `${(srsAnalytics.mastered / totalVerifiedPairs) * 100}%` }}
                            title={`Stage 3 (Mastered): ${srsAnalytics.mastered}`}
                        />
                        <div
                            className="srs-bar-segment segment-stage2"
                            style={{ width: `${(srsAnalytics.stage2 / totalVerifiedPairs) * 100}%` }}
                            title={`Stage 2 (Consolidation): ${srsAnalytics.stage2}`}
                        />
                        <div
                            className="srs-bar-segment segment-stage1"
                            style={{ width: `${(srsAnalytics.stage1 / totalVerifiedPairs) * 100}%` }}
                            title={`Stage 1 (Initial Recall): ${srsAnalytics.stage1}`}
                        />
                        <div
                            className="srs-bar-segment segment-stage0"
                            style={{ width: `${(srsAnalytics.stage0 / totalVerifiedPairs) * 100}%` }}
                            title={`Stage 0 (Learning / Flagged): ${srsAnalytics.stage0}`}
                        />
                    </div>

                    {/* Legend */}
                    <div className="srs-legend-row">
                        <div className="srs-legend-item">
                            <span className="legend-dot dot-mastered" />
                            <span>Mastered ({srsAnalytics.mastered})</span>
                        </div>
                        <div className="srs-legend-item">
                            <span className="legend-dot dot-stage2" />
                            <span>Consolidating ({srsAnalytics.stage2})</span>
                        </div>
                        <div className="srs-legend-item">
                            <span className="legend-dot dot-stage1" />
                            <span>Initial ({srsAnalytics.stage1})</span>
                        </div>
                        <div className="srs-legend-item">
                            <span className="legend-dot dot-stage0" />
                            <span>Learning ({srsAnalytics.stage0})</span>
                        </div>
                    </div>
                </div>

                {/* SRS Action Cards Row */}
                <div className="srs-actions-grid">
                    <div className={`srs-action-card ${srsAnalytics.due > 0 ? "has-due" : ""}`}>
                        <div className="srs-action-top">
                            <Clock size={20} className="srs-action-icon clock-color" />
                            <span className="srs-action-num">{srsAnalytics.due}</span>
                        </div>
                        <span className="srs-action-label">Due for Review Today</span>
                        {srsAnalytics.due > 0 ? (
                            <Link to="/practice?mode=due" className="srs-action-btn btn-due">
                                <span>Practice Due</span>
                                <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <span className="srs-action-uptodate">
                                <CheckCircle2 size={14} /> All caught up
                            </span>
                        )}
                    </div>

                    <div className={`srs-action-card ${srsAnalytics.mistakes > 0 ? "has-mistakes" : ""}`}>
                        <div className="srs-action-top">
                            <AlertCircle size={20} className="srs-action-icon alert-color" />
                            <span className="srs-action-num">{srsAnalytics.mistakes}</span>
                        </div>
                        <span className="srs-action-label">Flagged Mistakes</span>
                        {srsAnalytics.mistakes > 0 ? (
                            <Link to="/practice?mode=mistakes" className="srs-action-btn btn-mistakes">
                                <span>Redeem Now</span>
                                <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <span className="srs-action-uptodate">
                                <CheckCircle2 size={14} /> Zero active mistakes
                            </span>
                        )}
                    </div>

                    <div className="srs-action-card">
                        <div className="srs-action-top">
                            <BookOpen size={20} className="srs-action-icon review-color" />
                            <span className="srs-action-num">{user.practice_sessions_completed || 0}</span>
                        </div>
                        <span className="srs-action-label">Reviews Completed</span>
                        <Link to="/practice" className="srs-action-btn btn-quick">
                            <span>Open Practice</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 2: CURRICULUM PROGRESSION */}
            <section className="profile-section-block duo-card" aria-labelledby="curriculum-title">
                <div className="profile-section-header">
                    <div className="profile-section-title-wrap">
                        <BookOpen size={22} className="curriculum-header-icon" />
                        <div>
                            <h2 id="curriculum-title" className="heading-md">Curriculum Progress</h2>
                            <p className="body-text-muted profile-section-subtitle">
                                Progression across Section 1 (Foundations) and Section 2 (High-Alert Medications).
                            </p>
                        </div>
                    </div>
                    <div className="curriculum-overall-chip">
                        <span>{curriculumProgress.completedLevelsCount} / {curriculumProgress.totalLevelsCount} Levels ({curriculumProgress.overallPct}%)</span>
                    </div>
                </div>

                {/* Unit Cards List */}
                <div className="profile-units-grid">
                    {curriculumProgress.unitsData.map((unit, idx) => (
                        <div key={unit.id} className="profile-unit-card">
                            <div className="profile-unit-top">
                                <div className="profile-unit-title-group">
                                    <span className="profile-unit-tag">Unit {idx + 1}</span>
                                    <h3 className="heading-xs profile-unit-name">{unit.title}</h3>
                                    <span className="profile-unit-desc">{unit.subtitle}</span>
                                </div>
                                {unit.isMastered ? (
                                    <div className="unit-badge-mastered">
                                        <span>🏆 Mastered</span>
                                    </div>
                                ) : unit.completedCount > 0 ? (
                                    <div className="unit-badge-progress">
                                        <span>{unit.completedCount}/{unit.totalCount} Done</span>
                                    </div>
                                ) : (
                                    <div className="unit-badge-locked">
                                        <span>Locked</span>
                                    </div>
                                )}
                            </div>

                            {/* Unit Progress Bar */}
                            <div className="profile-unit-bar-wrapper">
                                <div
                                    className="profile-unit-bar-fill"
                                    style={{
                                        width: `${unit.percentage}%`,
                                        backgroundColor: unit.isMastered ? "#e6b800" : (unit.color || "var(--color-primary)")
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="profile-footer-nav">
                    <Link to="/learn" className="profile-learn-link">
                        <span>Continue Learning Path</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* SECTION 3: ACHIEVEMENTS & LASA BADGES */}
            <section className="profile-section-block duo-card" aria-labelledby="badges-title">
                <div className="profile-section-header">
                    <div className="profile-section-title-wrap">
                        <Trophy size={22} className="badges-header-icon" />
                        <div>
                            <h2 id="badges-title" className="heading-md">Achievements & Badges</h2>
                            <p className="body-text-muted profile-section-subtitle">
                                Milestones earned through mastering verified FDA/ISMP Look-Alike Sound-Alike medication pairs and curriculum levels.
                            </p>
                        </div>
                    </div>
                    <div className="badges-overall-chip">
                        <span>{badgeData.unlockedCount} / {badgeData.totalCount} Unlocked ({badgeData.completionPercentage}%)</span>
                    </div>
                </div>

                <div className="profile-badges-grid">
                    {badgeData.badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`profile-badge-card ${badge.isUnlocked ? "unlocked" : "locked"} tier-${badge.tier}`}
                        >
                            <div className="badge-card-icon-wrap">
                                <div className={`badge-icon-disc tier-${badge.tier}`}>
                                    <BadgeIcon iconName={badge.iconName} size={24} />
                                </div>
                                {!badge.isUnlocked && (
                                    <div className="badge-lock-overlay" title="Locked">
                                        <Lock size={12} />
                                    </div>
                                )}
                            </div>

                            <div className="badge-card-content">
                                <div className="badge-card-header">
                                    <span className={`badge-tier-pill tier-${badge.tier}`}>{badge.tier.toUpperCase()}</span>
                                    {badge.isUnlocked ? (
                                        <span className="badge-status-pill unlocked">
                                            <CheckCircle2 size={12} /> Unlocked
                                        </span>
                                    ) : (
                                        <span className="badge-status-pill locked">
                                            {badge.currentValue}/{badge.targetValue}
                                        </span>
                                    )}
                                </div>
                                <h3 className="heading-xs badge-title">{badge.title}</h3>
                                <p className="badge-desc">{badge.description}</p>

                                {!badge.isUnlocked && (
                                    <div className="badge-progress-container">
                                        <div className="badge-progress-track">
                                            <div
                                                className="badge-progress-fill"
                                                style={{ width: `${badge.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Profile;