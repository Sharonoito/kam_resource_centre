-- Simple single-query INSERT for Agriculture PowerBI (run in psql / Prisma Studio)
-- Adds ONE PowerBI entry visible on /sectors/agriculture

INSERT INTO public.kam_content (
  sector_id, title, slug, content_type, powerbi_embed, description, is_active, created_at
) VALUES (
  1,  -- Agriculture sector_id (confirm: SELECT id FROM public.kam_sector WHERE slug='agriculture')
  'Agriculture Sector Dashboard', 
  'agriculture-powerbi-dashboard',
  'POWERBI',
  'https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9&pageName=946bc8c254a71ad0',  -- Vegetable Products page (change pageName as needed)
  'Interactive PowerBI dashboard for Agriculture and Food Processing sector',
  TRUE, 
  NOW()
);

-- Verify
SELECT id, title, powerbi_embed, content_type FROM public.kam_content 
WHERE slug = 'agriculture-powerbi-dashboard';
