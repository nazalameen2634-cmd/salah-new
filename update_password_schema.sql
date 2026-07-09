-- Add password_hash column to app_users table
alter table public.app_users add column if not exists password_hash text;

-- Reload cache
NOTIFY pgrst, 'reload schema';
