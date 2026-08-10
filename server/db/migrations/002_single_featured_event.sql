-- Keep only the most recently updated featured event; clear all others.
UPDATE events
SET is_featured = false, updated_at = NOW()
WHERE is_featured = true
  AND id NOT IN (
    SELECT id FROM events
    WHERE is_featured = true
    ORDER BY updated_at DESC
    LIMIT 1
  );

-- Enforce at the database level: at most one row may have is_featured = true.
CREATE UNIQUE INDEX IF NOT EXISTS unique_featured_event
  ON events (is_featured)
  WHERE is_featured = true;
