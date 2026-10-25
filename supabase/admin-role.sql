-- Run in the Supabase SQL Editor after creating and confirming the admin account.
-- This role is stored in app_metadata, which users cannot change from the client.
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE lower(email) = lower('ankurempire008@gmail.com');
