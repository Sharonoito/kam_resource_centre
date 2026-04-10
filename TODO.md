# Trade PowerBI Admin Upload Enablement
Status: 🚀 In Progress | Priority: High

## Breakdown of Approved Plan

### ✅ Step 1: Ensure Trade Sector Exists (DB Setup)
- [x] Create migration: Ensure `kam_sector` id=-5 ("Trade Hub")
```
INSERT INTO public.kam_sector (id, name, slug, is_active) 
VALUES (-5, 'Trade Hub', 'trade-hub', true) 
ON CONFLICT (id) DO NOTHING;
```

### ✅ Step 2: Create TradeContent Component
```
app/trade/TradeContent.tsx
```
- [x] Copy TaxContent.tsx → Adapt colors/branding for Trade (blue/orange)

### ✅ Step 3: Update Trade Page 
```
app/trade/page.tsx  
```
- [x] Replace PDF UI → Fetch kam_content sector_id=-5 like tax/page.tsx
- [x] Use TradeContent component
- [x] Preserved header/search/sidebar/pagination (SharePoint preserved in comments)

### ✅ Step 4: Test Manual Admin Flow
```
1. npx prisma db execute --file=trade-sector.sql
2. Navigate /admin/upload
3. Select GENERAL_GLOBAL → generalNav="trade"
4. Add PowerBI report → POST /api/admin/resources
5. Verify appears at /trade with PowerBI cards
```
- Status: Post-implementation

## Success Criteria
- ✅ Admin can manually add PowerBI/PDF to Trade via /admin/upload
- ✅ New reports appear at /trade with proper PowerBI display  
- ✅ Existing Trade SharePoint PDFs preserved (no regression)
- ✅ No code duplication, minimal changes to working features

**Next Action:** Execute Steps 2-3 → Mark complete → Test Step 4

