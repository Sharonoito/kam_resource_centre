# PowerBI Sector Integration TODO

## [ ] 1. Diagnose Current State
- Execute `diagnose-powerbi.sql`
- Confirm: Agriculture sector_id=1 exists, 0 POWERBI kam_content records

## [ ] 2. Insert PowerBI Records  
- Execute `insert-powerbi-agriculture.sql` (4 HS sections: Live Animals, Vegetables, Fats/Oils, Foodstuffs)
- Records get unique slugs, PUBLIC visibility, hardcoded embed URLs

## [ ] 3. Verify Database
- Re-run diagnose queries
- Check: 4 new kam_content with content_type='POWERBI', sector_id=1

## [ ] 4. Frontend Test
- `npx prisma generate`
- Restart dev server (`npm run dev`)
- Visit `/sectors/agriculture` → See PowerBI cards under HS sections I-IV

## [ ] 5. Scale to All Sectors (Optional)
- Repeat for other KAM_SECTORS (e.g., automotive=13, leather=4)
- Use same embed base URL + section-specific pageNames

**Expected Result**: PowerBI dashboards visible exactly like PDFs, grouped by HS sections, embedded via PowerBiEmbed component.

**All hardcoded PowerBI links from SQL files will be persisted in kam_content.powerbi_embed**
