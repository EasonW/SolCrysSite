import siteContent from "@/content/siteContent.json";
import { ArrowRight } from "lucide-react";

const SolutionsSection = () => {
  const { solutions } = siteContent.home;

  return (
    <section
      id="solutions"
      className="relative py-24 md:py-32 section-fade overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(40_85%_55%/0.04)] blur-[120px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[hsl(40_85%_55%)] tracking-wider uppercase mb-3">
            Solutions
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Built for the teams that own AI visibility.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each role has a different path through the loop. Start with the resources
            built for yours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <a
              key={solution.title}
              href={solution.anchor}
              className="group relative rounded-xl p-7 border border-border/30 bg-card/40 backdrop-blur-sm hover:-translate-y-1 transition-all duration-500 overflow-hidden block"
              style={{ borderColor: undefined }}
            >
              <div
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: `${solution.color.replace(")", " / 0.12)")}` }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="font-display text-xl font-semibold tracking-tight transition-colors"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {solution.title}
                  </h3>
                  <span
                    className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 rounded-full border whitespace-nowrap"
                    style={{
                      color: solution.color,
                      borderColor: `${solution.color.replace(")", " / 0.3)")}`,
                      backgroundColor: `${solution.color.replace(")", " / 0.08)")}`,
                    }}
                  >
                    For
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/80 mb-3 uppercase tracking-wider">
                  {solution.audience}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  {solution.description}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: solution.color }}
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
