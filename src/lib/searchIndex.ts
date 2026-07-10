import MiniSearch from "minisearch";
import siteContent from "@/content/siteContent.json";

// Client-side resource search.
//
// This module is dynamically imported with SearchCommand, so the full corpus
// and MiniSearch stay out of the initial route bundle. The index itself is
// still built lazily on first query and cached for the rest of the session.
//
// Drafts (status === "draft") are excluded to mirror the /resources hub,
// sitemap, and llms files — they stay reachable by direct URL only.

interface RawSubsection {
  heading?: string;
  body?: string[];
  bullets?: string[];
}

interface RawSection {
  heading?: string;
  body?: string[];
  bullets?: string[];
  subsections?: RawSubsection[];
}

interface RawPage {
  slug: string;
  title?: string;
  description?: string;
  summary?: string;
  category?: string;
  status?: string;
  primaryKeyword?: string;
  aeoTargets?: string[];
  sections?: RawSection[];
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const pages = siteContent.resourcePages as unknown as RawPage[];

// Inline markdown the body strings carry: `[label](url)` and `**bold**`.
// Strip the syntax so URLs and asterisks don't pollute the token stream.
const stripMarkdown = (text: string): string =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");

// Flatten a page's section/subsection prose into one searchable blob, capped
// so a single long guide can't dominate the index or slow tokenization.
const buildBody = (page: RawPage): string => {
  const parts: string[] = [];
  for (const section of page.sections ?? []) {
    if (section.heading) parts.push(section.heading);
    if (section.body) parts.push(...section.body);
    if (section.bullets) parts.push(...section.bullets);
    for (const sub of section.subsections ?? []) {
      if (sub.heading) parts.push(sub.heading);
      if (sub.body) parts.push(...sub.body);
      if (sub.bullets) parts.push(...sub.bullets);
    }
  }
  return stripMarkdown(parts.join(" ")).slice(0, 2000);
};

const documents = pages
  .filter((page) => page.status !== "draft")
  .map((page) => ({
    id: page.slug,
    slug: page.slug,
    title: page.title ?? "",
    description: page.description ?? "",
    category: page.category ?? "",
    // Buyer questions + target keyword carry strong intent signal — index
    // them as a high-boost field separate from the descriptive prose.
    keywords: [page.primaryKeyword, ...(page.aeoTargets ?? [])]
      .filter(Boolean)
      .join(" "),
    summary: page.summary ?? "",
    body: buildBody(page),
  }));

export const RESOURCE_COUNT = documents.length;

let index: MiniSearch | null = null;

const getIndex = (): MiniSearch => {
  if (!index) {
    index = new MiniSearch({
      fields: ["title", "keywords", "description", "summary", "category", "body"],
      storeFields: ["slug", "title", "description", "category"],
      searchOptions: {
        boost: { title: 4, keywords: 3, description: 2, summary: 2, category: 2, body: 1 },
        fuzzy: 0.2,
        prefix: true,
        // AND so multi-word queries narrow rather than widen — better
        // precision for a small, high-signal corpus.
        combineWith: "AND",
      },
    });
    index.addAll(documents);
  }
  return index;
};

export const searchResources = (query: string, limit = 12): SearchResult[] => {
  const q = query.trim();
  if (!q) return [];
  return getIndex()
    .search(q)
    .slice(0, limit)
    .map((r) => ({
      slug: r.slug as string,
      title: r.title as string,
      description: r.description as string,
      category: r.category as string,
    }));
};
