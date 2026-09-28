/**
 * PREVIEW — master-brand FAQ. Pricing answer names no numbers for Sites and
 * Motion; the AEO subscription tiers stay on the app pricing page.
 */
import type { ReactNode } from "react";
import { FAQS } from "@/preview/content";

type Faq = { question: string; answer: ReactNode };

const HomeFaqSection = ({
  heading = "Common questions.",
  items = FAQS,
}: { heading?: string; items?: Faq[] } = {}) => {
  return (
    <section id="faq" className="relative scroll-mt-24 py-20 md:py-24 section-fade">
      <div className="container mx-auto max-w-4xl px-6">
        <h2 className="font-display mb-10 text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h2>
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.question} className="rounded-xl border border-border/30 bg-card/40 p-6 backdrop-blur-sm">
              <h3 className="font-display text-lg font-semibold mb-3">{item.question}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFaqSection;
