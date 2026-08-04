/*
# Create quiz_scores table

1. New Tables
- `quiz_scores`
  - `id` (uuid, primary key)
  - `score` (integer, not null) — number of correct answers
  - `total` (integer, not null) — total number of questions
  - `perfect` (boolean, default false) — whether the score was perfect
  - `answers` (jsonb) — which option index was picked for each question (optional, for debugging)
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `quiz_scores`.
- This is a single-tenant app (no sign-in). The site is a personal birthday
  surprise for one person (Aanya). The anon-key frontend needs to INSERT
  new quiz results, and the owner (Akhil) reads them via the dashboard /
  Supabase studio. We allow anon + authenticated to INSERT, and deny all
  SELECT/UPDATE/DELETE from anon to keep scores private (only the service
  role / dashboard can read them).
*/

CREATE TABLE IF NOT EXISTS quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  score integer NOT NULL,
  total integer NOT NULL,
  perfect boolean NOT NULL DEFAULT false,
  answers jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to insert a quiz score.
DROP POLICY IF EXISTS "anon_insert_quiz_scores" ON quiz_scores;
CREATE POLICY "anon_insert_quiz_scores"
ON quiz_scores FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- No SELECT / UPDATE / DELETE policies: scores are private and can only
-- be read via the service role key (dashboard) or Supabase Studio.
