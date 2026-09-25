import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";

/** PREVIEW — closing CTA: free read first, project inquiry second. */
const HomeClosingCTA = () => {
  return (
    <section className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="container mx-auto px-6 max-w-3xl text-center relative">
        <div className="relative rounded-2xl p-12 md:p-16 border border-[hsl(var(--brand-accent)/0.2)] bg-card/40 backdrop-blur-sm overflow-hidden">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent))]">
            Free · No credit card
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            See how AI reads your brand today.
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Start with a free AI visibility read. When you are ready to fix what
            it finds, we build the pages and demos that tell your story right.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild variant="hero" size="lg" className="text-base px-8 py-6">
              <a href={AUDIT_URL} onClick={() => trackAuditClick("cta_section")}>
                Start Free
                <ArrowRight className="ml-1" />
              </a>
            </Button>
            <EarlyAccessDialog mode="project" surface="cta_section">
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6">
                Start a project
              </Button>
            </EarlyAccessDialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeClosingCTA;
