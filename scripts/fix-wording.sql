-- Wording corrections, reviewed 2026-11-19. Not errors: weak word choices.
-- Replacement phrasings were checked against Google Books Ngrams (German, 1990-2019).
-- Dollar quoting ($j$...$j$, $t$...$t$) avoids escaping apostrophes.
-- Every statement guards on the current German text.

begin;

-- "die Steuern verringern" does not occur; "den Abstand verringern" does,
-- and it belongs to this deck's driving vocabulary.
update words set examples = jsonb_set(examples, '{0}', $j$ {
  "de": "Der Fahrer verringert den Abstand zum Vordermann.",
  "tense": "Präsens",
  "translations": {
    "en": "The driver reduces the distance to the car in front.",
    "ru": "Водитель сокращает дистанцию до машины впереди.",
    "uk": "Водій скорочує дистанцію до машини попереду."
  }
} $j$::jsonb)
where word = 'verringern'
  and examples->0->>'de' = $t$Die Regierung verringert die Steuern.$t$;

-- "eine Lichthupe geben" is rare; "mit der Lichthupe" is 17x more frequent.
update words set examples = jsonb_set(examples, '{0}', $j$ {
  "de": "Der Fahrer warnt den anderen Wagen mit der Lichthupe.",
  "tense": "Präsens",
  "translations": {
    "en": "The driver warns the other car with a flash of the headlights.",
    "ru": "Водитель предупреждает другую машину, моргнув фарами.",
    "uk": "Водій попереджає іншу машину, блимнувши фарами."
  }
} $j$::jsonb)
where word = 'Lichthupe'
  and examples->0->>'de' = $t$Der Fahrer gibt eine Lichthupe, um den anderen Wagen zu warnen.$t$;

update words set examples = jsonb_set(examples, '{1}', $j$ {
  "de": "Ich habe ihn mit der Lichthupe gewarnt, weil er zu schnell fuhr.",
  "tense": "Perfekt",
  "translations": {
    "en": "I warned him with a flash of the headlights because he was driving too fast.",
    "ru": "Я предупредил его, моргнув фарами, потому что он ехал слишком быстро.",
    "uk": "Я попередив його, блимнувши фарами, бо він їхав занадто швидко."
  }
} $j$::jsonb)
where word = 'Lichthupe'
  and examples->1->>'de' = $t$Ich habe eine Lichthupe gegeben, weil das Auto zu schnell fuhr.$t$;

-- "die Bremse wirkt ruckartig" does not occur; a vehicle brakes jerkily.
update words set examples = jsonb_set(examples, '{0}', $j$ {
  "de": "Der Bus bremst ruckartig und alle halten sich fest.",
  "tense": "Präsens",
  "translations": {
    "en": "The bus brakes jerkily and everyone holds on.",
    "ru": "Автобус тормозит рывками, и все хватаются за поручни.",
    "uk": "Автобус гальмує ривками, і всі хапаються за поручні."
  }
} $j$::jsonb)
where word = 'ruckartig'
  and examples->0->>'de' = $t$Die Bremse wirkt ruckartig und unangenehm.$t$;

-- zulässig is about rules and limits, not about mistakes.
-- "zulässige Höchstgeschwindigkeit" is one of its strongest collocations.
update words set examples = jsonb_set(examples, '{0}', $j$ {
  "de": "Auf dieser Straße ist eine Geschwindigkeit von 50 km/h zulässig.",
  "tense": "Präsens",
  "translations": {
    "en": "On this road a speed of 50 km/h is permitted.",
    "ru": "На этой дороге допустима скорость 50 км/ч.",
    "uk": "На цій дорозі допустима швидкість 50 км/год."
  }
} $j$::jsonb)
where word = 'zulässig'
  and examples->0->>'de' = $t$Dieser Fehler ist im Examen nicht zulässig.$t$;

-- Einmündung: the card described a river confluence, but this deck is about
-- driving, and the road sense is the more frequent one.
update words set translations = jsonb_set(jsonb_set(jsonb_set(translations, '{ru}',
  to_jsonb($t$примыкание дороги, съезд$t$::text)), '{uk}',
  to_jsonb($t$примикання дороги, з'їзд$t$::text)), '{en}',
  to_jsonb($t$road junction, turn-off$t$::text))
where word = 'Einmündung' and translations->>'ru' = $t$впадение, слияние$t$;

update words set examples = jsonb_set(examples, '{0}', $j$ {
  "de": "An der Einmündung musst du dem Verkehr von rechts Vorfahrt gewähren.",
  "tense": "Präsens",
  "translations": {
    "en": "At the junction you have to give way to traffic from the right.",
    "ru": "На примыкании ты должен уступить дорогу транспорту справа.",
    "uk": "На примиканні ти маєш дати дорогу транспорту справа."
  }
} $j$::jsonb)
where word = 'Einmündung'
  and examples->0->>'de' = $t$Die Einmündung des Nebenflusses liegt südlich der Stadt.$t$;

update words set examples = jsonb_set(examples, '{1}', $j$ {
  "de": "Wir haben die Einmündung in die Hauptstraße fast übersehen.",
  "tense": "Perfekt",
  "translations": {
    "en": "We almost missed the junction onto the main road.",
    "ru": "Мы чуть не пропустили выезд на главную дорогу.",
    "uk": "Ми ледь не пропустили виїзд на головну дорогу."
  }
} $j$::jsonb)
where word = 'Einmündung'
  and examples->1->>'de' = $t$Wir sind bei der Einmündung angekommen und haben die beiden Flüsse gesehen.$t$;

-- weichen takes a dative: one yields TO something.
update words set examples = jsonb_set(examples, '{0}', $j$ {
  "de": "Der Schnee weicht der Frühlingssonne.",
  "tense": "Präsens",
  "translations": {
    "en": "The snow gives way to the spring sun.",
    "ru": "Снег отступает перед весенним солнцем.",
    "uk": "Сніг відступає перед весняним сонцем."
  }
} $j$::jsonb)
where word = 'weichen'
  and examples->0->>'de' = $t$Der Schnee weicht im Frühling.$t$;

-- "в состоянии ездить" / "у стані їхати" are calques of the German.
update words set translations = jsonb_set(jsonb_set(translations, '{ru}',
  to_jsonb($t$исправный, пригодный к движению$t$::text)), '{uk}',
  to_jsonb($t$справний, придатний до руху$t$::text))
where word = 'fahrtüchtig' and translations->>'ru' = $t$пригодный к дороге, в состоянии ездить$t$;

-- A car is not the one doing the driving.
update words set examples = jsonb_set(examples, '{0}', $j$ {
  "de": "Das Auto ist nicht fahrtüchtig und darf nicht mehr gefahren werden.",
  "tense": "Präsens",
  "translations": {
    "en": "The car is not roadworthy and must no longer be driven.",
    "ru": "Машина неисправна, и на ней больше нельзя ездить.",
    "uk": "Машина несправна, і нею більше не можна їздити."
  }
} $j$::jsonb)
where word = 'fahrtüchtig'
  and examples->0->>'de' = $t$Das Auto ist nicht fahrtüchtig und darf nicht fahren.$t$;

-- Both examples should show the same sense. The first is a rear-end collision,
-- the second was the unrelated "to start up in fright".
update words set examples = jsonb_set(examples, '{1}', $j$ {
  "de": "Er ist bei Nebel auf einen Lastwagen aufgefahren.",
  "tense": "Perfekt",
  "translations": {
    "en": "In fog he rear-ended a truck.",
    "ru": "В тумане он врезался в грузовик.",
    "uk": "У тумані він врізався у вантажівку."
  }
} $j$::jsonb)
where word = 'auffahren'
  and examples->1->>'de' = $t$Sie ist beim lauten Knall aufgefahren.$t$;

-- Same reason: the first example starts an engine, the second left a heater on.
update words set examples = jsonb_set(examples, '{1}', $j$ {
  "de": "Bei der Kälte hat sie den Motor nur schwer angelassen.",
  "tense": "Perfekt",
  "translations": {
    "en": "In the cold she had trouble starting the engine.",
    "ru": "На морозе она с трудом завела двигатель.",
    "uk": "На морозі вона насилу завела двигун."
  }
} $j$::jsonb)
where word = 'anlassen'
  and examples->1->>'de' = $t$Sie hat die Heizung angelassen.$t$;

-- "Abblendlicht anmachen" does not occur in writing; einschalten does.
update words set examples = jsonb_set(examples, '{1,de}',
  to_jsonb($t$Der Fahrer hat das Abblendlicht zu spät eingeschaltet.$t$::text))
where word = 'Abblendlicht'
  and examples->1->>'de' = $t$Der Fahrer hat das Abblendlicht zu spät angemacht.$t$;

commit;
