-- ============================================================
-- TRADESHIFTERS — Supabase Schema
-- Bangladesh Export Platform · Phase 1 MVP
-- ============================================================
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: user_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  company_name  TEXT,
  business_type TEXT,             -- e.g. 'manufacturer', 'trader', 'service'
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_profiles IS 'Extended profile data for authenticated exporters';

-- ============================================================
-- TABLE: assessment_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Step 1: Region selection
  selected_regions  TEXT[] DEFAULT '{}',              -- e.g. ['usa_canada', 'eu']

  -- Step 2: KYC status
  kyc_payoneer      JSONB DEFAULT '{}'::JSONB,        -- { item_id: boolean }
  kyc_alibaba       JSONB DEFAULT '{}'::JSONB,        -- { item_id: boolean }
  kyc_completed_at  TIMESTAMPTZ,

  -- Step 3: AI interview
  ai_interview_data JSONB DEFAULT '{}'::JSONB,        -- AIInterviewData shape
  interview_completed_at TIMESTAMPTZ,

  -- Step 4: Report
  report_generated  BOOLEAN DEFAULT FALSE,
  report_data       JSONB DEFAULT '{}'::JSONB,        -- ExportOpportunityReport shape
  report_generated_at TIMESTAMPTZ,

  -- Meta
  status            TEXT NOT NULL DEFAULT 'draft',    -- draft | kyc | interview | report | complete
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.assessment_sessions IS 'Tracks each exporter assessment session through 4 phases';

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id
  ON public.assessment_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_status
  ON public.assessment_sessions(status);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_created_at
  ON public.assessment_sessions(created_at DESC);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_assessment_sessions_updated_at
  BEFORE UPDATE ON public.assessment_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;

-- user_profiles: users can only see/edit their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- assessment_sessions: users can only CRUD their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.assessment_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON public.assessment_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.assessment_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.assessment_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- GRANT permissions to authenticated users
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.user_profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.assessment_sessions TO authenticated;
