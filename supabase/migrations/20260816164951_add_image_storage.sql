insert into storage.buckets (id, name, public)
values ('word-images', 'word-images', true)
on conflict (id) do nothing;

create policy "Anyone can view word images"
  on storage.objects for select
  using (bucket_id = 'word-images');

create policy "Signed in users can upload word images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'word-images');