import { CheckCircle2 } from "lucide-react";

const steps = [
{
  number: "01",
  title: "Real User Prompts",
  description: "Starts with real user prompts and signals distilled from authentic sources — conversations, forums, product reviews, and trusted media."
},
{
  number: "02",
  title: "Continuous Measurement",
  description: "Continuously measures how brands are mentioned, positioned, and cited in AI-generated answers to separate durable trends from noise."
},
{
  number: "03",
  title: "Evidence-Backed Insights",
  description: "Delivers evidence-backed insights into why competitors outperform and why messages fail to break through."
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
              Grounded in Reality,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">Not Guesswork</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">SolCrys AI takes a fundamentally different approach to AEO (Answer Engine Optimization). We track what real users are asking—not what algorithms assume they might ask.

            </p>
            <div className="flex items-center gap-3 text-sm text-[hsl(195_90%_55%)]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Not inference. Not guesswork. Real signals.</span>
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