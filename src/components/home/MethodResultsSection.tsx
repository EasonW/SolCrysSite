import { ArrowRight } from "lucide-react";
import LoopDiagram, { type LoopStep } from "@/components/LoopDiagram";

/**
 * PREVIEW — one method across every product line (the existing Loop, extended
 * from content to pages and motion), with the Cornelis numbers as proof.
 * Numbers and wording match the published Cornelis case study.
 */
const STEPS: LoopStep[] = [
  {
    label: "Measure",
    description: "Run the questions your buyers ask AI and record how each engine describes you today.",
    example: "Cornelis: a new category prompt set, built with their team",
  },
  {
    label: "Diagnose",
    description: "Compare those answers with your approved facts to find what is missing or wrong.",
    example: "Cornelis: zero-presence prompts became page headings",
  },
  {
    label: "Execute",
    description: "Ship the fix, from content to web pages to booth motion, each mapped to a step in the buyer's journey.",
    example: "Cornelis: five deliverables in four weeks",
  },
  {
    label: "Verify",
    description: "Re-run the same prompts against the baseline and feed what changed into the next round.",
    example: "Cornelis: 12× mention rate on the category prompts",
  },
];

const STATS = [
  { value: "2×", label: "AI-readiness score", note: "On the marquee product page." },
  { value: "12×", label: "Mention rate", note: "On the new category prompt set." },
  { value: "#2", label: "Share of voice", note: "Unseating the incumbent #2." },
];

const MethodResultsSection = () => {
  return (
    <section id="method" className="relative scroll-mt-24 py-20 md:py-24 section-fade">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-[62ch]">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight [text-wrap:balance] md:text-4xl">
            Measure, diagnose, execute, then verify what changed.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            The same method runs every project, from an AI answer to a booth
            demo. Work ships against a baseline, so you can see what it moved.
          </p>
        </div>

        <LoopDiagram
          steps={STEPS}
          centerLines={["same baseline,", "re-measured after launch"]}
          footnote={null}
        />

        <div className="mt-10 rounded-xl border border-border/30 bg-card/40 p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent-ink))] mb-1">
                Cornelis Networks · four weeks · AI Infra Summit launch
              </p>
              <p className="font-display text-xl font-semibold tracking-tight">
                A brand-new category, made answerable before the show.
              </p>
            </div>
            <a
              href="/customers/cornelis/"
              className="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--brand-accent-ink))] hover:underline"
            >
              Read the case study <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-t border-border/30 pt-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{stat.label}</p>
                <p className="font-display text-4xl font-bold tracking-tight md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodResultsSection;
