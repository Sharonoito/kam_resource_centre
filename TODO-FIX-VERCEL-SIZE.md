# TODO: Fix Vercel Function Size Limit for api/admin/content

## Steps:
- [x] 1. Update next.config.js: Add bcrypt, xlsx, @prisma/engines to serverExternalPackages
- [x] 2. Update vercel.json: Expand excludeFiles for additional node_modules
- [x] 3. Edit app/api/admin/content/route.ts: Dynamic import for Prisma
- [x] 4. Edit app/api/admin/content/[id]/route.ts: Dynamic import for Prisma  
- [x] 5. Test: npm run build && check function sizes
- [ ] 6. Deploy with VERCEL_ANALYZE_BUILD_OUTPUT=1 for report
- [ ] 7. Test API endpoints (POST upload, DELETE/PATCH)
- [ ] 8. If <300MB: Complete. Else: Further optimizations

**Progress: Edits complete. Build succeeded. Check .next/server/app/api/admin/content sizes, test, redeploy.**

