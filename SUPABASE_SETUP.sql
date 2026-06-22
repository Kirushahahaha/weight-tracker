-- ============================================================
-- Weight Tracker — схема базы данных для Supabase
-- Выполни этот SQL в Supabase: SQL Editor → New query → Run
-- ============================================================

-- Одна строка на пользователя, данные хранятся в jsonb-колонках.
create table if not exists profiles_data (
  user_id    uuid references auth.users on delete cascade primary key,
  weight     jsonb default '{"entries":[],"goal":"","height":""}'::jsonb,
  calories   jsonb default '{"meals":[],"dailyGoal":2000}'::jsonb,
  workouts   jsonb default '{"history":[]}'::jsonb,
  updated_at timestamptz default now()
);

-- Row Level Security: каждый видит и меняет только свои данные.
alter table profiles_data enable row level security;

create policy "own data: select"
  on profiles_data for select
  using (auth.uid() = user_id);

create policy "own data: insert"
  on profiles_data for insert
  with check (auth.uid() = user_id);

create policy "own data: update"
  on profiles_data for update
  using (auth.uid() = user_id);
