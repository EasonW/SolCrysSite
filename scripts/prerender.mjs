import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const content = JSON.parse(fs.readFileSync(path.join(rootDir, "src/content/siteContent.json"), "utf8"));

const { site, home, resourcePages } = content;
const generatedAt = "2026-04-29";

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
      <a href="/" aria-label="SolCrys AI home"><img src="/logo.png" alt="SolCrys AI Logo" width="134" height="40" style="height: 40px; width: auto;"></a>
      <nav style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.9rem; color: hsl(var(--muted-foreground));">
        <a href="/#aeo">Why AEO</a>
        <a href="/#approach">Our Approach</a>
        <a href="/#features">Features</a>
        <a href="/resources/">Resources</a>
        <a href="/about/">About</a>
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
        <p class="seo-kicker">AI visibility audit</p>
        <h2>Find out where your brand is missing, miscited, or misrepresented.</h2>
        <p>SolCrys maps high-intent prompts to mentions, citations, answer accuracy, and content gaps so your team can prioritize the next pages to ship.</p>
        <p><a href="mailto:${escapeAttr(site.email)}?subject=SolCrys%20AI%20visibility%20audit">Request an audit</a></p>
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
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}" />
    <link rel="canonical" href="${escapeAttr(canonical)}" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" href="/solcrys-logo-tab-2.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/solcrys-logo-tab-2.png" />
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

function webPageSchema({ routePath, title, description }) {
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
      url: defaultOgImage
    }
  };
}

function homeHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">${escapeHtml(home.eyebrow)}</p>
      <h1>${escapeHtml(home.title)}</h1>
      <p class="seo-lede">${escapeHtml(home.description)}</p>
      <p>Maintained by ${escapeHtml(site.maintainer || site.name)}. Last updated <time datetime="${escapeAttr(site.updated || generatedAt)}">${escapeHtml(site.updated || generatedAt)}</time>.</p>
      <ul class="seo-grid" aria-label="SolCrys AI proof points">
        ${home.proofPoints.map((point) => `<li class="seo-card">${escapeHtml(point)}</li>`).join("")}
      </ul>
      <img src="${reportPath}" alt="SolCrys AI visibility report showing answer engine mentions, citations, and share of voice" width="1200" height="760" style="width: 100%; height: auto; border-radius: 0.9rem; border: 1px solid hsl(var(--border) / 0.25); margin-top: 2rem;" fetchpriority="high">
    </section>
    <section id="aeo" class="seo-container seo-section">
      <h2>What Answer Engine Optimization means</h2>
      <p><dfn>Answer Engine Optimization (AEO)</dfn> is the practice of making brand facts, proof, and pages easier for AI systems to retrieve, trust, cite, and summarize. SolCrys connects prompt-level measurement with crawlable, evidence-backed content strategy.</p>
    </section>
    <section id="approach" class="seo-container seo-section">
      <h2>Our approach to AI search visibility</h2>
      <p>SolCrys treats every AI answer as evidence. We score whether your brand is mentioned, whether your own pages are cited, how competitors are framed, and which third-party sources shape the answer. Each finding becomes a concrete content action.</p>
    </section>
    <section id="features" class="seo-container seo-section">
      <h2>How SolCrys improves AI discovery</h2>
      <div class="seo-grid">
        ${home.answerBlocks
          .map(
            (block) => `
          <article class="seo-card">
            <h3>${escapeHtml(block.title)}</h3>
            <p>${escapeHtml(block.body)}</p>
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

function aboutHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">About SolCrys AI</p>
      <h1>AI search visibility and Answer Engine Optimization for marketing teams.</h1>
      <p class="seo-lede">SolCrys AI was built by search, growth, data, and product operators to help brands connect AI visibility measurement with evidence-backed content action.</p>
      <p>Maintained by ${escapeHtml(site.maintainer || site.name)}. Last updated <time datetime="${escapeAttr(site.updated || generatedAt)}">${escapeHtml(site.updated || generatedAt)}</time>.</p>
    </section>
    <section class="seo-container seo-section">
      <h2>Our story</h2>
      <p>Our background sits at the intersection of SEO, search intent, product discovery, and data-driven growth. AI-generated answers add a new distribution layer to that work: a brand can perform well in traditional search, yet still be absent, uncited, or misrepresented inside the answer a buyer sees first.</p>
      <p>Marketing teams now need to know which prompts matter, which sources AI systems cite, how competitors are framed, and how to establish topical authority across AI-visible sources.</p>
      <p>SolCrys AI was built to connect AI visibility measurement with practical content action. The platform helps teams monitor mentions, citations, share of voice, sentiment, and answer accuracy, then translate those findings into page updates, publisher and analyst content briefs, FAQ improvements, and user-generated content (UGC) strategies.</p>
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
  </main>
  ${footerHtml()}
</div>`;
}

function resourcesHtml() {
  return `
<div class="seo-prerender">
  ${navHtml()}
  <main>
    <section class="seo-container seo-hero">
      <p class="seo-kicker">AEO Resource Hub</p>
      <h1>Practical guides for AI search visibility.</h1>
      <p class="seo-lede">These guides explain how to measure AI mentions, citations, share of voice, and answer accuracy, then turn weak coverage into concrete content actions.</p>
    </section>
    <section class="seo-container seo-section">
      <div class="seo-grid">
        ${resourcePages
          .map(
            (page) => `
          <article class="seo-card">
            <p class="seo-kicker">${escapeHtml(page.category)}</p>
            <h2><a href="/${escapeAttr(page.slug)}/">${escapeHtml(page.title)}</a></h2>
            <p>${escapeHtml(page.description)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>
  </main>
  ${footerHtml()}
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
      ${page.sections.map(sectionHtml).join("")}
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
    <p class="seo-lede">The page you requested does not exist. Return to SolCrys AI resources or the homepage.</p>
    <p><a href="/">Return home</a></p>
  </main>
  ${footerHtml()}
</div>`;
}

writePage(
  "index.html",
  renderLayout({
    routePath: "/",
    title: "SolCrys AI - AI Search Visibility and AEO Platform",
    description: site.description,
    body: homeHtml(),
    ogImage: home.ogImage,
    lastModified: site.updated,
    schemas: [
      organizationSchema,
      websiteSchema,
      webPageSchema({
        routePath: "/",
        title: "SolCrys AI - AI Search Visibility and AEO Platform",
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
    title: "About SolCrys AI - AI Search and AEO Team",
    description: "Meet the SolCrys AI founding team and learn why the company is building an AEO platform for AI-driven discovery.",
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
        headline: "About SolCrys AI - AI Search and AEO Team",
        name: "About SolCrys AI",
        url: canonicalUrl("/about/"),
        description: "Meet the SolCrys AI founding team and learn why the company is building an AEO platform for AI-driven discovery.",
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
  "resources/index.html",
  renderLayout({
    routePath: "/resources/",
    title: "AEO Resources for AI Search Visibility | SolCrys AI",
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
        name: "SolCrys AI AEO Resource Hub",
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
  "404.html",
  renderLayout({
    routePath: "/404.html",
    title: "Page Not Found | SolCrys AI",
    description: "The requested SolCrys AI page could not be found.",
    body: notFoundHtml(),
    includeApp: false,
    noindex: true
  })
);

// Sitemap: per Google guidance, omit <priority> and <changefreq> (they are ignored)
// and only set <lastmod> from real content updates, never deploy timestamps.
const sitemapUrls = [
  { path: "/", lastmod: site.updated || generatedAt },
  { path: "/about/", lastmod: site.updated || generatedAt },
  { path: "/resources/", lastmod: site.updated || generatedAt },
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

SolCrys AI helps marketing and growth teams monitor answer engine visibility, identify missing citations, and improve the content sources that AI systems use when answering buyer questions.

## Core Pages

- [Home](${site.url}/): Product overview, AI visibility audit, and platform positioning.
- [About](${site.url}/about/): Company story and founding team.
- [AEO Resource Hub](${site.url}/resources/): Curated guides for Answer Engine Optimization and AI search visibility.

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

${page.sections
  .map(
    (section) => `### ${section.heading}

${section.body.join("\n\n")}
${section.bullets ? `\n\n${section.bullets.map((item) => `- ${item}`).join("\n")}` : ""}
${section.table ? `\n\n${section.table.headers.join(" | ")}\n${section.table.headers.map(() => "---").join(" | ")}\n${section.table.rows.map((row) => row.join(" | ")).join("\n")}` : ""}`
  )
  .join("\n\n")}

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

console.log(`Prerendered ${resourcePages.length + 4} static HTML pages, sitemap.xml, llms.txt, and llms-full.txt.`);
