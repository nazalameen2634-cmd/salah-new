-- 1. Disable Row Level Security (RLS) on all tables so anyone can read/write data
alter table public.profiles disable row level security;
alter table public.prayers disable row level security;
alter table public.habits disable row level security;
alter table public.habit_logs disable row level security;
alter table public.journal disable row level security;
alter table public.fitness_logs disable row level security;

-- 2. Make user_id optional (since we no longer have logged in users)
alter table public.prayers alter column user_id drop not null;
alter table public.habits alter column user_id drop not null;
alter table public.habit_logs alter column user_id drop not null;
alter table public.journal alter column user_id drop not null;
alter table public.fitness_logs alter column user_id drop not null;

-- 3. Replace unique constraints that previously relied on user_id 
-- so you can still only have one prayer log per day (instead of one per day PER user)

-- Prayers
alter table public.prayers drop constraint if exists prayers_user_id_date_prayer_name_key;
alter table public.prayers add constraint prayers_date_prayer_name_key unique (date, prayer_name);

-- Habit Logs
alter table public.habit_logs drop constraint if exists habit_logs_habit_id_user_id_date_key;
alter table public.habit_logs drop constraint if exists habit_logs_habit_id_date_key;
alter table public.habit_logs add constraint habit_logs_habit_id_date_key unique (habit_id, date);

-- Journal
alter table public.journal drop constraint if exists journal_user_id_date_key;
alter table public.journal add constraint journal_date_key unique (date);

-- Fitness Logs
alter table public.fitness_logs drop constraint if exists fitness_logs_user_id_date_key;
alter table public.fitness_logs add constraint fitness_logs_date_key unique (date);
