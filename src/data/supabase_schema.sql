-- ==============================================================================
-- Duoclongo Phase 4: Supabase Database Schema & Row Level Security (RLS)
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/itgdqyezvpjbpscvsokx/sql/new
-- ==============================================================================

-- 1. Create Profiles table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar TEXT DEFAULT 'default_male',
    level INTEGER DEFAULT 1,
    hearts INTEGER DEFAULT 5,
    streak INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    diamonds INTEGER DEFAULT 1200,
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    unlocked_badges JSONB DEFAULT '[]'::jsonb,
    mistakes_queue JSONB DEFAULT '[]'::jsonb,
    practice_sessions_completed INTEGER DEFAULT 0,
    srs_records JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast username queries
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. Create Level Attempts Table (Audit log for research analytics)
CREATE TABLE IF NOT EXISTS public.level_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    level_id TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    accuracy NUMERIC(5, 2) DEFAULT 0.0,
    xp_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_level_attempts_user_id ON public.level_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_level_attempts_level_id ON public.level_attempts(level_id);

-- 3. Automated User Provisioning Trigger
-- Automatically creates a public.profiles row whenever a user registers in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        username,
        display_name,
        avatar
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar', 'default_male')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Automatically update 'updated_at' column
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies:
-- Allow users to view profiles (needed for leaderboards/public showcase in Phase 5)
DROP POLICY IF EXISTS "Profiles are readable by authenticated and anon users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated and anon users"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to update strictly their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Level Attempts RLS Policies:
-- Users can only view their own attempts
DROP POLICY IF EXISTS "Users can view own level attempts" ON public.level_attempts;
CREATE POLICY "Users can view own level attempts"
    ON public.level_attempts
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only record their own level attempts
DROP POLICY IF EXISTS "Users can insert own level attempts" ON public.level_attempts;
CREATE POLICY "Users can insert own level attempts"
    ON public.level_attempts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
