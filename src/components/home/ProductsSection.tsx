import { ArrowRight, Clapperboard, LayoutTemplate, Radar, Shield } from "lucide-react";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";

/**
 * PREVIEW — the three product lines under one master brand. AEO leads because
 * it is the free entry point; Sites and Motion are quoted.
 */
const PRODUCTS = [
  {
    name: "SolCrys AEO",
    promise: "Know how AI reads you.",
    body: "See how ChatGPT, Gemini, Google AI, Perplexity and Claude describe and cite your brand, find the gaps against your approved facts, and track every fix.",
    meta: "Monthly subscription · free to start",
    Icon: Radar,
    cta: "free" as const,
  },
  {
    name: "SolCrys Sites",
    promise: "Pages AI and buyers both read right.",
    body: "Homepages, category and product pages with AI-ready copy and design, built from your approved facts. Hosted on our subdomain or your own domain.",
    meta: "Per project · hosting optional",
    Icon: LayoutTemplate,
    cta: "quote" as const,
  },
  {
    name: "SolCrys Motion",
    promise: "Explain the hard part in two minutes.",
    body: "Booth animation and interactive demos that make deep technical products clear, on the same facts as your pages and AI answers.",
    meta: "Quoted per piece",
    Icon: Clapperboard,
    cta: "quote" as const,
  },
];

const ProductsSection = () => {
  return (
    <section id="products" className="relative scroll-mt-24 py-20 md:py-24 section-fade">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-[60ch] mb-12">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight [text-wrap:balance] md:text-4xl">
            One story, told everywhere your buyers look.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Buyers ask ChatGPT, read your website and stop by your booth. Every
            SolCrys product starts from the same approved facts, so each stop
            tells the same story.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PRODUCTS.map(({ name, promise, body, meta, Icon, cta }) => (
            <article
              key={name}
              className="flex flex-col rounded-xl border border-border/30 bg-card/40 p-7 backdrop-blur-sm transition-colors hover:border-border/60"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent)/0.12)]">
                <Icon className="h-5 w-5 text-[hsl(var(--brand-accent))]" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent-ink))] mb-2">
                {name}
              </p>
              <h3 className="font-display text-xl font-semibold mb-3 tracking-tight">{promise}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base mb-6">{body}</p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/20 pt-4">
                <span className="text-xs text-muted-foreground">{meta}</span>
                {cta === "free" ? (
                  <a
                    href={AUDIT_URL}
                    onClick={() => trackAuditClick("home_products")}
                    className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-[hsl(var(--brand-accent-ink))] hover:underline"
                  >
                    Start Free <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <EarlyAccessDialog mode="project" surface="home_products">
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-[hsl(var(--brand-accent-ink))] hover:underline"
                    >
                      Request a quote <ArrowRight className="h-4 w-4" />
                    </button>
                  </EarlyAccessDialog>
                )}
              </div>
            </article>
          ))}
        </div>

        <a
          href="/corporate-context-ai-marketing/"
          className="mt-6 flex items-start gap-4 rounded-xl border border-border/30 bg-card/30 p-5 transition-colors hover:border-border/60 md:items-center"
        >
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--brand-accent))] md:mt-0" />
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            <span className="font-semibold text-foreground">Built on one Corporate Context.</span>{" "}
            Your approved facts, claims and proof, kept current, so nothing we
            make drifts from what is true.
          </p>
          <ArrowRight className="ml-auto hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
        </a>
      </div>
    </section>
  );
};

export default ProductsSection;
