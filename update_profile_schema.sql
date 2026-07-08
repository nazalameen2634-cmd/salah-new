-- Add new columns to app_users table
alter table public.app_users add column if not exists age integer;
alter table public.app_users add column if not exists weight numeric;
alter table public.app_users add column if not exists username text;
alter table public.app_users add column if not exists country text;
alter table public.app_users add column if not exists time_zone text default 'UTC';
alter table public.app_users add column if not exists language text default 'en';

-- Reload cache
NOTIFY pgrst, 'reload schema';
