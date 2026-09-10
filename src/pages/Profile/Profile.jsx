import { useEffect, useState } from "react";
import { Shield, Flame, Gem, Award, Calendar } from "lucide-react";
import { getCurrentUser } from "../../services/userService.js";
import userAvatar from "../../assets/avatars/default_avatar_male.png";
import "./Profile.css";

function Profile() {
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
            <header className="profile-header-card duo-card">
                <img
                    src={userAvatar}
                    alt={`${user.display_name}'s avatar`}
                    className="profile-avatar-large"
                />
                <div className="profile-info-block">
                    <h1 className="heading-lg">{user.display_name}</h1>
                    <span className="profile-username-tag">@{user.username}</span>
                    <div className="profile-joined-date">
                        <Calendar size={16} />
                        <span>Joined {memberSince}</span>
                    </div>
                </div>
            </header>

            <section className="profile-stats-grid">
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
                        <span className="profile-stat-label">Current Mastery</span>
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
        </div>
    );
}

export default Profile;