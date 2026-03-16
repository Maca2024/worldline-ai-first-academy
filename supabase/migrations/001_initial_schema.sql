-- Worldline AI-First Academy — Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE squad_status AS ENUM ('upcoming', 'active', 'completed');
CREATE TYPE lesson_type AS ENUM ('theory', 'demo', 'lab', 'review', 'mixed');
CREATE TYPE exercise_type AS ENUM ('prompt-craft', 'code-review', 'free-form', 'multiple-choice', 'peer-review');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE session_type AS ENUM ('onsite', 'remote', 'hybrid', 'office_hours');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  squad_id UUID,
  avatar_url TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Squads
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  intensive_start DATE NOT NULL,
  intensive_end DATE NOT NULL,
  status squad_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK for profiles.squad_id
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_squad FOREIGN KEY (squad_id) REFERENCES squads(id);

-- Weeks
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  objectives TEXT[] NOT NULL DEFAULT '{}',
  squad_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  type lesson_type NOT NULL DEFAULT 'theory',
  content_md TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  duration_min INTEGER NOT NULL DEFAULT 30,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exercises
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  type exercise_type NOT NULL DEFAULT 'free-form',
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  points INTEGER NOT NULL DEFAULT 10,
  rubric JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status progress_status NOT NULL DEFAULT 'not_started',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Exercise Submissions
CREATE TABLE exercise_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  submission TEXT NOT NULL,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  ai_feedback JSONB,
  instructor_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  criteria TEXT NOT NULL DEFAULT '',
  points_required INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student Badges
CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  type session_type NOT NULL DEFAULT 'onsite',
  location TEXT NOT NULL DEFAULT '',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Conversations (anonymized per EU AI Act)
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  messages_json JSONB NOT NULL DEFAULT '[]',
  lesson_context TEXT,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_profiles_squad ON profiles(squad_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_lessons_week ON lessons(week_id);
CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_exercise_submissions_user ON exercise_submissions(user_id);
CREATE INDEX idx_exercise_submissions_exercise ON exercise_submissions(exercise_id);
CREATE INDEX idx_student_badges_user ON student_badges(user_id);
CREATE INDEX idx_sessions_week ON sessions(week_id);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users can read own, instructors can read all
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_select_instructor ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);

-- Squads, Weeks, Lessons, Exercises, Badges, Sessions: readable by all authenticated
CREATE POLICY squads_select ON squads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY weeks_select ON weeks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY lessons_select ON lessons FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY exercises_select ON exercises FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY badges_select ON badges FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY sessions_select ON sessions FOR SELECT USING (auth.uid() IS NOT NULL);

-- Progress: users can read/write own
CREATE POLICY progress_select_own ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY progress_insert_own ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY progress_update_own ON lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- Instructors can read all progress
CREATE POLICY progress_select_instructor ON lesson_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);

-- Exercise submissions: users can read/write own, instructors can read all
CREATE POLICY submissions_select_own ON exercise_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY submissions_insert_own ON exercise_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY submissions_select_instructor ON exercise_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);

-- Student badges: users can read own, instructors can read all
CREATE POLICY badges_select_own ON student_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY badges_select_instructor ON student_badges FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);

-- AI conversations: users can read/write own only
CREATE POLICY ai_select_own ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ai_insert_own ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ai_update_own ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);

-- Instructors can manage content
CREATE POLICY lessons_manage_instructor ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);
CREATE POLICY exercises_manage_instructor ON exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);
CREATE POLICY weeks_manage_instructor ON weeks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);
CREATE POLICY sessions_manage_instructor ON sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('instructor', 'admin'))
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
