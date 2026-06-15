import siteContent from "@/content/siteContent.json";

const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
            Common Questions
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Direct answers for AI discovery teams.
          </h2>
        </div>

        <div className="grid gap-4">
          {siteContent.home.faqs.map((item) => (
            <article key={item.question} className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-6">
              <h3 className="font-display text-lg font-semibold mb-3">{item.question}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
