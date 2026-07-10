import homeContent from "@/content/homeContent.json";
import { ExternalLink } from "lucide-react";

const SourceNotesSection = () => {
  return (
    <section id="source-notes" className="relative py-20 section-fade">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-xl border border-border/30 bg-card/30 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.6fr] md:items-start">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
                Source Notes
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                AEO recommendations should be tied to crawlability, source access, and visible content.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                These references guide how SolCrys evaluates AI search visibility, crawler access, and answer
                readiness.
              </p>
            </div>
            <div className="grid gap-4">
              {homeContent.home.sourceNotes.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border/30 bg-background/40 p-4 transition-colors hover:border-[hsl(var(--brand-accent)/0.35)]"
                >
                  <span className="inline-flex items-center gap-2 font-medium group-hover:text-[hsl(var(--brand-accent))]">
                    {source.label}
                    <ExternalLink className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{source.description}</p>
                </a>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Maintained by {homeContent.site.maintainer}. Last updated{" "}
            <time dateTime={homeContent.site.updated}>{homeContent.site.updated}</time>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SourceNotesSection;
