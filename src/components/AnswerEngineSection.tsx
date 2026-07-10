import homeContent from "@/content/homeContent.json";
import { BrainCircuit, FileCheck2, Radar } from "lucide-react";

const icons = [Radar, BrainCircuit, FileCheck2];

const AnswerEngineSection = () => {
  return (
    <section id="aeo" className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="absolute inset-x-0 top-1/4 h-64 bg-[radial-gradient(circle_at_center,hsl(var(--brand-accent)/0.08),transparent_60%)]" />
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="max-w-3xl mb-14">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
            {homeContent.home.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Build pages AI systems can retrieve, trust, cite, and summarize.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            <dfn className="not-italic text-foreground">Answer Engine Optimization (AEO)</dfn> is the
            practice of making brand facts, proof, and pages easier for AI systems to retrieve, trust,
            cite, and summarize. SolCrys connects prompt-level measurement with crawlable,
            evidence-backed content strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {homeContent.home.answerBlocks.map((block, index) => {
            const Icon = icons[index] ?? Radar;
            return (
              <article
                key={block.title}
                className="relative rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-8 overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[hsl(var(--brand-accent)/0.06)] blur-3xl" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-lg bg-[hsl(var(--brand-accent)/0.1)] flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-[hsl(var(--brand-accent))]" />
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
