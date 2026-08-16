create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  word text not null,
  created_at timestamptz not null default now()
);

create index generations_user_created_idx
  on public.generations using btree (user_id, created_at desc);

alter table public.generations enable row level security;

create policy "Users can read their own generation log"
  on public.generations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can log their own generations"
  on public.generations for insert
  to authenticated
  with check ((select auth.uid()) = user_id);