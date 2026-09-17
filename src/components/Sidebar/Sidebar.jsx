import { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { Link, useLocation, useNavigate } from "react-router";
import SidebarNav from "../SidebarNav/SidebarNav.jsx";
import Mascot from "../Mascot/Mascot.jsx";
import { allUnits } from "../../data/levels/index.js";
import { useAuth } from "../../context/AuthContext.jsx";
import {
    BookOpen,
    Dumbbell,
    Trophy,
    ShoppingBag,
    Medal,
    User,
    FileText,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Lock
} from "lucide-react";

function Sidebar({ onNavigate, isMobileDrawer = false }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isLearnRoute = location.pathname === "/learn";
    const [activeLevelId, setActiveLevelId] = useState("");
    const [isPathExpanded, setIsPathExpanded] = useState(true);
    const scrollContainerRef = useRef(null);
    const activeLevelIdRef = useRef("");

    // Ensure the active level item remains within comfortable visible bounds of the curriculum container
    const ensureLevelVisible = (levelId) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        requestAnimationFrame(() => {
            const targetBtn = container.querySelector(`[data-sidebar-level-id="${levelId}"]`);
            if (!targetBtn) return;

            const containerRect = container.getBoundingClientRect();
            const btnRect = targetBtn.getBoundingClientRect();

            const topPadding = 32;
            const bottomPadding = 32;

            if (btnRect.top < containerRect.top + topPadding) {
                const delta = btnRect.top - (containerRect.top + topPadding);
                container.scrollBy({ top: delta, behavior: "smooth" });
            } else if (btnRect.bottom > containerRect.bottom - bottomPadding) {
                const delta = btnRect.bottom - (containerRect.bottom - bottomPadding);
                container.scrollBy({ top: delta, behavior: "smooth" });
            }
        });
    };

    useEffect(() => {
        const handleActiveLevel = (e) => {
            const nextId = e.detail?.levelId;
            if (nextId && nextId !== activeLevelIdRef.current) {
                activeLevelIdRef.current = nextId;
                setActiveLevelId(nextId);
                ensureLevelVisible(nextId);
            }
        };

        window.addEventListener("duoclongo:active-level", handleActiveLevel);
        return () => window.removeEventListener("duoclongo:active-level", handleActiveLevel);
    }, []);

    const isLevelCompleted = (levelId) => {
        if (!user || !Array.isArray(user.completed_lessons)) return false;
        const cleanId = String(levelId);
        const legacyId = cleanId.replace(/^level_/, "lesson_");
        const modernId = cleanId.replace(/^lesson_/, "level_");
        return (
            user.completed_lessons.includes(cleanId) ||
            user.completed_lessons.includes(legacyId) ||
            user.completed_lessons.includes(modernId)
        );
    };

    const handleLevelClick = (levelId) => {
        activeLevelIdRef.current = levelId;
        setActiveLevelId(levelId);

        if (isLearnRoute) {
            const element = document.getElementById(levelId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            navigate(`/learn#${levelId}`);
        }

        onNavigate?.();
    };

    const showLearningPath = isLearnRoute || isMobileDrawer;

    const handleAccountClick = () => {
        navigate("/profile");
        onNavigate?.();
    };

    return (
        <aside className="sidebar" aria-label="Main Navigation">
            {/* 1. Logo Header (Fixed) - only render if not in mobile drawer */}
            {!isMobileDrawer && (
                <div className="sidebar-header">
                    <Link to="/learn" className="sidebar-logo-link" onClick={onNavigate}>
                        <Mascot mascotType="shadow" size={36} flipped={false} animationType="none" />
                        <span className="sidebar-logo-text">duoclongo</span>
                    </Link>
                </div>
            )}

            {/* 2. Main Navigation Links (Fixed) */}
            <nav className="sidebar-main-nav">
                <ul className="sidebar-links-list">
                    <SidebarNav icon={BookOpen} iconSize={24} link="/learn" text="LEARN" onClick={onNavigate} />
                    <SidebarNav icon={Dumbbell} iconSize={24} link="/practice" text="PRACTICE" onClick={onNavigate} />
                    <SidebarNav icon={Trophy} iconSize={24} link="/quests" text="QUESTS" onClick={onNavigate} />
                    <SidebarNav icon={Medal} iconSize={24} link="/leaderboards" text="LEADERBOARDS" onClick={onNavigate} />
                    <SidebarNav icon={ShoppingBag} iconSize={24} link="/shop" text="SHOP" onClick={onNavigate} />
                    <SidebarNav icon={User} iconSize={24} link="/profile" text="PROFILE" onClick={onNavigate} />
                    <SidebarNav icon={FileText} iconSize={24} link="/documentation" text="DOCS" onClick={onNavigate} />
                </ul>
            </nav>

            {/* 3. Dedicated Scrollable Curriculum Tree (Only shown on learn / mobile drawer) */}
            {showLearningPath && (
                <div className="sidebar-curriculum-container">
                    <button
                        type="button"
                        className="sidebar-path-header"
                        onClick={() => setIsPathExpanded((prev) => !prev)}
                        aria-expanded={isPathExpanded}
                        title="Toggle curriculum levels tree"
                    >
                        <span className="sidebar-path-title">CURRICULUM TREE</span>
                        {isPathExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </button>

                    {isPathExpanded && (
                        <div className="sidebar-units-tree" ref={scrollContainerRef}>
                            {allUnits.map((unit, unitIdx) => {
                                const unitNum = unitIdx + 1;
                                const levels = unit.levels || unit.normalLevels || [];
                                const masteryLevel = unit.masteryLevel;
                                const isMasteryDone = masteryLevel ? isLevelCompleted(masteryLevel.id) : false;
                                const isMasteryActive = masteryLevel ? (activeLevelId === masteryLevel.id) : false;

                                return (
                                    <div key={unit.id} className="sidebar-unit-group">
                                        <div className="sidebar-unit-title-row">
                                            <span
                                                className="sidebar-unit-pill"
                                                style={{ backgroundColor: unit.color || "var(--color-primary)" }}
                                            >
                                                U{unitNum}
                                            </span>
                                            <span className="sidebar-unit-name" title={unit.title || unit.description}>
                                                {unit.title || unit.description}
                                            </span>
                                        </div>

                                        <div className="sidebar-unit-levels-list">
                                            {levels.map((lvl, lvlIdx) => {
                                                const isDone = isLevelCompleted(lvl.id);
                                                const isActive = activeLevelId === lvl.id;
                                                const subNum = lvlIdx + 1;

                                                return (
                                                    <button
                                                        key={lvl.id}
                                                        type="button"
                                                        data-sidebar-level-id={lvl.id}
                                                        className={`sidebar-level-item ${isActive ? "active" : ""} ${isDone ? "completed" : ""}`}
                                                        onClick={() => handleLevelClick(lvl.id)}
                                                        title={lvl.title}
                                                    >
                                                        <span className="sidebar-level-num">{unitNum}.{subNum}</span>
                                                        <span className="sidebar-level-label">{lvl.title}</span>
                                                        {isDone ? (
                                                            <CheckCircle2 size={13} className="sidebar-level-check" />
                                                        ) : isActive ? (
                                                            <span className="sidebar-level-active-badge">Current</span>
                                                        ) : (
                                                            <Lock size={12} className="sidebar-level-lock" />
                                                        )}
                                                    </button>
                                                );
                                            })}

                                            {/* Unit Mastery Challenge item */}
                                            {masteryLevel && (
                                                <button
                                                    type="button"
                                                    data-sidebar-level-id={masteryLevel.id}
                                                    className={`sidebar-level-item mastery-item ${isMasteryActive ? "active" : ""} ${isMasteryDone ? "completed" : ""}`}
                                                    onClick={() => handleLevelClick(masteryLevel.id)}
                                                    title={masteryLevel.title}
                                                >
                                                    <Trophy size={13} className={`sidebar-mastery-icon ${isMasteryDone ? "completed-trophy" : ""}`} />
                                                    <span className="sidebar-level-label">
                                                        {unitNum}.M Mastery Challenge
                                                    </span>
                                                    {isMasteryDone ? (
                                                        <CheckCircle2 size={13} className="sidebar-mastery-check" />
                                                    ) : isMasteryActive ? (
                                                        <span className="sidebar-level-active-badge mastery">Current</span>
                                                    ) : (
                                                        <Lock size={12} className="sidebar-level-lock" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* 4. Bottom User Account Card (Fixed to bottom, never covered) */}
            <div className="sidebar-account-footer">
                <button
                    type="button"
                    className="sidebar-account-btn"
                    onClick={handleAccountClick}
                    title="View Profile & Account"
                >
                    <div className="sidebar-account-avatar-wrap">
                        <User size={18} />
                    </div>
                    <div className="sidebar-account-info">
                        <span className="sidebar-account-name">{user?.display_name || "Learner"}</span>
                        <span className="sidebar-account-status">
                            <span className="status-cloud"><User size={11} /> Profile &amp; Stats</span>
                        </span>
                    </div>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;