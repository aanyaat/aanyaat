CREATE TABLE IF NOT EXISTS shared_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'link' | 'note' | 'moment'
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE shared_memories ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write access since this is a private single-tenant client-side app
DROP POLICY IF EXISTS "Allow anonymous select" ON shared_memories;
CREATE POLICY "Allow anonymous select" ON shared_memories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert" ON shared_memories;
CREATE POLICY "Allow anonymous insert" ON shared_memories FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous delete" ON shared_memories;
CREATE POLICY "Allow anonymous delete" ON shared_memories FOR DELETE TO anon, authenticated USING (true);
