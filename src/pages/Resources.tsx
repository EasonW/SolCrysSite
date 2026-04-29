import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import siteContent from "@/content/siteContent.json";
import { ArrowRight } from "lucide-react";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <section className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase mb-4">
            AEO Resource Hub
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Research pages for AI search visibility.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
            These pages are structured for buyers, search crawlers, and AI answer engines: direct answer first, supporting evidence next, and clear follow-up questions throughout.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {siteContent.resourcePages.map((page) => (
              <a
                key={page.slug}
                href={`/${page.slug}/`}
                className="group rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-7 transition-all duration-300 hover:border-[hsl(195_90%_55%/0.35)] hover:-translate-y-1"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{page.category}</p>
                <h2 className="font-display text-2xl font-semibold mb-3 group-hover:text-[hsl(195_90%_55%)] transition-colors">
                  {page.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">{page.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(195_90%_55%)]">
                  Read guide
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

export default Resources;
