import { ArrowUpRight } from "lucide-react";
import work from "@/content/work.json";

/**
 * PREVIEW — selected work, read from src/content/work.json so /work/, /sites/
 * and /motion/ can share one list. Adding a project = adding one entry.
 */
const SelectedWorkSection = () => {
  return (
    <section id="work" className="relative scroll-mt-24 py-20 md:py-24 section-fade">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-[60ch] mb-12">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight [text-wrap:balance] md:text-4xl">
            Selected work.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Real pieces, live today. We add each project here once the client
            approves it.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {work.items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-xl border border-border/30 bg-card/40 transition-colors hover:border-border/60"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-[hsl(var(--brand-accent)/0.12)] px-2.5 py-0.5 font-semibold text-[hsl(var(--brand-accent-ink))]">
                    {item.line}
                  </span>
                  <span className="text-muted-foreground">{item.client}</span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 flex items-start justify-between gap-2">
                  {item.title}
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                {"quote" in item && item.quote ? (
                  <blockquote className="mt-5 border-l-2 border-[hsl(var(--brand-accent))] pl-4 text-sm leading-relaxed text-foreground/90">
                    “{item.quote}”
                    <footer className="mt-2 text-xs text-muted-foreground">{item.quoteBy}</footer>
                  </blockquote>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWorkSection;
