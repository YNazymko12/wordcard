-- Corrections to the Ukrainian translations, reviewed 2026-11-19.
-- Dollar quoting ($t$...$t$) is used throughout so apostrophes in Ukrainian
-- text (з'являються, м'яч, сім'єю) need no escaping.
-- Every statement guards on the current value and skips an already edited row.

begin;

-- ---------------------------------------------------------------- headwords

-- "світ" is world; a headlight is "світло".
update words set translations = jsonb_set(translations, '{uk}',
  to_jsonb($t$ближнє світло$t$::text))
where word = 'Abblendlicht' and translations->>'uk' = $t$ближній світ$t$;

-- "буксувати" means to spin the wheels; towing is "буксирувати".
update words set translations = jsonb_set(translations, '{uk}',
  to_jsonb($t$буксирувати$t$::text))
where word = 'abschleppen' and translations->>'uk' = $t$буксувати$t$;

-- An Einsatzfahrzeug is an emergency service vehicle, not a broken-down car.
update words set translations = jsonb_set(jsonb_set(translations, '{uk}',
  to_jsonb($t$автомобіль екстрених служб$t$::text)), '{ru}',
  to_jsonb($t$автомобиль экстренных служб$t$::text))
where word = 'Einsatzfahrzeug' and translations->>'uk' = $t$аварійний автомобіль$t$;

-- unerlässlich is indispensable, not inevitable.
update words set translations = jsonb_set(jsonb_set(translations, '{uk}',
  to_jsonb($t$необхідний, конче потрібний$t$::text)), '{ru}',
  to_jsonb($t$необходимый, крайне важный$t$::text))
where word = 'unerlässlich' and translations->>'uk' = $t$необхідний, невідворотний$t$;

-- Left over from the grinding sense; the card and both examples are about the clutch.
update words set translations = jsonb_set(jsonb_set(jsonb_set(translations, '{uk}',
  to_jsonb($t$точка зчеплення$t$::text)), '{ru}',
  to_jsonb($t$точка схватывания сцепления$t$::text)), '{en}',
  to_jsonb($t$clutch biting point$t$::text))
where word = 'Schleifpunkt' and translations->>'uk' = $t$точка шліфування$t$;

-- The example uses a screwdriver, so this is a screw, not a bolt.
update words set translations = jsonb_set(translations, '{ru}',
  to_jsonb($t$винт, шуруп$t$::text))
where word = 'Schraube' and translations->>'ru' = $t$болт$t$;

-- "обуздати" is Russian; Ukrainian is "приборкувати".
update words set translations = jsonb_set(translations, '{uk}',
  to_jsonb($t$стримувати, приборкувати$t$::text))
where word = 'zügeln' and translations->>'uk' = $t$стримувати, обуздати$t$;

-- "скритно" is Russian; and the infinitive takes -ся.
update words set translations = jsonb_set(translations, '{uk}',
  to_jsonb($t$крастися, пересуватися крадькома$t$::text))
where word = 'schleichen' and translations->>'uk' = $t$крастись, скритно переміщатися$t$;

-- "включити" is a Russianism in this sense.
update words set translations = jsonb_set(translations, '{uk}',
  to_jsonb($t$увімкнути задній хід$t$::text))
where word = 'Rückwärtsgang einlegen' and translations->>'uk' = $t$включити задній хід$t$;

-- The same word twice; the first gloss should be "відволікання".
update words set translations = jsonb_set(translations, '{uk}',
  to_jsonb($t$відволікання, відвернення уваги$t$::text))
where word = 'Ablenkung' and translations->>'uk' = $t$відвернення, відвернення уваги$t$;

-- ---------------------------------------------------------------- examples

update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$У сутінках я вмикаю ближнє світло.$t$::text))
where word = 'Abblendlicht'
  and examples->0->'translations'->>'uk' = $t$У сутінках я включаю ближній світ.$t$;

update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Водій увімкнув ближнє світло занадто пізно.$t$::text))
where word = 'Abblendlicht'
  and examples->1->'translations'->>'uk' = $t$Водій включив ближній світ занадто пізно.$t$;

-- "відвернешням" is not a word.
update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Він скористався відволіканням, щоб вийти з кімнати.$t$::text))
where word = 'Ablenkung'
  and examples->1->'translations'->>'uk' = $t$Він скористався відвернешням, щоб вийти з кімнати.$t$;

update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Механік буксирує автомобіль.$t$::text))
where word = 'abschleppen'
  and examples->0->'translations'->>'uk' = $t$Механік буксує автомобіль.$t$;

update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Поліція відбуксирувала неправильно припаркований автомобіль.$t$::text))
where word = 'abschleppen'
  and examples->1->'translations'->>'uk' = $t$Поліція буксувала неправильно припаркований автомобіль.$t$;

-- The discussion did not start, so it cannot be the one doing the starting.
update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Вона перервала дискусію, перш ніж та встигла початися.$t$::text))
where word = 'abwürgen'
  and examples->1->'translations'->>'uk' = $t$Вона перервала дискусію, перш ніж вона могла почати.$t$;

update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Вона увімкнула опалення.$t$::text))
where word = 'anlassen'
  and examples->1->'translations'->>'uk' = $t$Вона включила опалення.$t$;

-- "запотівати" is already intransitive; the reflexive form is wrong.
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Взимку автомобільне скло швидко запотіває.$t$::text))
where word = 'beschlagen'
  and examples->0->'translations'->>'uk' = $t$Взимку автомобільне скло швидко запотівається.$t$;

-- "прискорювати" is transitive and had no object here.
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Водій прискорюється на автостраді.$t$::text))
where word = 'beschleunigen'
  and examples->0->'translations'->>'uk' = $t$Водій прискорює на автостраді.$t$;

update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Пожежна служба їде до місця аварії на своєму спецавтомобілі.$t$::text))
where word = 'Einsatzfahrzeug'
  and examples->0->'translations'->>'uk' = $t$Пожежна служба їде до місця аварії на своєму аварійному автомобілі.$t$;

update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Поліцейський спецавтомобіль щойно прибув.$t$::text))
where word = 'Einsatzfahrzeug'
  and examples->1->'translations'->>'uk' = $t$Поліцейський аварійний автомобіль щойно прибув.$t$;

-- "зі" before the сп- cluster.
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Зі співпраці з'являються нові ідеї.$t$::text))
where word = 'entstehen'
  and examples->0->'translations'->>'uk' = $t$З співпраці з'являються нові ідеї.$t$;

-- "призвести до" is the fixed expression.
update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Загроза безпеці робітників призвела до нових правил безпеки.$t$::text))
where word = 'Gefährdung'
  and examples->1->'translations'->>'uk' = $t$Загроза безпеці робітників привела до нових правил безпеки.$t$;

-- "собака" is masculine in Ukrainian, as in the card's first example.
update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Собака приніс м'яч.$t$::text))
where word = 'Hund'
  and examples->1->'translations'->>'uk' = $t$Собака принесла м'яч.$t$;

update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Водій натискає на зчеплення і вмикає передачу.$t$::text))
where word = 'Kupplung'
  and examples->0->'translations'->>'uk' = $t$Водій натискає на зчеплення і включає передачу.$t$;

-- One flight, not repeated flying; and "через повітря" is a calque.
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Стріла швидко летить у повітрі.$t$::text))
where word = 'Pfeil'
  and examples->0->'translations'->>'uk' = $t$Стріла швидко літає через повітря.$t$;

-- "своих" is the Russian spelling.
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Вона враховує потреби своїх дітей.$t$::text))
where word = 'Rücksicht'
  and examples->0->'translations'->>'uk' = $t$Вона враховує потреби своих дітей.$t$;

update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Водій вмикає задній хід, щоб виїхати з місця паркування.$t$::text))
where word = 'Rückwärtsgang einlegen'
  and examples->0->'translations'->>'uk' = $t$Водій включає задній хід, щоб виїхати з місця паркування.$t$;

update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Вона увімкнула задній хід і повільно їхала назад.$t$::text))
where word = 'Rückwärtsgang einlegen'
  and examples->1->'translations'->>'uk' = $t$Вона включила задній хід і повільно їхала назад.$t$;

-- One trip, so "їду", not the repeated "їжджу".
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Я їду у відпустку разом зі своєю сім'єю.$t$::text))
where word = 'samt'
  and examples->0->'translations'->>'uk' = $t$Я їжджу у відпустку разом зі своєю сім'єю.$t$;

-- "краститься" is not a word, and one sneaks along an alley, not through it.
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Злодій крадеться темним провулком.$t$::text))
where word = 'schleichen'
  and examples->0->'translations'->>'uk' = $t$Злодій краститься крізь темну вулицю.$t$;

-- "крастився" is not a word; die Katze is feminine, as on the Katze card.
update words set examples = jsonb_set(examples, '{1,translations,uk}',
  to_jsonb($t$Кішка тихо прокралася на кухню.$t$::text))
where word = 'schleichen'
  and examples->1->'translations'->>'uk' = $t$Кіт тихо крастився на кухню.$t$;

-- Written as one word when nothing is contrasted.
update words set examples = jsonb_set(examples, '{0,translations,uk}',
  to_jsonb($t$Ця помилка на екзамені недопустима.$t$::text))
where word = 'zulässig'
  and examples->0->'translations'->>'uk' = $t$Ця помилка на екзамені не допустима.$t$;

commit;
