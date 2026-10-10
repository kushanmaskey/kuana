-- Add is_featured to media
ALTER TABLE media ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Speakers table
CREATE TABLE IF NOT EXISTS speakers (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(200) NOT NULL,
  role           VARCHAR(200),
  org            VARCHAR(300),
  bio            TEXT,
  photo_url      TEXT,
  tag            VARCHAR(100) DEFAULT 'Speaker',
  tag_color      VARCHAR(100) DEFAULT 'bg-[#0e1b4d] text-white',
  year           INTEGER,
  facebook_url   TEXT,
  linkedin_url   TEXT,
  instagram_url  TEXT,
  is_featured    BOOLEAN DEFAULT FALSE,
  is_published   BOOLEAN DEFAULT TRUE,
  sort_order     INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
