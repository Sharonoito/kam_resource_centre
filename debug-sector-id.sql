-- CRITICAL: Confirm Agriculture sector_id before INSERT

-- Run this FIRST in psql / Prisma Studio:
SELECT 
  id, 
  name, 
  slug, 
  is_active
FROM public.kam_sector 
WHERE slug = 'agriculture' 
   OR name ILIKE '%Agriculture%Food%';

-- Expected: id=1, name='Agriculture and Food Processing', slug='agriculture'
-- If different ID, update INSERT's sector_id = YOUR_ID_HERE

-- Then check current kam_content count:
SELECT COUNT(*) FROM public.kam_content WHERE sector_id = 1;

-- Copy YOUR sector_id into simple-insert-powerbi.sql and re-run.
