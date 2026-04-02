-- Diagnostic queries for PowerBI sector issue
-- Run these in psql or Prisma Studio (npx prisma studio)

-- 1. Check Agriculture sector ID (should be 1)
SELECT id, name, slug, is_active FROM public.kam_sector 
WHERE name ILIKE '%Agriculture%' OR slug = 'agriculture';

-- 2. Count kam_content for Agriculture sector
-- Your UPDATE targets this exact WHERE clause
SELECT COUNT(*) as agriculture_content_count 
FROM public.kam_content kc
JOIN public.kam_sector ks ON kc.sector_id = ks.id
WHERE ks.name = 'Agriculture and Food Processing' AND kc.is_active = TRUE;

-- 3. List all kam_content for Agriculture (top 10 recent)
SELECT id, title, slug, content_type, powerbi_embed, powerbi_url, is_active, sector_id, created_at
FROM public.kam_content kc
JOIN public.kam_sector ks ON kc.sector_id = ks.id
WHERE ks.slug = 'agriculture'
ORDER BY created_at DESC LIMIT 10;

-- 4. Check what sectors have POWERBI content
SELECT DISTINCT ks.name, ks.slug, COUNT(*) as powerbi_count
FROM public.kam_content kc
JOIN public.kam_sector ks ON kc.sector_id = ks.id
WHERE kc.content_type = 'POWERBI' AND kc.is_active = TRUE
GROUP BY ks.id, ks.name, ks.slug
ORDER BY powerbi_count DESC;

-- 5. Verify PowerBI POWERBI enum exists
SELECT unnest(enum_range(NULL::public."ContentType"));
