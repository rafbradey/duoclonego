import "./RightInfoBar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCurrentUser } from "../../services/userService.js";

import userAvatar from "../../assets/avatars/default_avatar_male.png";
import streakIcon from "../../assets/items/fire_streak.png";
import heartIcon from "../../assets/items/heart.png";
import diamondIcon from "../../assets/items/diamond.png";

function RightInfoBar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function loadUserInfo() {
            try {
                const data = await getCurrentUser();
                if (isMounted && data) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Failed to load user info:", err);
            }
        }
        loadUserInfo();

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

    if (!user) {
        return (
            <aside className="right-info-main" aria-label="User Statistics">
                <div className="right-info-loading body-text-muted">Loading profile...</div>
            </aside>
        );
    }

    return (
        <aside className="right-info-main" aria-label="User Statistics">
            <div className="user-stats-bar">
                <div className="user-stat" title="Current Day Streak">
                    <img src={streakIcon} alt="Streak" className="user-stat-icon" />
                    <span className="user-stat-value">{user.streak}</span>
                </div>

                <Link to="/shop" className="user-stat user-stat-link" title="Hearts Remaining — Click to visit Shop">
                    <img src={heartIcon} alt="Hearts" className="user-stat-icon" />
                    <span className="user-stat-value">{user.hearts}</span>
                </Link>

                <Link to="/shop" className="user-stat user-stat-link" title="Gems / Diamonds — Click to visit Shop">
                    <img src={diamondIcon} alt="Diamonds" className="user-stat-icon" />
                    <span className="user-stat-value">{user.diamonds}</span>
                </Link>
            </div>

            <Link to="/profile" className="user-profile-card" title="View Profile">
                <img src={userAvatar} alt={`${user.display_name}'s avatar`} className="user-profile-avatar" />
                <div className="user-profile-details">
                    <span className="user-profile-name">{user.display_name}</span>
                    <span className="user-profile-username">@{user.username}</span>
                </div>
            </Link>
        </aside>
    );
}

export default RightInfoBar;