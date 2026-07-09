-- Add security questions and password reset states
alter table public.app_users 
  add column if not exists security_q1 text,
  add column if not exists security_a1 text,
  add column if not exists security_q2 text,
  add column if not exists security_a2 text,
  add column if not exists is_temp_password boolean default false,
  add column if not exists reset_requested boolean default false;

-- Reload cache
NOTIFY pgrst, 'reload schema';
