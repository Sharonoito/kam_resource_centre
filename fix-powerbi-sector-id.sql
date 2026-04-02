-- Fix: link the existing POWERBI record to Agriculture sector (id=1)
UPDATE public.kam_content
SET sector_id = 1
WHERE content_type = 'POWERBI' AND sector_id IS NULL;

-- Verify
SELECT id, title, content_type, sector_id, is_active, powerbi_embed
FROM public.kam_content
WHERE content_type = 'POWERBI';
