import { describe, expect, it } from "vitest";

import searchPages from "@/content/searchPages.json";
import { searchResources } from "./searchIndex";

const boostedSlugs = searchPages.pages.filter((page) => page.boost > 1).map((page) => page.slug);

describe("searchResources", () => {
  // Navigational queries should land on the page itself, not on a resource
  // article that happens to mention the word.
  it.each([
    ["pricing", "pricing"],
    ["price", "pricing"],
    ["user guide", "guides"],
    ["customer stories", "customers"],
    ["case study nextsilicon", "customers/nextsilicon"],
    ["newsroom", "news"],
    ["free aeo audit", "free-aeo-audit"],
    ["chatgpt visibility tracker", "free-chatgpt-visibility-tracker"],
    ["team", "about"],
    ["aeo operator", "learn/aeo-operator"],
    ["prompt pulse cybersecurity", "prompt-pulse/cybersecurity"],
  ])("%s → /%s/", (query, slug) => {
    expect(searchResources(query)[0]?.slug).toBe(slug);
  });

  // The navigational boost must not let hub pages crowd out articles on
  // topical queries.
  it.each(["prompt set", "answer accuracy", "share of voice"])(
    "%s → a resource article first",
    (query) => {
      const top = searchResources(query)[0]?.slug;
      expect(top).toBeDefined();
      expect(boostedSlugs).not.toContain(top);
    },
  );
});
