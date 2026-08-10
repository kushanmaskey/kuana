-- Drop the partial unique index added in 002 — it conflicts with Neon's
-- connection pooler and blocks the two-step clear-then-set update.
-- Single-featured enforcement is handled at the application layer instead.
DROP INDEX IF EXISTS unique_featured_event;
