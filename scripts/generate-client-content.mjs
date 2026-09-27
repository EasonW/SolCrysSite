import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(rootDir, "src/content");
const readContent = (name) => JSON.parse(fs.readFileSync(path.join(contentDir, name), "utf8"));
const writeContent = (name, data) =>
  fs.writeFileSync(path.join(contentDir, name), `${JSON.stringify(data, null, 2)}\n`);

const featuredSlugs = new Set([
  "aeo-vs-seo",
  "visibility-measurement-methodology",
  "ai-visibility-platform-buyers-guide",
]);

const content = readContent("siteContent.json");
writeContent("homeContent.json", {
  site: content.site,
  home: content.home,
  featuredResourcePages: content.resourcePages.filter((page) => featuredSlugs.has(page.slug)),
});

// ---------------------------------------------------------------------------
// searchPages.json — every ⌘K search entry that isn't a resource page or a
// user guide (those are indexed straight from siteContent.json and
// userGuides.json in src/lib/searchIndex.ts).
//
// Pre-flattened here so the search chunk doesn't pull in the full newsroom,
// course, and Prompt Pulse datasets (Prompt Pulse alone is ~700 KB of prompt
// rows). `slug` is the route path without slashes; check-links.mjs fails the
// build if any of them doesn't resolve to a built page.
// ---------------------------------------------------------------------------

const pricing = readContent("pricing.json");
const newsroom = readContent("newsroom.json");
const courseContent = readContent("courseContent.json");
const promptPulse = readContent("promptPulse.json");

const stripMarkdown = (text) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");

// Same 2,000-char cap the resource pages get, so no single entry dominates.
const toBody = (parts) => stripMarkdown(parts.filter(Boolean).join(" ")).slice(0, 2000);

const entry = ({ slug, title, description, category, keywords = "", summary = "", body = "", boost = 1 }) => ({
  slug,
  title,
  description,
  category,
  keywords,
  summary,
  body,
  boost,
});

// Hand-maintained: the site's standalone routes (see src/App.tsx). Home is
// left out on purpose; the logo already goes there. These are navigational
// destinations, so they get a document boost: "pricing" should open our
// pricing page, not an article that compares AEO vendors' pricing.
const NAV_BOOST = 2;
const staticPages = [
  entry({
    slug: "pricing",
    title: "Pricing",
    description: "Plans and prices for brands and agencies.",
    category: "Pricing",
    keywords: "pricing plans plan price prices cost billing subscription tiers upgrade free pro enterprise agency custom",
    body: toBody([
      pricing.hero?.title,
      pricing.hero?.subtitle,
      ...(pricing.faqs ?? []).map((faq) => faq.question),
    ]),
  }),
  entry({
    slug: "guides",
    title: "SolCrys User Guides",
    description: "Workspace setup, dashboards and tools, chapter by chapter or as free PDFs.",
    category: "User Guides",
    keywords: "user guide guides documentation docs manual help how-to setup onboarding PDF",
  }),
  entry({
    slug: "free-chatgpt-visibility-tracker",
    title: "Free ChatGPT Visibility Tracker",
    description: "See whether ChatGPT mentions, cites, or skips your brand on the prompts your buyers ask.",
    category: "Free Tools",
    keywords: "free tool tracker ChatGPT visibility brand mentions check",
  }),
  entry({
    slug: "free-aeo-audit",
    title: "Free AEO Audit",
    description: "Score any page across AI-search checks and get the exact fix to ship.",
    category: "Free Tools",
    keywords: "free tool audit content audit page score schema checker",
  }),
  entry({
    slug: "about",
    title: "About SolCrys",
    description: "The team building SolCrys, and why.",
    category: "Company",
    keywords: "about company team founders who we are",
  }),
  entry({
    slug: "customers",
    title: "Customer Stories",
    description: "How brands use SolCrys to show up accurately in AI answers.",
    category: "Customer Stories",
    keywords: "customers case study case studies results logos",
  }),
  entry({
    slug: "customers/nextsilicon",
    title: "NextSilicon Case Study",
    description: "How NextSilicon lifted its AI mention rate from 1.9% to 7.4% in 45 days.",
    category: "Customer Stories",
    keywords: "case study customer HPC high-performance computing mention rate",
  }),
  entry({
    slug: "customers/cornelis",
    title: "Cornelis Case Study",
    description: "How Cornelis made a new networking category answerable in AI search in four weeks.",
    category: "Customer Stories",
    keywords: "case study customer networking category launch AI Infra Summit",
  }),
  entry({
    slug: "resources",
    title: "AEO Resources",
    description: "Every SolCrys guide on answer engine optimization, by topic.",
    category: "Resources",
    keywords: "resources library articles guides blog AEO",
  }),
  entry({
    slug: "compare",
    title: "Compare SolCrys",
    description: "SolCrys side by side with other AEO platforms.",
    category: "Competitor Comparisons",
    keywords: "compare comparison vs versus alternative alternatives competitors",
  }),
  entry({
    slug: "prompt-pulse",
    title: "Prompt Pulse",
    description: "What buyers ask AI in each industry, by demand tier and trend. Free.",
    category: "Prompt Pulse",
    keywords: "prompt pulse prompts questions demand trends industries free data",
  }),
  entry({
    slug: "news",
    title: "Newsroom",
    description: "Press releases, founder notes, and announcements from SolCrys.",
    category: "Newsroom",
    keywords: "news newsroom press releases announcements founder notes blog",
  }),
  entry({
    slug: "learn",
    title: "Free AEO Courses",
    description: "Open, self-paced courses on answer engine optimization. No login to read.",
    category: "Courses",
    keywords: "learn course courses training lessons free education",
  }),
];

const newsBlockText = (block) => {
  if (block.text) return block.text;
  if (block.items) return block.items.join(" ");
  return "";
};

const newsPages = newsroom.posts
  .filter((post) => post.status !== "draft")
  .map((post) =>
    entry({
      slug: `news/${post.slug}`,
      title: post.title,
      description: post.description,
      category: "Newsroom",
      keywords: [newsroom.kindLabels[post.kind], post.tag, post.author?.name].filter(Boolean).join(" "),
      body: toBody(post.body.map(newsBlockText)),
    }),
  );

const sectionText = (section) => [section.heading, ...(section.body ?? []), ...(section.bullets ?? [])];

const coursePages = courseContent.courses.flatMap((course) => [
  entry({
    slug: `learn/${course.slug}`,
    title: course.title,
    description: course.description,
    category: "Courses",
    keywords: `course free ${course.tagline ?? ""}`,
    summary: course.summary ?? "",
    body: toBody(course.modules.map((module) => `${module.title} ${module.blurb ?? ""}`)),
    // A course overview is a destination in its own right, like the hubs.
    boost: NAV_BOOST,
  }),
  ...course.modules.flatMap((module) =>
    module.lessons.map((lesson) =>
      entry({
        slug: `learn/${course.slug}/${module.slug}/${lesson.slug}`,
        title: lesson.title,
        description: lesson.summary,
        category: `${course.title} course`,
        keywords: `lesson ${module.title}`,
        body: toBody((lesson.sections ?? []).flatMap(sectionText)),
      }),
    ),
  ),
]);

const promptPulsePages = promptPulse.verticals.map((vertical) =>
  entry({
    slug: `prompt-pulse/${vertical.slug}`,
    title: `Prompt Pulse: ${vertical.short}`,
    description: `What ${vertical.short} buyers ask AI, by demand tier and trend.`,
    category: "Prompt Pulse",
    keywords: `${vertical.label} ${(vertical.categories?.topics ?? []).join(" ")}`,
    summary: vertical.blurb ?? "",
    body: toBody((vertical.prompts ?? []).map((prompt) => prompt.prompt)),
  }),
);

writeContent("searchPages.json", {
  pages: [
    ...staticPages.map((page) => ({ ...page, boost: NAV_BOOST })),
    ...newsPages,
    ...coursePages,
    ...promptPulsePages,
  ],
});
