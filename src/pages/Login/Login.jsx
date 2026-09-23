import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { LogIn, UserPlus, AlertCircle, Check, Loader2, ArrowLeft } from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import { useAuth, AUTH_STATUS } from "../../context/AuthContext.jsx";
import { isSupabaseConfigured } from "../../services/supabaseClient.js";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { status, signIn, signUp } = useAuth();

    const [mode, setMode] = useState("signin"); // "signin" | "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Target route to return to after successful authentication
    const destination = location.state?.from?.pathname || "/learn";

    // If already authenticated, redirect to destination
    useEffect(() => {
        if (status === AUTH_STATUS.AUTHENTICATED) {
            navigate(destination, { replace: true });
        }
    }, [status, navigate, destination]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            if (!isSupabaseConfigured) {
                throw new Error("Application configuration is pending. Please try again later.");
            }

            if (mode === "signup") {
                if (!email || !password) {
                    throw new Error("Please provide both email and password.");
                }
                if (password.length < 6) {
                    throw new Error("Password must be at least 6 characters long.");
                }

                const result = await signUp({
                    email,
                    password,
                    username: username.trim() || undefined,
                    displayName: displayName.trim() || undefined
                });

                if (result?.session) {
                    setSuccessMessage("Account created successfully! Taking you to learning...");
                } else {
                    setSuccessMessage("Account created! Please check your email inbox to confirm your registration before signing in.");
                    setMode("signin");
                }
            } else {
                if (!email || !password) {
                    throw new Error("Please enter your email and password.");
                }

                await signIn({ email, password });
                setSuccessMessage("Welcome back! Taking you to learning...");
            }
        } catch (err) {
            console.error("Authentication error:", err);
            let msg = err.message || "An unexpected error occurred. Please check your details and try again.";
            const lower = msg.toLowerCase();
            if (lower.includes("email not confirmed")) {
                msg = "Please confirm your email address before signing in. Check your inbox for the confirmation link.";
            } else if (lower.includes("invalid login credentials")) {
                msg = "Invalid email or password. Please verify your credentials and try again.";
            }
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <header className="login-page-header">
                <Link to="/" className="login-back-link">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </Link>
                <Link to="/" className="login-header-brand">
                    <Mascot mascotType="shadow" size={32} flipped={false} animationType="none" />
                    <span className="login-brand-title">duoclongo</span>
                </Link>
            </header>

            <main className="login-main">
                <div className="login-card duo-card">
                    <div className="login-card-header">
                        <div className="login-mascot-container">
                            <Mascot
                                mascotType={mode === "signin" ? "default" : "grad"}
                                size={96}
                                animationType={isLoading ? "pulse" : "bounce"}
                            />
                        </div>
                        <h1 className="login-title heading-md">
                            {mode === "signin" ? "Sign in to Duoclongo" : "Create your account"}
                        </h1>
                        <p className="login-subtitle body-text-muted">
                            {mode === "signin"
                                ? "Keep your progress, XP, and learning streak saved."
                                : "Save your progress and keep your learning streak going."}
                        </p>
                    </div>

                    <div className="login-tabs" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === "signin"}
                            className={`login-tab-btn ${mode === "signin" ? "active" : ""}`}
                            onClick={() => {
                                setMode("signin");
                                setErrorMessage("");
                                setSuccessMessage("");
                            }}
                        >
                            <LogIn size={16} />
                            <span>SIGN IN</span>
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === "signup"}
                            className={`login-tab-btn ${mode === "signup" ? "active" : ""}`}
                            onClick={() => {
                                setMode("signup");
                                setErrorMessage("");
                                setSuccessMessage("");
                            }}
                        >
                            <UserPlus size={16} />
                            <span>CREATE ACCOUNT</span>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="login-alert error" role="alert">
                            <AlertCircle size={18} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="login-alert success" role="status">
                            <Check size={18} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <>
                                <div className="login-form-group">
                                    <label className="login-label" htmlFor="login-username">
                                        Username
                                    </label>
                                    <input
                                        id="login-username"
                                        type="text"
                                        className="login-input"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                        autoComplete="username"
                                    />
                                </div>

                                <div className="login-form-group">
                                    <label className="login-label" htmlFor="login-display-name">
                                        Name or Title
                                    </label>
                                    <input
                                        id="login-display-name"
                                        type="text"
                                        className="login-input"
                                        placeholder="e.g. Alex, PharmD"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        disabled={isLoading}
                                        autoComplete="name"
                                    />
                                </div>
                            </>
                        )}

                        <div className="login-form-group">
                            <label className="login-label" htmlFor="login-email">
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                className="login-input"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>

                        <div className="login-form-group">
                            <label className="login-label" htmlFor="login-password">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                className="login-input"
                                placeholder="At least 6 characters"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                            />
                        </div>

                        <button
                            type="submit"
                            className="duo-button duo-button-primary login-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="login-spinner" />
                                    <span>{mode === "signin" ? "SIGNING IN..." : "CREATING ACCOUNT..."}</span>
                                </>
                            ) : (
                                <>
                                    {mode === "signin" ? <LogIn size={18} /> : <UserPlus size={18} />}
                                    <span>{mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer-info">
                        <span>Your progress will be saved to your account.</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
