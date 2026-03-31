# Fix Login Issue - Authentication Diagnosis & Repair

## Current Status
- App was working before recent DB changes (add_password.sql etc.).
- Test users exist, but likely no hashed passwords set for Credentials login.
- Google login also failing.

## Step 1: [PENDING] Check Environment Variables
Execute:
```
set | findstr /I NEXTAUTH
set | findstr /I GOOGLE
```
Ensure:
- NEXTAUTH_SECRET=...
- GOOGLE_CLIENT_ID=...
- GOOGLE_CLIENT_SECRET=...

Use client_secret json in ../Downloads for Google creds.

## Step 2: [PENDING] Inspect Database with Prisma Studio
Execute:
```
npx prisma studio
```
- Open localhost:5555
- Check `users` table:
  - Emails
  - Roles (should be SUPERADMIN/ADMIN/KAM_MEMBER/PUBLIC)
  - password column (likely NULL for all)
  - isSubscribed, subscriptionExpiry

## Step 3: [PENDING] Sync Schema & Regenerate Client
```
npm run db:push
npx prisma generate
```

## Step 4: [PENDING] Create Test User with Password
Use Prisma Studio to add/edit user password with bcrypt hash, or run script.

## Step 5: [DONE when login works] Test Login
- Email/PW on /auth/signin
- Google button

## Step 6: [FOLLOWUP] Add Password Hashing to Register API
Edit app/api/register/route.ts to bcrypt.hash.

**Next Action: Approve to execute Step 1 & 2?**

