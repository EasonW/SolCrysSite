import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Pull Vite's `VITE_*` env vars (from .env, .env.local, .env.production
// etc., loaded via Vite's own precedence rules) into `process.env` so
// this Node-side build script can read them. `npm run build` invokes
// `vite build && node scripts/prerender.mjs`; Vite's build pass sees
// the env vars natively via `import.meta.env`, but this prerender pass
// is a separate Node process with no .env loader of its own.
const viteEnv = loadEnv(
  process.env.NODE_ENV || "production",
  rootDir,
  "VITE_",
);
for (const [key, value] of Object.entries(viteEnv)) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}
const distDir = path.join(rootDir, "dist");
const content = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/siteContent.json"), "utf8"));
const pricingContent = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/pricing.json"), "utf8"));
const newsroomContent = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/newsroom.json"), "utf8"));
const promptPulse = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/promptPulse.json"), "utf8"));

const { site, home, resourcePages, resourceClusters = [] } = content;

// Curated homepage resource entry-points — TOFU (AEO 101) → MOFU
// (methodology / how we measure) → BOFU (buyer's guide). Keep in sync
// with HOMEPAGE_RESOURCE_SLUGS in src/components/ResourcesSection.tsx so
// the crawler-facing prerender matches the SPA homepage exactly.
const HOMEPAGE_RESOURCE_SLUGS = [
  "aeo-vs-seo",
  "visibility-measurement-methodology",
  "ai-visibility-platform-buyers-guide",
];

// Draft mechanism: a resource page with status === "draft" stays accessible at
// its canonical URL (so co-founders can review the production rendering) but is
// excluded from all discovery surfaces — listings, sitemap, llms files,
// related-guides cross-links, JSON-LD CollectionPage hasPart — and gets a
// noindex,nofollow meta + a visible "DRAFT" banner.
const isDraft = (page) => page && page.status === "draft";
const publishedResourcePages = resourcePages.filter((p) => !isDraft(p));
const newsPosts = (newsroomContent.posts || []).slice().sort((a, b) => {
  if (a.date === b.date) return 0;
  return a.date < b.date ? 1 : -1;
});
const featuredAnnouncement =
  newsPosts.find((post) => post.kind === "press-release") || newsPosts[0];
const newsKindLabels = newsroomContent.kindLabels || {};
const personPhotoMap = {
  "Raejeanne Skillern": "/news/raejeanne-skillern.png",
};
const resourceBySlug = new Map(resourcePages.map((p) => [p.slug, p]));
const generatedAt = "2026-05-04";

const distIndexPath = path.join(distDir, "index.html");
const distIndex = fs.readFileSync(distIndexPath, "utf8");
const stylesheetTags = [...distIndex.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((match) => match[0]).join("\n    ");
const scriptTags = [...distIndex.matchAll(/<script[^>]+type="module"[^>]*><\/script>/g)].map((match) => match[0]).join("\n    ");
const analyticsMatch = distIndex.match(/<!--\s*analytics:start\s*-->[\s\S]*?<!--\s*analytics:end\s*-->/);
const analyticsTags = analyticsMatch ? analyticsMatch[0] : "";

const reportAsset = fs
  .readdirSync(path.join(distDir, "assets"))
  .find((file) => /^report-.*\.png$/.test(file));
const reportPath = reportAsset ? `/assets/${reportAsset}` : "/solcrys-og-card.png";
const fallbackOgPath = site.defaultOgImage || "/solcrys-og-card.png";
const ogPublicDir = path.join(distDir, "og");
const availableOgImages = fs.existsSync(ogPublicDir) ? new Set(fs.readdirSync(ogPublicDir)) : new Set();

function resolveOgImage(preferredPath) {
  if (preferredPath && preferredPath.startsWith("/og/")) {
    const filename = preferredPath.replace("/og/", "");
    if (availableOgImages.has(filename)) return `${site.url}${preferredPath}`;
  } else if (preferredPath && preferredPath.startsWith("/")) {
    const candidate = path.join(distDir, preferredPath.replace(/^\//, ""));
    if (fs.existsSync(candidate)) return `${site.url}${preferredPath}`;
  }
  return `${site.url}${fallbackOgPath}`;
}

const defaultOgImage = resolveOgImage(fallbackOgPath);

const founders = [
  ["Gwen Chen", "Co-Founder & CEO", "AI search & GTM strategy", "AEO, content authority, and brand visibility", "https://www.linkedin.com/in/gwenchenx/"],
  ["Eason Wang", "Co-Founder & CPO", "Product & AI systems", "Product strategy, agentic AI, and enterprise workflows", "https://www.linkedin.com/in/eason-wang/"],
  ["Jia Chang", "Co-Founder & CTO", "AI architect; ex-Microsoft engineering leader", "15+ years in AI architecture and engineering systems", "https://www.linkedin.com/in/jia-c/"]
];

const advisors = [
  [
    "Raejeanne Skillern",
    "Strategic Advisor",
    "Former CMO, AWS; 25+ years at Intel; current board director at Jabil (NYSE: JBL) and Dycom Industries (NYSE: DY)",
    "Scaled hyperscale data center and cloud businesses; brings 30+ years of go-to-market leadership across cloud, AI, and infrastructure",
    "https://www.linkedin.com/in/raejeanne-skillern/"
  ]
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

// Matches either a markdown link [text](url) or **bold** segment.
const INLINE_TOKEN_REGEX = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+?)\*\*/g;
function renderInlineHtml(value) {
  const text = String(value);
  if (!text.includes("](") && !text.includes("**")) return escapeHtml(text);
  let out = "";
  let lastIndex = 0;
  for (const match of text.matchAll(INLINE_TOKEN_REGEX)) {
    const start = match.index ?? 0;
    if (start > lastIndex) out += escapeHtml(text.slice(lastIndex, start));
    if (match[1] !== undefined && match[2] !== undefined) {
      // Link
      out += `<a href="${escapeAttr(match[2])}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[1])}</a>`;
    } else if (match[3] !== undefined) {
      // Bold
      out += `<strong>${escapeHtml(match[3])}</strong>`;
    }
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length) out += escapeHtml(text.slice(lastIndex));
  return out;
}

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function canonicalUrl(routePath) {
  if (routePath === "/") return `${site.url}/`;
  return `${site.url}${routePath}`;
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
}

function navHtml() {
  return `
    <header class="seo-container" style="padding: 1.25rem 0; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
      <a href="/" aria-label="SolCrys home" style="display: inline-flex; align-items: center;">
        <img src="/logo-light.png" alt="SolCrys Logo" width="134" height="40" class="block dark:hidden" style="height: 40px; width: auto;">
        <img src="/logo-dark.png" alt="SolCrys Logo" width="134" height="40" class="hidden dark:block" style="height: 40px; width: auto;">
      </a>
      <nav style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.9rem; color: hsl(var(--muted-foreground));">
        <a href="/#features">Platform</a>
        <a href="/#solutions">Solutions</a>
        <a href="/#loop">The Loop</a>
        <a href="${escapeAttr(APP_PRICING_URL)}">Pricing</a>
        <a href="/prompt-pulse/">Prompt Pulse</a>
        <a href="/resources/">Resources</a>
        <a href="/news/">News</a>
        <a href="/about/">Company</a>
      </nav>
    </header>`;
}

function footerHtml() {
  return `
    <footer class="seo-footer">
      <div class="seo-container" style="padding: 3rem 0; border-top: 1px solid hsl(var(--border) / 0.25); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <p style="margin: 0;">${escapeHtml(site.description)}</p>
        <nav style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.9rem;">
          <a href="/resources/">Resources</a>
          <a href="/free-chatgpt-visibility-tracker/">Free ChatGPT Tracker</a>
          <a href="${escapeAttr(APP_PRICING_URL)}">Pricing</a>
          <a href="/news/">News</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
        </nav>
      </div>
    </footer>`;
}

function ctaHtml() {
  return `
    <section class="seo-section">
      <div class="seo-card">
        <p class="seo-kicker">Free AI visibility audit</p>
        <h2>Find out where your brand is missing, miscited, or misrepresented.</h2>
        <p>SolCrys maps high-intent prompts to mentions, citations, answer accuracy, and content gaps so your team can prioritize the next pages to ship.</p>
        <p><a href="mailto:${escapeAttr(site.email)}?subject=SolCrys%20Free%20AI%20Visibility%20Audit">Get a free audit</a></p>
      </div>
    </section>`;
}

function renderLayout({ routePath, title, description, body, schemas = [], includeApp = true, noindex = false, ogImage, lastModified }) {
  const canonical = canonicalUrl(routePath);
  const pageOgImage = ogImage ? resolveOgImage(ogImage) : defaultOgImage;
  const dateMeta = lastModified || site.updated || generatedAt;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <script>
      (function () {
        try {
          var theme = localStorage.getItem('solcrys-theme');
          var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          var isDark = theme === 'dark' || (theme !== 'light' && prefersDark);
          if (isDark) document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        } catch (e) {}
      })();
    </script>
    <script>
      // Phase E theme handoff to app.solcrys.com/pricing.
      //
      // Why this lives in the head, not in the Navbar component:
      //   1. The prerendered nav (raw HTML in navHtml()) renders before
      //      React hydrates. A user clicking Pricing within the first
      //      few hundred ms would otherwise navigate via the raw <a>
      //      tag, bypassing any onClick handler React would later
      //      attach.
      //   2. There are multiple entry points (Navbar, Footer, Customers
      //      page CTA). One global listener is cheaper to maintain than
      //      three onClick handlers that have to stay in sync.
      //
      // Why we pass the RESOLVED theme (not just localStorage):
      //   localStorage only holds a value when the user explicitly picks
      //   Light or Dark. System-preference users have an empty entry, so
      //   reading localStorage gives null and we'd pass nothing. Then
      //   the app falls back to its own stored preference, which may be
      //   stale ("light" from a previous session on app.solcrys.com).
      //   Passing the rendered theme (via matchMedia for system mode)
      //   forces the app to honor what the user is seeing right now.
      //
      // Capture-phase listener so it fires before any React onClick
      // handler. Modifier keys (cmd/ctrl/shift/alt) are bypassed so
      // "open in new tab" navigation isn't intercepted.
      //
      // The expected app host + pricing path are baked in from the
      // build-time VITE_APP_PRICING_URL env var so the local-dev
      // build (host=localhost:3000) and the prod build (host=
      // app.solcrys.com) both intercept the correct link without a
      // separate code path.
      (function () {
        var APP_HOST = ${JSON.stringify(new URL(APP_PRICING_URL).host)};
        var APP_PATH_PREFIX = ${JSON.stringify(
          new URL(APP_PRICING_URL).pathname,
        )};
        function resolvedTheme() {
          try {
            var stored = localStorage.getItem('solcrys-theme');
            if (stored === 'light' || stored === 'dark') return stored;
          } catch (e) {}
          try {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
          } catch (e) {
            return 'light';
          }
        }
        document.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (e.button !== undefined && e.button !== 0) return;
          var a = e.target && e.target.closest && e.target.closest('a[href]');
          if (!a) return;
          var url;
          try {
            url = new URL(a.href, window.location.href);
          } catch (err) {
            return;
          }
          if (url.host !== APP_HOST) return;
          if (!url.pathname.startsWith(APP_PATH_PREFIX)) return;
          if (url.searchParams.has('theme')) return;
          url.searchParams.set('theme', resolvedTheme());
          e.preventDefault();
          window.location.href = url.toString();
        }, true);
      })();
    </script>
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}" />
    <link rel="canonical" href="${escapeAttr(canonical)}" />
    <link rel="icon" type="image/png" sizes="512x512" href="/solcrys-tab-icon-512x512.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/solcrys-tab-icon-192x192.png" />
    <link rel="icon" type="image/png" sizes="48x48" href="/solcrys-tab-icon-48x48.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="author" content="${escapeAttr(site.name)}" />
    <meta name="date" content="${escapeAttr(dateMeta)}" />
    <meta name="theme-color" content="#000000" />
    <meta property="og:site_name" content="${escapeAttr(site.name)}" />
    <meta property="og:locale" content="${escapeAttr(site.locale || "en_US")}" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:url" content="${escapeAttr(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${escapeAttr(pageOgImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeAttr(pageOgImage)}" />
    ${stylesheetTags}
    ${analyticsTags}
    ${schemas.map(jsonLd).join("\n    ")}
  </head>
  <body>
    <div id="root">${body}</div>
    ${includeApp ? scriptTags : ""}
  </body>
</html>
`;
}

function writePage(relativePath, html) {
  const filePath = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

/**
 * Phase E redirect bridge for /pricing/.
 *
 * solcrys.com is hosted on GitHub Pages, which can't issue real 301
 * redirects server-side. This emits the closest static equivalent:
 *
 *   - `<meta http-equiv="refresh" content="0; url=...">` — the
 *     industry-standard SEO 301 stand-in. Search engines (Google,
 *     Bing, DuckDuckGo) treat zero-second meta-refresh as equivalent
 *     to a 301 for canonical consolidation.
 *   - `<link rel="canonical" href="https://app.solcrys.com/pricing">`
 *     — explicit signal to crawlers that the canonical URL is on the
 *     app subdomain.
 *   - `<meta name="robots" content="noindex,follow">` — the bridge
 *     page itself shouldn't be indexed, but its outbound canonical
 *     link should still be followed.
 *   - Inline JS that preserves theme handoff (`solcrys-theme`
 *     localStorage → `?theme=<light|dark>` URL param) plus any
 *     inbound UTM params, then `window.location.replace()` for a
 *     faster cache-warm redirect. Falls back to the meta-refresh if
 *     JS is disabled.
 *
 * The marketing site's `<Pricing />` SPA route is wired to
 * [[PricingRedirect]] which does the same handoff for warm-cache
 * client-side navigations. Together they cover every entry path:
 * static (meta-refresh) for cold loads, SPA (PricingRedirect) for
 * hydrated navigations.
 */
// Phase E: app-side pricing URL. Mirrors `src/lib/pricing-url.ts` (the
// Vite-side reader) — we keep the two in sync because Vite's
// `import.meta.env.VITE_*` resolution doesn't reach Node-side build
// scripts. Setting VITE_APP_PRICING_URL in `.env.local` routes both
// the prerendered nav/bridge and the SPA components at the same dev
// app instance for local end-to-end Phase E testing.
const APP_PRICING_URL =
  (process.env.VITE_APP_PRICING_URL || "").trim() ||
  "https://app.solcrys.com/pricing";

function pricingRedirectBridgeHtml() {
  const dest = APP_PRICING_URL;
  const title = "Pricing — SolCrys";
  const description =
    "SolCrys pricing has moved to app.solcrys.com/pricing.";
  // The inline script is a small enough payload to ship without a
  // bundler; embeds the destination URL once so the meta-refresh and
  // the JS path can't drift.
  const handoffScript = `
      (function () {
        var dest = ${JSON.stringify(dest)};
        function resolvedTheme() {
          try {
            var stored = window.localStorage && window.localStorage.getItem('solcrys-theme');
            if (stored === 'light' || stored === 'dark') return stored;
          } catch (e) {}
          try {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
          } catch (e) { return 'light'; }
        }
        try {
          // Preserve any inbound UTM / referrer params, then layer on
          // theme. We always pass theme (even 'light' system default)
          // so the app honors what the visitor sees here regardless of
          // any stale app-side localStorage preference.
          var params = new URLSearchParams(window.location.search);
          if (!params.has('theme')) params.set('theme', resolvedTheme());
          var qs = params.toString();
          if (qs) dest += '?' + qs;
        } catch (e) { /* localStorage / URL access blocked — fall through */ }
        window.location.replace(dest);
      })();`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${escapeAttr(dest)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${escapeAttr(dest)}" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <script>${handoffScript}</script>
  </head>
  <body>
    <p style="font-family: system-ui; padding: 2rem;">
      Redirecting to <a href="${escapeAttr(dest)}">app.solcrys.com/pricing</a>…
    </p>
  </body>
</html>
`;
}

const organizationSameAs = Array.from(
  new Set([...(site.sameAs || []), site.linkedin].filter(Boolean))
);

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: site.logo,
  description: site.description,
  email: site.email,
  sameAs: organizationSameAs,
  founder: founders.map(([name, title, background, expertise, linkedin]) => ({
    "@type": "Person",
    name,
    jobTitle: title,
    description: `${background}. ${expertise}.`,
    worksFor: {
      "@type": "Organization",
      name: site.name,
      url: site.url
    },
    sameAs: [linkedin]
  }))
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  publisher: {
    "@type": "Organization",
    name: site.name
  }
};

function faqSchema(faqs, routePath) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntityOfPage: canonicalUrl(routePath),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path)
    }))
  };
}

function webPageSchema({ routePath, title, description, ogImage }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    headline: title,
    name: title,
    url: canonicalUrl(routePath),
    description,
    datePublished: site.published || generatedAt,
    dateModified: site.updated || generatedAt,
    author: {
      "@type": "Organization",
      name: site.maintainer || site.name,
      url: site.url
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: site.logo
      }
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImage ? resolveOgImage(ogImage) : defaultOgImage
    }
  };
}

function homeHtml() {
  const announcementPost = featuredAnnouncement;
  const announcement = announcementPost
    ? `
    <section class="seo-container" style="padding: 1.5rem 0 0;">
      <p style="margin: 0; font-size: 0.9rem;"><a href="/news/${escapeAttr(announcementPost.slug)}/">New: ${escapeHtml(announcementPost.title)} →</a></p>
    </section>`
    : "";
  return `
<div class="seo-prerender">
  ${navHtml()}
  ${announcement}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">${escapeHtml(home.eyebrow)}</p>
      <h1>${escapeHtml(home.title)}</h1>
      <p class="seo-lede">${escapeHtml(home.description)}</p>
      <ul class="seo-grid" aria-label="SolCrys proof points">
        ${home.proofPoints.map((point) => `<li class="seo-card">${escapeHtml(point)}</li>`).join("")}
      </ul>
      <figure style="margin-top: 2rem;">
        <figcaption><strong>The SolCrys Loop</strong> — operational snapshot of one customer workspace. Numbers reflect actual state, not aggregate marketing claims.</figcaption>
        <ol class="seo-list" style="margin-top: 1rem;">
          <li><strong>Step 01 · Measure.</strong> 20 prompts tracked across ChatGPT, Gemini, Google AI Overviews / AI Mode, Perplexity, and Claude on eligible plans.</li>
          <li><strong>Step 02 · Diagnose.</strong> 3 gaps detected, classified as absence, citation, accuracy, comparison, or action gap.</li>
          <li><strong>Step 03 · Execute.</strong> 1 action queued — brand-safe drafts via Corporate Context, routed for human review.</li>
          <li><strong>Step 04 · Verify.</strong> +5pp citation rate after re-testing the same prompt set. Loop continues.</li>
        </ol>
      </figure>
    </section>
    <section id="aeo" class="seo-container seo-section">
      <h2>What Answer Engine Optimization means</h2>
      <p><dfn>Answer Engine Optimization (AEO)</dfn> is the practice of making brand facts, proof, and pages easier for AI systems to retrieve, trust, cite, and summarize. SolCrys connects prompt-level measurement with crawlable, evidence-backed content strategy.</p>
    </section>
    <section id="loop" class="seo-container seo-section">
      <h2>The SolCrys Loop: measure, diagnose, execute, verify</h2>
      <p>SolCrys closes the loop on AI search visibility. Each shipped action is tied to the same prompt set so teams can see which fixes actually changed the answer.</p>
      <ol class="seo-list">
        <li><strong>Measure across engines.</strong> Run a fixed prompt set across ChatGPT, Gemini, Google AI Overviews / AI Mode, Perplexity, and Claude on eligible plans. Capture mentions, citations, competitors, sentiment, and answer accuracy in one place.</li>
        <li><strong>Diagnose the answer gap.</strong> Classify each weak answer as an absence, citation, accuracy, comparison, or action gap. Map each gap to the page or source most likely to fix it.</li>
        <li><strong>Execute with Corporate Context.</strong> SolCrys uses your approved facts, claims, and guardrails to turn gaps into briefs, fix recommendations, and reviewable drafts your team can approve and ship.</li>
        <li><strong>Verify and re-test.</strong> Re-run the same prompt set after the action ships. Track citation rate, answer accuracy, and recommendation share to prove which fixes actually moved the answer.</li>
      </ol>
    </section>
    <section id="free-tracker" class="seo-container seo-section">
      <h2>Free ChatGPT visibility tracker</h2>
      <p>See if ChatGPT recommends your brand — or your competitor — then fix it, free. Enter your domain and SolCrys shows where ChatGPT mentions, cites, or skips your brand on the prompts your buyers actually ask (about 5 minutes, no credit card). Unlike a scoreboard, it does not stop at the number: in the same free workspace a free content audit hands you the exact change to ship — the JSON-LD block, the heading rewrite, the FAQ to add, with the points each one recovers — then you re-test that the fix moved the answer. That is the SolCrys Loop, and the free tracker is your way in. The free tier covers ChatGPT; paid plans add Gemini, Google AI Overviews / AI Mode, Perplexity and Claude with automatic daily tracking and the re-test loop at scale. <a href="/free-chatgpt-visibility-tracker/">Learn how the free ChatGPT visibility tracker works</a> or <a href="https://app.solcrys.com/audit">start free</a>.</p>
    </section>
    <section id="features" class="seo-container seo-section">
      <h2>Four layers turn AI visibility into governed execution</h2>
      <div class="seo-grid">
        ${home.platformLayers
          .map(
            (layer) => `
          <article class="seo-card">
            <h3>${escapeHtml(layer.title)}</h3>
            <p>${escapeHtml(layer.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>
    <section id="solutions" class="seo-container seo-section">
      <h2>Built for the teams that own AI visibility</h2>
      <div class="seo-grid">
        ${home.solutions
          .map(
            (solution) => `
          <article class="seo-card">
            <p class="seo-kicker">${escapeHtml(solution.audience)}</p>
            <h3><a href="${escapeAttr(solution.anchor)}">${escapeHtml(solution.title)}</a></h3>
            <p>${escapeHtml(solution.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>
    <section class="seo-container seo-section">
      <h2>AEO resources</h2>
      <p>A curated entry point — full library at <a href="/resources/">resources</a>. Measurement methodology and source notes live at <a href="/visibility-measurement-methodology/">visibility measurement methodology</a>.</p>
      <div class="seo-grid">
        ${HOMEPAGE_RESOURCE_SLUGS
          .map((slug) => resourcePages.find((p) => p.slug === slug))
          .filter(Boolean)
          .map(
            (page) => `
          <article class="seo-card">
            <p class="seo-kicker">${escapeHtml(page.category)}</p>
            <h3><a href="/${escapeAttr(page.slug)}/">${escapeHtml(page.title)}</a></h3>
            <p>${escapeHtml(page.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>
    <section class="seo-container seo-section">
      <h2>FAQ</h2>
      ${home.faqs
        .map(
          (faq) => `
        <article class="seo-card">
          <h3>${escapeHtml(faq.question)}</h3>
          <p>${escapeHtml(faq.answer)}</p>
        </article>`
        )
        .join("")}
    </section>
    <div class="seo-container">${ctaHtml()}</div>
  </main>
  ${footerHtml()}
</div>`;
}

function customersHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">Customer Stories</p>
      <h1>How leading brands use SolCrys to show up in AI answers.</h1>
      <p class="seo-lede">From HPC and AI infrastructure to consumer smart home — measurable visibility, accuracy, and trust across the AI engines where buyers now ask, compare, and decide.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Featured customer: NextSilicon</h2>
      <p><strong>Category:</strong> High-Performance Computing &amp; AI infrastructure</p>
      <p><strong>Result:</strong> Mention rate climbed from 1.9% to 7.4% in 45 days — a near 4× lift in share of voice against entrenched HPC and AI infrastructure incumbents.</p>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/brandondraeger/" rel="noopener">Brandon Draeger</a> — VP of Marketing, NextSilicon</p>
        <blockquote>
          <p>“For the first time, we have clear, system-level visibility into marketing performance — paired with a platform that continuously optimizes it. The upside is significant. SolCrys is informing how we think about marketing performance in a number of areas — we're already using it to inform content strategy across product launches, campaigns, and major events.”</p>
        </blockquote>
      </article>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/brandondraeger/" rel="noopener">Brandon Draeger</a> — VP of Marketing, NextSilicon</p>
        <blockquote>
          <p>“Every time we meet, SolCrys shares insights that surprise me. I'm approached by vendors all the time, but none of them treat this as a science the way SolCrys does. The guardrails and scoring frameworks they've built into the product, along with the level of insight — from citation analysis to prompt diagnosis and content gap identification — are exceptional. It's exactly what we've been looking for.”</p>
        </blockquote>
      </article>
      <p><a href="/customers/nextsilicon/">Read the full NextSilicon case study →</a></p>
    </section>
    <section class="seo-container seo-section">
      <h2>About NextSilicon</h2>
      <p>NextSilicon is a high-performance computing pioneer competing head-to-head with deeply entrenched incumbents and well-funded challengers across HPC and AI infrastructure — a category where buyers are highly technical and evaluation cycles are long.</p>
      <h3>Why it worked</h3>
      <p>NextSilicon's results came from a continuous loop of measurement, diagnosis, execution, and verification — prompt building and benchmarking across answer engines, page-level content and metadata optimization, authority mapping, and deep analysis routed to the SolCrys Actions page where owners, due dates, and progress are tracked through completion.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Featured customer: Wyze</h2>
      <p><strong>Category:</strong> Consumer smart home</p>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/yun-zhang-1441933" rel="noopener">Yun Zhang</a> — CEO, Wyze</p>
        <blockquote>
          <p>“AI is changing how people discover products online, and for consumer brands, showing up correctly in AI answers is becoming incredibly important. The opportunity is about helping the right customers find your products and making it easier for them to buy. SolCrys gives us a better understanding of how Wyze appears across AI engines and where we can improve visibility and trust. We're excited to work with the SolCrys team as they build toward the future of brand discovery and agentic commerce.”</p>
        </blockquote>
      </article>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/michellewangfrees/" rel="noopener">Michelle Frees</a> — Head of Amazon, Wyze</p>
        <blockquote>
          <p>“SolCrys AI has become a trusted growth partner for our team. What's been most impressive is how they've elevated our approach to PDP content — taking it to a level of precision and impact we hadn't thought possible. On top of that, they've surfaced rich customer insights that are informing our product decisions.”</p>
        </blockquote>
      </article>
    </section>
    <section class="seo-container seo-section">
      <h2>About Wyze</h2>
      <p>Wyze is a Seattle-based smart home company known for cameras, sensors, and connected devices designed to be high quality and affordable. The brand reaches millions of households shopping across retail and direct channels — exactly the kind of discovery surface AI assistants are now reshaping.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Across the industry</h2>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/mariavoloh/" rel="noopener">Maria Voloh</a> — Sr. Director, Global Digital Marketing, UiPath</p>
        <blockquote>
          <p>“We've been trying out SolCrys AI for a while now, and the MCP feature lets us pull visibility insights on citations, gaps, and monthly action plans — it also recommends next steps in our optimization journey. We can then turn the insights straight into content. We're excited to keep partnering with the SolCrys team to unlock even more of our presence across AI answer engines.”</p>
        </blockquote>
      </article>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/tiafrate/" rel="noopener">Toni Iafrate</a> — Chief Communications Officer (company name withheld)</p>
        <blockquote>
          <p>“What stood out to me about SolCrys is that it goes beyond just showing data. Most tools stop at dashboards and metrics, but SolCrys helps teams understand what the data means and what actions to take next. That's incredibly valuable for communications and marketing leaders who need actionable intelligence, not just reports.”</p>
        </blockquote>
        <p><em>Shared with permission. Company name redacted at the customer's request.</em></p>
      </article>
    </section>
    <div class="seo-container">${ctaHtml()}</div>
  </main>
  ${footerHtml()}
</div>`;
}

function nextSiliconCaseStudyHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker"><a href="/customers/">← All customer stories</a></p>
      <p class="seo-kicker">Case Study · High-Performance Computing &amp; AI</p>
      <h1>How NextSilicon quadrupled its share of voice in HPC &amp; AI — in 45 days.</h1>
      <p class="seo-lede">A challenger in one of tech's most crowded categories used SolCrys to close the visibility gap with incumbents.</p>
      <ul class="seo-grid" aria-label="Headline results">
        <li class="seo-card"><strong>Mention rate — before:</strong> 1.9%. Trailing entrenched HPC and AI infrastructure incumbents.</li>
        <li class="seo-card"><strong>In just:</strong> 45 days. From kickoff to a measurable, repeatable engine.</li>
        <li class="seo-card"><strong>Mention rate — after:</strong> 7.4%. Near 4× lift in share of voice.</li>
      </ul>
    </section>
    <section class="seo-container seo-section">
      <h2>The customer</h2>
      <p>NextSilicon is a high-performance computing pioneer competing in one of the most technically demanding markets in technology. The company goes head-to-head with deeply entrenched incumbents and well-funded challengers across HPC and AI infrastructure — a category where buyers are highly technical and evaluation cycles are long.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>The challenge</h2>
      <p>In a category dominated by established names, NextSilicon's share of voice was lagging. Their mention rate — the frequency with which the company appeared in AI-generated answers about HPC and AI infrastructure — sat at just 1.9%. For a business whose buyers increasingly rely on AI assistants to research vendors, build shortlists, and validate claims, that was a serious gap.</p>
      <p>The marketing team needed to understand exactly where they were losing ground, why competitors were being surfaced more often, and which specific moves would shift AI-generated answers in their favor.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>The SolCrys approach</h2>
      <p>NextSilicon onboarded to SolCrys in March 2026. Within days, SolCrys completed a full audit of their content, benchmarked their performance against key competitors, and surfaced critical gaps impacting their visibility. From there, the platform generated a continuously updated optimization roadmap across:</p>
      <ul class="seo-list">
        <li><strong>Prompt building.</strong> Developing prompt sets across answer engines to measure prompt-level AI visibility, citation, sentiment, and recommendation share.</li>
        <li><strong>Content optimization.</strong> Auditing webpages, identifying topic clusters, strengthening factual density, refining comparison framing, and recommending high-impact claims.</li>
        <li><strong>Metadata intelligence.</strong> Applying and validating schema, structured data, and AI engine-optimized descriptions at scale.</li>
        <li><strong>Authority mapping.</strong> Pinpointing high-value citation sources and PR opportunities aligned to category relevance.</li>
        <li><strong>Deep analysis and actionable workflows.</strong> Analyzing visibility gaps, recommending next-best actions ranked by priority level and effort level. From there, insights are automatically routed to the Actions page, where teams can assign owners, set due dates, collaborate cross-functionally, and track progress through completion.</li>
      </ul>
      <p>Rather than a one-time engagement, SolCrys operates as a self-improving operating system — continuously analyzing, prioritizing, and optimizing AI performance over time.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>The results</h2>
      <p>Within 45 days, NextSilicon's mention rate climbed from 1.9% to 7.4% — a near 4× increase in a category where incumbents have spent years building authority. The gains compounded as new content shipped and existing content was re-optimized against SolCrys' scoring framework, giving the team a measurable, repeatable engine rather than a one-off lift.</p>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/brandondraeger/" rel="noopener">Brandon Draeger</a> — VP of Marketing, NextSilicon</p>
        <blockquote>
          <p>“For the first time, we have clear, system-level visibility into marketing performance — paired with a platform that continuously optimizes it. The upside is significant. SolCrys is informing how we think about marketing performance in a number of areas — we're already using it to inform content strategy across product launches, campaigns, and major events.”</p>
        </blockquote>
      </article>
    </section>
    <section class="seo-container seo-section">
      <h2>Why it worked</h2>
      <p>NextSilicon's results came from a system, not a one-off effort — a continuous loop of measurement, diagnosis, execution, and verification. That loop is at the core of the SolCrys platform, transforming AEO from guesswork into a structured, measurable discipline.</p>
      <article class="seo-card">
        <p class="seo-kicker"><a href="https://www.linkedin.com/in/brandondraeger/" rel="noopener">Brandon Draeger</a> — VP of Marketing, NextSilicon</p>
        <blockquote>
          <p>“Every time we meet, SolCrys shares insights that surprise me. I'm approached by vendors all the time, but none of them treat this as a science the way SolCrys does. The guardrails and scoring frameworks they've built into the product, along with the level of insight — from citation analysis to prompt diagnosis and content gap identification — are exceptional. It's exactly what we've been looking for.”</p>
        </blockquote>
      </article>
    </section>
    <section class="seo-container seo-section">
      <h2>About SolCrys AI</h2>
      <p>SolCrys helps brands improve visibility and compete in high-stakes categories. We help marketing organizations measure how often they appear in AI-generated answers, understand why, and systematically close the gap with competitors.</p>
    </section>
    <div class="seo-container">${ctaHtml()}</div>
  </main>
  ${footerHtml()}
</div>`;
}

function aboutHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">About SolCrys</p>
      <h1>AI search visibility and Answer Engine Optimization for marketing teams.</h1>
      <p class="seo-lede">SolCrys was built by search, growth, data, and product operators to help brands connect AI visibility measurement with evidence-backed content action.</p>
      <p>Maintained by ${escapeHtml(site.maintainer || site.name)}. Last updated <time datetime="${escapeAttr(site.updated || generatedAt)}">${escapeHtml(site.updated || generatedAt)}</time>.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Our story</h2>
      <p>Our background sits at the intersection of SEO, search intent, product discovery, and data-driven growth. AI-generated answers add a new distribution layer to that work: a brand can perform well in traditional search, yet still be absent, uncited, or misrepresented inside the answer a buyer sees first.</p>
      <p>Marketing teams now need to know which prompts matter, which sources AI systems cite, how competitors are framed, and how to establish topical authority across AI-visible sources.</p>
      <p>SolCrys was built to connect AI visibility measurement with practical content action. The platform helps teams monitor mentions, citations, share of voice, sentiment, and answer accuracy, then translate those findings into page updates, publisher and analyst content briefs, FAQ improvements, and user-generated content (UGC) strategies.</p>
      <p>Our focus is straightforward: help brands sharpen their content strategy so their content is easier for answer engines to retrieve, trust, cite, and summarize.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Founding team</h2>
      <p>The founding team combines AI search strategy, product systems thinking, and AI architecture experience for the shift from rankings to answer visibility.</p>
      <div class="seo-grid">
        ${founders
          .map(
            ([name, title, background, expertise, linkedin]) => `
          <article class="seo-card">
            <h3><a href="${escapeAttr(linkedin)}">${escapeHtml(name)}</a></h3>
            <p>${escapeHtml(title)}</p>
            <p>${escapeHtml(background)}. ${escapeHtml(expertise)}.</p>
          </article>`
          )
          .join("")}
      </div>
      <table>
        <thead>
          <tr><th>Name</th><th>Role</th><th>Background</th><th>Search/AEO relevance</th></tr>
        </thead>
        <tbody>
          ${founders
            .map(
              ([name, title, background, expertise, linkedin]) => `<tr><td><a href="${escapeAttr(linkedin)}">${escapeHtml(name)}</a></td><td>${escapeHtml(title)}</td><td>${escapeHtml(background)}</td><td>${escapeHtml(expertise)}</td></tr>`
            )
            .join("")}
        </tbody>
      </table>
    </section>
    <section class="seo-container seo-section">
      <h2>Advisors</h2>
      <p>SolCrys advisors bring board-level perspective and operating experience from the companies and categories shaped by previous platform shifts.</p>
      <div class="seo-grid">
        ${advisors
          .map(
            ([name, title, background, expertise, linkedin]) => `
          <article class="seo-card">
            <h3><a href="${escapeAttr(linkedin)}">${escapeHtml(name)}</a></h3>
            <p>${escapeHtml(title)}</p>
            <p>${escapeHtml(background)}. ${escapeHtml(expertise)}.</p>
          </article>`
          )
          .join("")}
      </div>
      <p><a href="/news/raejeanne-skillern-strategic-advisor/">Read the announcement of Raejeanne Skillern joining SolCrys as Strategic Advisor →</a></p>
    </section>
  </main>
  ${footerHtml()}
</div>`;
}

function newsBlockHtml(block) {
  switch (block.type) {
    case "heading":
      return `<h2>${escapeHtml(block.text)}</h2>`;
    case "subheading":
      return `<h3>${escapeHtml(block.text)}</h3>`;
    case "quote": {
      const attribution = block.attribution
        ? `<figcaption><strong>${escapeHtml(block.attribution)}</strong>${
            block.role ? ` — ${escapeHtml(block.role)}` : ""
          }</figcaption>`
        : "";
      return `<figure class="seo-quote"><blockquote><p>“${escapeHtml(
        block.text
      )}”</p></blockquote>${attribution}</figure>`;
    }
    case "bullets":
      return `<ul class="seo-list">${(block.items || [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>`;
    case "paragraph":
    default:
      return `<p>${escapeHtml(block.text || "")}</p>`;
  }
}

function newsIndexHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">Newsroom</p>
      <h1>Announcements and notes from SolCrys.</h1>
      <p class="seo-lede">Press releases, founder notes, and updates from the team building the AEO operating system for brands in AI search.</p>
    </section>
    <section class="seo-container seo-section">
      <div class="seo-grid">
        ${newsPosts
          .map(
            (post) => `
          <article class="seo-card">
            <p class="seo-kicker">${escapeHtml(newsKindLabels[post.kind] || post.kind)} · <time datetime="${escapeAttr(
              post.date
            )}">${escapeHtml(post.date)}</time></p>
            <h2><a href="/news/${escapeAttr(post.slug)}/">${escapeHtml(post.title)}</a></h2>
            <p>${escapeHtml(post.dek)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>
    <div class="seo-container">${ctaHtml()}</div>
  </main>
  ${footerHtml()}
</div>`;
}

function newsArticleHtml(post) {
  const heroPhoto =
    post.heroImage && post.heroImage.type === "person" ? personPhotoMap[post.heroImage.name] : null;
  const heroFigure = heroPhoto
    ? `<figure class="seo-figure"><img src="${escapeAttr(heroPhoto)}" alt="${escapeAttr(
        post.heroImage.alt
      )}" loading="eager" /><figcaption><strong>${escapeHtml(post.heroImage.name)}</strong>${
        post.heroImage.role ? ` — ${escapeHtml(post.heroImage.role)}` : ""
      }</figcaption></figure>`
    : "";
  const authorLine = post.author
    ? `<p>By <strong>${escapeHtml(post.author.name)}</strong>, ${escapeHtml(post.author.role)}${
        post.author.linkedin
          ? ` · <a href="${escapeAttr(post.author.linkedin)}" rel="noopener">LinkedIn</a>`
          : ""
      }</p>`
    : "";
  const releaseFlag = post.kind === "press-release" ? `<p class="seo-kicker">For Immediate Release</p>` : "";
  const mediaContact = post.mediaContact
    ? `<section class="seo-card"><h2>Media Contact</h2><p><strong>${escapeHtml(
        post.mediaContact.name
      )}</strong> · <a href="mailto:${escapeAttr(post.mediaContact.email)}">${escapeHtml(
        post.mediaContact.email
      )}</a></p></section>`
    : "";
  const related = (post.relatedSlugs || [])
    .map((s) => newsPosts.find((p) => p.slug === s))
    .filter(Boolean);
  const relatedHtml =
    related.length === 0
      ? ""
      : `<section class="seo-section"><h2>Related</h2><div class="seo-grid">${related
          .map(
            (item) => `
        <article class="seo-card">
          <p class="seo-kicker">${escapeHtml(newsKindLabels[item.kind] || item.kind)}</p>
          <h3><a href="/news/${escapeAttr(item.slug)}/">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.dek)}</p>
        </article>`
          )
          .join("")}</div></section>`;

  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container">
    <article>
      <header class="seo-hero">
        <p class="seo-kicker">${escapeHtml(newsKindLabels[post.kind] || post.kind)} · <time datetime="${escapeAttr(
          post.date
        )}">${escapeHtml(post.date)}</time></p>
        ${releaseFlag}
        <h1>${escapeHtml(post.title)}</h1>
        <p class="seo-lede">${escapeHtml(post.dek)}</p>
        ${authorLine}
      </header>
      ${heroFigure}
      ${post.leadParagraph ? `<p><strong>${escapeHtml(post.leadParagraph)}</strong></p>` : ""}
      ${(post.body || []).map(newsBlockHtml).join("")}
      ${mediaContact}
      ${relatedHtml}
      ${ctaHtml()}
    </article>
  </main>
  ${footerHtml()}
</div>`;
}

const pricingAudiences = pricingContent.audiences || [];
const pricingBrandTierCount = pricingAudiences.find((audience) => audience.key === "brand")?.tiers?.length || 0;

function pricingComparisonValue(label, globalIndex) {
  for (const group of pricingContent.comparisonGroups || []) {
    const row = group.rows?.find((candidate) => candidate.label === label);
    if (row) return row.values?.[globalIndex] || "";
  }
  return "";
}

function promptLabel(value) {
  const text = String(value);
  if (/prompt/i.test(text)) return text;
  return `${text} prompts`;
}

function countLabel(value, singular, plural) {
  const text = String(value);
  if (!/^\d+$/.test(text)) return text;
  return `${text} ${Number(text) === 1 ? singular : plural}`;
}

function pricingPlansFor(audienceKey) {
  const audience = pricingAudiences.find((candidate) => candidate.key === audienceKey);
  const offset = audienceKey === "brand" ? 0 : pricingBrandTierCount;
  return (audience?.tiers || []).map((tier, index) => {
    const globalIndex = index + offset;
    return {
      name: tier.name,
      price: `$${Number(tier.monthly).toLocaleString("en-US")}/mo`,
      prompts: promptLabel(pricingComparisonValue("Tracked prompts", globalIndex)),
      engines: pricingComparisonValue("Included engines", globalIndex),
      deepAnalyses: countLabel(pricingComparisonValue("Deep Analyses / mo", globalIndex), "Deep Analysis", "Deep Analyses"),
      contentAudits: countLabel(pricingComparisonValue("Content Audits / mo", globalIndex), "Content Audit", "Content Audits"),
      bestFit: tier.bestFit,
      summary: tier.tagline
    };
  });
}

const brandPricingPlans = pricingPlansFor("brand");
const agencyPricingPlans = pricingPlansFor("agency");

function pricingPlanCard(plan) {
  return `
          <article class="seo-card">
            <p class="seo-kicker">${escapeHtml(plan.name)}</p>
            <h3>${escapeHtml(plan.price)}</h3>
            <p>${escapeHtml(plan.summary)}</p>
            <ul class="seo-list">
              <li><strong>Prompts:</strong> ${escapeHtml(plan.prompts)}</li>
              <li><strong>Engines:</strong> ${escapeHtml(plan.engines)}</li>
              <li><strong>Deep Analyses:</strong> ${escapeHtml(plan.deepAnalyses)}</li>
              <li><strong>Content Audits:</strong> ${escapeHtml(plan.contentAudits)}</li>
              <li><strong>Best fit:</strong> ${escapeHtml(plan.bestFit)}</li>
            </ul>
          </article>`;
}

function pricingHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">${escapeHtml(pricingContent.hero.eyebrow)}</p>
      <h1>${escapeHtml(pricingContent.hero.title)}</h1>
      <p class="seo-lede">${escapeHtml(pricingContent.hero.subtitle)}</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Brand plans</h2>
      <p>Brand plans scale by prompts, engines, workspaces, Deep Analyses, and Content Audits. We do not meter seats.</p>
      <div class="seo-grid">
        ${brandPricingPlans.map(pricingPlanCard).join("")}
      </div>
    </section>
    <section class="seo-container seo-section">
      <h2>Agency plans</h2>
      <p>Agency plans sell client organization capacity, repeatable reporting, and white-label-ready Deep Analysis workflows.</p>
      <div class="seo-grid">
        ${agencyPricingPlans.map(pricingPlanCard).join("")}
      </div>
    </section>
    <section class="seo-container seo-section">
      <h2>Add-ons and Enterprise</h2>
      <div class="seo-grid">
        ${(pricingContent.addOns || [])
          .map(
            (addOn) => `<article class="seo-card">
          <h3>${escapeHtml(addOn.label)}</h3>
          <p>${escapeHtml(addOn.description)}</p>
        </article>`
          )
          .join("")}
      </div>
    </section>
    <div class="seo-container">${ctaHtml()}</div>
  </main>
  ${footerHtml()}
</div>`;
}

function categorySlug(s) {
  return String(s)
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resourcesHtml() {
  const declared = resourceClusters.map((c) => c.key);
  const grouped = new Map();
  // Drafts are excluded from /resources/ listing.
  // A page lives primarily in `category` and additionally surfaces in any
  // clusters declared via `alsoListIn` (dual-listing for cross-cluster pieces).
  for (const page of publishedResourcePages) {
    const primaryList = grouped.get(page.category) || [];
    primaryList.push(page);
    grouped.set(page.category, primaryList);
    const alsoListIn = Array.isArray(page.alsoListIn) ? page.alsoListIn : [];
    for (const secondaryCluster of alsoListIn) {
      const secondaryList = grouped.get(secondaryCluster) || [];
      secondaryList.push(page);
      grouped.set(secondaryCluster, secondaryList);
    }
  }
  const orderedKeys = [
    ...declared.filter((k) => grouped.has(k)),
    ...Array.from(grouped.keys()).filter((k) => !declared.includes(k)),
  ];
  const blurbByKey = new Map(resourceClusters.map((c) => [c.key, c.blurb]));

  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">AEO Resource Hub</p>
      <h1>Practical guides for AI search visibility.</h1>
      <p class="seo-lede">Each guide pairs a direct answer with prompt examples, scoring guidance, and concrete follow-up actions. Browse by topic below.</p>
    </section>
    ${orderedKeys
      .map((key) => {
        const pages = grouped.get(key) || [];
        if (pages.length === 0) return "";
        const blurb = blurbByKey.get(key) || "";
        return `
    <section id="${escapeAttr(categorySlug(key))}" class="seo-container seo-section">
      <h2>${escapeHtml(key)}</h2>
      ${blurb ? `<p>${escapeHtml(blurb)}</p>` : ""}
      <div class="seo-grid">
        ${pages
          .map(
            (page) => `
          <article class="seo-card">
            <p class="seo-kicker">${escapeHtml(page.category)}</p>
            <h3><a href="/${escapeAttr(page.slug)}/">${escapeHtml(page.title)}</a></h3>
            <p>${escapeHtml(page.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>`;
      })
      .join("")}
  </main>
  ${footerHtml()}
</div>`;
}

function subsectionHtml(subsection) {
  return `
      <div class="seo-subsection">
        <h3>${escapeHtml(subsection.heading)}</h3>
        ${subsection.body.map((paragraph) => `<p>${renderInlineHtml(paragraph)}</p>`).join("")}
        ${subsection.bullets ? `<ul class="seo-list">${subsection.bullets.map((item) => `<li>${renderInlineHtml(item)}</li>`).join("")}</ul>` : ""}
      </div>`;
}

function sectionHtml(section) {
  return `
    <section class="seo-section">
      <h2>${escapeHtml(section.heading)}</h2>
      ${section.body.map((paragraph) => `<p>${renderInlineHtml(paragraph)}</p>`).join("")}
      ${section.bullets ? `<ul class="seo-list">${section.bullets.map((item) => `<li>${renderInlineHtml(item)}</li>`).join("")}</ul>` : ""}
      ${
        section.table
          ? `<table>
              <thead><tr>${section.table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
              <tbody>${section.table.rows
                .map((row) => `<tr>${row.map((cell) => `<td>${renderInlineHtml(cell)}</td>`).join("")}</tr>`)
                .join("")}</tbody>
            </table>`
          : ""
      }
      ${section.subsections ? section.subsections.map(subsectionHtml).join("") : ""}
    </section>`;
}

function relatedGuidesHtml(page) {
  // Drafts are excluded from "Related guides" cross-links on other articles.
  const explicit = Array.isArray(page.relatedSlugs)
    ? page.relatedSlugs.map((slug) => resourceBySlug.get(slug)).filter(Boolean).filter((p) => !isDraft(p))
    : [];
  const related = explicit.length > 0
    ? explicit.slice(0, 3)
    : publishedResourcePages.filter((p) => p.slug !== page.slug).slice(0, 3);
  if (related.length === 0) return "";
  return `
      <section class="seo-section">
        <h2>Related guides</h2>
        <div class="seo-grid">
          ${related
            .map(
              (item) => `
          <article class="seo-card">
            <p class="seo-kicker">${escapeHtml(item.category)}</p>
            <h3><a href="/${escapeAttr(item.slug)}/">${escapeHtml(item.title)}</a></h3>
            <p>${escapeHtml(item.description)}</p>
          </article>`
            )
            .join("")}
        </div>
      </section>`;
}

function aeoTargetsHtml(page) {
  if (!Array.isArray(page.aeoTargets) || page.aeoTargets.length === 0) return "";
  return `
      <section class="seo-section">
        <h2>Questions this guide answers</h2>
        <ul class="seo-list">
          ${page.aeoTargets.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}
        </ul>
      </section>`;
}

function sourcesHtml(page) {
  if (!Array.isArray(page.sources) || page.sources.length === 0) return "";
  return `
      <section class="seo-section">
        <h2>Sources</h2>
        <ul class="seo-list">
          ${page.sources
            .map(
              (source) =>
                `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a></li>`
            )
            .join("")}
        </ul>
      </section>`;
}

function draftBannerHtml() {
  return `
<div class="seo-draft-banner" style="background:#3a2a08;border:1px solid #b88a1a;color:#ffd97a;padding:14px 18px;margin:0 0 24px;border-radius:10px;font-size:14px;line-height:1.5;">
  <strong style="text-transform:uppercase;letter-spacing:0.08em;font-size:12px;">Draft &mdash; internal preview</strong>
  <br />
  This article is not listed on /resources/, not in the sitemap, and not indexed by search engines or AI crawlers. Share the direct URL with reviewers only. Promote to publication by removing <code>"status": "draft"</code> from this page's entry in <code>siteContent.json</code>.
</div>`;
}

function resourcePageHtml(page) {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container">
    <article>
      <header class="seo-hero">
        <p class="seo-kicker">${escapeHtml(page.category)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="seo-lede">${renderInlineHtml(page.summary)}</p>
        <p>Updated ${escapeHtml(page.updated)}</p>
      </header>
      ${aeoTargetsHtml(page)}
      ${page.sections.map(sectionHtml).join("")}
      ${sourcesHtml(page)}
      <section class="seo-section">
        <h2>FAQ</h2>
        ${page.faqs
          .map(
            (faq) => `
          <article class="seo-card">
            <h3>${escapeHtml(faq.question)}</h3>
            <p>${renderInlineHtml(faq.answer)}</p>
          </article>`
          )
          .join("")}
      </section>
      ${relatedGuidesHtml(page)}
      ${ctaHtml()}
    </article>
  </main>
  ${footerHtml()}
</div>`;
}

function notFoundHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container seo-hero">
    <p class="seo-kicker">404</p>
    <h1>Page not found</h1>
    <p class="seo-lede">The page you requested does not exist. Return to SolCrys resources or the homepage.</p>
    <p><a href="/">Return home</a></p>
  </main>
  ${footerHtml()}
</div>`;
}

writePage(
  "index.html",
  renderLayout({
    routePath: "/",
    title: "SolCrys - Governed AEO Execution Platform",
    description: site.description,
    body: homeHtml(),
    ogImage: home.ogImage,
    lastModified: site.updated,
    schemas: [
      organizationSchema,
      websiteSchema,
      webPageSchema({
        routePath: "/",
        title: "SolCrys - Governed AEO Execution Platform",
        description: site.description
      }),
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: site.name,
        applicationCategory: site.softwareCategory || "BusinessApplication",
        applicationSubCategory: site.softwareSubCategory || undefined,
        operatingSystem: "Web",
        url: site.url,
        description: site.description,
        softwareVersion: site.softwareVersion || undefined,
        featureList: home.proofPoints,
        screenshot: `${site.url}${reportPath}`,
        audience: site.audienceType
          ? {
              "@type": "Audience",
              audienceType: site.audienceType
            }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: {
            "@type": "ImageObject",
            url: site.logo
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${site.name} Answer Engine Optimization Platform`,
        serviceType: "Answer Engine Optimization",
        provider: {
          "@type": "Organization",
          name: site.name,
          url: site.url
        },
        areaServed: "Global",
        audience: site.audienceType
          ? {
              "@type": "Audience",
              audienceType: site.audienceType
            }
          : undefined,
        description: site.description,
        url: site.url
      },
      faqSchema(home.faqs, "/")
    ]
  })
);

writePage(
  "about/index.html",
  renderLayout({
    routePath: "/about/",
    title: "About SolCrys - AI Search and AEO Team",
    description: "Meet the SolCrys founding team and learn why the company is building an AEO platform for AI-driven discovery.",
    body: aboutHtml(),
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about/" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        headline: "About SolCrys - AI Search and AEO Team",
        name: "About SolCrys",
        url: canonicalUrl("/about/"),
        description: "Meet the SolCrys founding team and learn why the company is building an AEO platform for AI-driven discovery.",
        datePublished: site.published || generatedAt,
        dateModified: site.updated || generatedAt,
        author: {
          "@type": "Organization",
          name: site.maintainer || site.name,
          url: site.url
        },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: {
            "@type": "ImageObject",
            url: site.logo
          }
        },
        about: organizationSchema,
        mainEntity: organizationSchema
      }
    ]
  })
);

writePage(
  "customers/index.html",
  renderLayout({
    routePath: "/customers/",
    title: "Customer Stories | SolCrys",
    description: "How leading brands — including UiPath, NextSilicon, and Wyze — use SolCrys to show up in AI answers. NextSilicon lifted its mention rate from 1.9% to 7.4% in 45 days.",
    body: customersHtml(),
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Customers", path: "/customers/" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "SolCrys Customer Stories",
        url: canonicalUrl("/customers/"),
        description: "Customer stories from brands using SolCrys for AI search visibility, accuracy, and trust — across enterprise software (UiPath), HPC and AI infrastructure (NextSilicon), and consumer (Wyze).",
        datePublished: site.published || generatedAt,
        dateModified: site.updated || generatedAt
      },
      {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: organizationSchema,
        author: { "@type": "Person", name: "Brandon Draeger", jobTitle: "VP of Marketing, NextSilicon" },
        reviewBody: "For the first time, we have clear, system-level visibility into marketing performance — paired with a platform that continuously optimizes it. The upside is significant. SolCrys is informing how we think about marketing performance in a number of areas — we're already using it to inform content strategy across product launches, campaigns, and major events."
      },
      {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: organizationSchema,
        author: { "@type": "Person", name: "Brandon Draeger", jobTitle: "VP of Marketing, NextSilicon" },
        reviewBody: "Every time we meet, SolCrys shares insights that surprise me. I'm approached by vendors all the time, but none of them treat this as a science the way SolCrys does. The guardrails and scoring frameworks they've built into the product, along with the level of insight — from citation analysis to prompt diagnosis and content gap identification — are exceptional. It's exactly what we've been looking for."
      },
      {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: organizationSchema,
        author: { "@type": "Person", name: "Yun Zhang", jobTitle: "CEO, Wyze" },
        reviewBody: "AI is changing how people discover products online, and for consumer brands, showing up correctly in AI answers is becoming incredibly important. The opportunity is about helping the right customers find your products and making it easier for them to buy. SolCrys gives us a better understanding of how Wyze appears across AI engines and where we can improve visibility and trust. We're excited to work with the SolCrys team as they build toward the future of brand discovery and agentic commerce."
      },
      {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: organizationSchema,
        author: { "@type": "Person", name: "Michelle Frees", jobTitle: "Head of Amazon, Wyze" },
        reviewBody: "SolCrys AI has become a trusted growth partner for our team. What's been most impressive is how they've elevated our approach to PDP content — taking it to a level of precision and impact we hadn't thought possible. On top of that, they've surfaced rich customer insights that are informing our product decisions."
      },
      {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: organizationSchema,
        author: { "@type": "Person", name: "Maria Voloh", jobTitle: "Sr. Director, Global Digital Marketing, UiPath" },
        reviewBody: "We've been trying out SolCrys AI for a while now, and the MCP feature lets us pull visibility insights on citations, gaps, and monthly action plans — it also recommends next steps in our optimization journey. We can then turn the insights straight into content. We're excited to keep partnering with the SolCrys team to unlock even more of our presence across AI answer engines."
      }
    ]
  })
);

writePage(
  "customers/nextsilicon/index.html",
  renderLayout({
    routePath: "/customers/nextsilicon/",
    title: "NextSilicon Case Study: 1.9% → 7.4% Mention Rate in 45 Days | SolCrys",
    description: "How NextSilicon, a high-performance computing pioneer, used SolCrys to quadruple its share of voice in HPC and AI — mention rate climbed from 1.9% to 7.4% in 45 days.",
    body: nextSiliconCaseStudyHtml(),
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Customers", path: "/customers/" },
        { name: "NextSilicon", path: "/customers/nextsilicon/" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": canonicalUrl("/customers/nextsilicon/") + "#article",
        headline: "How NextSilicon quadrupled its share of voice in HPC & AI — in 45 days.",
        description: "A challenger in one of tech's most crowded categories used SolCrys to close the visibility gap with incumbents. Mention rate climbed from 1.9% to 7.4% in 45 days — a near 4× lift.",
        url: canonicalUrl("/customers/nextsilicon/"),
        datePublished: site.published || generatedAt,
        dateModified: site.updated || generatedAt,
        author: {
          "@type": "Organization",
          name: site.maintainer || site.name,
          url: site.url
        },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: { "@type": "ImageObject", url: site.logo }
        },
        about: {
          "@type": "Organization",
          name: "NextSilicon",
          url: "https://www.nextsilicon.com/"
        },
        keywords: [
          "AI search visibility case study",
          "Answer Engine Optimization case study",
          "AEO mention rate lift",
          "HPC marketing AI visibility",
          "AI infrastructure share of voice",
          "NextSilicon SolCrys"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: organizationSchema,
        author: { "@type": "Person", name: "Brandon Draeger", jobTitle: "VP of Marketing, NextSilicon" },
        reviewBody: "For the first time, we have clear, system-level visibility into marketing performance — paired with a platform that continuously optimizes it. The upside is significant. SolCrys is informing how we think about marketing performance in a number of areas — we're already using it to inform content strategy across product launches, campaigns, and major events."
      },
      {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: organizationSchema,
        author: { "@type": "Person", name: "Brandon Draeger", jobTitle: "VP of Marketing, NextSilicon" },
        reviewBody: "Every time we meet, SolCrys shares insights that surprise me. I'm approached by vendors all the time, but none of them treat this as a science the way SolCrys does. The guardrails and scoring frameworks they've built into the product, along with the level of insight — from citation analysis to prompt diagnosis and content gap identification — are exceptional. It's exactly what we've been looking for."
      }
    ]
  })
);

// Phase E: /pricing/ is canonical-hosted at app.solcrys.com/pricing.
// We emit a minimal redirect bridge here (meta-refresh + canonical +
// theme handoff). No structured data, no nav chrome, noindex — the
// destination page has the full schema graph (see geo-platform's
// `lib/marketing/pricing-jsonld.ts`). The bridge exists purely to
// route bookmarks, AI citations, and inbound links to the new URL.
writePage("pricing/index.html", pricingRedirectBridgeHtml());

writePage(
  "resources/index.html",
  renderLayout({
    routePath: "/resources/",
    title: "AEO Resources for AI Search Visibility | SolCrys",
    description: "Guides on Answer Engine Optimization, AI brand visibility, ChatGPT brand mentions, AI share of voice, and hallucination risk monitoring.",
    body: resourcesHtml(),
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources/" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SolCrys AEO Resource Hub",
        url: canonicalUrl("/resources/"),
        hasPart: publishedResourcePages.map((page) => ({
          "@type": "WebPage",
          name: page.title,
          url: canonicalUrl(`/${page.slug}/`)
        }))
      }
    ]
  })
);

// ---- Prompt Pulse (AI demand data) ----
// Crawler-facing static render of the same scrubbed public JSON the SPA reads
// (single source of truth → no drift). Emits Dataset + ItemList + Breadcrumb
// schema so AI engines can cite the prompt set as a data source.
function ppTrend(t) {
  if (t.label === "—") return "—";
  if (t.label === "New") return "New";
  if (t.pct == null) return t.label;
  const pct = t.pct > 300 ? "+300%+" : `${t.pct > 0 ? "+" : ""}${t.pct}%`;
  return `${t.label} ${pct}`;
}
function ppTrendSort(t) {
  return t.pct != null ? t.pct : t.label === "New" ? 999 : -999;
}
function promptPulseVerticalBody(v) {
  const rows = v.prompts
    .map((p) =>
      `<tr><td>${escapeHtml(p.prompt)}</td><td>${escapeHtml(p.demandTier)}</td><td>${escapeHtml(ppTrend(p.trend))}</td><td>${escapeHtml(p.persona)}</td><td>${escapeHtml(p.stage)}</td></tr>`,
    )
    .join("");
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container">
    <p class="seo-kicker">Prompt Pulse · AI demand data</p>
    <h1>The prompts ${escapeHtml(v.short)} buyers ask AI</h1>
    <p class="seo-lede">The real questions ${escapeHtml(v.short)} buyers ask AI answer engines (ChatGPT, Perplexity, Google AI Overviews), rated by a High/Medium/Low demand tier and a trend direction. ${v.stats.prompts} prompts${v.stats.rising > 0 ? ` · ${v.stats.rising} rising` : ""} · ${v.stats.decision} purchase-ready. Updated ${escapeHtml(v.updated)}, US/English.</p>
    <section class="seo-section">
      <h2>Demand ranking</h2>
      <table>
        <thead><tr><th>Prompt</th><th>Demand</th><th>Trend</th><th>Persona</th><th>Buying stage</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
    <section class="seo-section">
      <h2>About this data</h2>
      <p>Prompt Pulse runs on SolCrys's proprietary AEO methodology — the same framework behind our AI-visibility measurement — distilled from the real questions buyers ask across AI answer engines and the community sources they cite. Signals are relative within each industry and directional by design. <a href="/resources/">See the methodology in our resources</a>.</p>
    </section>
  </main>
  ${ctaHtml()}
  ${footerHtml()}
</div>`;
}
function promptPulseHubBody() {
  // Representative cross-industry sample: round-robin the strongest risers across
  // verticals (≤2 each) so the table isn't dominated by one industry.
  const perVertical = 2;
  const groups = promptPulse.verticals.map((v) =>
    v.prompts
      .filter((p) => p.trend.label === "Rising" || p.trend.label === "New")
      .map((p) => ({ ...p, vShort: v.short, vSlug: v.slug }))
      .sort((a, b) => ppTrendSort(b.trend) - ppTrendSort(a.trend))
      .slice(0, perVertical),
  );
  const rising = [];
  for (let i = 0; i < perVertical && rising.length < 12; i++) {
    for (const g of groups) {
      if (g[i] && rising.length < 12) rising.push(g[i]);
    }
  }
  const risingRows = rising
    .map(
      (p) =>
        `<tr><td>${escapeHtml(p.prompt)}</td><td>${escapeHtml(ppTrend(p.trend))}</td><td><a href="/prompt-pulse/${p.vSlug}/">${escapeHtml(p.vShort)}</a></td></tr>`,
    )
    .join("");
  const cards = promptPulse.verticals
    .map(
      (v) =>
        `<li><a href="/prompt-pulse/${v.slug}/"><strong>${escapeHtml(v.short)}</strong></a> — ${escapeHtml(v.blurb)} (${v.stats.prompts} prompts${v.stats.rising > 0 ? `, ${v.stats.rising} rising` : ""}, ${v.stats.decision} purchase-ready)</li>`,
    )
    .join("");
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container">
    <p class="seo-kicker">Prompt Pulse · AI demand data</p>
    <h1>See what your market is asking AI</h1>
    <p class="seo-lede">The real questions buyers ask ChatGPT, Perplexity, and Google AI Overviews — by industry, ranked by demand, and showing what's rising. Free, updated ${escapeHtml(promptPulse.updated)}, US/English.</p>
    <section class="seo-section">
      <h2>Browse by industry</h2>
      <ul class="seo-list">${cards}</ul>
    </section>
    <section class="seo-section">
      <h2>Rising across all industries</h2>
      <table><thead><tr><th>Prompt</th><th>Trend</th><th>Industry</th></tr></thead><tbody>${risingRows}</tbody></table>
    </section>
  </main>
  ${ctaHtml()}
  ${footerHtml()}
</div>`;
}
function promptPulseDatasetSchema(v, routePath) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Prompt Pulse — ${v.short}: AI demand for buyer prompts`,
    description: `The questions ${v.short} buyers ask AI answer engines, with a High/Medium/Low demand tier and a trend direction. Free, updated monthly.`,
    url: canonicalUrl(routePath),
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: site.name, url: site.url },
    temporalCoverage: v.updated,
    dateModified: v.updated,
    keywords: v.categories.topics,
    variableMeasured: [
      { "@type": "PropertyValue", name: "Prompt demand tier (High/Medium/Low)" },
      { "@type": "PropertyValue", name: "AI demand trend" },
    ],
  };
}
function promptPulseItemList(prompts, routePath, max = 50) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: canonicalUrl(routePath),
    numberOfItems: Math.min(prompts.length, max),
    itemListElement: prompts.slice(0, max).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.prompt,
    })),
  };
}

writePage(
  "prompt-pulse/index.html",
  renderLayout({
    routePath: "/prompt-pulse/",
    title: "Prompt Pulse — what your market is asking AI | SolCrys",
    description:
      "AI demand data: the real prompts buyers ask ChatGPT, Perplexity and Google AI Overviews across industries, ranked by demand and what's rising. Updated monthly.",
    lastModified: promptPulse.updated,
    body: promptPulseHubBody(),
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Prompt Pulse", path: "/prompt-pulse/" },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SolCrys Prompt Pulse",
        url: canonicalUrl("/prompt-pulse/"),
        hasPart: promptPulse.verticals.map((v) => ({
          "@type": "Dataset",
          name: `Prompt Pulse — ${v.short}`,
          url: canonicalUrl(`/prompt-pulse/${v.slug}/`),
        })),
      },
    ],
  }),
);

for (const v of promptPulse.verticals) {
  const routePath = `/prompt-pulse/${v.slug}/`;
  writePage(
    `prompt-pulse/${v.slug}/index.html`,
    renderLayout({
      routePath,
      title: `Prompt Pulse — ${v.short}: what buyers ask AI (2026) | SolCrys`,
      description: `The real questions ${v.short} buyers ask AI engines, rated by demand tier and trend. Free, updated monthly.`,
      lastModified: v.updated,
      body: promptPulseVerticalBody(v),
      schemas: [
        organizationSchema,
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Prompt Pulse", path: "/prompt-pulse/" },
          { name: v.short, path: routePath },
        ]),
        promptPulseDatasetSchema(v, routePath),
        promptPulseItemList(v.prompts, routePath),
      ],
    }),
  );
}

for (const page of resourcePages) {
  const routePath = `/${page.slug}/`;
  const draft = isDraft(page);
  writePage(
    `${page.slug}/index.html`,
    renderLayout({
      routePath,
      title: draft ? `[DRAFT] ${page.metaTitle}` : page.metaTitle,
      description: page.description,
      body: (draft ? draftBannerHtml() : "") + resourcePageHtml(page),
      ogImage: page.ogImage,
      lastModified: page.updated,
      noindex: draft,
      schemas: [
        organizationSchema,
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources/" },
          { name: page.title, path: routePath }
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: page.h1,
          description: page.description,
          dateModified: page.updated,
          datePublished: page.updated,
          mainEntityOfPage: canonicalUrl(routePath),
          author: {
            "@type": "Organization",
            name: site.name
          },
          publisher: {
            "@type": "Organization",
            name: site.name,
            logo: {
              "@type": "ImageObject",
              url: site.logo
            }
          }
        },
        faqSchema(page.faqs, routePath)
      ]
    })
  );
}

writePage(
  "news/index.html",
  renderLayout({
    routePath: "/news/",
    title: "Newsroom | SolCrys",
    description:
      "Press releases, founder notes, and announcements from SolCrys — the AEO operating system for brands in AI search.",
    body: newsIndexHtml(),
    lastModified: newsPosts[0]?.date || site.updated,
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Newsroom", path: "/news/" }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SolCrys Newsroom",
        url: canonicalUrl("/news/"),
        description:
          "Press releases, founder notes, and announcements from SolCrys.",
        hasPart: newsPosts.map((post) => ({
          "@type": post.kind === "press-release" ? "NewsArticle" : "Article",
          headline: post.title,
          datePublished: post.datePublished || post.date,
          dateModified: post.updated || post.date,
          url: canonicalUrl(`/news/${post.slug}/`)
        }))
      }
    ]
  })
);

for (const post of newsPosts) {
  const routePath = `/news/${post.slug}/`;
  const articleType = post.kind === "press-release" ? "NewsArticle" : "BlogPosting";
  const personImage =
    post.heroImage && post.heroImage.type === "person"
      ? personPhotoMap[post.heroImage.name]
      : null;
  const authorEntity = post.author
    ? {
        "@type": "Person",
        name: post.author.name,
        jobTitle: post.author.role,
        sameAs: post.author.linkedin ? [post.author.linkedin] : undefined
      }
    : {
        "@type": "Organization",
        name: site.name,
        url: site.url
      };
  writePage(
    `news/${post.slug}/index.html`,
    renderLayout({
      routePath,
      title: post.metaTitle,
      description: post.description,
      body: newsArticleHtml(post),
      lastModified: post.updated || post.date,
      schemas: [
        organizationSchema,
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Newsroom", path: "/news/" },
          { name: post.title, path: routePath }
        ]),
        {
          "@context": "https://schema.org",
          "@type": articleType,
          headline: post.title,
          description: post.description,
          datePublished: post.datePublished || post.date,
          dateModified: post.updated || post.date,
          mainEntityOfPage: canonicalUrl(routePath),
          image: personImage ? `${site.url}${personImage}` : undefined,
          author: authorEntity,
          publisher: {
            "@type": "Organization",
            name: site.name,
            logo: {
              "@type": "ImageObject",
              url: site.logo
            }
          }
        }
      ]
    })
  );
}

writePage(
  "404.html",
  renderLayout({
    routePath: "/404.html",
    title: "Page Not Found | SolCrys",
    description: "The requested SolCrys page could not be found.",
    body: notFoundHtml(),
    includeApp: false,
    noindex: true
  })
);

// Sitemap: per Google guidance, omit <priority> and <changefreq> (they are ignored)
// and only set <lastmod> from real content updates, never deploy timestamps.
const newsLatest = newsPosts[0]?.date || site.updated || generatedAt;
// Free ChatGPT Visibility Tracker — keyword-targeted landing page. This is the
// indexable ranking + AI-citation asset on solcrys.com; the actual run happens
// in-app at app.solcrys.com/audit (the free tier). Mirrors the React
// FreeTrackerPage content for crawlers + first paint.
const freeTrackerRoute = "/free-chatgpt-visibility-tracker/";
const freeTrackerTitle =
  "Free ChatGPT Visibility Tracker — See If AI Recommends Your Brand | SolCrys";
const freeTrackerDescription =
  "Free ChatGPT visibility tracker. See whether ChatGPT mentions, cites, or skips your brand on the prompts your buyers actually ask — then get the exact fix to ship, not just a score. About 5 minutes, no credit card.";
const freeTrackerSteps = [
  {
    name: "Enter your domain",
    text: "Just your website — or a competitor's. No credit card.",
  },
  {
    name: "We ask ChatGPT your buyers' questions",
    text: "SolCrys runs the high-intent prompts people use to find products like yours, then reads how ChatGPT answers.",
  },
  {
    name: "See where you show up — and where a rival wins",
    text: "Your visibility score, the prompts where AI skips you, and which competitor it names instead.",
  },
  {
    name: "Get the fix, not just the score",
    text: "In the same free workspace, run a free content audit on a page: it hands you the exact change to ship — the JSON-LD block, the heading rewrite — with the points each fix recovers.",
  },
];
const freeTrackerFaqs = [
  {
    question: "Is the ChatGPT visibility tracker really free?",
    answer:
      "Yes. You can check your brand's ChatGPT visibility for free, with no credit card. The free tier covers ChatGPT; paid plans add Gemini, Google AI Overviews, and Perplexity plus automatic daily tracking.",
  },
  {
    question: "Does it just give me a score, or help me fix it?",
    answer:
      "Both. The visibility check is the measure step. In the same free workspace, a free content audit hands you the concrete fix to ship — the schema block, the heading rewrite — not just a score. That is what makes SolCrys a closed loop instead of a scoreboard: measure, diagnose, execute, verify. Re-testing at scale across every engine is the paid part.",
  },
  {
    question: "What should I do after I get my results?",
    answer:
      "Run the loop. Pick the page behind your weakest prompt and run your free content audit on it — it returns the specific findings, the code or copy to ship, and the points each fix recovers. Ship the fix, then re-test: your next monthly audit (or a paid plan, on demand) re-scores the page so you can see the recovery. Score → fix → proof, instead of score → screenshot → forgotten.",
  },
  {
    question: "What's included in the free workspace?",
    answer:
      "10 tracked prompts on ChatGPT with manual checks (3 per month), one content audit per month (with the concrete fixes), one deep analysis per month, and the Action Hub that turns findings into a task queue. Free forever, no credit card — email verification is all it takes. Paid plans add more engines, daily tracking, and more audits.",
  },
  {
    question: "Do I need to sign up?",
    answer:
      "Enter your domain to start. To unlock the full report, save it, and track changes over time, you create a free workspace — still no credit card.",
  },
  {
    question: "Which AI engines does it cover?",
    answer:
      "The free tracker checks ChatGPT. SolCrys also tracks Gemini, Google AI Overviews / AI Mode, and Perplexity on paid plans, so you can see your visibility across every major answer engine.",
  },
  {
    question: "How is this different from my Google ranking?",
    answer:
      "Ranking #1 on Google does not mean AI engines recommend you. ChatGPT synthesizes an answer from many sources and often names a different brand than the top Google result. This tracker shows what AI actually says about you.",
  },
  {
    question: "How accurate is the result?",
    answer:
      "We query the live engine on real buyer prompts and report what it returned, including the citations and competitors it surfaced. AI answers vary run to run, so SolCrys tracks them over time rather than from a single snapshot.",
  },
];
function freeTrackerBody() {
  const stepHtml = freeTrackerSteps
    .map((s) => `<li><strong>${escapeHtml(s.name)}.</strong> ${escapeHtml(s.text)}</li>`)
    .join("\n        ");
  const faqHtml = freeTrackerFaqs
    .map((f) => `<h3>${escapeHtml(f.question)}</h3>\n      <p>${escapeHtml(f.answer)}</p>`)
    .join("\n      ");
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container">
    <p class="seo-kicker">Free ChatGPT visibility tracker</p>
    <h1>Free ChatGPT Visibility Tracker</h1>
    <p class="seo-lede">See whether ChatGPT mentions, cites, or skips your brand on the prompts your buyers actually ask — or names a competitor instead. Then, unlike a scoreboard, the free workspace hands you the exact fix to ship. About 5 minutes, no credit card.</p>
    <p><a href="https://app.solcrys.com/audit">Track your ChatGPT visibility, free &rarr;</a> &middot; Free &middot; No credit card</p>
    <section class="seo-section">
      <h2>What &ldquo;AI visibility&rdquo; means &mdash; and why your Google rank doesn&rsquo;t cover it</h2>
      <p>When a buyer asks ChatGPT &ldquo;what&rsquo;s the best tool for X,&rdquo; the answer names a short list of brands. AI visibility is whether you are on that list &mdash; decided by the citations and sources the model trusts, not by where you rank on Google. The tracker checks three outcomes for every prompt:</p>
      <ul class="seo-list">
        <li><strong>Mentioned</strong> &mdash; ChatGPT names your brand in the answer.</li>
        <li><strong>Cited</strong> &mdash; ChatGPT links to your page as a source.</li>
        <li><strong>Skipped</strong> &mdash; ChatGPT answers without you, often naming a rival.</li>
      </ul>
    </section>
    <section class="seo-section">
      <h2>How the free ChatGPT visibility tracker works</h2>
      <ol class="seo-list">
        ${stepHtml}
      </ol>
    </section>
    <section class="seo-section">
      <h2>What&rsquo;s in your free report</h2>
      <ul class="seo-list">
        <li>Your ChatGPT visibility score</li>
        <li>The high-intent prompts where AI skips your brand</li>
        <li>Which competitor ChatGPT recommends in your place</li>
        <li>The citations and sources shaping the answer</li>
      </ul>
      <p>Your report is saved to your free workspace &mdash; 10 tracked prompts, one content audit and one deep analysis a month, and the Action Hub that turns findings into fixes. No credit card.</p>
    </section>
    <section class="seo-section">
      <h2>Here&rsquo;s the fix you actually get</h2>
      <p>Every free checker we&rsquo;ve tested ends at a score. A SolCrys audit ends with the change to ship. These are real findings from running the free content audit on our own About page &mdash; it scored 60/100, and yes, we publish that:</p>
      <p><strong>Finding: schema type doesn&rsquo;t match the content.</strong> The page emits AboutPage + Organization markup; the template AI engines expect here is BlogPosting. The audit hands you the block to paste &mdash; <strong>14 points recoverable</strong>:</p>
      <pre><code>{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "About SolCrys — AI Search and AEO Team",
  "author": {
    "@type": "Person",
    "name": "SolCrys Team",
    "worksFor": { "@type": "Organization", "name": "SolCrys" }
  },
  "dateModified": "2026-05-15"
}</code></pre>
      <ul class="seo-list">
        <li><strong>Add source links to statistics and claims</strong> &mdash; the audit lists which sentences, with before/after &mdash; <strong>35 points recoverable</strong></li>
        <li><strong>Wrap key numbers in &lt;strong&gt;</strong> so AI engines extract them &mdash; <strong>20 points recoverable</strong></li>
      </ul>
      <p>Every audit returns findings in this form: the current state, the update to make, the code to paste, and the points it recovers. You leave with a fix, not homework.</p>
    </section>
    <section class="seo-section">
      <h2>Most free checkers stop at the score &mdash; this one reaches the fix</h2>
      <p>We surveyed 16 free AEO tools against the full loop &mdash; measure &rarr; diagnose &rarr; execute &rarr; verify. Free-forever trackers, one-shot graders, and trials all stop at measure or diagnose: a score and a gap list, then you are on your own. The SolCrys free workspace is the only free tier we found that reaches <em>execute</em> &mdash; it hands you the fix itself. The honest boundary: re-testing that the fix moved the answer uses your next monthly audit on free; on-demand re-tests and multi-engine tracking are the paid part. That cycle is <a href="/#loop">the SolCrys Loop</a>; see the full comparison in <a href="/free-aeo-tools-that-fix-not-just-score/">16 free AEO tools, compared by the loop</a>.</p>
    </section>
    <section class="seo-section">
      <h2>Exactly what&rsquo;s free &mdash; no fine print</h2>
      <p>Most free tools never state their limits. Here are ours, precisely:</p>
      <table>
        <thead>
          <tr><th></th><th>Free workspace</th><th>Paid plans</th></tr>
        </thead>
        <tbody>
          <tr><td>Engines</td><td>ChatGPT &mdash; manual checks (3/mo)</td><td>Up to 5 engines, tracked daily</td></tr>
          <tr><td>Tracked prompts</td><td>10</td><td>20&ndash;60</td></tr>
          <tr><td>Content audits (with the fix)</td><td>1 / month</td><td>4&ndash;10 / month</td></tr>
          <tr><td>Deep analyses</td><td>1 / month</td><td>12&ndash;40 / month</td></tr>
          <tr><td>Action Hub (the fix itself)</td><td>Included</td><td>Included</td></tr>
          <tr><td>Re-test to verify the fix</td><td>Next month&rsquo;s audit</td><td>On demand, at scale</td></tr>
        </tbody>
      </table>
      <p>Full plan details on the <a href="https://app.solcrys.com/pricing">pricing page</a>.</p>
    </section>
    <section class="seo-section">
      <h2>Free ChatGPT visibility tracker &mdash; FAQ</h2>
      ${faqHtml}
    </section>
  </main>
  ${footerHtml()}
</div>`;
}
writePage(
  "free-chatgpt-visibility-tracker/index.html",
  renderLayout({
    routePath: freeTrackerRoute,
    title: freeTrackerTitle,
    description: freeTrackerDescription,
    body: freeTrackerBody(),
    lastModified: site.updated,
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Free ChatGPT Visibility Tracker", path: freeTrackerRoute },
      ]),
      webPageSchema({
        routePath: freeTrackerRoute,
        title: freeTrackerTitle,
        description: freeTrackerDescription,
      }),
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Free ChatGPT Visibility Tracker",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: canonicalUrl(freeTrackerRoute),
        description: freeTrackerDescription,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: { "@type": "ImageObject", url: site.logo },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to check your brand's ChatGPT visibility for free",
        description:
          "Run a free ChatGPT visibility check on your brand in about 5 minutes.",
        step: freeTrackerSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      },
      faqSchema(freeTrackerFaqs, freeTrackerRoute),
    ],
  }),
);

// Free AEO Audit — the execution-intent sibling of the tracker LP.
// Demand research 2026-06-12: "free aeo audit" / "free geo audit tool" are
// autocomplete-confirmed clusters with a fragmented, measure-only SERP;
// "execution engine" (our category term) has zero query demand. This page
// anchors on the user's word ("audit") and carries the execution-engine
// story in the body. Mirrors src/pages/FreeAeoAuditPage.tsx.
const freeAeoAuditRoute = "/free-aeo-audit/";
const freeAeoAuditTitle =
  "Free AEO Audit Tool — Get the Fix, Not Just the Score | SolCrys";
const freeAeoAuditDescription =
  "Free AEO audit: score any page across 40+ AI-search checks and get the exact fix to ship — the schema block, the meta rewrite, the points each fix recovers. Free workspace, no credit card.";
const freeAeoAuditSteps = [
  {
    name: "Enter your domain",
    text: "Your free workspace opens with a ChatGPT visibility read: 10 buyer-intent prompts, where you show up, who gets named instead.",
  },
  {
    name: "Run your free content audit",
    text: "Point it at the page behind your weakest prompt. It scores 40+ checks across content quality, credibility, technical readability, and discoverability.",
  },
  {
    name: "Get the fixes, not homework",
    text: "Every finding ships with the current state, the update to make, the code or copy to paste, and the points it recovers.",
  },
  {
    name: "Ship, then re-test",
    text: "Re-audit the page to watch the score recover — your next monthly audit on free, on demand on paid plans.",
  },
];
const freeAeoAuditFaqs = [
  {
    question: "What is an AEO audit?",
    answer:
      "An AEO (Answer Engine Optimization) audit scores a page on how well AI engines like ChatGPT, Perplexity, and Google AI can retrieve, trust, cite, and summarize it — then tells you what to change. SolCrys's free audit runs 40+ checks across content quality, credibility, technical readability, and discoverability, and returns each finding with the concrete fix attached.",
  },
  {
    question: "What does the audit check?",
    answer:
      "Four weighted categories: content quality (30%) — direct answers, term definitions, emphasized data; credibility (35%) — sourced statistics, external citations, author attribution; technical readability (20%) — JSON-LD that matches the content type, schema completeness, content visible without JavaScript; discoverability (15%) — meta description, links, canonical, sitemap, AI-crawler access.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. The free workspace includes one content audit per month with the full findings and fixes, plus 10 tracked ChatGPT prompts and one deep analysis. No credit card — email verification is all it takes. Paid plans add more engines, daily tracking, and more audits.",
  },
  {
    question: "AEO audit vs GEO audit — what's the difference?",
    answer:
      "Same audit, different name. Some teams say GEO (Generative Engine Optimization), others say AEO (Answer Engine Optimization); both mean optimizing for AI-generated answers. The checks — schema, credibility signals, answer-ready structure, crawler access — are identical, so this free audit covers both.",
  },
  {
    question: "Do I get a score or the actual fix?",
    answer:
      "Both, and that's the point. Most free AEO graders return a score and generic tips. Every SolCrys finding ships with the current state, the update to make, the code or copy to paste (the JSON-LD block, the meta rewrite), and the points it recovers — so you leave with a fix, not homework.",
  },
  {
    question: "What should I do after the audit?",
    answer:
      "Ship the highest-point fixes first — each finding shows its points recoverable, so the priority order is explicit. Then re-test: re-auditing the same page shows the score recovery. On free that's your next monthly audit; paid plans re-test on demand and track the answer itself across engines daily.",
  },
  {
    question: "How is this different from a free AEO grader?",
    answer:
      "Graders measure; this audit executes. We surveyed 16 free AEO tools against the loop — measure, diagnose, execute, verify — and the free offerings all stop at a score or a gap list. The SolCrys free workspace is the only free tier we found that reaches execute: it hands you the fix itself. The honest boundary: re-testing on free uses your next monthly audit.",
  },
  {
    question: "Do I need to sign up?",
    answer:
      "Enter your domain to start. To run the audit, keep the findings, and track changes over time, you create a free workspace — email verification, no credit card.",
  },
];
function freeAeoAuditBody() {
  const stepHtml = freeAeoAuditSteps
    .map((s) => `<li><strong>${escapeHtml(s.name)}.</strong> ${escapeHtml(s.text)}</li>`)
    .join("\n        ");
  const faqHtml = freeAeoAuditFaqs
    .map((f) => `<h3>${escapeHtml(f.question)}</h3>\n      <p>${escapeHtml(f.answer)}</p>`)
    .join("\n      ");
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container">
    <p class="seo-kicker">Free AEO audit</p>
    <h1>Free AEO Audit &mdash; Get the Fix, Not Just the Score</h1>
    <p class="seo-lede">Most free AEO graders score you and stop. This audit runs 40+ AI-search checks on your pages and returns every finding with the change to ship attached &mdash; the schema block, the meta rewrite, the points it recovers. Free workspace, no credit card.</p>
    <p><a href="https://app.solcrys.com/audit">Run your free AEO audit &rarr;</a> &middot; Free &middot; No credit card</p>
    <section class="seo-section">
      <h2>What a free AEO audit checks &mdash; 40+ checks, four weighted categories</h2>
      <p>AI engines decide what to cite using signals your Google rank never measured. The audit scores the four families that decide whether an answer engine retrieves, trusts, cites, and summarizes your page:</p>
      <ul class="seo-list">
        <li><strong>Content quality (30% of the score)</strong> &mdash; does the page answer in the first 50 words, define terms, emphasize key numbers, and structure sections the way answer engines extract them?</li>
        <li><strong>Credibility (35%)</strong> &mdash; sourced statistics, authoritative external citations, author and expert attribution, promotional-language density.</li>
        <li><strong>Technical readability (20%)</strong> &mdash; JSON-LD present and matching the content type, schema completeness, text-to-HTML ratio, content visible without JavaScript.</li>
        <li><strong>Discoverability (15%)</strong> &mdash; meta description, internal and outbound links, canonical, sitemap presence, descriptive URL slug, crawler access for all major AI bots.</li>
      </ul>
    </section>
    <section class="seo-section">
      <h2>How the free AEO audit works</h2>
      <ol class="seo-list">
        ${stepHtml}
      </ol>
      <p>That cycle &mdash; measure, diagnose, execute, verify &mdash; is <a href="/#loop">the SolCrys Loop</a>. The free workspace runs one full pass a month.</p>
    </section>
    <section class="seo-section">
      <h2>Findings come with the fix attached</h2>
      <p>Real findings from running this audit on our own About page &mdash; it scored 60/100, and yes, we publish that:</p>
      <p><strong>Finding: meta description too thin to stand alone (109 characters).</strong> AI engines lean on the meta description to judge page relevance when they don&rsquo;t parse the full body. The audit hands you the rewrite &mdash; <strong>14 points recoverable</strong>:</p>
      <pre><code>&lt;meta name="description" content="Meet the SolCrys
team — AI search strategists, enterprise marketers,
and engineers building tools to measure and improve
brand visibility in AI-generated answers." /&gt;</code></pre>
      <ul class="seo-list">
        <li><strong>Descriptive URL slug + the 301 redirect config to ship</strong> &mdash; <strong>15 points recoverable</strong></li>
        <li><strong>Rephrase one H2 as a question</strong> so engines map it to user queries, with the suggested heading &mdash; <strong>15 points recoverable</strong></li>
      </ul>
      <p>Current state, the update to make, the code to paste, the points it recovers &mdash; every finding, in that form.</p>
    </section>
    <section class="seo-section">
      <h2>Graders measure &mdash; this audit executes</h2>
      <p>We surveyed 16 free AEO tools against the full loop &mdash; measure &rarr; diagnose &rarr; execute &rarr; verify. The free graders and checkers all stop at a score or a gap list; even the biggest one returns five scored dimensions and generic tips. The SolCrys free workspace is the only free tier we found that reaches <em>execute</em>: the audit hands you the fix itself. The honest boundary: re-testing on free uses your next monthly audit; on-demand re-tests and multi-engine tracking are the paid part. See the evidence in <a href="/free-aeo-tools-that-fix-not-just-score/">16 free AEO tools, compared by the loop</a>, or start with the <a href="/free-chatgpt-visibility-tracker/">free ChatGPT visibility tracker</a> if you want the visibility read first.</p>
    </section>
    <section class="seo-section">
      <h2>Exactly what&rsquo;s free &mdash; no fine print</h2>
      <table>
        <thead>
          <tr><th></th><th>Free workspace</th><th>Paid plans</th></tr>
        </thead>
        <tbody>
          <tr><td>Content audits (with the fix)</td><td>1 / month</td><td>4&ndash;10 / month</td></tr>
          <tr><td>Engines</td><td>ChatGPT &mdash; manual checks (3/mo)</td><td>Up to 5 engines, tracked daily</td></tr>
          <tr><td>Tracked prompts</td><td>10</td><td>20&ndash;60</td></tr>
          <tr><td>Deep analyses</td><td>1 / month</td><td>12&ndash;40 / month</td></tr>
          <tr><td>Action Hub (the fix itself)</td><td>Included</td><td>Included</td></tr>
          <tr><td>Re-test to verify the fix</td><td>Next month&rsquo;s audit</td><td>On demand, at scale</td></tr>
        </tbody>
      </table>
      <p>Full plan details on the <a href="https://app.solcrys.com/pricing">pricing page</a>.</p>
    </section>
    <section class="seo-section">
      <h2>Free AEO audit &mdash; FAQ</h2>
      ${faqHtml}
    </section>
  </main>
  ${footerHtml()}
</div>`;
}
writePage(
  "free-aeo-audit/index.html",
  renderLayout({
    routePath: freeAeoAuditRoute,
    title: freeAeoAuditTitle,
    description: freeAeoAuditDescription,
    body: freeAeoAuditBody(),
    lastModified: site.updated,
    ogImage: "/og/free-aeo-audit.png",
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Free AEO Audit", path: freeAeoAuditRoute },
      ]),
      webPageSchema({
        routePath: freeAeoAuditRoute,
        title: freeAeoAuditTitle,
        description: freeAeoAuditDescription,
      }),
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Free AEO Audit",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: canonicalUrl(freeAeoAuditRoute),
        description: freeAeoAuditDescription,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: { "@type": "ImageObject", url: site.logo },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to run a free AEO audit and ship the fixes",
        description:
          "Audit a page for AI search readiness and get the exact fixes to ship, free.",
        step: freeAeoAuditSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      },
      faqSchema(freeAeoAuditFaqs, freeAeoAuditRoute),
    ],
  }),
);

const sitemapUrls = [
  { path: "/", lastmod: site.updated || generatedAt },
  { path: "/about/", lastmod: site.updated || generatedAt },
  { path: "/customers/", lastmod: site.updated || generatedAt },
  { path: "/customers/nextsilicon/", lastmod: site.updated || generatedAt },
  // /pricing/ removed Phase E — page is now a noindex meta-refresh bridge
  // to app.solcrys.com/pricing. Listing the bridge would tell crawlers to
  // index a page whose only job is to redirect away from itself.
  { path: "/resources/", lastmod: site.updated || generatedAt },
  { path: "/free-chatgpt-visibility-tracker/", lastmod: site.updated || generatedAt },
  { path: "/free-aeo-audit/", lastmod: site.updated || generatedAt },
  { path: "/prompt-pulse/", lastmod: promptPulse.updated },
  ...promptPulse.verticals.map((v) => ({ path: `/prompt-pulse/${v.slug}/`, lastmod: v.updated || promptPulse.updated })),
  { path: "/news/", lastmod: newsLatest },
  ...newsPosts.map((post) => ({ path: `/news/${post.slug}/`, lastmod: post.updated || post.date })),
  // Drafts are excluded from sitemap (so search engines don't discover them).
  ...publishedResourcePages.map((page) => ({ path: `/${page.slug}/`, lastmod: page.updated })),
  { path: "/privacy.html", lastmod: site.updated || generatedAt },
  { path: "/terms.html", lastmod: site.updated || generatedAt }
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (url) => `  <url>
    <loc>${xmlEscape(canonicalUrl(url.path))}</loc>
    <lastmod>${xmlEscape(url.lastmod)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;
writePage("sitemap.xml", sitemapXml);

// Emit canonical URL list for IndexNow ping (consumed by scripts/ping-indexnow.mjs)
writePage(
  "indexnow-urls.json",
  `${JSON.stringify(sitemapUrls.map((url) => canonicalUrl(url.path)), null, 2)}\n`
);

const llmsTxt = `# ${site.name}

> ${site.description}

SolCrys helps marketing and growth teams monitor answer engine visibility, identify missing citations, and improve the content sources that AI systems use when answering buyer questions.

## Core Pages

- [Home](${site.url}/): Product overview, AI visibility audit, and platform positioning.
- [About](${site.url}/about/): Company story, founding team, and advisors.
- [Customers](${site.url}/customers/): Customer stories from brands using SolCrys across AI engines — featuring UiPath (enterprise automation software), NextSilicon (HPC & AI infrastructure, 1.9% → 7.4% mention rate in 45 days), and Wyze (consumer smart home).
- [NextSilicon case study](${site.url}/customers/nextsilicon/): Full case study — how NextSilicon quadrupled its share of voice in HPC & AI in 45 days, mention rate 1.9% → 7.4%, with the SolCrys approach (prompt building, content optimization, metadata intelligence, authority mapping, deep analysis) detailed end-to-end.
- [Pricing](https://app.solcrys.com/pricing): Brand and agency pricing for AI visibility tracking and diagnosis.
- [AEO Resource Hub](${site.url}/resources/): Curated guides for Answer Engine Optimization and AI search visibility.
- [Prompt Pulse](${site.url}/prompt-pulse/): AI demand data — the real questions buyers ask ChatGPT, Perplexity and Google AI Overviews across ${promptPulse.verticals.length} industries, ranked by demand and what's rising. Updated ${promptPulse.updated}.${promptPulse.verticals
  .map(
    (v) => `\n  - [${v.short}](${site.url}/prompt-pulse/${v.slug}/): ${v.stats.prompts} buyer prompts ${v.short} teams should track in AI answers.`
  )
  .join("")}
- [Newsroom](${site.url}/news/): Press releases and founder notes.${newsPosts
  .map(
    (post) => `\n  - [${post.title}](${site.url}/news/${post.slug}/): ${post.dek}`
  )
  .join("")}

## Recommended Reading

${publishedResourcePages.map((page) => `- [${page.title}](${site.url}/${page.slug}/): ${page.description}`).join("\n")}

## Contact

- Email: ${site.email}
- LinkedIn: ${site.linkedin}
`;
writePage("llms.txt", llmsTxt);

const llmsFullTxt = `# ${site.name} Full AEO Context

${site.description}

${publishedResourcePages
  .map(
    (page) => `## ${page.title}

${page.summary}
${Array.isArray(page.aeoTargets) && page.aeoTargets.length > 0 ? `\n### Questions this guide answers\n\n${page.aeoTargets.map((q) => `- ${q}`).join("\n")}\n` : ""}
${page.sections
  .map(
    (section) => `### ${section.heading}

${section.body.join("\n\n")}
${section.bullets ? `\n\n${section.bullets.map((item) => `- ${item}`).join("\n")}` : ""}
${section.table ? `\n\n${section.table.headers.join(" | ")}\n${section.table.headers.map(() => "---").join(" | ")}\n${section.table.rows.map((row) => row.join(" | ")).join("\n")}` : ""}
${section.subsections ? section.subsections.map((sub) => `\n\n#### ${sub.heading}\n\n${sub.body.join("\n\n")}${sub.bullets ? `\n\n${sub.bullets.map((item) => `- ${item}`).join("\n")}` : ""}`).join("") : ""}`
  )
  .join("\n\n")}

${Array.isArray(page.sources) && page.sources.length > 0 ? `\n### Sources\n\n${page.sources.map((source) => `- [${source.label}](${source.url})`).join("\n")}\n` : ""}
### FAQ

${page.faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n")}`
  )
  .join("\n\n")}
`;
writePage("llms-full.txt", llmsFullTxt);

const legacyStyles = path.join(rootDir, "styles.css");
if (fs.existsSync(legacyStyles)) {
  fs.copyFileSync(legacyStyles, path.join(distDir, "styles.css"));
}

// Static redirect bridges for retired / never-built URLs that still 404 live.
// GitHub Pages can't issue server-side 301s, so each entry emits the same
// meta-refresh + canonical + JS-replace stand-in used for /pricing/ (see
// pricingRedirectBridgeHtml above) — search engines treat a zero-second
// meta-refresh as a 301 for canonical consolidation.
//
// `to` is either a same-site slug (resolved against solcrys.com) or an
// absolute URL (e.g. the app subdomain, where the audit/contact funnels live).
//
// /free-audit/ and /contact/ were never real marketing-root routes — the
// funnels moved to the app. An Ahrefs crawl surfaced both (plus /pricing-alerts/
// and /strategy-positioning/) as 404s with heavy internal inlinks. The internal
// links were repointed to the app CTAs in a prior commit, but the bare URLs
// still 404 for external backlinks, search-index entries, AI citations, and
// typed traffic. These bridges recover that link equity to the right page.
// Destinations mirror the in-page CTAs: AUDIT_URL (src/lib/audit-cta.ts) and
// contact-sales. /pricing-alerts/ and /strategy-positioning/ were internal-link
// typos — send strays to their topical home (the pricing comparison page and
// the About page's Founders' Notes section, respectively).
const retiredRedirects = [
  { from: "ai-search-share-of-voice", to: "ai-share-of-recommendation" },
  { from: "free-audit", to: "https://app.solcrys.com/audit" },
  { from: "contact", to: "https://app.solcrys.com/contact-sales/" },
  { from: "pricing-alerts", to: "aeo-platform-pricing-2026" },
  { from: "strategy-positioning", to: "about" },
];

for (const { from, to } of retiredRedirects) {
  const target = /^https?:\/\//i.test(to) ? to : canonicalUrl(`/${to}/`);
  const redirectHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page has moved | SolCrys</title>
    <link rel="canonical" href="${escapeAttr(target)}" />
    <meta name="robots" content="noindex, follow" />
    <meta http-equiv="refresh" content="0; url=${escapeAttr(target)}" />
    <script>window.location.replace(${JSON.stringify(target)});</script>
  </head>
  <body>
    <p>This page has moved. Redirecting to <a href="${escapeAttr(target)}">${escapeHtml(target)}</a>.</p>
  </body>
</html>
`;
  writePage(`${from}/index.html`, redirectHtml);
}

console.log(`Prerendered ${resourcePages.length + 1 + promptPulse.verticals.length + 1 + newsPosts.length + 1 + retiredRedirects.length} static HTML pages (incl. ${promptPulse.verticals.length} Prompt Pulse verticals + ${newsPosts.length} news + index), sitemap.xml, llms.txt, and llms-full.txt.`);
