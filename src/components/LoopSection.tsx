import LoopDiagram from "./LoopDiagram";

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
 */
const LoopSection = () => {
  return (
    <section
      id="loop"
      className="relative scroll-mt-24 py-20 md:py-24 section-fade"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-[60ch]">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight [text-wrap:balance] md:text-4xl">
            Measure, diagnose, execute, then verify the lift.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Each shipped action is tied to the same prompt set, so you can see
            which fixes actually changed the answer.
          </p>
        </div>
        <LoopDiagram />
      </div>
    </section>
  );
};

export default LoopSection;
