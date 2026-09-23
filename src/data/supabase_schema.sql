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

-- Schema and Table Grants for PostgREST API access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO anon, authenticated;
GRANT ALL ON TABLE public.level_attempts TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- ==============================================================================
-- 6. Phase 5A: Duoclongo Shop Extensions & Atomic Purchase RPC Functions
-- ==============================================================================

-- Add inventory and daily tracking columns to public.profiles if not present
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS streak_freeze_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE;

-- Atomic Heart Refill Purchase RPC Function
CREATE OR REPLACE FUNCTION public.buy_heart_refill(cost INTEGER DEFAULT 350)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    current_diamonds INTEGER;
    current_hearts INTEGER;
    uid UUID := auth.uid();
BEGIN
    IF uid IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthenticated');
    END IF;

    SELECT diamonds, hearts INTO current_diamonds, current_hearts
    FROM public.profiles
    WHERE id = uid
    FOR UPDATE;

    IF current_hearts >= 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Hearts already full');
    END IF;

    IF current_diamonds < cost THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient gems');
    END IF;

    UPDATE public.profiles
    SET diamonds = diamonds - cost,
        hearts = 5,
        updated_at = NOW()
    WHERE id = uid;

    RETURN jsonb_build_object(
        'success', true,
        'diamonds', current_diamonds - cost,
        'hearts', 5
    );
END;
$$;

-- Atomic Streak Freeze Purchase RPC Function
CREATE OR REPLACE FUNCTION public.buy_streak_freeze(cost INTEGER DEFAULT 400)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    current_diamonds INTEGER;
    current_freezes INTEGER;
    uid UUID := auth.uid();
BEGIN
    IF uid IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthenticated');
    END IF;

    SELECT diamonds, COALESCE(streak_freeze_count, 0) INTO current_diamonds, current_freezes
    FROM public.profiles
    WHERE id = uid
    FOR UPDATE;

    IF current_freezes >= 2 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Maximum streak freezes already equipped (2/2)');
    END IF;

    IF current_diamonds < cost THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient gems');
    END IF;

    UPDATE public.profiles
    SET diamonds = diamonds - cost,
        streak_freeze_count = current_freezes + 1,
        updated_at = NOW()
    WHERE id = uid;

    RETURN jsonb_build_object(
        'success', true,
        'diamonds', current_diamonds - cost,
        'streak_freeze_count', current_freezes + 1
    );
END;
$$;

