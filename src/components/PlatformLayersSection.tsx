import siteContent from "@/content/siteContent.json";
import reportImage from "@/assets/report.png";
import {
  Activity,
  BarChart3,
  Shield,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  Shield,
  Sparkles,
  Activity,
};

const PlatformLayersSection = () => {
  const { platformLayers } = siteContent.home;

  return (
    <section
      id="features"
      className="relative py-24 md:py-32 section-fade overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(var(--brand-accent)/0.04)] blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-[350px] h-[350px] rounded-full bg-[hsl(var(--brand-accent)/0.03)] blur-[100px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
            Platform
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Four layers, one closed loop.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {platformLayers.map((layer) => {
            const Icon = iconMap[layer.icon] ?? BarChart3;
            return (
              <article
                key={layer.title}
                className="relative rounded-xl p-8 border border-border/30 bg-card/40 backdrop-blur-sm hover:border-border/50 transition-all duration-500 group overflow-hidden"
              >
                <div
                  className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: `${layer.color.replace(")", " / 0.1)")}` }}
                />
                <div className="relative">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${layer.color.replace(")", " / 0.12)")}` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: layer.color }} />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-3">
                    {layer.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {layer.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Action-to-Result reporting visual — anchors the 4th layer */}
        <div className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-6 md:p-8">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-6 items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[hsl(var(--brand-accent))] mb-2 font-medium">
                Action-to-result report
              </p>
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                See which shipped fix moved the answer.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every action ships against the same prompt set, so the report links
                each page or source update to its citation, accuracy, and
                recommendation impact.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
              <div className="h-7 border-b border-white/5 bg-white/5 flex items-center px-3 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/30" />
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand-accent)/0.3)]" />
                <div className="w-2 h-2 rounded-full bg-green-500/30" />
              </div>
              <img
                src={reportImage}
                alt="SolCrys action-to-result report showing AI mentions, citations, and recommendation share over time"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformLayersSection;
