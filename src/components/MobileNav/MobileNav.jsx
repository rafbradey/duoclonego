import { NavLink } from "react-router";
import "./MobileNav.css";
import {
    BookOpen,
    Dumbbell,
    Trophy,
    Medal,
    ShoppingBag,
    User
} from "lucide-react";

function MobileNav() {
    return (
        <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
            <NavLink
                to="/learn"
                className={({ isActive }) =>
                    `mobile-nav-item ${isActive ? "active" : ""}`
                }
                aria-label="Learn"
            >
                <BookOpen size={22} />
                <span className="mobile-nav-label">Learn</span>
            </NavLink>

            <NavLink
                to="/practice"
                className={({ isActive }) =>
                    `mobile-nav-item ${isActive ? "active" : ""}`
                }
                aria-label="Practice"
            >
                <Dumbbell size={22} />
                <span className="mobile-nav-label">Practice</span>
            </NavLink>

            <NavLink
                to="/quests"
                className={({ isActive }) =>
                    `mobile-nav-item ${isActive ? "active" : ""}`
                }
                aria-label="Quests"
            >
                <Trophy size={22} />
                <span className="mobile-nav-label">Quests</span>
            </NavLink>

            <NavLink
                to="/leaderboards"
                className={({ isActive }) =>
                    `mobile-nav-item ${isActive ? "active" : ""}`
                }
                aria-label="Leaderboards"
            >
                <Medal size={22} />
                <span className="mobile-nav-label">Ranks</span>
            </NavLink>

            <NavLink
                to="/shop"
                className={({ isActive }) =>
                    `mobile-nav-item ${isActive ? "active" : ""}`
                }
                aria-label="Shop"
            >
                <ShoppingBag size={22} />
                <span className="mobile-nav-label">Shop</span>
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    `mobile-nav-item ${isActive ? "active" : ""}`
                }
                aria-label="Profile"
            >
                <User size={22} />
                <span className="mobile-nav-label">Profile</span>
            </NavLink>
        </nav>
    );
}

export default MobileNav;
