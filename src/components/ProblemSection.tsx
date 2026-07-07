import { AlertTriangle, Eye, ShieldAlert } from "lucide-react";

// Card order tells the why-now story in sequence: the shift (discovery moved
// into answers) → the risk (facts drift) → the market gap (tools stop at
// reports) — which the next section, the Loop, answers directly.
const problems = [
  {
    icon: Eye,
    title: "Discovery is moving into answers",
    description:
      "If buyers can't retrieve, cite, or recommend you in AI, the shortlist is set before they reach your site.",
    glow: "hsl(var(--brand-accent) / 0.08)",
  },
  {
    icon: ShieldAlert,
    title: "Brand facts drift across answers",
    description:
      "Outdated AI claims compound across engines until they become the default narrative.",
    glow: "hsl(var(--brand-accent) / 0.08)",
  },
  {
    icon: AlertTriangle,
    title: "Reports aren't actions",
    description:
      "Most AEO tools surface gaps and leave the fix to humans. Screenshots pile up; pages don't change.",
    glow: "hsl(var(--brand-accent) / 0.08)",
  },
];

const ProblemSection = () => {
  return (
    <section
      id="problem"
      className="relative py-24 md:py-32 section-fade overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(var(--brand-accent)/0.04)] blur-[120px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
            Why AEO
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            AI search now decides what buyers see — before they click.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            <dfn className="not-italic text-foreground font-medium">Answer Engine Optimization (AEO)</dfn> makes brand facts, proof, and pages easy for AI systems to retrieve, cite, and recommend.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="relative rounded-xl p-8 border border-border/30 bg-card/40 backdrop-blur-sm hover:border-[hsl(var(--brand-accent)/0.3)] transition-all duration-500 group overflow-hidden"
            >
              {/* Card glow on hover */}
              <div
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: problem.glow }}
              />

              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--brand-accent)/0.1)] flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--brand-accent)/0.15)] transition-colors">
                  <problem.icon className="h-6 w-6 text-[hsl(var(--brand-accent))]" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-3">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
