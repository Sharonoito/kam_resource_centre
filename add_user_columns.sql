ALTER TABLE public."users" ADD COLUMN IF NOT EXISTS "isSubscribed" BOOLEAN DEFAULT false;
ALTER TABLE public."users" ADD COLUMN IF NOT EXISTS "subscriptionExpiry" TIMESTAMP WITH TIME ZONE;
ALTER TABLE public."users" ADD COLUMN IF NOT EXISTS "current_session_id" VARCHAR;
