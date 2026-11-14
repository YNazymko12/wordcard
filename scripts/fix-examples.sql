-- One-off corrections to example sentences, reviewed 2026-11-14.
-- Every statement guards on the current German text, so a row that has
-- already been edited is skipped instead of being overwritten.

begin;

-- Wrong preposition: sich wappnen takes fuer/gegen, not auf.
-- Also rewritten as a real Perfekt; the old sentence was Praeteritum.
update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Er hat sich für alle Fragen gut gewappnet.",
  "tense": "Perfekt",
  "translations": {
    "en": "He prepared himself well for all questions.",
    "ru": "Он хорошо подготовился ко всем вопросам.",
    "uk": "Він добре підготувався до всіх запитань."
  }
}'::jsonb)
where word = 'gewappnet'
  and examples->1->>'de' = 'Er war auf alle Fragen gut gewappnet.';

-- abwuergen is transitive: a person stalls the engine, the engine does not stall itself.
update words
set examples = jsonb_set(examples, '{0}', '{
  "de": "Beim Anfahren würge ich oft den Motor ab.",
  "tense": "Präsens",
  "translations": {
    "en": "When pulling away I often stall the engine.",
    "ru": "При трогании с места я часто глушу двигатель.",
    "uk": "Рушаючи з місця, я часто глушу двигун."
  }
}'::jsonb)
where word = 'abwürgen'
  and examples->0->>'de' = 'Der Motor würgt ab, wenn die Kupplung zu schnell kommt.';

-- beschlagen is a change of state: auxiliary sein, not haben.
update words
set examples = jsonb_set(
  examples, '{1,de}',
  '"Der Spiegel ist beschlagen, als ich geduscht habe."'::jsonb)
where word = 'beschlagen'
  and examples->1->>'de' = 'Der Spiegel hat beschlagen, als ich geduscht habe.';

-- "auf Fokus einstellen" does not exist in German.
update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Ich habe den Sitz und die Spiegel richtig eingestellt.",
  "tense": "Perfekt",
  "translations": {
    "en": "I adjusted the seat and the mirrors properly.",
    "ru": "Я правильно отрегулировал сиденье и зеркала.",
    "uk": "Я правильно відрегулював сидіння і дзеркала."
  }
}'::jsonb)
where word = 'einstellen'
  and examples->1->>'de' = 'Ich habe meine Kamera auf Fokus eingestellt.';

-- Both examples used "ahnen" instead of the headword "erahnen".
update words
set examples = jsonb_set(examples, '{0}', '{
  "de": "Im Nebel erahne ich nur die Umrisse der Brücke.",
  "tense": "Präsens",
  "translations": {
    "en": "In the fog I can only make out the outline of the bridge.",
    "ru": "В тумане я лишь угадываю очертания моста.",
    "uk": "У тумані я лише вгадую обриси мосту."
  }
}'::jsonb)
where word = 'erahnen'
  and examples->0->>'de' = 'Ich ahne, dass etwas nicht stimmt.';

update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Sie hat seine Absicht sofort erahnt.",
  "tense": "Perfekt",
  "translations": {
    "en": "She immediately sensed his intention.",
    "ru": "Она сразу угадала его намерение.",
    "uk": "Вона одразу вгадала його намір."
  }
}'::jsonb)
where word = 'erahnen'
  and examples->1->>'de' = 'Sie hat sein Geheimnis geahnt.';

-- Missing article before Klimawandel.
update words
set examples = jsonb_set(
  examples, '{0,de}',
  '"Die Gefährdung von Wildtieren durch den Klimawandel ist ein großes Problem."'::jsonb)
where word = 'Gefährdung'
  and examples->0->>'de' = 'Die Gefährdung von Wildtieren durch Klimawandel ist ein großes Problem.';

-- The example practised "Klarsichthülle", not the headword "Hülle".
update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Ich habe die Gitarre wieder in ihre Hülle gepackt.",
  "tense": "Perfekt",
  "translations": {
    "en": "I packed the guitar back into its case.",
    "ru": "Я снова упаковал гитару в чехол.",
    "uk": "Я знову запакував гітару в чохол."
  }
}'::jsonb)
where word = 'Hülle'
  and examples->1->>'de' = 'Ich habe die Dokumente in eine Klarsichthülle gesteckt.';

-- A gear is "eingelegt", never "eingeschaltet".
update words
set examples = jsonb_set(
  examples, '{0,de}',
  '"Der Fahrer tritt die Kupplung und legt einen Gang ein."'::jsonb)
where word = 'Kupplung'
  and examples->0->>'de' = 'Der Fahrer tritt die Kupplung und schaltet einen Gang ein.';

-- The expression is "in puncto"; bare "puncto" is not used.
update words
set examples = jsonb_set(
  examples, '{0,de}',
  '"In puncto Sicherheit haben wir keine Bedenken."'::jsonb)
where word = 'puncto'
  and examples->0->>'de' = 'Puncto Sicherheit haben wir keine Bedenken.';

-- Same fix, plus the tense label: this sentence is Perfekt, not Präsens.
update words
set examples = jsonb_set(
  jsonb_set(
    examples, '{1,de}',
    '"In puncto Budget ist die Diskussion schwierig geworden."'::jsonb),
  '{1,tense}', '"Perfekt"'::jsonb)
where word = 'puncto'
  and examples->1->>'de' = 'Puncto Budget ist die Diskussion schwierig geworden.';

-- Missing article before Rückwärtsgang.
update words
set examples = jsonb_set(
  examples, '{0,de}',
  '"Der Fahrer legt den Rückwärtsgang ein, um aus der Parklücke zu fahren."'::jsonb)
where word = 'Rückwärtsgang einlegen'
  and examples->0->>'de' = 'Der Fahrer legt Rückwärtsgang ein, um aus der Parklücke zu fahren.';

update words
set examples = jsonb_set(
  examples, '{1,de}',
  '"Sie hat den Rückwärtsgang eingelegt und ist langsam rückwärts gefahren."'::jsonb)
where word = 'Rückwärtsgang einlegen'
  and examples->1->>'de' = 'Sie hat Rückwärtsgang eingelegt und ist langsam rückwärts gefahren.';

-- Both examples described a grinding point on a machine.
-- The card is about the clutch biting point.
update words
set examples = jsonb_set(examples, '{0}', '{
  "de": "Beim Anfahren suche ich zuerst den Schleifpunkt.",
  "tense": "Präsens",
  "translations": {
    "en": "When pulling away I first look for the biting point.",
    "ru": "Трогаясь с места, я сначала ищу точку схватывания.",
    "uk": "Рушаючи з місця, я спочатку шукаю точку зчеплення."
  }
}'::jsonb)
where word = 'Schleifpunkt'
  and examples->0->>'de' = 'Der Schleifpunkt befindet sich an der hinteren Ecke der Maschine.';

update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Ich habe den Schleifpunkt zu spät gefunden und den Motor abgewürgt.",
  "tense": "Perfekt",
  "translations": {
    "en": "I found the biting point too late and stalled the engine.",
    "ru": "Я слишком поздно нашёл точку схватывания и заглушил двигатель.",
    "uk": "Я надто пізно знайшов точку зчеплення і заглушив двигун."
  }
}'::jsonb)
where word = 'Schleifpunkt'
  and examples->1->>'de' = 'Wir haben den Schleifpunkt genau eingestellt.';

-- "ist unerlässlich gewesen" is not used; a real Perfekt needs a full verb.
update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Das Visum hat sich für die Reise als unerlässlich erwiesen.",
  "tense": "Perfekt",
  "translations": {
    "en": "The visa proved indispensable for the trip.",
    "ru": "Виза оказалась необходимой для поездки.",
    "uk": "Віза виявилася необхідною для подорожі."
  }
}'::jsonb)
where word = 'unerlässlich'
  and examples->1->>'de' = 'Das Visum ist für die Reise unerlässlich gewesen.';

-- Optional: the sentence is correct German but Präteritum, labelled Perfekt.
update words
set examples = jsonb_set(examples, '{1}', '{
  "de": "Über Nacht sind die Straßen vereist.",
  "tense": "Perfekt",
  "translations": {
    "en": "The roads iced over during the night.",
    "ru": "За ночь дороги покрылись льдом.",
    "uk": "За ніч дороги вкрилися кригою."
  }
}'::jsonb)
where word = 'vereist'
  and examples->1->>'de' = 'Am Morgen waren die Straßen vereist und glatt.';

commit;
