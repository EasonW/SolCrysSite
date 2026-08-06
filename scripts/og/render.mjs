#!/usr/bin/env node
/**
 * Reusable OG-image renderer for SolCrysSite.
 *
 * Reads:
 *   src/content/siteContent.json   (homepage + resourcePages[])
 *   src/content/newsroom.json      (newsroom posts[])
 *
 * Emits one 1200×630 PNG per entry that has an `ogImage` field, to:
 *   public/og/<slug>.png
 *
 * Implementation:
 *   - Pure HTML/CSS template (./template.html) with placeholder tokens.
 *   - System fonts only — no Google Fonts fetch — so headless Chrome
 *     renders deterministically without network or font-load timing.
 *   - System Chrome via `--headless=new --screenshot` (no npm deps).
 *
 * Usage:
 *   node scripts/og/render.mjs                              # render all
 *   node scripts/og/render.mjs --only=<slug>                # render one
 *   node scripts/og/render.mjs --list                       # list targets
 *   node scripts/og/render.mjs --dry-run                    # no PNGs written
 *   node scripts/og/render.mjs --force                      # overwrite existing
 *
 * No console emojis. No frameworks. Outputs are .gitignored at the repo
 * level only if you choose; by default they live under public/og/ so the
 * site's <meta property="og:image"> URLs resolve once built.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ----- paths -----
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const SITE_JSON = join(REPO_ROOT, "src", "content", "siteContent.json");
const NEWS_JSON = join(REPO_ROOT, "src", "content", "newsroom.json");
const PULSE_JSON = join(REPO_ROOT, "src", "content", "promptPulse.json");
const TEMPLATE = join(__dirname, "template.html");
const OUT_DIR = join(REPO_ROOT, "public", "og");
const TMP_DIR = join(__dirname, ".tmp");
const LOGO_PATH = join(REPO_ROOT, "public", "brand", "solcrys-logo-white.png");
const LOGO_SRC = `file://${LOGO_PATH}`;

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// ----- args -----
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

// ----- helpers -----
const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Build the title HTML.
 * - Explicit `ogTitleParts: [setup, punch]` always wins (manual override).
 * - Else, if the title contains a sentence break (". "), split on it and
 *   render dual-weight (lighter "setup" + bold "punch", with an aqua
 *   accent on the punch's final word).
 * - Else, render the whole title as a single bold block.
 *
 * Also returns a size token (xl/lg/md/sm) so we don't blow the canvas
 * on long titles.
 */
function buildTitleHtml(entry) {
  const explicit = entry.ogTitleParts;
  const raw = entry.ogTitle ?? entry.h1 ?? entry.title ?? "";

  let setup = null;
  let punch = raw.trim().replace(/\s+/g, " ");

  if (Array.isArray(explicit) && explicit.length >= 2) {
    setup = explicit[0];
    punch = explicit.slice(1).join(" ");
  } else {
    // sentence-break split: "Production Is Cheap. Trust Is Scarce." → 2 parts
    const m = punch.match(/^(.+?\.)\s+(.+)$/);
    if (m && m[1].length <= 30 && m[2].length <= 40) {
      setup = m[1];
      punch = m[2];
    }
  }

  // pick a size that fits — rough char-count heuristic across both lines
  const totalChars = (setup ? setup.length : 0) + punch.length;
  let size = "xl";
  if (totalChars > 36) size = "lg";
  if (totalChars > 52) size = "md";
  if (totalChars > 72) size = "sm";

  let html;
  if (setup) {
    // accent the final word of the punch line for the dual-weight variant
    const punchParts = punch.split(/(\s+)/);
    const lastWordIdx = (() => {
      for (let i = punchParts.length - 1; i >= 0; i--) {
        if (punchParts[i].trim()) return i;
      }
      return -1;
    })();
    const punchHtml = punchParts
      .map((tok, i) =>
        i === lastWordIdx
          ? `<span class="accent">${escapeHtml(tok)}</span>`
          : escapeHtml(tok)
      )
      .join("");
    html =
      `<span class="setup">${escapeHtml(setup)}</span>` +
      `<span class="punch">${punchHtml}</span>`;
  } else {
    html = escapeHtml(punch);
  }
  return { html, size };
}

function buildSubtitle(entry) {
  if (entry.ogSubtitle) return entry.ogSubtitle;
  if (entry.dek) return entry.dek;
  const desc = entry.description ?? entry.summary ?? "";
  // collapse whitespace and cap at ~180 chars (will be clamped to 2 lines by CSS too)
  const collapsed = String(desc).replace(/\s+/g, " ").trim();
  return collapsed.length > 180 ? collapsed.slice(0, 177) + "…" : collapsed;
}

function buildByline(entry) {
  const parts = [];
  if (entry.author?.name) parts.push(entry.author.name);
  parts.push("solcrys.com");
  const date = entry.updated ?? entry.datePublished ?? entry.date;
  if (date) parts.push(date);
  return parts
    .map((p, i) =>
      i === parts.length - 2 && p === "solcrys.com"
        ? `<span class="domain">${escapeHtml(p)}</span>`
        : p === "solcrys.com"
          ? `<span class="domain">${escapeHtml(p)}</span>`
          : escapeHtml(p)
    )
    .join('<span class="sep">·</span>');
}

function buildEyebrow(entry) {
  if (entry.ogEyebrow) return entry.ogEyebrow;
  if (entry.category) return entry.category;
  if (entry.tag) return entry.tag;
  if (entry.kind) return entry.kind.replace(/-/g, " ");
  return "SolCrys";
}

function deriveSlugFromOgImage(ogImage) {
  // "/og/foo-bar.png" → "foo-bar"
  if (!ogImage) return null;
  const m = ogImage.match(/\/og\/([^/]+?)\.png$/);
  return m ? m[1] : null;
}

// ----- collect render targets -----
function collectTargets() {
  const site = JSON.parse(readFileSync(SITE_JSON, "utf8"));
  const news = JSON.parse(readFileSync(NEWS_JSON, "utf8"));
  const promptPulse = JSON.parse(readFileSync(PULSE_JSON, "utf8"));

  const targets = [];

  // Homepage card — declared at home.ogImage in siteContent.json (the
  // legacy `site.ogImage` read pointed at a key that never existed, so
  // the homepage silently shipped on the fallback card).
  if (site.home?.ogImage) {
    targets.push({
      source: "site",
      slug: deriveSlugFromOgImage(site.home.ogImage) ?? "home",
      entry: {
        title: site.home.title,
        description: site.home.description,
        category: "Governed AEO Execution",
        updated: null,
      },
    });
  }

  // Static hub pages — routes prerendered by scripts/prerender.mjs that
  // have no siteContent entry of their own. Slugs must match the
  // `/og/<slug>.png` paths passed to renderLayout there.
  const staticHubs = [
    {
      slug: "about",
      title: "The team behind SolCrys",
      description: "Built by search, growth, data, and product operators to connect AI visibility measurement with evidence-backed content action.",
      category: "About SolCrys",
    },
    {
      slug: "customers",
      title: "How leading brands show up in AI answers",
      description: "Customer stories from NextSilicon, Wyze, UiPath and more — measurable visibility, accuracy, and trust across AI engines.",
      category: "Customer Stories",
    },
    {
      slug: "customers-nextsilicon",
      title: "NextSilicon: 4x share of voice in 45 days",
      description: "How a challenger in HPC & AI infrastructure closed the AI visibility gap with entrenched incumbents.",
      category: "Case Study",
    },
    {
      slug: "resources",
      title: "Practical guides for AI search visibility",
      description: "The SolCrys AEO resource hub: measurement, citations, engine-specific optimization, and buyer guides.",
      category: "AEO Resource Hub",
    },
    {
      slug: "compare",
      title: "How SolCrys compares",
      description: "Side-by-side comparisons against Profound, Peec AI, Otterly, AirOps, HubSpot AEO, Semrush, and Ahrefs Brand Radar.",
      category: "Competitor Comparisons",
    },
    {
      slug: "news",
      title: "SolCrys Newsroom",
      description: "Press releases, founder notes, and announcements from SolCrys.",
      category: "Newsroom",
    },
    {
      slug: "prompt-pulse",
      title: "What your market is asking AI",
      description: "AI demand data: the real prompts buyers ask ChatGPT, Perplexity and Google AI Overviews across industries.",
      category: "Prompt Pulse",
    },
    {
      slug: "learn",
      title: "Free courses on Answer Engine Optimization",
      description: "Self-paced, open, free to read in full — no login, no email gate. Labs run on a free SolCrys account.",
      category: "Learn",
    },
    {
      // Matches courseContent.json → courses[0].ogImage (/og/learn-aeo-operator.png).
      slug: "learn-aeo-operator",
      title: "AEO Operator",
      description: "Measure, diagnose, act, verify — the whole loop, on a free account. 7 modules, 22 lessons, free to read.",
      category: "Free Course",
    },
  ];
  for (const hub of staticHubs) {
    targets.push({ source: "static", slug: hub.slug, entry: hub });
  }

  // Prompt Pulse verticals — slugs match `/og/prompt-pulse-<slug>.png`
  // in prerender.mjs.
  for (const v of promptPulse.verticals ?? []) {
    targets.push({
      source: "pulse",
      slug: `prompt-pulse-${v.slug}`,
      entry: {
        title: `${v.short}: what buyers ask AI`,
        description: `${v.stats?.prompts ?? ""} real buyer prompts ${v.short} teams should track in AI answers, rated by demand tier and trend.`,
        category: "Prompt Pulse",
        // No date in the byline: an OG card is cached and reshared for months,
        // so a stamped snapshot date is the first thing to read as stale.
      },
    });
  }

  // Resource pages
  for (const p of site.resourcePages ?? []) {
    if (!p.ogImage) continue;
    const slug = deriveSlugFromOgImage(p.ogImage) ?? p.slug;
    targets.push({ source: "resource", slug, entry: p });
  }

  // Newsroom posts (only if they declare an ogImage; otherwise skip)
  for (const post of news.posts ?? []) {
    if (!post.ogImage) continue;
    const slug = deriveSlugFromOgImage(post.ogImage) ?? post.slug;
    targets.push({ source: "newsroom", slug, entry: post });
  }

  return targets;
}

function renderOneHtml(target) {
  const tpl = readFileSync(TEMPLATE, "utf8");
  const eyebrow = escapeHtml(buildEyebrow(target.entry));
  const { html: titleHtml, size } = buildTitleHtml(target.entry);
  const subtitle = escapeHtml(buildSubtitle(target.entry));
  const byline = buildByline(target.entry);

  return tpl
    .replace("__EYEBROW__", eyebrow)
    .replace("__TITLE_HTML__", titleHtml)
    .replace("__TITLE_SIZE__", size)
    .replace("__SUBTITLE__", subtitle)
    .replace("__BYLINE__", byline)
    .replace("__LOGO_SRC__", LOGO_SRC);
}

function shotOne(htmlPath, pngPath) {
  // --headless=new gives accurate font rendering; --hide-scrollbars matters
  const res = spawnSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-sandbox",
      "--no-first-run",
      "--no-default-browser-check",
      `--window-size=1200,630`,
      `--screenshot=${pngPath}`,
      `--default-background-color=00000000`,
      `--virtual-time-budget=2000`,
      `file://${htmlPath}`,
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  if (res.status !== 0) {
    const stderr = res.stderr?.toString() ?? "";
    throw new Error(`Chrome render failed (${res.status}): ${stderr.slice(0, 400)}`);
  }
  if (!existsSync(pngPath)) {
    throw new Error(`Chrome reported success but produced no file at ${pngPath}`);
  }
}

// ----- main -----
function main() {
  const targets = collectTargets();
  let filtered = targets;
  if (args.only) {
    const want = String(args.only);
    filtered = targets.filter((t) => t.slug === want);
    if (filtered.length === 0) {
      console.error(`No target matched --only=${want}`);
      console.error("Available slugs include:");
      for (const t of targets.slice(0, 8)) console.error("  " + t.slug);
      process.exit(2);
    }
  }

  if (args.list) {
    console.log(`# ${filtered.length} render targets`);
    for (const t of filtered) {
      console.log(`  [${t.source.padEnd(9)}] ${t.slug}`);
    }
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(TMP_DIR, { recursive: true });

  let made = 0, skipped = 0, failed = 0;
  for (const t of filtered) {
    const pngPath = join(OUT_DIR, `${t.slug}.png`);
    if (existsSync(pngPath) && !args.force) {
      skipped++;
      continue;
    }

    const html = renderOneHtml(t);
    const htmlPath = join(TMP_DIR, `${t.slug}.html`);
    writeFileSync(htmlPath, html, "utf8");

    if (args["dry-run"]) {
      console.log(`[dry-run] would render: ${t.slug}`);
      made++;
      continue;
    }

    try {
      shotOne(htmlPath, pngPath);
      console.log(`rendered: ${t.slug}.png`);
      made++;
    } catch (e) {
      console.error(`FAILED: ${t.slug}: ${e.message}`);
      failed++;
    }
  }

  // tidy tmp dir unless we're previewing one card
  if (!args.only && !args["keep-tmp"]) {
    rmSync(TMP_DIR, { recursive: true, force: true });
  }

  console.log(
    `\nSummary: ${made} rendered, ${skipped} skipped (already exist; use --force to redo), ${failed} failed`
  );
  process.exit(failed > 0 ? 1 : 0);
}

main();
