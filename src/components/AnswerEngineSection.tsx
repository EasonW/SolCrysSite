import siteContent from "@/content/siteContent.json";
import { BrainCircuit, FileCheck2, Radar } from "lucide-react";

const icons = [Radar, BrainCircuit, FileCheck2];

const AnswerEngineSection = () => {
  return (
    <section id="aeo" className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="absolute inset-x-0 top-1/4 h-64 bg-[radial-gradient(circle_at_center,hsl(195_90%_55%/0.08),transparent_60%)]" />
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="max-w-3xl mb-14">
          <p className="text-sm font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase mb-3">
            {siteContent.home.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Build pages AI systems can retrieve, trust, cite, and summarize.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            SolCrys combines prompt-level measurement with crawlable, evidence-backed content strategy so marketing teams can improve AI visibility without guessing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {siteContent.home.answerBlocks.map((block, index) => {
            const Icon = icons[index] ?? Radar;
            return (
              <article
                key={block.title}
                className="relative rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-8 overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[hsl(195_90%_55%/0.06)] blur-3xl" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-lg bg-[hsl(195_90%_55%/0.1)] flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-[hsl(195_90%_55%)]" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-3">{block.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{block.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnswerEngineSection;
