drop table if exists public.words cascade;

create table public.words (
  id uuid primary key default gen_random_uuid(),

  word text not null unique,
  article text check (article in ('der', 'die', 'das')),
  type text not null check (type in ('noun', 'verb', 'adjective', 'phrase')),
  level text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),

  translations jsonb not null default '{}'::jsonb,
  examples jsonb not null default '[]'::jsonb,
  verb jsonb,
  preposition jsonb,
  notes text,
  image_url text,

  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_words (
  user_id uuid not null references auth.users on delete cascade,
  word_id uuid not null references public.words on delete cascade,

  due_at timestamptz not null default now(),
  interval_days integer not null default 0,
  ease_factor real not null default 2.5,
  repetitions integer not null default 0,

  created_at timestamptz not null default now(),

  primary key (user_id, word_id)
);

create index user_words_due_idx on public.user_words using btree (user_id, due_at);
create index words_created_by_idx on public.words using btree (created_by);

alter table public.words enable row level security;
alter table public.user_words enable row level security;

create policy "Anyone signed in can read the shared library"
  on public.words for select
  to authenticated
  using (true);

create policy "Users can add words to the shared library"
  on public.words for insert
  to authenticated
  with check ((select auth.uid()) = created_by);

create policy "Authors can edit their own contributions"
  on public.words for update
  to authenticated
  using ((select auth.uid()) = created_by)
  with check ((select auth.uid()) = created_by);

create policy "Users can read their own collection"
  on public.user_words for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own collection"
  on public.user_words for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own progress"
  on public.user_words for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove words from their collection"
  on public.user_words for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create trigger words_set_updated_at
  before update on public.words
  for each row
  execute function public.set_updated_at();