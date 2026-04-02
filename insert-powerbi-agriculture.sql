-- Sample INSERTs for Agriculture PowerBI content
-- Run AFTER diagnose-powerbi.sql confirms sector_id=1
-- Creates 4 PowerBI entries (one per HS section in Agriculture)
-- Uses buildPowerBiEmbedUrl logic from lib/powerbi-config.ts

-- Verify POWERBI_REPORT_URL first (should be in lib/powerbi-config.ts)
DO $$
DECLARE
  report_base TEXT := 'https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9';
  sector_id_val INT := 1;  -- Confirm with diagnose-powerbi.sql query #1
BEGIN
  -- I: Live Animals (pageId from config)
  INSERT INTO public.kam_content (sector_id, title, slug, content_type, powerbi_embed, description, is_active, created_at)
  VALUES (sector_id_val, 
          'Live Animals & Products Dashboard', 
          'agriculture-live-animals-powerbi',
          'POWERBI'::public."ContentType",
          report_base || '&pageName=5174b7720480096b117c',
          'Interactive PowerBI dashboard for HS Section I: Live Animals & Products (Ch. 1-5)',
          TRUE, 
          NOW());

  -- II: Vegetable Products
  INSERT INTO public.kam_content (sector_id, title, slug, content_type, powerbi_embed, description, is_active, created_at)
  VALUES (sector_id_val, 
          'Vegetable Products Dashboard', 
          'agriculture-vegetables-powerbi',
          'POWERBI'::public."ContentType",
          report_base || '&pageName=946bc8c254a71ad0',
          'Interactive PowerBI dashboard for HS Section II: Vegetable Products (Ch. 6-14)',
          TRUE, 
          NOW());

  -- III: Fats and Oils
  INSERT INTO public.kam_content (sector_id, title, slug, content_type, powerbi_embed, description, is_active, created_at)
  VALUES (sector_id_val, 
          'Fats and Oils Dashboard', 
          'agriculture-fats-oils-powerbi',
          'POWERBI'::public."ContentType",
          report_base || '&pageName=5cb0946bc8c254a71ad0',
          'Interactive PowerBI dashboard for HS Section III: Fats and Oils (Ch. 15-16)',
          TRUE, 
          NOW());

  -- IV: Prepared Foodstuffs
  INSERT INTO public.kam_content (sector_id, title, slug, content_type, powerbi_embed, description, is_active, created_at)
  VALUES (sector_id_val, 
          'Prepared Foodstuffs Dashboard', 
          'agriculture-food-processing-powerbi',
          'POWERBI'::public."ContentType",
          report_base || '&pageName=e0b70589900315438756',
          'Interactive PowerBI dashboard for HS Section IV: Prepared Foodstuffs (Ch. 16-24)',
          TRUE, 
          NOW());

  RAISE NOTICE 'Inserted 4 PowerBI entries for Agriculture sector_id=%. Check /sectors/agriculture', sector_id_val;
END $$;

-- Verify inserts
SELECT id, title, slug, content_type, powerbi_embed, sector_id FROM public.kam_content 
WHERE sector_id = 1 AND content_type = 'POWERBI' ORDER BY id DESC LIMIT 5;
