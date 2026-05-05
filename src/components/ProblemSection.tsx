import { AlertTriangle, Eye, ShieldAlert } from "lucide-react";

const problems = [
  {
    icon: Eye,
    title: "Discovery is moving into answers",
    description:
      "More research journeys now end inside an AI answer. If your brand cannot be retrieved, cited, or recommended, the buyer's shortlist is shaped before they ever reach your site.",
    glow: "hsl(195 90% 55% / 0.08)",
  },
  {
    icon: AlertTriangle,
    title: "Reports are not actions",
    description:
      "Most AI visibility tools surface gaps but leave the fix to a human team. Without a structured workflow, prompt screenshots pile up and the pages buyers actually read do not change.",
    glow: "hsl(40 85% 55% / 0.08)",
  },
  {
    icon: ShieldAlert,
    title: "Brand facts drift across answers",
    description:
      "Outdated, inferred, or unsupported AI claims compound across engines until they become the default narrative. Reactive correction is too slow without a governed source of truth.",
    glow: "hsl(0 70% 55% / 0.08)",
  },
];

const ProblemSection = () => {
  return (
    <section
      id="problem"
      className="relative py-24 md:py-32 section-fade overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(195_90%_55%/0.04)] blur-[120px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase mb-3">
            Why teams come to SolCrys
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            AI search now decides what buyers see — before they click.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            As discovery shifts from result pages to generated answers, marketing teams
            need more than a dashboard. They need a workflow that turns answer gaps into
            shipped, verified action.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="relative rounded-xl p-8 border border-border/30 bg-card/40 backdrop-blur-sm hover:border-[hsl(195_90%_55%/0.3)] transition-all duration-500 group overflow-hidden"
            >
              {/* Card glow on hover */}
              <div
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: problem.glow }}
              />

              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-[hsl(195_90%_55%/0.1)] flex items-center justify-center mb-5 group-hover:bg-[hsl(195_90%_55%/0.15)] transition-colors">
                  <problem.icon className="h-6 w-6 text-[hsl(195_90%_55%)]" />
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
