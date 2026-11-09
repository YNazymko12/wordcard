"""Compare word levels against the official Goethe-Institut word lists.

Reports only; it never writes to the database. See scripts/README.md.
"""

import json
import re
import sys
from pypdf import PdfReader

LEVELS = ["A1", "A2", "B1"]


def text_of(path):
    return "\n".join(page.extract_text() or "" for page in PdfReader(path).pages)


def headword_hits(word, text):
    """Lines where `word` looks like a list entry: at line start, after an
    optional article, ending on a boundary. Returns the matching lines so a
    human can check every hit instead of trusting the match."""
    pattern = (
        r"^[ \t]{0,6}(?:der[ \t]+|die[ \t]+|das[ \t]+)?"
        + re.escape(word).replace(r"\ ", r"[ \t]+")
        + r"(?=$|[ \t,;:.!?/()\-])"
    )
    return [
        re.sub(r"[ \t]+", " ", line).strip()
        for line in text.split("\n")
        if re.match(pattern, line)
    ]


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: check-levels.py <pdf-dir> <words.json>")

    pdf_dir, words_path = sys.argv[1], sys.argv[2]
    texts = {level: text_of(f"{pdf_dir}/{level.lower()}.pdf") for level in LEVELS}

    with open(words_path, encoding="utf-8") as handle:
        words = json.load(handle)

    counts = {}

    for entry in sorted(words, key=lambda item: (item["level"], item["word"])):
        word, ours = entry["word"], entry["level"]
        hits = {level: headword_hits(word, texts[level]) for level in LEVELS}
        found = [level for level in LEVELS if hits[level]]
        goethe = found[0] if found else None

        if goethe == ours:
            verdict = "ok"
        elif goethe:
            verdict = f"MISMATCH ours={ours} goethe={goethe}"
        elif ours in LEVELS:
            verdict = f"NOT IN LISTS ours={ours}"
        else:
            verdict = f"unverifiable ours={ours}"

        counts[verdict.split()[0]] = counts.get(verdict.split()[0], 0) + 1
        print(f"{word!r:34} {verdict}")

        for level in found:
            for line in hits[level][:2]:
                print(f"{'':36}{level} | {line[:70]}")

    print()
    for verdict, count in sorted(counts.items()):
        print(f"{verdict:14} {count}")


if __name__ == "__main__":
    main()
