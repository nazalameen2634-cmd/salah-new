-- 1. Create custom app_users table
create table if not exists public.app_users (
  id uuid default gen_random_uuid() primary key,
  phone_number text unique not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on app_users
alter table public.app_users enable row level security;
-- Since we are handling auth via custom cookies, we can allow anon to insert/select for now
-- Or we can just disable RLS on this table since it's a completely open personal app system.
-- Let's just disable RLS for simplicity since we disabled it for everything else.
alter table public.app_users disable row level security;

-- 2. Add user_id foreign keys back (if missing)
-- (They were previously dropped from NOT NULL, but the columns still exist)
-- Let's make them reference app_users instead of auth.users or profiles

-- Drop old foreign keys to profiles if they exist
alter table public.prayers drop constraint if exists prayers_user_id_fkey;
alter table public.habits drop constraint if exists habits_user_id_fkey;
alter table public.habit_logs drop constraint if exists habit_logs_user_id_fkey;
alter table public.journal drop constraint if exists journal_user_id_fkey;
alter table public.fitness_logs drop constraint if exists fitness_logs_user_id_fkey;

-- Add new foreign keys to app_users
alter table public.prayers add constraint prayers_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;
alter table public.habits add constraint habits_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;
alter table public.habit_logs add constraint habit_logs_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;
alter table public.journal add constraint journal_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;
alter table public.fitness_logs add constraint fitness_logs_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;

-- 3. Replace unique constraints to include user_id so each user has their own data

-- Prayers
alter table public.prayers drop constraint if exists prayers_date_prayer_name_key;
alter table public.prayers drop constraint if exists prayers_user_id_date_prayer_name_key;
alter table public.prayers add constraint prayers_user_id_date_prayer_name_key unique (user_id, date, prayer_name);

-- Habit Logs
alter table public.habit_logs drop constraint if exists habit_logs_habit_id_date_key;
alter table public.habit_logs drop constraint if exists habit_logs_habit_id_user_id_date_key;
alter table public.habit_logs add constraint habit_logs_habit_id_user_id_date_key unique (habit_id, user_id, date);

-- Journal
alter table public.journal drop constraint if exists journal_date_key;
alter table public.journal drop constraint if exists journal_user_id_date_key;
alter table public.journal add constraint journal_user_id_date_key unique (user_id, date);

-- Fitness Logs
alter table public.fitness_logs drop constraint if exists fitness_logs_date_key;
alter table public.fitness_logs drop constraint if exists fitness_logs_user_id_date_key;
alter table public.fitness_logs add constraint fitness_logs_user_id_date_key unique (user_id, date);

-- 4. Reload cache
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
