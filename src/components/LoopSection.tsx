import { ArrowRight, ArrowUpRight } from "lucide-react";
import LoopDiagram from "./LoopDiagram";
import ScreenshotFrame from "./ScreenshotFrame";

/**
 * The SolCrys Loop — SolCrys's #1 messaging pillar (measure → diagnose →
 * execute → verify), per editorial_standards §2.5.
 *
 * History: the loop used to be a prose-card ApproachSection further down the
 * page. The 2026-05-28 scannability redesign removed that section as
 * "redundant with the LoopDiagram in the hero" and left the LoopDiagram inside
 * the hero. That over-packed the hero, so this section restores the loop as
 * its own breathing-room section directly below the hero. The crawler-facing
 * prerender carries a matching `id="loop"` section; keep the two aligned.
 *
 * 2026-09-09: restyled after the taste review. Left-aligned header, no
 * eyebrow, no gradient tail, no ambient blur glows; the diagram is a real
 * ring instead of a 2×2 card grid ([[LoopDiagram]]).
 *
 * 2026-09-29: headline "See it. Fix it. Prove it." and, under the ring, one
 * real piece of work with its published result (Cornelis case study), so the
 * "Prove it" step has evidence instead of illustrative numbers.
 */
const CORNELIS_ACF_URL = "https://www.cornelis.com/technology/active-compute-fabric";
const LoopSection = () => {
  return (
    <section
      id="loop"
      className="relative scroll-mt-24 py-20 md:py-24 section-fade"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-[60ch]">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight [text-wrap:balance] md:text-4xl">
            See it. Fix it. Prove it.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Each shipped action is tied to the same prompt set, so you can see
            which fixes actually changed the answer.
          </p>
        </div>
        <LoopDiagram />

        <article className="mt-14 grid grid-cols-1 overflow-hidden rounded-xl border border-border/30 bg-card/40 md:grid-cols-12">
          <ScreenshotFrame
            src="/customers/cornelis/shot-1.jpg"
            alt="The Active Compute Fabric category page on cornelis.com"
            label="cornelis.com/technology/active-compute-fabric"
            href={CORNELIS_ACF_URL}
            aspect="aspect-[5/3]"
            className="md:col-span-6"
          />
          <div className="p-6 md:col-span-6 md:self-center md:p-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent-ink))]">
              Cornelis Networks · In practice
            </p>
            <h3 className="font-display mb-3 text-2xl font-semibold tracking-tight">Defining a new category</h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Working with Cornelis's web team, SolCrys made a brand-new category
              answerable, with pages AI engines can read, extract, and quote in
              Cornelis's own words.
            </p>
            <div className="mb-6 flex items-baseline gap-4 border-t border-border/30 pt-5">
              <span className="font-display text-4xl font-bold tracking-tight md:text-5xl">12×</span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                Mention rate on the new category prompt set, in four weeks.
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              <a
                href="/customers/cornelis/"
                className="inline-flex items-center gap-1 text-[hsl(var(--brand-accent-ink))] hover:underline"
              >
                Read the case study <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={CORNELIS_ACF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                View the page <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default LoopSection;
