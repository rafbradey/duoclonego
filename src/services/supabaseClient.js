import { createClient } from "@supabase/supabase-js";

const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : (globalThis.process?.env || {});

/**
 * LASA-Quest Demo Mode Configuration
 *
 * For the undergraduate thesis proposal presentation and defense, all live database
 * interactions are disabled by default. The application operates in 100% local demo mode,
 * persisting user progress, inventory, diamond balances, and shop purchases
 * directly in local JSON storage (localStorage), eliminating live network and database dependencies.
 *
 * To enable live cloud database syncing in future research increments, set:
 * VITE_ENABLE_LIVE_SUPABASE="true" in your .env file.
 */
export const IS_DEMO_MODE = env.VITE_ENABLE_LIVE_SUPABASE !== "true";

const DEFAULT_SUPABASE_URL = "https://itgdqyezvpjbpscvsokx.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Z2RxeWV6dnBqYnBzY3Zzb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjM0NTYsImV4cCI6MjEwNTEzOTQ1Nn0.RDYHAv0YWnCLvY2P9uFDKWpksuw9B8aF09AndfmHydo";

const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !IS_DEMO_MODE && Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    })
    : null;
