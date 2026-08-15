create table public.words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,

  word text not null,
  article text check (article in ('der', 'die', 'das')),
  type text not null check (type in ('noun', 'verb', 'adjective', 'phrase')),
  level text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),

  translations jsonb not null default '{}'::jsonb,
  examples jsonb not null default '[]'::jsonb,
  verb jsonb,
  preposition jsonb,
  notes text,
  image_url text,

  due_at timestamptz not null default now(),
  interval_days integer not null default 0,
  ease_factor real not null default 2.5,
  repetitions integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, word)
);

create index words_user_id_idx on public.words using btree (user_id);
create index words_due_idx on public.words using btree (user_id, due_at);

alter table public.words enable row level security;

create policy "Users can read their own words"
  on public.words for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own words"
  on public.words for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own words"
  on public.words for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own words"
  on public.words for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger words_set_updated_at
  before update on public.words
  for each row
  execute function public.set_updated_at();