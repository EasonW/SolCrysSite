import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";

type HomeClosingCTAProps = {
  /** null hides the eyebrow. */
  eyebrow?: string | null;
  title?: string;
  body?: string;
  /** "project" makes Start a project the solid button and puts it first. */
  primary?: "free" | "project";
};

/** PREVIEW — closing CTA: free read first, project inquiry second (default). */
const HomeClosingCTA = ({
  eyebrow = "Free · No credit card",
  title = "See how AI reads your brand today.",
  body = "Start with a free AI visibility read. When you are ready to fix what it finds, we build the pages and demos that tell your story right.",
  primary = "free",
}: HomeClosingCTAProps = {}) => {
  const freeButton = (
    <Button key="free" asChild variant={primary === "free" ? "hero" : "hero-outline"} size="lg" className="text-base px-8 py-6">
      <a href={AUDIT_URL} onClick={() => trackAuditClick("cta_section")}>
        Start Free
        {primary === "free" ? <ArrowRight className="ml-1" /> : null}
      </a>
    </Button>
  );
  const projectButton = (
    <EarlyAccessDialog key="project" mode="project" surface="cta_section">
      <Button variant={primary === "project" ? "hero" : "hero-outline"} size="lg" className="text-base px-8 py-6">
        Start a project
        {primary === "project" ? <ArrowRight className="ml-1" /> : null}
      </Button>
    </EarlyAccessDialog>
  );
  return (
    <section className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="container mx-auto px-6 max-w-3xl text-center relative">
        <div className="relative rounded-2xl p-12 md:p-16 border border-[hsl(var(--brand-accent)/0.2)] bg-card/40 backdrop-blur-sm overflow-hidden">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent))]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">{body}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primary === "project" ? [projectButton, freeButton] : [freeButton, projectButton]}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeClosingCTA;
