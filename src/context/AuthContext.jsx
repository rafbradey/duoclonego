/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase, isSupabaseConfigured } from "../services/supabaseClient.js";
import { getCurrentUser } from "../services/userService.js";
import { signIn as apiSignIn, signUp as apiSignUp, signOut as apiSignOut } from "../services/authService.js";

const AuthContext = createContext(null);

import { AUTH_STATUS } from "./authConstants.js";
export { AUTH_STATUS };

export function AuthProvider({ children }) {
    const [status, setStatus] = useState(AUTH_STATUS.INITIALIZING);
    const [authUser, setAuthUser] = useState(null);
    const [profile, setProfile] = useState(null);

    // Initial session discovery & Supabase event subscription
    useEffect(() => {
        let isMounted = true;

        async function initAuth() {
            if (!isSupabaseConfigured || !supabase) {
                if (isMounted) setStatus(AUTH_STATUS.UNAUTHENTICATED);
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (!error && session?.user) {
                    if (isMounted) {
                        setAuthUser(session.user);
                        const userProfile = await getCurrentUser();
                        setProfile(userProfile);
                        setStatus(AUTH_STATUS.AUTHENTICATED);
                    }
                } else {
                    if (isMounted) {
                        setAuthUser(null);
                        setProfile(null);
                        setStatus(AUTH_STATUS.UNAUTHENTICATED);
                    }
                }
            } catch (err) {
                console.warn("Auth initialization notice:", err);
                if (isMounted) {
                    setAuthUser(null);
                    setProfile(null);
                    setStatus(AUTH_STATUS.UNAUTHENTICATED);
                }
            }
        }

        initAuth();

        // Listen to Supabase Auth state changes
        const { data: { subscription } } = supabase
            ? supabase.auth.onAuthStateChange(async (event, session) => {
                if (!isMounted) return;

                if (session?.user && (
                    event === "SIGNED_IN" ||
                    event === "INITIAL_SESSION" ||
                    event === "TOKEN_REFRESHED" ||
                    event === "USER_UPDATED"
                )) {
                    setAuthUser(session.user);
                    const userProfile = await getCurrentUser();
                    setProfile(userProfile);
                    setStatus(AUTH_STATUS.AUTHENTICATED);
                } else if (event === "SIGNED_OUT" || !session?.user) {
                    setAuthUser(null);
                    setProfile(null);
                    setStatus(AUTH_STATUS.UNAUTHENTICATED);
                }
            })
            : { data: { subscription: { unsubscribe: () => {} } } };

        // Listen to domain progress updates (e.g., XP earned, level completed)
        const handleUserUpdated = (e) => {
            if (isMounted && e.detail?.user) {
                setProfile(e.detail.user);
            }
        };
        window.addEventListener("duoclongo:user-updated", handleUserUpdated);

        return () => {
            isMounted = false;
            subscription?.unsubscribe();
            window.removeEventListener("duoclongo:user-updated", handleUserUpdated);
        };
    }, []);

    const signIn = async ({ email, password }) => {
        const result = await apiSignIn({ email, password });
        if (result.error) throw result.error;
        return result;
    };

    const signUp = async ({ email, password, username, displayName }) => {
        const result = await apiSignUp({ email, password, username, displayName });
        if (result.error) throw result.error;
        return result;
    };

    const signOut = async () => {
        await apiSignOut();
        setAuthUser(null);
        setProfile(null);
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
    };

    const value = useMemo(() => ({
        status,
        isLoading: status === AUTH_STATUS.INITIALIZING,
        isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
        authUser,
        profile,
        user: profile,
        signIn,
        signUp,
        signOut
    }), [status, authUser, profile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
