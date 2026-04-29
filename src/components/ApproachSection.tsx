import { CheckCircle2 } from "lucide-react";

const steps = [
{
  number: "01",
  title: "Prompt Set Design",
  description: "Start with category, comparison, competitor, risk, and branded prompts that mirror how buyers research options in AI tools."
},
{
  number: "02",
  title: "Cross-Engine Measurement",
  description: "Measure mentions, citations, competitor placement, sentiment, and answer accuracy across the AI surfaces that influence discovery."
},
{
  number: "03",
  title: "Evidence-Backed Actions",
  description: "Map each visibility or accuracy gap to a page update, content brief, FAQ improvement, or source correction your team can ship."
}];


const ApproachSection = () => {
  return (
    <section id="approach" className="relative py-24 md:py-32 section-fade overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[hsl(40_85%_55%/0.04)] blur-[140px]" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-[hsl(195_90%_55%/0.03)] blur-[100px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-[hsl(40_85%_55%)] tracking-wider uppercase mb-3">Our Approach</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Measure the answer,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">then fix the source</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">SolCrys connects AI answer monitoring with the source-level work needed to improve citations, accuracy, and competitive positioning.

            </p>
            <div className="flex items-center gap-3 text-sm text-[hsl(195_90%_55%)]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Prompt data, cited sources, and clear next actions.</span>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) =>
            <div
              key={step.number}
              className="relative rounded-xl p-6 flex gap-5 border border-border/30 bg-card/40 backdrop-blur-sm hover:border-[hsl(40_85%_55%/0.3)] transition-all duration-500 group overflow-hidden">

                {/* Hover glow */}
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[hsl(40_85%_55%/0.08)] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-2xl font-display font-bold text-[hsl(40_85%_55%/0.4)] shrink-0 relative">{step.number}</div>
                <div className="relative">
                  <h3 className="font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default ApproachSection;
