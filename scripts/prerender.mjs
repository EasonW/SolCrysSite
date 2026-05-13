import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const content = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/siteContent.json"), "utf8"));
const pricingContent = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/pricing.json"), "utf8"));
const newsroomContent = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/newsroom.json"), "utf8"));

const { site, home, resourcePages, resourceClusters = [] } = content;
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
        <a href="/pricing/">Pricing</a>
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
          <a href="/pricing/">Pricing</a>
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
          <li><strong>Step 01 · Measure.</strong> 20 prompts tracked across ChatGPT, Gemini, Google AI Overviews / AI Mode, and Perplexity on eligible plans.</li>
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
        <li><strong>Measure across engines.</strong> Run a fixed prompt set across ChatGPT, Gemini, Google AI Overviews / AI Mode, and Perplexity on eligible plans. Capture mentions, citations, competitors, sentiment, and answer accuracy in one place.</li>
        <li><strong>Diagnose the answer gap.</strong> Classify each weak answer as an absence, citation, accuracy, comparison, or action gap. Map each gap to the page or source most likely to fix it.</li>
        <li><strong>Execute with Corporate Context.</strong> SolCrys uses your approved facts, claims, and guardrails to turn gaps into briefs, fix recommendations, and reviewable drafts your team can approve and ship.</li>
        <li><strong>Verify and re-test.</strong> Re-run the same prompt set after the action ships. Track citation rate, answer accuracy, and recommendation share to prove which fixes actually moved the answer.</li>
      </ol>
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
      <div class="seo-grid">
        ${resourcePages
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
    <section id="source-notes" class="seo-container seo-section">
      <h2>Source notes</h2>
      <p>These references guide how SolCrys evaluates AI search visibility, crawler access, and answer readiness.</p>
      <ul class="seo-list">
        ${home.sourceNotes
          .map(
            (source) => `<li><a href="${escapeAttr(source.url)}" rel="noopener" target="_blank">${escapeHtml(source.label)}</a>: ${escapeHtml(source.description)}</li>`
          )
          .join("")}
      </ul>
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
      <h1>How consumer brands use SolCrys to show up in AI answers.</h1>
      <p class="seo-lede">Visibility, accuracy, and trust across the AI engines where buyers now ask, compare, and decide.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Featured customer: Wyze</h2>
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
  for (const page of resourcePages) {
    const list = grouped.get(page.category) || [];
    list.push(page);
    grouped.set(page.category, list);
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
        ${subsection.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        ${subsection.bullets ? `<ul class="seo-list">${subsection.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
      </div>`;
}

function sectionHtml(section) {
  return `
    <section class="seo-section">
      <h2>${escapeHtml(section.heading)}</h2>
      ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      ${section.bullets ? `<ul class="seo-list">${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
      ${
        section.table
          ? `<table>
              <thead><tr>${section.table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
              <tbody>${section.table.rows
                .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
                .join("")}</tbody>
            </table>`
          : ""
      }
      ${section.subsections ? section.subsections.map(subsectionHtml).join("") : ""}
    </section>`;
}

function relatedGuidesHtml(page) {
  const explicit = Array.isArray(page.relatedSlugs)
    ? page.relatedSlugs.map((slug) => resourceBySlug.get(slug)).filter(Boolean)
    : [];
  const related = explicit.length > 0
    ? explicit.slice(0, 3)
    : resourcePages.filter((p) => p.slug !== page.slug).slice(0, 3);
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

function resourcePageHtml(page) {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main class="seo-container">
    <article>
      <header class="seo-hero">
        <p class="seo-kicker">${escapeHtml(page.category)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="seo-lede">${escapeHtml(page.summary)}</p>
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
            <p>${escapeHtml(faq.answer)}</p>
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
    description: "How consumer brands like Wyze use SolCrys to show up correctly across AI search engines, with visibility, accuracy, and trust across ChatGPT, Gemini, AI Overviews, AI Mode, and Perplexity.",
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
        description: "Customer stories from consumer brands using SolCrys for AI search visibility, accuracy, and trust.",
        datePublished: site.published || generatedAt,
        dateModified: site.updated || generatedAt
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
      }
    ]
  })
);

writePage(
  "pricing/index.html",
  renderLayout({
    routePath: "/pricing/",
    title: pricingContent.meta.title,
    description: pricingContent.meta.description,
    body: pricingHtml(),
    schemas: [
      organizationSchema,
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing/" }
      ]),
      webPageSchema({
        routePath: "/pricing/",
        title: pricingContent.meta.title,
        description: pricingContent.meta.description,
        ogImage: pricingContent.meta.ogImage
      })
    ]
  })
);

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
        hasPart: resourcePages.map((page) => ({
          "@type": "WebPage",
          name: page.title,
          url: canonicalUrl(`/${page.slug}/`)
        }))
      }
    ]
  })
);

for (const page of resourcePages) {
  const routePath = `/${page.slug}/`;
  writePage(
    `${page.slug}/index.html`,
    renderLayout({
      routePath,
      title: page.metaTitle,
      description: page.description,
      body: resourcePageHtml(page),
      ogImage: page.ogImage,
      lastModified: page.updated,
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
const sitemapUrls = [
  { path: "/", lastmod: site.updated || generatedAt },
  { path: "/about/", lastmod: site.updated || generatedAt },
  { path: "/customers/", lastmod: site.updated || generatedAt },
  { path: "/pricing/", lastmod: site.updated || generatedAt },
  { path: "/resources/", lastmod: site.updated || generatedAt },
  { path: "/news/", lastmod: newsLatest },
  ...newsPosts.map((post) => ({ path: `/news/${post.slug}/`, lastmod: post.updated || post.date })),
  ...resourcePages.map((page) => ({ path: `/${page.slug}/`, lastmod: page.updated })),
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
- [Customers](${site.url}/customers/): Customer stories from consumer brands using SolCrys across AI engines.
- [Pricing](${site.url}/pricing/): Brand and agency pricing for AI visibility tracking and diagnosis.
- [AEO Resource Hub](${site.url}/resources/): Curated guides for Answer Engine Optimization and AI search visibility.
- [Newsroom](${site.url}/news/): Press releases and founder notes.${newsPosts
  .map(
    (post) => `\n  - [${post.title}](${site.url}/news/${post.slug}/): ${post.dek}`
  )
  .join("")}

## Recommended Reading

${resourcePages.map((page) => `- [${page.title}](${site.url}/${page.slug}/): ${page.description}`).join("\n")}

## Contact

- Email: ${site.email}
- LinkedIn: ${site.linkedin}
`;
writePage("llms.txt", llmsTxt);

const llmsFullTxt = `# ${site.name} Full AEO Context

${site.description}

${resourcePages
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

const retiredRedirects = [
  { from: "ai-search-share-of-voice", to: "ai-share-of-recommendation" },
];

for (const { from, to } of retiredRedirects) {
  const target = canonicalUrl(`/${to}/`);
  const redirectHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Moved - see AI Share of Recommendation | SolCrys</title>
    <link rel="canonical" href="${target}" />
    <meta name="robots" content="noindex, follow" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>window.location.replace(${JSON.stringify(target)});</script>
  </head>
  <body>
    <p>This page has moved. Redirecting to <a href="${target}">${target}</a>.</p>
  </body>
</html>
`;
  writePage(`${from}/index.html`, redirectHtml);
}

console.log(`Prerendered ${resourcePages.length + 5 + newsPosts.length + 1 + retiredRedirects.length} static HTML pages (incl. ${newsPosts.length} news + index), sitemap.xml, llms.txt, and llms-full.txt.`);
