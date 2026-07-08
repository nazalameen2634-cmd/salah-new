-- Supabase Schema for Multi-User SaaS Islamic Productivity Dashboard

-- Updated At Trigger Function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  username text unique,
  email text,
  profile_picture text,
  country text,
  time_zone text default 'UTC',
  language text default 'en',
  role text default 'user' check (role in ('user', 'admin')),
  theme_preferences jsonb default '{"theme": "system", "accent_color": "emerald"}'::jsonb,
  notification_preferences jsonb default '{"email_updates": true, "push_reminders": false}'::jsonb,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

-- 2. Prayers Table
create table public.prayers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  prayer_name text not null, -- e.g., 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Tahajjud', etc.
  completed boolean default false not null,
  completed_time timestamp with time zone,
  jamaah boolean default false not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date, prayer_name)
);

create trigger update_prayers_updated_at
  before update on public.prayers
  for each row execute procedure public.update_updated_at_column();

-- 3. Habits Table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  icon text,
  color text,
  category text,
  frequency text default 'daily' not null,
  target integer default 1 not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_habits_updated_at
  before update on public.habits
  for each row execute procedure public.update_updated_at_column();

-- 4. Habit Logs Table
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  completed boolean default false not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (habit_id, date)
);

create trigger update_habit_logs_updated_at
  before update on public.habit_logs
  for each row execute procedure public.update_updated_at_column();

-- 5. Journal Table
create table public.journal (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  mood text,
  reflection text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date)
);

create trigger update_journal_updated_at
  before update on public.journal
  for each row execute procedure public.update_updated_at_column();

-- 6. Fitness Logs Table
create table public.fitness_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  calories_burned integer default 0,
  active_minutes integer default 0,
  steps integer default 0,
  water_intake_ml integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date)
);

create trigger update_fitness_logs_updated_at
  before update on public.fitness_logs
  for each row execute procedure public.update_updated_at_column();

-- Row Level Security (RLS) Configuration
alter table public.profiles enable row level security;
alter table public.prayers enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.journal enable row level security;
alter table public.fitness_logs enable row level security;

-- Policies for profiles
create policy "Users can view own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Trigger to automatically create profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, username)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow replacing
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Policies for prayers
create policy "Users can view own prayers." on public.prayers for select using (auth.uid() = user_id);
create policy "Users can insert own prayers." on public.prayers for insert with check (auth.uid() = user_id);
create policy "Users can update own prayers." on public.prayers for update using (auth.uid() = user_id);
create policy "Users can delete own prayers." on public.prayers for delete using (auth.uid() = user_id);

-- Policies for habits
create policy "Users can view own habits." on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits." on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits." on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits." on public.habits for delete using (auth.uid() = user_id);

-- Policies for habit logs
create policy "Users can view own habit logs." on public.habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own habit logs." on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own habit logs." on public.habit_logs for update using (auth.uid() = user_id);
create policy "Users can delete own habit logs." on public.habit_logs for delete using (auth.uid() = user_id);

-- Policies for journal
create policy "Users can view own journal." on public.journal for select using (auth.uid() = user_id);
create policy "Users can insert own journal." on public.journal for insert with check (auth.uid() = user_id);
create policy "Users can update own journal." on public.journal for update using (auth.uid() = user_id);
create policy "Users can delete own journal." on public.journal for delete using (auth.uid() = user_id);

-- Policies for fitness logs
create policy "Users can view own fitness logs." on public.fitness_logs for select using (auth.uid() = user_id);
create policy "Users can insert own fitness logs." on public.fitness_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own fitness logs." on public.fitness_logs for update using (auth.uid() = user_id);
create policy "Users can delete own fitness logs." on public.fitness_logs for delete using (auth.uid() = user_id);

-- Performance Indexes
create index if not exists prayers_user_id_idx on public.prayers (user_id);
create index if not exists prayers_user_id_date_idx on public.prayers (user_id, date);
create index if not exists habits_user_id_idx on public.habits (user_id);
create index if not exists habit_logs_user_id_date_idx on public.habit_logs (user_id, date);
create index if not exists journal_user_id_date_idx on public.journal (user_id, date);
create index if not exists fitness_logs_user_id_date_idx on public.fitness_logs (user_id, date);

-- Admin Stats Function (Bypasses RLS)
create or replace function public.get_platform_stats()
returns jsonb as $$
declare
  total_users integer;
  active_users_7d integer;
begin
  -- Total users
  select count(*) into total_users from auth.users;
  
  -- Active users in last 7 days (users who created/updated logs)
  select count(distinct user_id) into active_users_7d
  from (
    select user_id from public.prayers where updated_at > now() - interval '7 days'
    union
    select user_id from public.habit_logs where updated_at > now() - interval '7 days'
  ) as recent_activity;

  return jsonb_build_object(
    'totalUsers', coalesce(total_users, 0),
    'activeUsers7d', coalesce(active_users_7d, 0)
  );
end;
$$ language plpgsql security definer;
