alter table public.words
  add column source_id uuid references public.words;

create index words_source_idx on public.words using btree (source_id);

alter table public.words drop constraint words_word_key;

create unique index words_word_unique
  on public.words using btree (word)
  where source_id is null;

create unique index words_copy_unique
  on public.words using btree (created_by, source_id)
  where source_id is not null;

drop policy "Anyone signed in can read the shared library" on public.words;

create policy "Users can read the library and their own copies"
  on public.words for select
  to authenticated
  using (source_id is null or (select auth.uid()) = created_by);
