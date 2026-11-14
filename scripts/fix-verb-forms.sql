-- One-off corrections to the verb forms, reviewed 2026-11-14.
-- Companion to fix-examples.sql, which corrected the example sentences.
-- Every statement guards on the current value, so an already edited row is skipped.

begin;

-- "eriahnite" is not a German word, and the participle lost its prefix.
update words
set verb = '{
  "infinitive": "erahnen",
  "present3rd": "erahnt",
  "praeteritum": "erahnte",
  "perfekt": "hat erahnt"
}'::jsonb
where word = 'erahnen'
  and verb->>'praeteritum' = 'eriahnite'
  and verb->>'perfekt' = 'hat geahnt';

-- This card is about a surface fogging up, which takes sein.
-- "hat beschlagen" belongs to the other meaning, shoeing a horse.
update words
set verb = jsonb_set(verb, '{perfekt}', '"ist beschlagen"'::jsonb)
where word = 'beschlagen'
  and verb->>'perfekt' = 'hat beschlagen';

-- The article belongs to the expression and was missing from every form;
-- the infinitive had been cut down to the bare verb.
update words
set verb = '{
  "infinitive": "den Rückwärtsgang einlegen",
  "present3rd": "legt den Rückwärtsgang ein",
  "praeteritum": "legte den Rückwärtsgang ein",
  "perfekt": "hat den Rückwärtsgang eingelegt"
}'::jsonb
where word = 'Rückwärtsgang einlegen'
  and verb->>'perfekt' = 'hat Rückwärtsgang eingelegt';

-- Optional: consistency only. Every other phrase keeps the full expression
-- in the infinitive, this one was stored as the bare verb.
update words
set verb = jsonb_set(verb, '{infinitive}', '"die Bremse lösen"'::jsonb)
where word = 'die Bremse lösen'
  and verb->>'infinitive' = 'lösen';

commit;
