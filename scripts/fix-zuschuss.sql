-- Corrections to the Zuschuss card, reviewed 2026-11-19.
-- Guards on the current text, so an already edited row is skipped.

begin;

-- A Zuschuss goes toward concrete costs and takes "zu", not "für".
-- State support for a whole sector is Förderung or Subventionen, not a Zuschuss.
update words
set examples = jsonb_set(examples, '{0}', '{
  "de": "Der Staat zahlt einen Zuschuss zu den Heizkosten.",
  "tense": "Präsens",
  "translations": {
    "en": "The state pays a subsidy toward the heating costs.",
    "ru": "Государство выплачивает субсидию на отопление.",
    "uk": "Держава виплачує субсидію на опалення."
  }
}'::jsonb)
where word = 'Zuschuss'
  and examples->0->>'de' = 'Der Staat gibt einen Zuschuss für erneuerbare Energien.';

-- Same preposition fix, plus the Ukrainian translation:
-- "опіка" is legal guardianship, childcare is "догляд".
update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Mein Arbeitgeber hat mir einen Zuschuss zur Kinderbetreuung gewährt.",
  "tense": "Perfekt",
  "translations": {
    "en": "My employer granted me a contribution toward childcare.",
    "ru": "Мой работодатель предоставил мне доплату на уход за детьми.",
    "uk": "Мій роботодавець надав мені доплату на догляд за дітьми."
  }
}'::jsonb)
where word = 'Zuschuss'
  and examples->1->>'de' = 'Mein Arbeitgeber hat mir einen Zuschuss für die Kinderbetreuung gewährt.';

commit;
