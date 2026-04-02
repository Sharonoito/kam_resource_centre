# Restore Working Login Plan

## Steps:

### 1. [ ] Check current users and passwords
Run: `tsx tmp-list-users.ts`
- Note any users with role != SUPERADMIN and hasPassword: SET

### 2. [ ] Restore signin page form
Edit app/auth/signin/page.tsx with complete NextAuth login form.

### 3. [ ] Set test password if needed
If no suitable user with password from step 1:
Run: `tsx tmp-set-test-password.ts`

### 4. [ ] Verify .env.local
- Ensure NEXTAUTH_SECRET exists (generate with `openssl rand -base64 32`)

### 5. [ ] Prisma sync (if schema changes)
`npx prisma db push`

### 6. [ ] Test
- `npm run dev`
- Go to /auth/signin
- Login with creds from step 3
- Access /member or /admin if role allows

**Current: Starting step 1**
