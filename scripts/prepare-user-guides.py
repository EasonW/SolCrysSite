"""Prepare the September 2026 guides for publication without changing originals.

Requires PyMuPDF. Run with the directory containing the original PDFs:
  python3 scripts/prepare-user-guides.py /path/to/originals [/path/to/Arial.ttf]

The corrections are intentionally tied to this edition. Assertions stop a later
edition from being edited at stale coordinates. Render and inspect changed pages.
"""

import json
import inspect
import subprocess
import sys
import unicodedata
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "src/content/userGuides.json"
SOURCE = Path(sys.argv[1]).resolve()
DEST = ROOT / "public/guides"
FONT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("/System/Library/Fonts/Supplemental/Arial.ttf")
assert SOURCE != DEST.resolve(), "Use the originals, not the published copies."
assert FONT.is_file(), "Pass the path to Arial.ttf as the second argument."


def replace_lines(doc, page_number, originals, replacements, size, x, baseline, leading):
    page = doc[page_number - 1]
    rects = []
    for original in originals:
        matches = page.search_for(original)
        assert len(matches) == 1, f"Expected exactly one match on page {page_number}: {original}"
        rects.extend(matches)
    # A ReportLab subset does not retain the complete Unicode mapping needed
    # for new text. Embed the full matching font, never reuse its subset.
    font = fitz.Font(fontfile=str(FONT))
    for replacement in replacements:
        assert font.text_length(replacement, fontsize=size) <= 551.2756 - x, "Text exceeds column width"
    for rect in rects:
        page.add_redact_annot(rect, fill=(1, 1, 1))
    options = {"images": 0}
    if "graphics" in inspect.signature(page.apply_redactions).parameters:
        options["graphics"] = 0
    page.apply_redactions(**options)
    page.insert_font(fontname="GuideBody", fontfile=str(FONT))
    for offset, replacement in enumerate(replacements):
        page.insert_text((x, baseline + offset * leading), replacement, fontname="GuideBody", fontsize=size, color=(35/255, 54/255, 73/255))


data = json.loads(MANIFEST.read_text())
transcripts = {}
for guide in data["guides"]:
    filename = Path(guide["pdf"]).name
    doc = fitz.open(SOURCE / filename)
    assert len(doc) == guide["pages"]
    if guide["slug"] == "aeo-dashboards-and-tools":
        replace_lines(doc, 2, [
            "How often your brand appears in the selected measured answers. In this example,",
            "50% means one in two responses.",
        ], [
            "Average mention rate across runs, weighted by the configured engine mix.",
            "A 50% rate does not necessarily mean half of all raw responses.",
        ], 9.5, 193, 584.9667, 13)
    else:
        replace_lines(doc, 10, [
            "2. Read the current state: Open to all means all organization members can open it; Custom access limits",
            "access to the listed members.",
        ], [
            "2. Open to all allows every organization member. Custom access limits other members to the list;",
            "organization admins retain access to every workspace.",
        ], 10.5, 44, 361.5101, 15.4)
        replace_lines(doc, 10, [
            "3. Choose Restrict to specific people or Manage who can access. Add existing organization members or",
            "remove access as needed, then select Done.",
        ], [
            "3. Choose Restrict to specific people or Manage who can access. Add or remove existing members.",
            "Changes apply immediately. Done only closes the editor.",
        ], 10.5, 44, 399.3101, 15.4)

    doc.set_toc([[1, chapter["title"], chapter["page"]] for chapter in guide["chapters"]])
    doc.set_language("en-US")
    companion = next(item for item in data["guides"] if item["slug"] != guide["slug"])
    for page in doc:
        for rect in page.search_for(companion["title"]):
            page.insert_link({"kind": fitz.LINK_URI, "from": rect, "uri": f'https://solcrys.com/guides/{companion["slug"]}/'})
    # Make the overview's page-number column clickable while preserving its layout.
    cover = doc[0]
    page_labels = [(str(n), n) for n in range(2, 11)] if guide["slug"] == "aeo-dashboards-and-tools" else [("2-4", 2), ("5-7", 5), ("8-9", 8), ("10-11", 10), ("12", 12)]
    for label, target_page in page_labels:
        for rect in cover.search_for(label):
            in_column = rect.x0 < 90 if guide["slug"] == "aeo-dashboards-and-tools" else rect.x0 > 490
            if in_column and 150 < rect.y0 < 690:
                cover.insert_link({"kind": fitz.LINK_GOTO, "from": rect, "page": target_page - 1})
    output = DEST / filename
    doc.save(output, garbage=4, deflate=True)
    transcripts[guide["slug"]] = [unicodedata.normalize("NFKC", page.get_text(sort=True)).strip() for page in doc]
    doc.close()
    guide["fileSize"] = f"{output.stat().st_size / (1024 * 1024):.1f} MB"
    preview_dir = DEST / guide["slug"]
    preview_dir.mkdir(exist_ok=True)
    subprocess.run(["pdftoppm", "-scale-to", "1500", "-jpeg", "-jpegopt", "quality=88", str(output), str(preview_dir / "page")], check=True)
    print(f"Prepared {filename}: {guide['pages']} pages, {guide['fileSize']}")

MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
(ROOT / "src/content/userGuideText.json").write_text(json.dumps(transcripts, indent=2, ensure_ascii=False) + "\n")
