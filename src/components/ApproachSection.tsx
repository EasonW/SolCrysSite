import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Measure across engines",
    description:
      "Run a fixed prompt set across ChatGPT, Gemini, Google AI Overviews / AI Mode, and Perplexity on eligible plans. Capture mentions, citations, competitors, sentiment, and answer accuracy in one place.",
  },
  {
    number: "02",
    title: "Diagnose the answer gap",
    description:
      "Classify each weak answer as an absence, citation, accuracy, comparison, or action gap. Map each gap to the page or source most likely to fix it.",
  },
  {
    number: "03",
    title: "Execute with Corporate Context",
    description:
      "SolCrys uses your approved facts, claims, and guardrails to turn gaps into briefs, fix recommendations, and reviewable drafts your team can approve and ship.",
  },
  {
    number: "04",
    title: "Verify and re-test",
    description:
      "Re-run the same prompt set after the action ships. Track citation rate, answer accuracy, and recommendation share to prove which fixes actually moved the answer.",
  },
];

const ApproachSection = () => {
  return (
    <section id="loop" className="relative py-24 md:py-32 section-fade overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[hsl(40_85%_55%/0.04)] blur-[140px]" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-[hsl(195_90%_55%/0.03)] blur-[100px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-medium text-[hsl(40_85%_55%)] tracking-wider uppercase mb-3">
              The SolCrys Loop
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Measure, diagnose, execute,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">
                then prove the lift.
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              SolCrys closes the loop on AI search visibility. Each shipped action is
              tied to the same prompt set so you can see which fixes actually changed
              the answer.
            </p>
            <div className="flex items-center gap-3 text-sm text-[hsl(195_90%_55%)]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                Prompt evidence, governed action, action-to-result verification.
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-xl p-6 flex gap-5 border border-border/30 bg-card/40 backdrop-blur-sm hover:border-[hsl(40_85%_55%/0.3)] transition-all duration-500 group overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[hsl(40_85%_55%/0.08)] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-2xl font-display font-bold text-[hsl(40_85%_55%/0.4)] shrink-0 relative">
                  {step.number}
                </div>
                <div className="relative">
                  <h3 className="font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
