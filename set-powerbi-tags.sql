-- Set tags on POWERBI records to control which HS section they appear under.
-- The tags value must exactly match the section name in types/sectors.ts sectionsData.

-- Example: place the test record under "Vegetable Products"
UPDATE public.kam_content
SET tags = 'Vegetable Products'
WHERE id = 3;

-- Verify
SELECT id, title, content_type, sector_id, tags FROM public.kam_content WHERE content_type = 'POWERBI';
