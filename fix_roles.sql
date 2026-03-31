-- Fix invalid roles
UPDATE public."users" SET role = 'KAM_MEMBER' WHERE role = 'MEMBER' OR role = 'member';
UPDATE public."users" SET role = 'PUBLIC' WHERE role NOT IN ('SUPERADMIN', 'ADMIN', 'KAM_MEMBER', 'PUBLIC');

-- Verify
SELECT email, role FROM public."users";
