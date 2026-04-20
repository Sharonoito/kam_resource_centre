-- Ensure Trade Hub virtual sector exists (id=-5)
-- Used by admin upload → sector_id=-5 → /trade page

INSERT INTO public.kam_sector (id, name, slug, description, icon, color, is_active, sort_order) 
VALUES (-5, 'Trade Hub', 'trade-hub', 'Trade Intelligence Hub', null, null, true, 999) 
ON CONFLICT (id) DO NOTHING;

-- Verify
-- SELECT * FROM public.kam_sector WHERE id = -5;

