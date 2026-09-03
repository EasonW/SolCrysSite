import resourceCta from "@/content/resourceCta.json";

/**
 * Resource-page CTA copy, keyed by siteContent.resourcePages[].category.
 * The JSON is shared with scripts/prerender.mjs so the crawler HTML and the
 * hydrated SPA say the same thing. Lives outside the component file so the
 * component module only exports components (react-refresh rule).
 */
export type ResourceCtaCopy = {
  kicker: string;
  heading: string;
  body: string;
  inline: string;
  inlineLink: string;
  footnote: string;
};

export function resolveResourceCta(category?: string): ResourceCtaCopy {
  const byCategory = resourceCta.byCategory as Record<string, Partial<ResourceCtaCopy>>;
  const override = category ? byCategory[category] ?? {} : {};
  return { ...resourceCta.default, ...override };
}
