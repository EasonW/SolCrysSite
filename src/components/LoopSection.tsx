import LoopDiagram from "./LoopDiagram";

/**
 * The SolCrys Loop — SolCrys's #1 messaging pillar (measure → diagnose →
 * execute → verify), per editorial_standards §2.5.
 *
 * History: the loop used to be a prose-card ApproachSection further down the
 * page. The 2026-05-28 scannability redesign removed that section as
 * "redundant with the LoopDiagram in the hero" and left the LoopDiagram inside
 * the hero. That over-packed the hero (pitch + form + 4-step diagram in one
 * viewport) and left the `#loop` anchor dangling. This section restores the
 * loop as its own breathing-room section directly below the hero, using the
 * LoopDiagram visual plus the named-pillar framing humans had lost. The
 * crawler-facing prerender already carries an `id="loop"` section; this keeps
 * the SPA aligned with it.
 */
const LoopSection = () => {
  return (
    <section
      id="loop"
      className="relative scroll-mt-24 py-24 md:py-32 section-fade overflow-hidden"
    >
      {/* Ambient glows — mirror the section treatment used elsewhere on the page */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[hsl(40_85%_55%/0.04)] blur-[140px]" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-[hsl(195_90%_55%/0.03)] blur-[100px]" />

      <div className="container mx-auto px-6 max-w-4xl relative text-center">
        <p className="text-sm font-medium text-[hsl(40_85%_55%)] tracking-wider uppercase mb-3">
          The SolCrys Loop
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Measure, diagnose, execute,{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">
            then verify the lift.
          </span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          SolCrys closes the loop on AI search visibility — each shipped action is tied
          to the same prompt set, so you can see which fixes actually changed the answer.
        </p>
        <LoopDiagram />
      </div>
    </section>
  );
};

export default LoopSection;
