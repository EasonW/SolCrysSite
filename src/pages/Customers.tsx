import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, BadgeCheck, ShoppingBag, Lock } from "lucide-react";

const WYZE_TEAL = "#00D4B4";

const LINKEDIN = {
  yun: "https://www.linkedin.com/in/yun-zhang-1441933",
  michelle: "https://www.linkedin.com/in/michellewangfrees/",
  toni: "https://www.linkedin.com/in/tiafrate/",
} as const;

const LinkedInLink = ({ href, name }: { href: string; name: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    aria-label={`${name} on LinkedIn`}
  >
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
    LinkedIn
  </a>
);

const yunQuote =
  "AI is changing how people discover products online, and for consumer brands, showing up correctly in AI answers is becoming incredibly important. The opportunity is about helping the right customers find your products and making it easier for them to buy. SolCrys gives us a better understanding of how Wyze appears across AI engines and where we can improve visibility and trust. We're excited to work with the SolCrys team as they build toward the future of brand discovery and agentic commerce.";

const michelleQuote =
  "SolCrys AI has become a trusted growth partner for our team. What's been most impressive is how they've elevated our approach to PDP content — taking it to a level of precision and impact we hadn't thought possible. On top of that, they've surfaced rich customer insights that are informing our product decisions.";

const toniQuote =
  "What stood out to me about SolCrys is that it goes beyond just showing data. Most tools stop at dashboards and metrics, but SolCrys helps teams understand what the data means and what actions to take next. That's incredibly valuable for communications and marketing leaders who need actionable intelligence, not just reports.";

const whatSolCrysDelivers = [
  {
    Icon: Eye,
    title: "Visibility across AI engines",
    body:
      "Track how Wyze appears in ChatGPT, Gemini, Google AI Overviews, AI Mode, and Perplexity — by prompt, by competitor, and by source.",
  },
  {
    Icon: BadgeCheck,
    title: "Accuracy and trust signals",
    body:
      "Surface where answers misstate product details or omit Wyze entirely, and pinpoint the citations AI systems lean on to form those answers.",
  },
  {
    Icon: ShoppingBag,
    title: "PDP precision & customer insight",
    body:
      "Sharpen product detail page content for AI retrieval and turn answer-engine signals into product decisions, listing fixes, and Q&A coverage.",
  },
];

const CustomerStories = () => {
  const containerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main ref={containerRef} className="text-foreground overflow-x-hidden pt-16">
        {/* Hero */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          {/* Subtle teal aurora keyed to the featured brand */}
          <div
            className="absolute inset-x-0 top-0 h-96 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${WYZE_TEAL}1F, transparent 60%)`,
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <p className="fade-in-scroll section-label mb-6">Customer Stories</p>
            <h1 className="fade-in-scroll font-heading text-4xl md:text-6xl font-bold leading-tight">
              How consumer brands use SolCrys to show up in AI answers.
            </h1>
            <p className="fade-in-scroll mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Visibility, accuracy, and trust across the AI engines where buyers
              now ask, compare, and decide.
            </p>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* Featured customer: Wyze */}
        <section className="relative py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="fade-in-scroll flex flex-col items-center mb-10">
              <p className="section-label mb-4">Featured customer</p>
              <img
                src="/customers/wyze-logo.png"
                alt="Wyze"
                className="h-9 md:h-10 w-auto"
                loading="lazy"
              />
            </div>

            {/* Executive testimonial — Yun Zhang */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${WYZE_TEAL}, transparent)`,
                }}
              />

              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-0">
                {/* Photo column */}
                <div className="relative bg-muted/30 overflow-hidden min-h-[360px] md:min-h-[560px]">
                  <img
                    src="/customers/yun-zhang.jpg"
                    alt="Yun Zhang, CEO of Wyze"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white"
                      style={{ backgroundColor: WYZE_TEAL }}
                    >
                      CEO
                    </span>
                  </div>
                </div>

                {/* Quote column */}
                <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-7xl md:text-8xl leading-none mb-2 select-none"
                    style={{ color: WYZE_TEAL, opacity: 0.5 }}
                  >
                    “
                  </div>

                  <blockquote className="font-heading text-xl md:text-2xl lg:text-[1.6rem] leading-snug md:leading-[1.35] text-foreground">
                    {yunQuote}
                  </blockquote>

                  <figcaption className="mt-8 pt-6 border-t border-border/40 flex items-center gap-4">
                    <div
                      className="h-10 w-1 rounded-full"
                      style={{ backgroundColor: WYZE_TEAL }}
                    />
                    <div>
                      <p className="font-heading text-base font-semibold text-foreground">
                        Yun Zhang
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CEO, Wyze
                      </p>
                      <div className="mt-2">
                        <LinkedInLink href={LINKEDIN.yun} name="Yun Zhang" />
                      </div>
                    </div>
                  </figcaption>
                </div>
              </div>
            </article>

            {/* Practitioner testimonial — Michelle Frees */}
            <article className="fade-in-scroll relative mt-8 md:mt-10 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="grid md:grid-cols-[auto_1fr] gap-0">
                {/* Avatar column */}
                <div className="flex md:flex-col items-center md:justify-center gap-4 p-8 md:p-10 md:w-[260px] border-b md:border-b-0 md:border-r border-border/40 bg-muted/20">
                  <div
                    className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-2 shrink-0"
                    style={{ borderColor: `${WYZE_TEAL}55` }}
                  >
                    <img
                      src="/customers/michelle-frees.jpg"
                      alt="Michelle Frees"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:mt-5 md:text-center">
                    <p className="font-heading text-base font-semibold text-foreground">
                      Michelle Frees
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Head of Amazon Growth
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      Wyze
                    </p>
                    <div className="mt-3">
                      <LinkedInLink href={LINKEDIN.michelle} name="Michelle Frees" />
                    </div>
                  </div>
                </div>

                {/* Quote column */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-5xl md:text-6xl leading-none mb-1 select-none"
                    style={{ color: WYZE_TEAL, opacity: 0.45 }}
                  >
                    “
                  </div>
                  <blockquote className="font-heading text-lg md:text-xl lg:text-2xl leading-snug md:leading-[1.4] text-foreground">
                    {michelleQuote}
                  </blockquote>
                </div>
              </div>
            </article>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* About Wyze */}
        <section className="max-w-4xl mx-auto px-6 py-20 md:py-24">
          <div className="grid md:grid-cols-[auto_1fr] items-center gap-10 md:gap-12">
            <div className="fade-in-scroll flex justify-center md:justify-start">
              <div className="rounded-xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
                <img
                  src="/customers/wyze-logo.png"
                  alt="Wyze"
                  width={180}
                  height={44}
                  loading="lazy"
                  className="h-[44px] w-auto block"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="fade-in-scroll section-label mb-4">About Wyze</p>
              <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-4">
                A consumer brand making smart home accessible.
              </h2>
              <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
                Wyze is a Seattle-based smart home company known for cameras,
                sensors, and connected devices designed to be high quality and
                affordable. The brand reaches millions of households shopping
                across retail and direct channels — exactly the kind of
                discovery surface AI assistants are now reshaping.
              </p>
            </div>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* Across the industry — anonymized testimonial */}
        <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center mb-12">
            <p className="fade-in-scroll section-label mb-4">
              Across the industry
            </p>
            <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground">
              Comms and marketing leaders are turning AI signal into action.
            </h2>
          </div>

          <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
            <div className="grid md:grid-cols-[auto_1fr] gap-0">
              {/* Speaker column with photo + anonymized company */}
              <div className="flex md:flex-col items-center md:justify-center gap-4 p-8 md:p-10 md:w-[280px] border-b md:border-b-0 md:border-r border-border/40 bg-muted/20">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border border-border/40 shrink-0">
                  <img
                    src="/customers/toni-iafrate.jpg"
                    alt="Toni Iafrate"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="md:mt-5 md:text-center md:flex md:flex-col md:items-center">
                  <p className="font-heading text-base font-semibold text-foreground">
                    Toni Iafrate
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Chief Communications Officer
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                    <Lock className="h-3 w-3" />
                    Company name withheld
                  </p>
                  <div className="mt-3">
                    <LinkedInLink href={LINKEDIN.toni} name="Toni Iafrate" />
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div
                  aria-hidden
                  className="font-heading text-5xl md:text-6xl leading-none mb-1 select-none text-muted-foreground/60"
                >
                  “
                </div>
                <blockquote className="font-heading text-lg md:text-xl lg:text-2xl leading-snug md:leading-[1.4] text-foreground">
                  {toniQuote}
                </blockquote>
              </div>
            </div>
          </article>

          <p className="fade-in-scroll mt-6 text-center text-xs text-muted-foreground/70">
            Shared with permission. Company name redacted at the customer's
            request.
          </p>
        </section>

        <div className="glow-line w-full" />

        {/* What SolCrys delivers */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center mb-14">
            <p className="fade-in-scroll section-label mb-4">
              What SolCrys delivers
            </p>
            <h2 className="fade-in-scroll font-heading text-3xl md:text-4xl text-foreground">
              From AI visibility measurement to action on every page that matters.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whatSolCrysDelivers.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="fade-in-scroll group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                  style={{
                    backgroundColor: `${WYZE_TEAL}1A`,
                    color: WYZE_TEAL,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="fade-in-scroll section-label mb-4">Get started</p>
          <h2 className="fade-in-scroll font-heading text-3xl md:text-4xl text-foreground mb-5">
            See where your brand shows up — and where it doesn't.
          </h2>
          <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Get a free AI visibility audit. We'll map high-intent prompts to
            mentions, citations, answer accuracy, and the content gaps your team
            should fix next.
          </p>
          <div className="fade-in-scroll flex flex-col sm:flex-row items-center justify-center gap-4">
            <EarlyAccessDialog surface="customers">
              <Button variant="hero" size="lg" className="text-base px-8 py-6 h-auto">
                Get a Free AI Visibility Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </EarlyAccessDialog>
            <Button asChild variant="hero-outline" size="lg" className="text-base px-8 py-6 h-auto">
              <a href="/pricing/">See pricing</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerStories;
