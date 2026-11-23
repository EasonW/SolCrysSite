/**
 * Check search-facing contracts in the actual static output. Crawl from the
 * homepage so a sitemap entry alone cannot hide an orphaned marketing page.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const read = (file) => fs.readFileSync(path.join(dist, file), "utf8");
const { site } = JSON.parse(fs.readFileSync(path.join(root, "src/content/siteContent.json"), "utf8"));
const errors = [];
const sitemap = new JSDOM(read("sitemap.xml"), { contentType: "text/xml" });
const sitemapEntries = [...sitemap.window.document.querySelectorAll("urlset > url")];
const entries = new Map();
for (const entry of sitemapEntries) {
  const url = entry.querySelector("loc")?.textContent;
  if (entries.has(url)) errors.push(`${url} appears more than once in the sitemap`);
  entries.set(url, entry.querySelector("lastmod")?.textContent);
}
sitemap.window.close();

const sitemapUrls = [...entries.keys()];
const indexNowUrls = JSON.parse(read("indexnow-urls.json"));
if (JSON.stringify(indexNowUrls) !== JSON.stringify(sitemapUrls)) {
  errors.push("IndexNow and sitemap URL lists differ");
}
if (!sitemapUrls.includes(`${site.url}/`)) errors.push("The sitemap omits the homepage");

function* htmlFiles(folder, relative = "") {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path.join(folder, entry.name), file);
    else if (file.endsWith(".html")) yield file;
  }
}

const titles = new Map();
const descriptions = new Map();
const linksByUrl = new Map();
function checkUnique(map, value, url, field) {
  const key = value.trim().replace(/\s+/g, " ").toLowerCase();
  if (!key) errors.push(`${url} is missing a ${field}`);
  else if (map.has(key)) errors.push(`${url} and ${map.get(key)} share a ${field}`);
  else map.set(key, url);
}

for (const file of htmlFiles(dist)) {
  const url = `${site.url}/${file.replace(/(^|\/)index\.html$/, "$1")}`;
  const dom = new JSDOM(read(file), { url });
  const { document } = dom.window;
  try {
    const select = (selector) => [...document.querySelectorAll(selector)];
    const canonical = select('head link[rel="canonical"]');
    const noindex = select('head meta[name="robots"], head meta[name="googlebot"]')
      .some((meta) => /\b(?:noindex|none)\b/i.test(meta.content));
    const redirect = Boolean(document.querySelector('head meta[http-equiv="refresh" i]'));
    const inSitemap = entries.has(url);
    if (noindex || redirect) {
      if (inSitemap) errors.push(`${url} is a redirect or noindex page listed in the sitemap`);
      continue;
    }
    if (!inSitemap) errors.push(`${url} is indexable and missing from the sitemap`);
    if (canonical.length !== 1 || canonical[0].getAttribute("href") !== url) {
      errors.push(`${url} must have one self-referencing canonical`);
    }
    if (select("main").length !== 1 || select("main h1").length !== 1 || select("h1").length !== 1) {
      errors.push(`${url} must have one primary heading in its main content`);
    }
    checkUnique(titles, document.title, url, "title");
    checkUnique(descriptions, document.querySelector('meta[name="description"]')?.content ?? "", url, "meta description");

    const sitemapDate = entries.get(url);
    const pageDate = document.querySelector('head meta[name="date"]')?.content;
    if (sitemapDate !== pageDate) errors.push(`${url} has a sitemap date that differs from the page date`);
    if (sitemapDate && (!/^\d{4}-\d{2}-\d{2}$/.test(sitemapDate) ||
      !Number.isFinite(Date.parse(sitemapDate)) ||
      new Date(sitemapDate).toISOString().slice(0, 10) !== sitemapDate)) {
      errors.push(`${url} has an invalid lastmod date`);
    }
    for (const schema of select('script[type="application/ld+json"]')) {
      try {
        JSON.parse(schema.textContent);
      } catch {
        errors.push(`${url} contains invalid JSON-LD`);
      }
    }
    linksByUrl.set(url, select("a[href]").map((anchor) => {
      const href = new URL(anchor.href, url);
      return `${href.origin}${href.pathname}`;
    }).filter((href) => entries.has(href)));
  } finally {
    dom.window.close();
  }
}

const visited = new Set([`${site.url}/`]);
const queue = [...visited];
for (const url of queue) {
  for (const href of linksByUrl.get(url) ?? []) {
    if (visited.has(href)) continue;
    visited.add(href);
    queue.push(href);
  }
}
for (const url of sitemapUrls) {
  if (!linksByUrl.has(url)) errors.push(`${url} does not resolve to an indexable HTML file`);
  else if (!visited.has(url)) errors.push(`${url} is unreachable via links from the homepage`);
}

if (errors.length) {
  console.error(`check-seo: FAIL\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`check-seo: OK — ${entries.size} indexable pages, all reachable from the homepage.`);
}
