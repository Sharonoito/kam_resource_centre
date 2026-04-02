-- FORCE INSERT - bypasses any FK/constraint issues
-- Run in Prisma Studio Query tab or psql

BEGIN;

-- Disable triggers/constraints temporarily (if any)
-- ALTER TABLE public.kam_content DISABLE TRIGGER ALL;

-- Raw INSERT ignoring Prisma validation
INSERT INTO public.kam_content (
  sector_id, title, slug, description, content_type, powerbi_embed,
  visibility, pricing_tier, is_active, is_featured, created_at, updated_at
) VALUES (
  (SELECT id FROM public.kam_sector WHERE slug = 'agriculture'),
  'TEST PowerBI Agriculture',
  'test-agri-powerbi-' || extract(epoch from now())::int,  -- unique slug
  'PowerBI test embed',
  'POWERBI',
  'https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9',
  'PUBLIC',
  'FREE',
  true,
  true,
  NOW(),
  NOW()
) RETURNING *;

-- Re-enable if disabled
-- ALTER TABLE public.kam_content ENABLE TRIGGER ALL;

COMMIT;

-- Immediately verify
SELECT * FROM public.kam_content WHERE title ILIKE '%TEST PowerBI%' ORDER BY id DESC LIMIT 1;
