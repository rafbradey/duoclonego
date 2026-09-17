import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Flame, Heart } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar.jsx";
import MobileNav from "../MobileNav/MobileNav.jsx";
import Mascot from "../Mascot/Mascot.jsx";
import { getCurrentUser } from "../../services/userService.js";
import "./AppLayout.css";

function AppLayout() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    const [prevPath, setPrevPath] = useState(location.pathname);
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        }
    }

    // Close drawer on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isDrawerOpen) {
                setIsDrawerOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDrawerOpen]);

    // Lock body scrolling when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isDrawerOpen]);

    // Load and listen to user updates for mobile header stats
    useEffect(() => {
        let isMounted = true;
        async function loadUser() {
            try {
                const data = await getCurrentUser();
                if (isMounted && data) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Failed to load user in AppLayout:", err);
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

    return (
        <div className="app-layout-root">
            {/* Desktop Sidebar Column */}
            <div className="app-sidebar-column">
                <Sidebar />
            </div>

            {/* Mobile Header (visible only on <= 768px) */}
            <header className="app-mobile-header" aria-label="Mobile Header">
                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={() => setIsDrawerOpen(true)}
                    aria-label="Open navigation menu"
                    aria-expanded={isDrawerOpen}
                >
                    <Menu size={24} />
                </button>

                <Link to="/learn" className="mobile-brand-link" aria-label="Duoclongo Home">
                    <Mascot mascotType="shadow" size={28} flipped={false} animationType="none" />
                    <span className="mobile-brand-title">duoclongo</span>
                </Link>

                <div className="mobile-header-stats">
                    <div className="mobile-stat-item streak" title="Current Day Streak">
                        <Flame size={18} className="mobile-stat-icon-streak" />
                        <span className="mobile-stat-value">{user?.streak ?? 0}</span>
                    </div>
                    <Link to="/shop" className="mobile-stat-item hearts" title="Hearts Remaining — Tap to Visit Shop">
                        <Heart size={18} className="mobile-stat-icon-heart" />
                        <span className="mobile-stat-value">{user?.hearts ?? 5}</span>
                    </Link>
                </div>
            </header>

            {/* Mobile Navigation Drawer Overlay */}
            {isDrawerOpen && (
                <div className="mobile-drawer-overlay">
                    <div
                        className="mobile-drawer-backdrop"
                        onClick={() => setIsDrawerOpen(false)}
                        role="presentation"
                        aria-hidden="true"
                    />

                    <div
                        className="mobile-drawer-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Learning Path"
                    >
                        <div className="mobile-drawer-top">
                            <Link
                                to="/learn"
                                className="mobile-drawer-brand"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <Mascot mascotType="shadow" size={28} flipped={false} animationType="none" />
                                <span className="mobile-drawer-title">Learning Path</span>
                            </Link>

                            <button
                                type="button"
                                className="mobile-drawer-close-btn"
                                onClick={() => setIsDrawerOpen(false)}
                                aria-label="Close navigation menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mobile-drawer-body">
                            <Sidebar onNavigate={() => setIsDrawerOpen(false)} isMobileDrawer={true} />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Application Content */}
            <main className="app-main-viewport">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <MobileNav />
        </div>
    );
}

export default AppLayout;
