alter table public.words drop constraint words_type_check;

alter table public.words
  add constraint words_type_check check (
    type in (
      'noun',
      'verb',
      'adjective',
      'adverb',
      'preposition',
      'conjunction',
      'phrase'
    )
  );

update public.words
set type = 'preposition'
where word in ('aufgrund', 'puncto');
