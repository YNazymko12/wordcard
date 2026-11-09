# scripts

One-off maintenance scripts. Not part of the app build.

## check-levels.py

Compares the `level` column of our words against the official Goethe-Institut
word lists for A1, A2 and B1. Prints the matching line from the list for every
hit, so each verdict can be checked by hand. It never writes to the database.

Official word lists exist only up to B1 — for B2, C1 and C2 the Goethe-Institut
publishes none, because those exams test text comprehension rather than a fixed
vocabulary. Words marked B2 and above are therefore reported as `unverifiable`.

`NOT IN LISTS` means the word is absent from all three lists. That is not an
error by itself: the exam lists do not cover specialised vocabulary (car parts,
for example).

### Setup

The lists are copyrighted by the Goethe-Institut. Download them for your own
use; they stay out of git (see `.gitignore`).

```bash
mkdir -p scripts/goethe
curl -o scripts/goethe/a1.pdf https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf
curl -o scripts/goethe/a2.pdf https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Wortliste.pdf
curl -o scripts/goethe/b1.pdf https://www.goethe.de/pro/relaunch/prf/da/Goethe-Zertifikat_B1_Wortliste.pdf
```

```bash
python3 -m venv scripts/venv && scripts/venv/bin/pip install pypdf
```

### Run

Export the words from Supabase as JSON (SQL editor):

```sql
select json_agg(json_build_object('word', word, 'level', level))
from public.words
where source_id is null;
```

Save the result as `scripts/goethe/words.json`, then:

```bash
scripts/venv/bin/python scripts/check-levels.py scripts/goethe scripts/goethe/words.json
```
