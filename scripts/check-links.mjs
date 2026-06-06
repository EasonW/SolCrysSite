/**
 * check-links.mjs — internal dead-link gate for the prerendered site.
 *
 * Runs after `vite build && prerender` (see package.json "build"). It scans every
 * built HTML file in dist/ and fails the build if any INTERNAL link (relative `/…`
 * or absolute `https://solcrys.com/…`) does not resolve to a real built route or
 * static asset.
 *
 * Why this exists: resource pages render at ROOT `/<slug>/` — there is no
 * `/resources/<slug>/` route — and CTAs live on the app (app.solcrys.com/audit,
 * app.solcrys.com/contact-sales/), NOT on invented marketing-root paths like
 * `/free-audit/`, `/contact/`, `/pricing-alerts/`, or `/methodology`. Those
 * mistakes ship 404s that crawlers (and AI engines) penalize. This catches them
 * before deploy. See solcrys_content_system/pre_publication_checklist_v1.md §F.
 *
 * External links (app.solcrys.com, third-party domains), mailto:, tel:, #anchors,
 * and data: URIs are intentionally NOT validated here — they are not 404-checkable
 * from a static build. The crawl/CSV pass covers those.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(rootDir, "dist");

if (!fs.existsSync(dist)) {
  console.error("check-links: dist/ not found — run the build first.");
  process.exit(1);
}

// 1) Build the set of valid internal paths from what was actually built.
const validPaths = new Set(["/"]);
function indexDist(dir, base = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = base + "/" + entry.name;
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(full, "index.html"))) {
        validPaths.add(rel + "/");
        validPaths.add(rel); // tolerate missing trailing slash
      }
      indexDist(full, rel);
    } else {
      validPaths.add(rel); // any real file is a valid asset target
    }
  }
}
indexDist(dist);

// 2) Collect every built HTML file.
const htmlFiles = [];
function findHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findHtml(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
findHtml(dist);

// 3) Extract internal links and validate.
const broken = new Map(); // target -> Set(source routes)
let totalInternal = 0;
const SKIP = /^(mailto:|tel:|#|javascript:|data:)/i;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const sourceRoute =
    "/" + path.relative(dist, file).replace(/index\.html$/, "").replace(/\.html$/, "");
  const re = /href=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) {
    let u = m[1].trim();
    if (SKIP.test(u)) continue;
    let pathname = null;
    if (u.startsWith("/")) pathname = u;
    else {
      try {
        const url = new URL(u);
        if (url.host === "solcrys.com") pathname = url.pathname;
      } catch {
        continue;
      }
    }
    if (pathname === null) continue; // external domain — out of scope
    const clean = pathname.split("#")[0].split("?")[0];
    if (clean === "") continue; // pure fragment/query on current page
    totalInternal++;
    const candidates = [clean, clean.endsWith("/") ? clean.slice(0, -1) : clean + "/"];
    if (!candidates.some((c) => validPaths.has(c))) {
      if (!broken.has(clean)) broken.set(clean, new Set());
      broken.get(clean).add(sourceRoute);
    }
  }
}

if (broken.size === 0) {
  console.log(
    `check-links: OK — ${htmlFiles.length} pages, ${totalInternal} internal links, 0 broken.`
  );
  process.exit(0);
}

console.error(
  `\ncheck-links: FAIL — ${broken.size} broken internal target(s) across ${htmlFiles.length} pages:\n`
);
for (const target of [...broken.keys()].sort()) {
  const sources = [...broken.get(target)];
  console.error(`  [404] ${target}  (linked from ${sources.length} page(s))`);
  for (const s of sources.slice(0, 8)) console.error(`        <- ${s}`);
  if (sources.length > 8) console.error(`        ... +${sources.length - 8} more`);
}
console.error(
  "\nFix: resource pages live at ROOT `/<slug>/` (no `/resources/` prefix); audit/contact CTAs" +
    " point to app.solcrys.com/audit and app.solcrys.com/contact-sales/. See" +
    " pre_publication_checklist_v1.md §F.\n"
);
process.exit(1);
