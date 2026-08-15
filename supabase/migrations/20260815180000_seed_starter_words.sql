insert into public.words
  (word, article, type, level, translations, examples, verb, preposition, notes, image_url)
values
  (
    'Haus', 'das', 'noun', 'A1',
    '{"ru": "дом", "uk": "дім", "en": "house"}'::jsonb,
    '[
      {"de": "Das Haus ist sehr groß.", "tense": "Präsens",
       "translations": {"ru": "Дом очень большой.", "uk": "Дім дуже великий.", "en": "The house is very big."}},
      {"de": "Wir haben ein neues Haus gekauft.", "tense": "Perfekt",
       "translations": {"ru": "Мы купили новый дом.", "uk": "Ми купили новий дім.", "en": "We bought a new house."}}
    ]'::jsonb,
    null, null,
    'Plural: die Häuser. Häufig in Komposita: das Krankenhaus, das Rathaus.',
    '/images/haus.png'
  ),
  (
    'Hund', 'der', 'noun', 'A1',
    '{"ru": "собака", "uk": "собака", "en": "dog"}'::jsonb,
    '[
      {"de": "Der Hund spielt im Garten.", "tense": "Präsens",
       "translations": {"ru": "Собака играет в саду.", "uk": "Собака грається в саду.", "en": "The dog plays in the garden."}},
      {"de": "Der Hund hat den Ball geholt.", "tense": "Perfekt",
       "translations": {"ru": "Собака принесла мяч.", "uk": "Собака принесла м''яч.", "en": "The dog fetched the ball."}}
    ]'::jsonb,
    null, null,
    'Plural: die Hunde. Verkleinerung: das Hündchen.',
    '/images/hund.png'
  ),
  (
    'Katze', 'die', 'noun', 'A1',
    '{"ru": "кошка", "uk": "кішка", "en": "cat"}'::jsonb,
    '[
      {"de": "Die Katze schläft auf dem Sofa.", "tense": "Präsens",
       "translations": {"ru": "Кошка спит на диване.", "uk": "Кішка спить на дивані.", "en": "The cat sleeps on the sofa."}},
      {"de": "Die Katze ist auf den Baum geklettert.", "tense": "Perfekt",
       "translations": {"ru": "Кошка залезла на дерево.", "uk": "Кішка залізла на дерево.", "en": "The cat climbed up the tree."}}
    ]'::jsonb,
    null, null,
    'Plural: die Katzen.',
    '/images/katze.png'
  ),
  (
    'gehen', null, 'verb', 'A1',
    '{"ru": "идти / ходить", "uk": "йти / ходити", "en": "to go / to walk"}'::jsonb,
    '[
      {"de": "Ich gehe jeden Morgen zur Arbeit.", "tense": "Präsens",
       "translations": {"ru": "Я каждое утро иду на работу.", "uk": "Я щоранку йду на роботу.", "en": "I go to work every morning."}},
      {"de": "Sie ist nach Hause gegangen.", "tense": "Perfekt",
       "translations": {"ru": "Она пошла домой.", "uk": "Вона пішла додому.", "en": "She went home."}}
    ]'::jsonb,
    '{"infinitive": "gehen", "present3rd": "geht", "praeteritum": "ging", "perfekt": "ist gegangen"}'::jsonb,
    null,
    'Bewegungsverb — Perfekt mit „sein“. Unregelmäßig.',
    '/images/gehen.png'
  ),
  (
    'warten', null, 'verb', 'A2',
    '{"ru": "ждать", "uk": "чекати", "en": "to wait"}'::jsonb,
    '[
      {"de": "Ich warte auf den Bus.", "tense": "Präsens",
       "translations": {"ru": "Я жду автобус.", "uk": "Я чекаю на автобус.", "en": "I am waiting for the bus."}},
      {"de": "Wir haben lange auf dich gewartet.", "tense": "Perfekt",
       "translations": {"ru": "Мы долго тебя ждали.", "uk": "Ми довго на тебе чекали.", "en": "We waited for you a long time."}}
    ]'::jsonb,
    '{"infinitive": "warten", "present3rd": "wartet", "praeteritum": "wartete", "perfekt": "hat gewartet"}'::jsonb,
    '{"prep": "warten auf", "case": "Akkusativ"}'::jsonb,
    'Regelmäßiges Verb. „warten auf“ verlangt den Akkusativ.',
    '/images/warten.png'
  ),
  (
    'Freiheit', 'die', 'noun', 'B2',
    '{"ru": "свобода", "uk": "свобода", "en": "freedom / liberty"}'::jsonb,
    '[
      {"de": "Die Freiheit ist ein hohes Gut.", "tense": "Präsens",
       "translations": {"ru": "Свобода — большая ценность.", "uk": "Свобода — велика цінність.", "en": "Freedom is a precious good."}},
      {"de": "Sie haben für ihre Freiheit gekämpft.", "tense": "Perfekt",
       "translations": {"ru": "Они боролись за свою свободу.", "uk": "Вони боролися за свою свободу.", "en": "They fought for their freedom."}}
    ]'::jsonb,
    null, null,
    'Abstraktes Nomen. Nachsilbe „-heit“ ist immer feminin.',
    '/images/freiheit.png'
  )
on conflict (word) do nothing;

create or replace function public.add_starter_words()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_words (user_id, word_id)
  select new.id, w.id
  from public.words w
  where w.created_by is null
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created_add_starter_words
  after insert on auth.users
  for each row
  execute function public.add_starter_words();

insert into public.user_words (user_id, word_id)
select u.id, w.id
from auth.users u
cross join public.words w
where w.created_by is null
on conflict do nothing;
