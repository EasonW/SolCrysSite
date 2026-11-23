import MiniSearch from "minisearch";
import resourceSearch from "@/content/generated-resources/search.json";
import userGuides from "@/content/userGuides.json";
import searchPages from "@/content/searchPages.json";

// Client-side site search: resource pages, user guides, and every other
// published page (pricing, hubs, customer stories, news, courses, Prompt
// Pulse). The non-resource entries are pre-flattened into searchPages.json by
// scripts/generate-client-content.mjs.
//
// This module is dynamically imported with SearchCommand, so the full corpus
// and MiniSearch stay out of the initial route bundle. The index itself is
// still built lazily on first query and cached for the rest of the session.
//
// Drafts (status === "draft") are excluded to mirror the /resources hub,
// sitemap, and llms files — they stay reachable by direct URL only.

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const documents = resourceSearch.map(({ boost: _boost, ...page }) => ({ id: page.slug, ...page }));

documents.push(...userGuides.guides.map((guide) => ({
  id: `guides/${guide.slug}`,
  slug: `guides/${guide.slug}`,
  title: guide.title,
  description: guide.description,
  category: "User Guides",
  keywords: `${guide.category} documentation PDF manual ${guide.highlights.join(" ")}`,
  summary: guide.beforeYouStart,
  body: guide.chapters.map((chapter) => `${chapter.title} ${chapter.summary}`).join(" "),
})));

documents.push(
  ...searchPages.pages.map(({ boost: _boost, ...page }) => ({ id: page.slug, ...page })),
);

// Per-page ranking multipliers set in generate-client-content.mjs (the site's
// navigational pages get > 1). Everything else scores at 1.
const documentBoost = new Map(searchPages.pages.map((page) => [page.slug, page.boost]));

export const DOCUMENT_COUNT = documents.length;

let index: MiniSearch | null = null;

const getIndex = (): MiniSearch => {
  if (!index) {
    index = new MiniSearch({
      fields: ["title", "keywords", "description", "summary", "category", "body"],
      storeFields: ["slug", "title", "description", "category"],
      searchOptions: {
        boost: { title: 4, keywords: 3, description: 2, summary: 2, category: 2, body: 1 },
        boostDocument: (id: string) => documentBoost.get(id) ?? 1,
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
