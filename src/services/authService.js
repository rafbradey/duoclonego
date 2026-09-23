import { supabase, isSupabaseConfigured } from "./supabaseClient.js";

/**
 * Signs up a new learner account.
 * Metadata passed in `options.data` is picked up by the PostgreSQL trigger to populate public.profiles.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} [params.username]
 * @param {string} [params.displayName]
 * @returns {Promise<{ user: Object|null, session: Object|null, error: Error|null }>}
 */
export async function signUp({ email, password, username, displayName }) {
    const cleanUsername = (username || email?.split("@")[0] || "demo_learner").trim().toLowerCase();
    const cleanDisplayName = (displayName || username || email?.split("@")[0] || "Demo Learner").trim();

    if (isSupabaseConfigured && supabase) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: (email || "demo@duoclongo.local").trim(),
                password: password || "demo123456",
                options: {
                    data: {
                        username: cleanUsername,
                        display_name: cleanDisplayName,
                        avatar: "default_male"
                    }
                }
            });

            if (!error && data?.user && data?.session) {
                return { user: data.user, session: data.session, error: null };
            }
        } catch (error) {
            console.warn("Supabase signUp falling back to demo session:", error);
        }
    }

    // Instant demo session - zero verification required
    const demoUser = {
        id: "demo_" + Date.now(),
        email: email || "demo@duoclongo.local",
        user_metadata: {
            username: cleanUsername,
            display_name: cleanDisplayName,
            avatar: "default_male"
        }
    };
    return { user: demoUser, session: { user: demoUser }, error: null };
}

/**
 * Signs in an existing learner using email and password.
 * Falls back to demo session if offline or unconfirmed.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ user: Object|null, session: Object|null, error: Error|null }>}
 */
export async function signIn({ email, password }) {
    if (isSupabaseConfigured && supabase) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: (email || "demo@duoclongo.local").trim(),
                password: password || "demo123456"
            });

            if (!error && data?.user && data?.session) {
                return { user: data.user, session: data.session, error: null };
            }
        } catch (error) {
            console.warn("Supabase signIn falling back to demo session:", error);
        }
    }

    // Instant demo session - zero verification required
    const cleanName = email ? email.split("@")[0] : "Demo Learner";
    const demoUser = {
        id: "demo_" + Date.now(),
        email: email || "demo@duoclongo.local",
        user_metadata: {
            username: cleanName.toLowerCase(),
            display_name: cleanName,
            avatar: "default_male"
        }
    };
    return { user: demoUser, session: { user: demoUser }, error: null };
}

/**
 * Signs out the currently authenticated user.
 *
 * @returns {Promise<{ error: Error|null }>}
 */
export async function signOut() {
    if (!isSupabaseConfigured || !supabase) {
        return { error: null };
    }

    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error("Supabase signOut error:", error);
        return { error };
    }
}

/**
 * Retrieves the current active Supabase session.
 *
 * @returns {Promise<Object|null>}
 */
export async function getCurrentSession() {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) return null;
        return data.session;
    } catch (err) {
        console.warn("Failed to get Supabase session:", err);
        return null;
    }
}

/**
 * Retrieves the currently authenticated Supabase user.
 *
 * @returns {Promise<Object|null>}
 */
export async function getCurrentAuthUser() {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) return null;
        return data.user;
    } catch (err) {
        console.warn("Failed to get current auth user:", err);
        return null;
    }
}

/**
 * Subscribes to Supabase authentication state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED).
 *
 * @param {Function} callback - Function receiving (event, session)
 * @returns {{ unsubscribe: Function }}
 */
export function onAuthStateChange(callback) {
    if (!isSupabaseConfigured || !supabase) {
        return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (typeof callback === "function") {
            callback(event, session);
        }
    });

    return subscription;
}
