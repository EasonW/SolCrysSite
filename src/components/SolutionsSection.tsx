import homeContent from "@/content/homeContent.json";
import { ArrowRight } from "lucide-react";

const SolutionsSection = () => {
  const { solutions } = homeContent.home;

  return (
    <section
      id="solutions"
      className="relative py-24 md:py-32 section-fade overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(var(--brand-accent)/0.04)] blur-[120px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
            Solutions
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Built for the teams that own AI visibility.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <a
              key={solution.title}
              href={solution.anchor}
              className="group relative rounded-xl p-7 border border-border/30 bg-card/40 backdrop-blur-sm hover:-translate-y-1 transition-all duration-500 overflow-hidden block"
            >
              <div
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: "hsl(var(--brand-accent) / 0.12)" }}
              />
              <div className="relative">
                <h3
                  className="font-display text-xl font-semibold tracking-tight transition-colors mb-4"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {solution.title}
                </h3>
                <p className="text-xs text-muted-foreground/80 mb-3 uppercase tracking-wider">
                  {solution.audience}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  {solution.description}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: "hsl(var(--brand-accent))" }}
                >
                  Read the playbook
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
