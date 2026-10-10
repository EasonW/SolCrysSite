"""Publish one user guide from its source PDF without changing the source.

Requires PyMuPDF. Add the guide to src/content/userGuides.json first, then:
  python3 scripts/add-user-guide.py <slug> /path/to/source.pdf

Writes the published PDF (chapter bookmarks, language, links to the other
guides and from the overview's Page column), the cover, the numbered page
previews, the page text, and the manifest's file size. The guide's wording is
not edited: review the source against the app before publishing it.
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "src/content/userGuides.json"
TRANSCRIPTS = ROOT / "src/content/userGuideText.json"
DEST = ROOT / "public/guides"
SLUG = sys.argv[1]
SOURCE = Path(sys.argv[2]).resolve()

data = json.loads(MANIFEST.read_text())
guide = next(item for item in data["guides"] if item["slug"] == SLUG)
output = DEST / Path(guide["pdf"]).name
assert SOURCE != output.resolve(), "Use the source PDF, not the published copy."


def render(page, height, path):
    zoom = height / page.rect.height
    page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False).save(path, jpg_quality=88)


doc = fitz.open(SOURCE)
assert len(doc) == guide["pages"], f'{SOURCE.name} has {len(doc)} pages; the manifest says {guide["pages"]}'
doc.set_toc([[1, chapter["title"], chapter["page"]] for chapter in guide["chapters"]])
doc.set_language("en-US")
doc.set_metadata({
    **{key: value for key, value in doc.metadata.items() if key not in ("format", "encryption")},
    "title": f'SolCrys | {guide["title"]}',
    "author": "SolCrys",
})
for other in data["guides"]:
    if other["slug"] == SLUG:
        continue
    for page in doc:
        for rect in page.search_for(other["title"]):
            page.insert_link({"kind": fitz.LINK_URI, "from": rect, "uri": f'https://solcrys.com/guides/{other["slug"]}/'})
# Make the overview's Page column clickable: each number or range under the
# "Page" header jumps to its first page.
cover = doc[0]
words = cover.get_text("words")
headers = [word for word in words if word[4] == "Page"]
linked = 0
if len(headers) == 1:
    header = headers[0]
    for x0, y0, x1, y1, text, *_ in words:
        match = re.fullmatch(r"(\d+)(?:[-–]\d+)?", text)
        if match and abs(x0 - header[0]) < 2 and y0 > header[3] and 1 <= int(match[1]) <= len(doc):
            cover.insert_link({"kind": fitz.LINK_GOTO, "from": fitz.Rect(x0, y0, x1, y1), "page": int(match[1]) - 1})
            linked += 1
doc.save(output, garbage=4, deflate=True)
doc.close()

doc = fitz.open(output)
transcripts = json.loads(TRANSCRIPTS.read_text())
transcripts[SLUG] = [unicodedata.normalize("NFKC", page.get_text(sort=True)).strip() for page in doc]
assert all(transcripts[SLUG]), "Every page needs text; a scanned page cannot be read in the website's text view."
preview_dir = DEST / SLUG
preview_dir.mkdir(exist_ok=True)
for stale in preview_dir.glob("page-*.jpg"):
    stale.unlink()
for number, page in enumerate(doc, start=1):
    render(page, 1500, preview_dir / f"page-{number:02d}.jpg")
render(doc[0], 900, DEST / Path(guide["cover"]).name)
doc.close()

guide["fileSize"] = f"{output.stat().st_size / (1024 * 1024):.1f} MB"
MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
TRANSCRIPTS.write_text(json.dumps(transcripts, indent=2, ensure_ascii=False) + "\n")
print(f'Prepared {output.name}: {guide["pages"]} pages, {guide["fileSize"]}, {linked} overview links')
