import { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { Link, useLocation, useNavigate } from "react-router";
import SidebarNav from "../SidebarNav/SidebarNav.jsx";
import Mascot from "../Mascot/Mascot.jsx";
import { allUnits } from "../../data/levels/index.js";
import { getCurrentUser } from "../../services/userService.js";
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
    MapPin,
    CheckCircle2,
    Cloud,
    CloudOff
} from "lucide-react";
import AuthModal from "../AuthModal/AuthModal.jsx";

function Sidebar({ onNavigate, isMobileDrawer = false }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isLearnRoute = location.pathname === "/learn";
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [activeLevelId, setActiveLevelId] = useState("");
    const [isLevelsTreeExpanded, setIsLevelsTreeExpanded] = useState(true);
    const sidebarRef = useRef(null);
    const activeLevelIdRef = useRef("");

    // Ensure the active level item remains within comfortable visible bounds of the sidebar
    const ensureLevelVisible = (levelId) => {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;

        requestAnimationFrame(() => {
            const targetBtn = sidebar.querySelector(`[data-sidebar-level-id="${levelId}"]`);
            if (!targetBtn) return;

            const sidebarRect = sidebar.getBoundingClientRect();
            const btnRect = targetBtn.getBoundingClientRect();

            // Comfortable viewing padding from top and bottom boundaries
            const topComfortPadding = 64;
            const bottomComfortPadding = 48;

            if (btnRect.top < sidebarRect.top + topComfortPadding) {
                const delta = btnRect.top - (sidebarRect.top + topComfortPadding);
                sidebar.scrollBy({ top: delta, behavior: "smooth" });
            } else if (btnRect.bottom > sidebarRect.bottom - bottomComfortPadding) {
                const delta = btnRect.bottom - (sidebarRect.bottom - bottomComfortPadding);
                sidebar.scrollBy({ top: delta, behavior: "smooth" });
            }
        });
    };

    // Load user for completed level checkmarks
    useEffect(() => {
        let isMounted = true;
        async function loadUser() {
            try {
                const data = await getCurrentUser();
                if (isMounted && data) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Failed to load user in Sidebar:", err);
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

    return (
        <aside className="sidebar" ref={sidebarRef} aria-label="Main Navigation">
            <div className="sidebar-header">
                <Link to="/learn" className="sidebar-logo-link" onClick={onNavigate}>
                    <Mascot mascotType="shadow" size={36} flipped={false} animationType="none" />
                    <span className="sidebar-logo-text">duoclongo</span>
                </Link>
            </div>

            <nav className="sidebar-nav">
                {!isMobileDrawer && (
                    <ul className="sidebar-links-list">
                        <SidebarNav icon={BookOpen} iconSize={24} link="/learn" text="LEARN" onClick={onNavigate} />
                        <SidebarNav icon={Dumbbell} iconSize={24} link="/practice" text="PRACTICE" onClick={onNavigate} />
                        <SidebarNav icon={Trophy} iconSize={24} link="/quests" text="QUESTS" onClick={onNavigate} />
                        <SidebarNav icon={Medal} iconSize={24} link="/leaderboards" text="LEADERBOARDS" onClick={onNavigate} />
                        <SidebarNav icon={ShoppingBag} iconSize={24} link="/shop" text="SHOP" onClick={onNavigate} />
                        <SidebarNav icon={User} iconSize={24} link="/profile" text="PROFILE" onClick={onNavigate} />
                        <SidebarNav icon={FileText} iconSize={24} link="/documentation" text="DOCS" onClick={onNavigate} />
                    </ul>
                )}

                {/* Dedicated Learning Path Levels Scroll-Spy Tree */}
                {showLearningPath && (
                    <div className={`sidebar-levels-section ${isMobileDrawer ? "mobile-drawer-mode" : ""}`}>
                        {isMobileDrawer ? (
                            <div className="sidebar-levels-drawer-header">
                                <div className="sidebar-levels-toggle-title">
                                    <MapPin size={18} className="sidebar-levels-pin-icon" />
                                    <span>LEARNING PATH</span>
                                </div>
                                <span className="sidebar-levels-drawer-subtitle">Select a level to navigate</span>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="sidebar-levels-toggle"
                                onClick={() => setIsLevelsTreeExpanded((prev) => !prev)}
                                aria-expanded={isLevelsTreeExpanded}
                            >
                                <div className="sidebar-levels-toggle-title">
                                    <MapPin size={16} className="sidebar-levels-pin-icon" />
                                    <span>LEARNING PATH</span>
                                </div>
                                {isLevelsTreeExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}

                        {(isMobileDrawer || isLevelsTreeExpanded) && (
                            <div className="sidebar-levels-tree">
                                {allUnits.map((unit, unitIdx) => {
                                    const normalLevels = unit.normalLevels || (unit.levels || []).filter((l) => l.type === "level");
                                    const masteryLevel = unit.masteryLevel || (unit.levels || []).find((l) => l.type === "unit_mastery");
                                    const unitNum = unitIdx + 1;
                                    const isMasteryDone = masteryLevel ? isLevelCompleted(masteryLevel.id) : false;
                                    const isMasteryActive = masteryLevel ? activeLevelId === masteryLevel.id : false;

                                    return (
                                        <div key={unit.id} className="sidebar-unit-group">
                                            <div className="sidebar-unit-header">
                                                <span className="sidebar-unit-tag">UNIT {unitNum}</span>
                                                <span className="sidebar-unit-name" title={unit.description}>
                                                    {unit.description || unit.title}
                                                </span>
                                            </div>

                                            <div className="sidebar-levels-list">
                                                {normalLevels.map((lvl, lvlIdx) => {
                                                    const isActive = activeLevelId === lvl.id;
                                                    const isCompleted = isLevelCompleted(lvl.id);
                                                    return (
                                                        <button
                                                            key={lvl.id}
                                                            type="button"
                                                            data-sidebar-level-id={lvl.id}
                                                            className={`sidebar-level-btn ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                                                            onClick={() => handleLevelClick(lvl.id)}
                                                            title={lvl.title}
                                                        >
                                                            {isCompleted ? (
                                                                <CheckCircle2 size={14} className="sidebar-level-completed-icon" />
                                                            ) : (
                                                                <span className="sidebar-level-dot" />
                                                            )}
                                                            <span className="sidebar-level-label">
                                                                {unitNum}.{lvlIdx + 1} {lvl.title}
                                                            </span>
                                                            {isActive && <span className="sidebar-level-active-badge">Current</span>}
                                                        </button>
                                                    );
                                                })}

                                                {masteryLevel && (
                                                    <button
                                                        type="button"
                                                        data-sidebar-level-id={masteryLevel.id}
                                                        className={`sidebar-level-btn sidebar-mastery-btn ${isMasteryActive ? "active" : ""} ${isMasteryDone ? "completed" : ""}`}
                                                        onClick={() => handleLevelClick(masteryLevel.id)}
                                                        title={masteryLevel.title}
                                                    >
                                                        <Trophy size={14} className={`sidebar-mastery-icon ${isMasteryDone ? "completed-trophy" : ""}`} />
                                                        <span className="sidebar-level-label">
                                                            {unitNum}.M Mastery Challenge
                                                        </span>
                                                        {isMasteryDone ? (
                                                            <CheckCircle2 size={13} className="sidebar-mastery-check" />
                                                        ) : isMasteryActive ? (
                                                            <span className="sidebar-level-active-badge mastery">Current</span>
                                                        ) : null}
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
            </nav>

            <div className="sidebar-account-footer">
                <button
                    type="button"
                    className="sidebar-account-btn"
                    onClick={() => setIsAuthModalOpen(true)}
                    title={user?.is_cloud ? "Cloud Synced account" : "Click to Sign In and sync your progress"}
                >
                    <div className="sidebar-account-avatar-wrap">
                        <User size={18} />
                    </div>
                    <div className="sidebar-account-info">
                        <span className="sidebar-account-name">{user?.display_name || "Guest Learner"}</span>
                        <span className="sidebar-account-status">
                            {user?.is_cloud ? (
                                <span className="status-cloud"><Cloud size={11} /> Synced</span>
                            ) : (
                                <span className="status-guest"><CloudOff size={11} /> Guest (Sync)</span>
                            )}
                        </span>
                    </div>
                </button>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </aside>
    );
}

export default Sidebar;