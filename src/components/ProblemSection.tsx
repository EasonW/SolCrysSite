import { AlertTriangle, Eye, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: Eye,
    title: "Discovery is moving into answers",
    description:
      "More research journeys now include AI summaries and recommendations. If AI systems cannot retrieve or cite your evidence, your brand may be missing when buyers form a shortlist.",
    glow: "hsl(195 90% 55% / 0.08)",
  },
  {
    icon: AlertTriangle,
    title: "Traditional monitoring misses AI framing",
    description:
      "Social listening and keyword tools do not show how answer engines describe your category, compare competitors, or repeat brand claims.",
    glow: "hsl(40 85% 55% / 0.08)",
  },
  {
    icon: TrendingDown,
    title: "Inaccurate answers create trust risk",
    description:
      "AI systems can repeat outdated or unsupported facts. Without monitoring, teams often find inaccurate answers only after prospects have already seen them.",
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
            AI Search Visibility
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Search visibility now includes what AI systems retrieve, cite, and repeat.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            As discovery shifts from result pages to generated answers, brands
            need visibility into what AI systems retrieve, cite, and repeat.
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
