import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth, AUTH_STATUS } from "../../context/AuthContext.jsx";
import "./ProtectedRoute.css";

export default function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === AUTH_STATUS.INITIALIZING) {
        return (
            <div className="auth-loading-screen" role="status" aria-live="polite">
                <div className="auth-loading-content">
                    <div className="auth-loading-spinner" />
                    <h2 className="auth-loading-title">Loading Duoclongo...</h2>
                    <p className="auth-loading-subtitle">Verifying your session</p>
                </div>
            </div>
        );
    }

    if (status === AUTH_STATUS.UNAUTHENTICATED) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
