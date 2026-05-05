import siteContent from "@/content/siteContent.json";
import {
  AlertCircle,
  GitCompare,
  MinusCircle,
  Quote,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  MinusCircle,
  Quote,
  AlertCircle,
  GitCompare,
  Zap,
};

const AnswerGapSection = () => {
  const { answerGapTypes } = siteContent.home;

  return (
    <section
      id="aeo"
      className="relative py-24 md:py-32 section-fade overflow-hidden"
    >
      <div className="absolute inset-x-0 top-1/4 h-64 bg-[radial-gradient(circle_at_center,hsl(195_90%_55%/0.08),transparent_60%)]" />
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="max-w-3xl mb-14">
          <p className="text-sm font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase mb-3">
            The Answer Gap
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Five ways AI search makes your brand harder to find — and harder to
            choose.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            <dfn className="not-italic text-foreground">An answer gap</dfn> is the
            difference between what your brand needs answer engines to say and what
            they actually say today. SolCrys classifies every weak AI answer into one
            of five gap types so the team knows exactly what to fix next.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {answerGapTypes.map((gap) => {
            const Icon = iconMap[gap.icon] ?? AlertCircle;
            return (
              <article
                key={gap.type}
                className="relative rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-7 overflow-hidden group hover:border-[hsl(195_90%_55%/0.3)] transition-all duration-500"
              >
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[hsl(195_90%_55%/0.06)] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(195_90%_55%/0.1)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(195_90%_55%)]" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {gap.type}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {gap.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {gap.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnswerGapSection;
