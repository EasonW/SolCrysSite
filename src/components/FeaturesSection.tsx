import { BarChart3, FileText, Activity } from "lucide-react";

const features = [
{
  icon: BarChart3,
  title: "Brand Visibility & Share of Voice",
  description: "Track how your brand appears and is positioned across major AI engines. Understand your share of voice in AI-generated answers.",
  color: "hsl(195 90% 55%)",
  glowColor: "hsl(195 90% 55% / 0.08)"
},
{
  icon: FileText,
  title: "Authoritative Content Creation",
  description: "Create content designed to perform in AI engines—built on real user intent and structured for AI credibility signals.",
  color: "hsl(40 85% 55%)",
  glowColor: "hsl(40 85% 55% / 0.08)"
},
{
  icon: Activity,
  title: "Real-Time Sentiment Monitoring",
  description: "Monitor customer sentiment and friction points in real time—before they become brand or revenue risks.",
  color: "hsl(270 60% 60%)",
  glowColor: "hsl(270 60% 60% / 0.08)"
}];


const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 md:py-32 section-fade overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(270_60%_50%/0.04)] blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-[350px] h-[350px] rounded-full bg-[hsl(195_90%_55%/0.03)] blur-[100px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[hsl(270_60%_60%)] tracking-wider uppercase mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            From Visibility to Narrative Control
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Not just better visibility—sustained narrative control and higher customer retention

          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) =>
          <div
            key={index}
            className="relative rounded-xl p-8 border border-border/30 bg-card/40 backdrop-blur-sm hover:border-border/50 transition-all duration-500 group overflow-hidden">

              {/* Glow on hover */}
              <div
              className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: feature.glowColor }} />


              <div className="relative">
                <div
                className="h-12 w-12 rounded-lg flex items-center justify-center mb-5 transition-colors"
                style={{ backgroundColor: `${feature.color.replace(')', ' / 0.1)')}` }}>

                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default FeaturesSection;