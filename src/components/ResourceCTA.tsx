import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { resolveResourceCta } from "@/lib/resource-cta";
import { ArrowRight } from "lucide-react";

/**
 * Resource-page CTAs — the human-facing render of /<slug>/ had none.
 *
 * The prerendered HTML carried a generic end card, but src/main.tsx mounts
 * with createRoot, which replaces the whole #root — so after hydration the
 * only product action left on a resource page was the navbar button.
 * Resource pages are the bulk of organic entries, so this file adds:
 *
 *   - <ResourceInlineCTA>  a one-line hook after the second section
 *   - <ResourceEndCTA>     a card after FAQ, before "Related guides"
 *
 * Copy lives in src/content/resourceCta.json and is shared with
 * scripts/prerender.mjs (resourceCtaHtml) so both renders say the same
 * thing. Both links go to the in-app free workspace (AUDIT_URL) and fire
 * request_audit_open with their own surface.
 *
 * Pages with `cta: "project"` (SolCrys Sites, SolCrys Motion) open the
 * project inquiry instead; the crawler HTML links to contact-sales.
 */

type ResourceCtaProps = { category?: string; cta?: string };

export const ResourceInlineCTA = ({ category, cta }: ResourceCtaProps) => {
  const copy = resolveResourceCta(category, cta);
  const isProject = cta === "project";
  const linkClass =
    "inline-flex items-center gap-1 font-medium text-[hsl(var(--action))] underline-offset-4 hover:underline";
  return (
    <aside
      aria-label={isProject ? copy.kicker : "Free ChatGPT visibility check"}
      className="my-8 rounded-lg border-l-2 border-[hsl(var(--action))] bg-card/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground"
    >
      {copy.inline}{" "}
      {isProject ? (
        <EarlyAccessDialog mode="project" surface="resource_inline">
          <button type="button" className={linkClass}>
            {copy.inlineLink}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </EarlyAccessDialog>
      ) : (
        <a href={AUDIT_URL} onClick={() => trackAuditClick("resource_inline")} className={linkClass}>
          {copy.inlineLink}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </aside>
  );
};

export const ResourceEndCTA = ({ category, cta }: ResourceCtaProps) => {
  const copy = resolveResourceCta(category, cta);
  const isProject = cta === "project";
  return (
    <section aria-labelledby="resource-cta-heading" className="border-t border-border/30 py-10">
      <div className="rounded-2xl border border-[hsl(var(--brand-accent)/0.25)] bg-[hsl(var(--brand-accent)/0.05)] p-8 md:p-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--action))]">
          {copy.kicker}
        </p>
        <h2
          id="resource-cta-heading"
          className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4"
        >
          {copy.heading}
        </h2>
        <p className="mx-auto mb-7 max-w-2xl leading-relaxed text-muted-foreground">{copy.body}</p>
        {isProject ? (
          <EarlyAccessDialog mode="project" surface="resource_end">
            <Button variant="hero" size="lg">
              Start a project
              <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
            </Button>
          </EarlyAccessDialog>
        ) : (
          <Button asChild variant="hero" size="lg">
            <a href={AUDIT_URL} onClick={() => trackAuditClick("resource_end")}>
              Start Free
              <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
            </a>
          </Button>
        )}
        <p className="mt-4 text-sm text-muted-foreground/85">{copy.footnote}</p>
      </div>
    </section>
  );
};
