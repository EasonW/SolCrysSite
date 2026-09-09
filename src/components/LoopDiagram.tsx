/**
 * The SolCrys Loop, drawn as a loop.
 *
 * Four nodes on a ring with directional arcs (Measure → Diagnose → Execute →
 * Verify → back to Measure) and a 2×2 step list beside it. Replaces the
 * 2×2 card grid, which read as a square of boxes, not a cycle.
 *
 * Rules applied from the 2026-09-09 taste review: no "Step 01" labels (the
 * verb IS the label), no cards, one accent, no em-dashes, illustrative
 * numbers explicitly labeled as examples. The arc draw-in lives in
 * index.css (.loop-arc) and is disabled under prefers-reduced-motion.
 *
 * Text and strokes use --brand-accent-ink, the readable accent token
 * (deep teal in light mode, bright teal in dark), because --brand-accent
 * is 1.78:1 on white.
 */
type Step = { label: string; description: string; example: string };

const steps: Step[] = [
  {
    label: "Measure",
    description:
      "Any 4 of ChatGPT, Gemini, Google AI surfaces, Perplexity, and Claude, at the prompt level.",
    example: "Example: 60 prompts on a Pro plan",
  },
  {
    label: "Diagnose",
    description:
      "Gaps classified as absence, citation, accuracy, comparison, or action gap.",
    example: "Example: 3 gaps detected",
  },
  {
    label: "Execute",
    description:
      "Drafts grounded in your Corporate Context, your approved facts, claims, and guardrails, routed for human review.",
    example: "Example: 1 action queued",
  },
  {
    label: "Verify",
    description:
      "The same prompt set re-runs after the fix ships, tracking visibility and recommendation movement, not just citations.",
    example: "Example: recommendation share moves",
  },
];

const ACCENT = "hsl(var(--brand-accent-ink))";

/* Ring geometry: centre (170,170), radius 120, nodes at the four compass
   points, arcs run clockwise with a 14° gap on each side of a node. */
const ARCS = [
  "M199.0 53.6 A120 120 0 0 1 286.4 141.0",
  "M286.4 199.0 A120 120 0 0 1 199.0 286.4",
  "M141.0 286.4 A120 120 0 0 1 53.6 199.0",
  "M53.6 141.0 A120 120 0 0 1 141.0 53.6",
];
const NODES: Array<{ cx: number; cy: number }> = [
  { cx: 170, cy: 50 },
  { cx: 290, cy: 170 },
  { cx: 170, cy: 290 },
  { cx: 50, cy: 170 },
];

const LoopRing = () => (
  <svg
    className="mx-auto w-full max-w-[460px]"
    viewBox="-70 0 480 340"
    role="img"
    aria-labelledby="loop-ring-title"
  >
    <title id="loop-ring-title">
      The SolCrys Loop: Measure, Diagnose, Execute, Verify, and back to Measure
    </title>
    <defs>
      <marker
        id="loop-arrow"
        viewBox="0 0 10 10"
        refX="7"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0L10 5L0 10z" fill={ACCENT} />
      </marker>
    </defs>
    {ARCS.map((d, i) => (
      <path
        key={d}
        className="loop-arc"
        d={d}
        markerEnd="url(#loop-arrow)"
        style={{ stroke: ACCENT, animationDelay: `${i * 0.3}s` }}
      />
    ))}
    {NODES.map((n) => (
      <circle
        key={`${n.cx}-${n.cy}`}
        cx={n.cx}
        cy={n.cy}
        r="9"
        fill="hsl(var(--background))"
        stroke={ACCENT}
        strokeWidth="3"
      />
    ))}
    <g className="font-display" style={{ fontWeight: 600, fontSize: 15, fill: "hsl(var(--foreground))" }}>
      <text x="170" y="26" textAnchor="middle">Measure</text>
      <text x="312" y="175" textAnchor="start">Diagnose</text>
      <text x="170" y="326" textAnchor="middle">Execute</text>
      <text x="28" y="175" textAnchor="end">Verify</text>
    </g>
    <g className="font-body" style={{ fontSize: 11.5, fill: "hsl(var(--muted-foreground))" }}>
      <text x="170" y="164" textAnchor="middle">same prompt set,</text>
      <text x="170" y="181" textAnchor="middle">re-run after each fix</text>
    </g>
  </svg>
);

const LoopDiagram = () => {
  return (
    <div className="mt-12">
      <div className="grid gap-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <LoopRing />
        </div>
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 md:col-span-7">
          {steps.map((step) => (
            <div key={step.label}>
              <h3 className="font-display mb-1.5 text-lg font-semibold text-[hsl(var(--brand-accent-ink))]">
                {step.label}
              </h3>
              <p className="leading-relaxed text-muted-foreground">{step.description}</p>
              <span className="mt-1.5 block text-[13.5px] text-foreground/80">{step.example}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-7 text-xs leading-relaxed text-muted-foreground/70">
        Illustrative example of one workspace. Directional, not an aggregate marketing claim.
      </p>
    </div>
  );
};

export default LoopDiagram;
