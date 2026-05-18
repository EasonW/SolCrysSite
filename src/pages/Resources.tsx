import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import siteContent from "@/content/siteContent.json";
import { ArrowRight } from "lucide-react";
import { categorySlug } from "@/lib/categorySlug";
import { useHashScroll } from "@/hooks/useHashScroll";

type ResourcePageData = (typeof siteContent.resourcePages)[number];

const Resources = () => {
  useHashScroll();
  const clusterDefs = siteContent.resourceClusters ?? [];
  const clusterOrder = clusterDefs.map((c) => c.key);
  const blurbByKey = new Map(clusterDefs.map((c) => [c.key, c.blurb]));

  // Group resources by cluster, preserving JSON ordering inside each group.
  // A page lives primarily in `category` and may additionally surface in clusters
  // declared via `alsoListIn` (dual-listing for cross-cluster articles like
  // Golden Prompt Set Methodology — primarily SolCrys methodology, also relevant
  // to Prompt Intelligence readers).
  // Drafts are filtered out — they are accessible by direct URL but not listed here.
  const grouped = new Map<string, ResourcePageData[]>();
  for (const page of siteContent.resourcePages) {
    if ((page as { status?: string }).status === "draft") continue;
    const primaryList = grouped.get(page.category) ?? [];
    primaryList.push(page);
    grouped.set(page.category, primaryList);
    const alsoListIn = (page as { alsoListIn?: string[] }).alsoListIn ?? [];
    for (const secondaryCluster of alsoListIn) {
      const secondaryList = grouped.get(secondaryCluster) ?? [];
      secondaryList.push(page);
      grouped.set(secondaryCluster, secondaryList);
    }
  }

  // Order: declared clusters first (in declared order), then any extras observed in data.
  const orderedKeys = [
    ...clusterOrder.filter((k) => grouped.has(k)),
    ...Array.from(grouped.keys()).filter((k) => !clusterOrder.includes(k)),
  ];

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
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
            Each guide pairs a direct answer with prompt examples, scoring guidance, and
            concrete follow-up actions. Browse by topic below.
          </p>

          {orderedKeys.map((key) => {
            const pages = grouped.get(key) ?? [];
            if (pages.length === 0) return null;
            return (
              <div key={key} id={categorySlug(key)} className="mb-16 scroll-mt-28">
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
