SELECT kc.id, kc.title, kc.content_type, kc.is_active, kc.sector_id, kc.powerbi_embed, ks.name as sector_name, ks.slug as sector_slug
FROM public.kam_content kc
LEFT JOIN public.kam_sector ks ON kc.sector_id = ks.id
WHERE kc.content_type = 'POWERBI'
ORDER BY kc.id DESC;

SELECT id, name, slug, is_active FROM public.kam_sector ORDER BY id;
