import homeContent from "@/content/homeContent.json";
import { ArrowRight } from "lucide-react";

// Explicit curation — three pages spanning TOFU (AEO 101) → MOFU
// (methodology / how we measure) → BOFU (buyer's guide).
// Order is deliberate; do not switch to slice() — array order is not
// a conversion strategy.
const HOMEPAGE_RESOURCE_SLUGS = [
  "aeo-vs-seo",
  "visibility-measurement-methodology",
  "ai-visibility-platform-buyers-guide",
];

const ResourcesSection = () => {
  const featured = HOMEPAGE_RESOURCE_SLUGS
    .map((slug) => homeContent.featuredResourcePages.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section id="resources" className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
              AEO Resource Hub
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Guides built around the questions marketing teams need to measure.
            </h2>
          </div>
          <a
            href="/resources/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-accent))] hover:text-foreground transition-colors"
          >
            View all resources
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((page) => (
            <a
              key={page.slug}
              href={`/${page.slug}/`}
              className="group rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[hsl(var(--brand-accent)/0.35)] hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{page.category}</p>
              <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                {page.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{page.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
