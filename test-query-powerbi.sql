-- Test if frontend query finds your PowerBI rows
-- Run after INSERT

SELECT 
  kc.id, kc.title, kc.slug, kc.content_type, kc.powerbi_embed,
  ks.name as sector_name, ks.slug as sector_slug
FROM public.kam_content kc
JOIN public.kam_sector ks ON kc.sector_id = ks.id
WHERE kc.sector_id = 1 
  AND kc.content_type = 'POWERBI'::public."ContentType" 
  AND kc.is_active = TRUE;
