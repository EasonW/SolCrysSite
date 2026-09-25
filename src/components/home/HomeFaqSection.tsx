/**
 * PREVIEW — master-brand FAQ. Pricing answer names no numbers for Sites and
 * Motion; the AEO subscription tiers stay on the app pricing page.
 */
const FAQS = [
  {
    question: "What does SolCrys do?",
    answer:
      "SolCrys makes sure AI describes your brand accurately, then builds the web pages and booth demos that tell the same story. Everything starts from your approved facts, and we measure what changed.",
  },
  {
    question: "Do you build websites and animations?",
    answer:
      "Yes. SolCrys Sites delivers homepages, category and product pages with AI-ready copy and design, hosted on our subdomain or your own domain. SolCrys Motion delivers booth animation and interactive demos. Both use the same Corporate Context as your AI visibility work.",
  },
  {
    question: "How is it priced?",
    answer:
      "SolCrys AEO is a monthly subscription with a free tier. Sites and Motion are quoted per project or per piece. Start a project and we'll come back with a scope and quote.",
  },
  {
    question: "How do you measure results?",
    answer:
      "Before we ship, we run the questions your buyers ask AI and record a baseline. After launch, the same prompts re-run across the same engines, so you can see the change in mentions, citations and share of voice.",
  },
  {
    question: "What is AEO, and how is it different from SEO?",
    answer:
      "Answer Engine Optimization makes a brand's facts, proof, and pages easy for AI systems to retrieve, cite, and summarize. SEO targets the results page; AEO targets the answer itself.",
  },
  {
    question: "How do you keep what you make accurate?",
    answer:
      "Every piece is grounded in your Corporate Context, your approved facts, claims and guardrails, and nothing ships without your team's approval.",
  },
];

const HomeFaqSection = () => {
  return (
    <section id="faq" className="relative scroll-mt-24 py-20 md:py-24 section-fade">
      <div className="container mx-auto max-w-4xl px-6">
        <h2 className="font-display mb-10 text-3xl font-bold tracking-tight md:text-4xl">
          Common questions.
        </h2>
        <div className="grid gap-4">
          {FAQS.map((item) => (
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
