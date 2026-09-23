import { createClient } from "@supabase/supabase-js";

const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : (globalThis.process?.env || {});
// Public Supabase configuration for Duoclongo client app
const DEFAULT_SUPABASE_URL = "https://itgdqyezvpjbpscvsokx.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Z2RxeWV6dnBqYnBzY3Zzb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjM0NTYsImV4cCI6MjEwNTEzOTQ1Nn0.RDYHAv0YWnCLvY2P9uFDKWpksuw9B8aF09AndfmHydo";

const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
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
