-- Migration: Fix Research PowerBI + Seed Navigation Sectors
-- Run: psql -d your_db -f migrate-research-sectors.sql

BEGIN;

-- 1. Seed navigation sectors (negative IDs for virtual)
INSERT INTO public.kam_sector (id, name, slug, description, is_active, created_at) 
VALUES 
  (-1, 'Research Hub', 'research', 'Research analytics and data hub', true, NOW()),
  (-2, 'Trade Hub', 'trade', 'Trade facilitation and policy resources', true, NOW()),
  (-3, 'Tax Hub', 'tax', 'Tax policy and compliance resources', true, NOW()),
  (-4, 'Publications', 'publications', 'KAM publications and reports', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Fix existing PowerBI resources (kra tags → Research Hub)
UPDATE public.kam_content 
SET sector_id = -1,
    tags = tags || ', Research Hub',
    updated_at = NOW()
WHERE content_type = 'POWERBI' 
  AND (tags LIKE '%kra%' OR tags LIKE '%data hub%' OR tags LIKE '%research%')
  AND (sector_id IS NULL OR sector_id = 0);

-- 3. Verify changes
SELECT 'PowerBI Fixed' as status, COUNT(*) as count 
FROM public.kam_content 
WHERE content_type = 'POWERBI' AND sector_id = -1;

SELECT id, title, sector_id, tags 
FROM public.kam_sector 
WHERE id < 0;

COMMIT;
