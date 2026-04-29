import siteContent from "@/content/siteContent.json";
import { ArrowRight } from "lucide-react";

const ResourcesSection = () => {
  return (
    <section id="resources" className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[hsl(40_85%_55%)] tracking-wider uppercase mb-3">
              AEO Resource Hub
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
              Guides built around the questions marketing teams need to measure.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Each resource pairs a direct answer with prompt examples, scoring guidance, and concrete follow-up actions.
            </p>
          </div>
          <a
            href="/resources/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(195_90%_55%)] hover:text-foreground transition-colors"
          >
            View all resources
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {siteContent.resourcePages.slice(0, 6).map((page) => (
            <a
              key={page.slug}
              href={`/${page.slug}/`}
              className="group rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[hsl(195_90%_55%/0.35)] hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{page.category}</p>
              <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-[hsl(195_90%_55%)] transition-colors">
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
