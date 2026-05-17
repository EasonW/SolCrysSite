import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import siteContent from "@/content/siteContent.json";
import { ArrowRight, BookOpen } from "lucide-react";
import { categorySlug } from "@/lib/categorySlug";
import { useHashScroll } from "@/hooks/useHashScroll";

type ResourcePageData = (typeof siteContent.resourcePages)[number];
type ResourceCluster = {
  key: string;
  blurb: string;
  tier?: string;
};
type ResourceTier = {
  key: string;
  label: string;
  blurb?: string;
};

const Resources = () => {
  useHashScroll();
  const clusterDefs = (siteContent.resourceClusters ?? []) as ResourceCluster[];
  const tierDefs = ((siteContent as { resourceTiers?: ResourceTier[] }).resourceTiers ?? []) as ResourceTier[];

  const clusterOrder = clusterDefs.map((c) => c.key);
  const blurbByKey = new Map(clusterDefs.map((c) => [c.key, c.blurb]));
  const tierByCluster = new Map(clusterDefs.map((c) => [c.key, c.tier]));

  const grouped = new Map<string, ResourcePageData[]>();
  for (const page of siteContent.resourcePages) {
    const list = grouped.get(page.category) ?? [];
    list.push(page);
    grouped.set(page.category, list);
  }

  const orderedKeys = [
    ...clusterOrder.filter((k) => grouped.has(k)),
    ...Array.from(grouped.keys()).filter((k) => !clusterOrder.includes(k)),
  ];

  // Bucket clusters by tier, preserving order. Anything without a tier falls
  // into "operate" so we never silently drop content.
  const clustersByTier = new Map<string, string[]>();
  for (const tier of tierDefs) clustersByTier.set(tier.key, []);
  if (!clustersByTier.has("operate")) clustersByTier.set("operate", []);
  for (const key of orderedKeys) {
    const tier = tierByCluster.get(key) ?? "operate";
    if (!clustersByTier.has(tier)) clustersByTier.set(tier, []);
    clustersByTier.get(tier)!.push(key);
  }

  const totalGuides = siteContent.resourcePages.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <section className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase mb-4">
            AEO Resource Hub
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Practical guides for AI search visibility.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-14">
            Each guide pairs a direct answer with prompt examples, scoring guidance, and
            concrete follow-up actions. Browse by topic — start with the manifestos and
            agency playbooks, drop into the operating clusters when you need a
            day-to-day reference, and compare platforms at the bottom.
          </p>

          {tierDefs.map((tier) => {
            const keysInTier = clustersByTier.get(tier.key) ?? [];
            if (keysInTier.length === 0) return null;
            return (
              <div key={tier.key} className="mb-16">
                <div className="mb-10 border-t border-border/30 pt-8">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[hsl(195_90%_55%)] mb-2">
                    {tier.label}
                  </p>
                  {tier.blurb ? (
                    <p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
                      {tier.blurb}
                    </p>
                  ) : null}
                </div>

                {keysInTier.map((key) => {
                  const pages = grouped.get(key) ?? [];
                  if (pages.length === 0) return null;
                  return (
                    <div key={key} id={categorySlug(key)} className="mb-14 scroll-mt-28">
                      <div className="mb-6 max-w-3xl">
                        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                          {key}
                        </h2>
                        {blurbByKey.get(key) ? (
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {blurbByKey.get(key)}
                          </p>
                        ) : null}
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {pages.map((page) => (
                          <a
                            key={page.slug}
                            href={`/${page.slug}/`}
                            className="group rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-7 transition-all duration-300 hover:border-[hsl(195_90%_55%/0.35)] hover:-translate-y-1"
                          >
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                              {page.category}
                            </p>
                            <h3 className="font-display text-2xl font-semibold mb-3 group-hover:text-[hsl(195_90%_55%)] transition-colors">
                              {page.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-5">
                              {page.description}
                            </p>
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(195_90%_55%)]">
                              Read guide
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <a
            href="#start-here-top"
            className="group block rounded-2xl border border-[hsl(195_90%_55%/0.35)] bg-[hsl(195_90%_55%/0.06)] hover:bg-[hsl(195_90%_55%/0.12)] transition-colors px-6 md:px-10 py-7 md:py-9 mt-4"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex-none rounded-full bg-[hsl(195_90%_55%/0.18)] p-3">
                  <BookOpen className="h-6 w-6 text-[hsl(195_90%_55%)]" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[hsl(195_90%_55%)] mb-1">
                    All resources
                  </p>
                  <p className="text-xl md:text-2xl font-semibold text-foreground">
                    Browse all {totalGuides} guides
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Strategy essays, operating playbooks, engine-specific guides, and
                    platform comparisons — every published SolCrys guide in one place.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-[hsl(195_90%_55%)] group-hover:translate-x-1 transition-transform">
                Back to top
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </span>
            </div>
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
