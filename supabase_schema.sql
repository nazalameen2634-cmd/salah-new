-- Supabase Schema for Personal Islamic Productivity Dashboard

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  settings jsonb default '{"theme": "system", "accent_color": "green", "notifications": false}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
  unique (user_id, date, prayer_name)
);

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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Habit Logs Table
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  completed boolean default false not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (habit_id, date)
);

-- 5. Journal Table
create table public.journal (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  mood text,
  reflection text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date)
);

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
  unique (user_id, date)
);

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
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

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
