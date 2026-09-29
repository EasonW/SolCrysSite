import homeContent from "@/content/homeContent.json";
import ScreenshotFrame from "@/components/ScreenshotFrame";
import {
  Activity,
  ArrowRight,
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
  const { platformLayers } = homeContent.home;

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
            Four layers, one closed loop — from AI visibility to governed execution.
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

        {/* Action-to-Result reporting band — anchors the 4th layer. (No mock
            product screenshot: the report visual drifted from the copy and led
            on a retired Sentiment tile; when the real report UI is
            screenshot-ready it can return here with neutral example data.) */}
        <div className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-6 md:p-8 text-center md:text-left">
          <p className="text-xs uppercase tracking-wider text-[hsl(var(--brand-accent))] mb-2 font-medium">
            Action-to-result report
          </p>
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 tracking-tight">
            See which shipped fix moved the answer.
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto md:mx-0">
            Every action ships against the same prompt set, so the report ties each
            page or source update to its recommendation, visibility, and accuracy
            impact — not just a citation count.
          </p>
        </div>

        {/* Signals: the market brief. Not one of the four layers, so it sits
            below them as its own row. Availability is per organization. */}
        <article className="mt-6 grid grid-cols-1 overflow-hidden rounded-xl border border-border/30 bg-card/40 md:grid-cols-12">
          <div className="order-2 p-6 md:order-1 md:col-span-6 md:self-center md:p-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent-ink))]">
              Signals
            </p>
            <h3 className="font-display mb-3 text-2xl font-semibold tracking-tight">Staying ahead of competitors</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              SolCrys monitors the news, announcements, and conversations in your
              space, from competitors to your market and customers, and briefs you
              every day. Publish your take, and AI has a reason to cite your brand.
              Competitive intelligence, market intelligence, content strategy, and
              communications, all in one place.
            </p>
            <p className="mb-6 text-xs text-muted-foreground/80">Available when enabled for your organization.</p>
            <a
              href="/signal-weekly-market-brief/"
              className="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--brand-accent-ink))] hover:underline"
            >
              How Signals works <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <ScreenshotFrame
            src="/work/signals-daily-brief.jpg"
            alt="A daily brief with industry, competitor and community cards, each with a suggested response and the prompt it answers"
            label="SolCrys · Signals · example brief"
            className="order-1 md:order-2 md:col-span-6"
          />
        </article>
      </div>
    </section>
  );
};

export default PlatformLayersSection;
