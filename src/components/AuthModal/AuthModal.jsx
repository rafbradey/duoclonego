import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, LogIn, UserPlus, Cloud, Check, AlertCircle, Sparkles, Loader2, LogOut, User } from "lucide-react";
import Mascot from "../Mascot/Mascot.jsx";
import { signIn, signUp, signOut } from "../../services/authService.js";
import { syncLocalProgressToCloud, getCurrentUser } from "../../services/userService.js";
import "./AuthModal.css";

function AuthModal({ isOpen, onClose, initialMode = "signin" }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
    const [currentUser, setCurrentUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [mergeLocalProgress, setMergeLocalProgress] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        let isMounted = true;
        getCurrentUser().then((u) => {
            if (isMounted) setCurrentUser(u);
        });
        return () => { isMounted = false; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            if (mode === "signup") {
                await signUp({
                    email: email || "demo@duoclongo.local",
                    password: password || "demo123456",
                    username,
                    displayName
                });
                setSuccessMessage("Account created and ready!");
                if (mergeLocalProgress) {
                    await syncLocalProgressToCloud();
                }
                setTimeout(() => {
                    onClose();
                }, 400);
            } else {
                await signIn({
                    email: email || "demo@duoclongo.local",
                    password: password || "demo123456"
                });
                setSuccessMessage("Welcome back! Demo session active.");
                if (mergeLocalProgress) {
                    await syncLocalProgressToCloud();
                }
                setTimeout(() => {
                    onClose();
                }, 400);
            }
        } catch (err) {
            console.warn("Auth note:", err);
            setSuccessMessage("Demo mode active!");
            setTimeout(() => {
                onClose();
            }, 400);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <div className="auth-header">
                    <div className="auth-header-title">
                        <Cloud className="auth-header-icon" size={24} />
                        <div>
                            <h2 className="heading-md" style={{ margin: 0 }}>
                                {mode === "signin" ? "Welcome Back" : "Create Learner Account"}
                            </h2>
                            <span className="auth-subtitle">
                                {mode === "signin"
                                    ? "Sign in to sync your LASA progress across devices"
                                    : "Save your XP, streak, and Spaced Repetition mastery to the cloud"}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="auth-close-btn"
                        onClick={onClose}
                        aria-label="Close authentication modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="auth-body">
                    {currentUser?.is_cloud ? (
                        <div className="auth-signed-in-state" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "center" }}>
                            <div className="auth-mascot-row">
                                <Mascot mascotType="party" size={90} animationType="bounce" />
                            </div>
                            <div>
                                <h3 className="heading-md" style={{ margin: "0 0 0.35rem 0" }}>
                                    You're Already Signed In!
                                </h3>
                                <p className="body-text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                                    Connected as <strong>{currentUser.display_name}</strong> ({currentUser.email})
                                </p>
                            </div>

                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <span className="profile-sync-pill cloud" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                                    <Cloud size={14} style={{ marginRight: "0.25rem" }} />
                                    <span>Cloud Synchronization Active</span>
                                </span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                                <button
                                    type="button"
                                    className="duo-btn duo-btn-primary"
                                    style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "0.5rem" }}
                                    onClick={() => {
                                        navigate("/profile");
                                        onClose();
                                    }}
                                >
                                    <User size={18} />
                                    <span>View My Profile</span>
                                </button>
                                <button
                                    type="button"
                                    className="duo-btn duo-btn-secondary"
                                    style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "0.5rem" }}
                                    onClick={async () => {
                                        await signOut();
                                        setCurrentUser(null);
                                        onClose();
                                    }}
                                >
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="auth-mascot-row">
                                <Mascot
                                    mascotType={mode === "signin" ? "default" : "grad"}
                                    size={90}
                                    animationType={isLoading ? "pulse" : "bounce"}
                                />
                            </div>

                    <div className="auth-mode-tabs">
                        <button
                            type="button"
                            className={`auth-tab ${mode === "signin" ? "active" : ""}`}
                            onClick={() => {
                                setMode("signin");
                                setErrorMessage("");
                                setSuccessMessage("");
                            }}
                        >
                            <LogIn size={16} />
                            <span>Sign In</span>
                        </button>
                        <button
                            type="button"
                            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                            onClick={() => {
                                setMode("signup");
                                setErrorMessage("");
                                setSuccessMessage("");
                            }}
                        >
                            <UserPlus size={16} />
                            <span>Create Account</span>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="auth-alert error">
                            <AlertCircle size={18} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="auth-alert success">
                            <Check size={18} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <>
                                <div className="auth-form-group">
                                    <label className="auth-label" htmlFor="auth-username">
                                        Username
                                    </label>
                                    <input
                                        id="auth-username"
                                        type="text"
                                        className="auth-input"
                                        placeholder="e.g. pharm_student"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="auth-form-group">
                                    <label className="auth-label" htmlFor="auth-display-name">
                                        Full Name or Display Name
                                    </label>
                                    <input
                                        id="auth-display-name"
                                        type="text"
                                        className="auth-input"
                                        placeholder="e.g. Jane Doe, PharmD Candidate"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </>
                        )}

                        <div className="auth-form-group">
                            <label className="auth-label" htmlFor="auth-email">
                                Email Address
                            </label>
                            <input
                                id="auth-email"
                                type="email"
                                className="auth-input"
                                placeholder="name@domain.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label" htmlFor="auth-password">
                                Password
                            </label>
                            <input
                                id="auth-password"
                                type="password"
                                className="auth-input"
                                placeholder="At least 6 characters"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <label className="auth-checkbox-label">
                            <input
                                type="checkbox"
                                checked={mergeLocalProgress}
                                onChange={(e) => setMergeLocalProgress(e.target.checked)}
                                disabled={isLoading}
                            />
                            <span>
                                <Sparkles size={14} style={{ color: "var(--color-primary)", marginRight: "0.25rem", verticalAlign: "middle" }} />
                                Automatically merge current local guest progress &amp; SRS records to cloud
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="duo-btn duo-btn-primary auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="auth-spinner" />
                                    <span>{mode === "signin" ? "Signing In..." : "Creating Account..."}</span>
                                </>
                            ) : (
                                <>
                                    {mode === "signin" ? <LogIn size={18} /> : <UserPlus size={18} />}
                                    <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                                </>
                            )}
                        </button>
                    </form>
                    </>
                )}
                </div>
            </div>
        </div>
    );
}

export default AuthModal;
