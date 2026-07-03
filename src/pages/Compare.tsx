import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import siteContent from "@/content/siteContent.json";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

// Hub for the Competitor Comparisons cluster. The individual comparison
// pages live at /compare/<slug>/ (nested resourcePage slugs); this page
// gives them a crawlable parent so /compare/* URLs are not orphaned
// directory paths. Mirrored for crawlers in scripts/prerender.mjs
// (compareHubHtml) — keep the two in sync.
const COMPARE_TITLE = "Compare SolCrys vs. AEO & AI visibility platforms | SolCrys";
const COMPARE_DESCRIPTION =
  "Side-by-side comparisons of SolCrys against Profound, Peec AI, Otterly, AirOps, HubSpot AEO, Semrush, and Ahrefs Brand Radar — scope, pricing model, and where each tool fits.";

const Compare = () => {
  useEffect(() => {
    document.title = COMPARE_TITLE;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = COMPARE_DESCRIPTION;
  }, []);

  const pages = siteContent.resourcePages.filter(
    (page) =>
      page.category === "Competitor Comparisons" &&
      (page as { status?: string }).status !== "draft"
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <section className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-4">
            Competitor Comparisons
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            How SolCrys compares.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
            Honest, criteria-based comparisons against the AEO and AI visibility platforms
            buyers evaluate most often. Each page covers measurement scope, execution depth,
            pricing model, and the cases where the other tool is the better fit.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {pages.map((page) => (
              <a
                key={page.slug}
                href={`/${page.slug}/`}
                className="group rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-7 transition-all duration-300 hover:border-[hsl(var(--brand-accent)/0.35)] hover:-translate-y-1"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  {page.category}
                </p>
                <h3 className="font-display text-2xl font-semibold mb-3 group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                  {page.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{page.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-accent))]">
                  Read comparison
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Compare;
