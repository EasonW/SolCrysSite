import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { APP_PRICING_URL } from "@/lib/pricing-url";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Eye,
  BadgeCheck,
  ShoppingBag,
  Lock,
  TrendingUp,
  Target,
  Workflow,
} from "lucide-react";

const WYZE_TEAL = "#00D4B4";
const NEXTSILICON_INDIGO = "#5700FF";
const UIPATH_ORANGE = "#FA4616";

const LINKEDIN = {
  brandon: "https://www.linkedin.com/in/brandondraeger/",
  yun: "https://www.linkedin.com/in/yun-zhang-1441933",
  michelle: "https://www.linkedin.com/in/michellewangfrees/",
  toni: "https://www.linkedin.com/in/tiafrate/",
  garrett: "https://www.linkedin.com/in/ACoAAAzCAM8B_4zaQelFta2ZX-vhiQRMG2QBCYg",
  maria: "https://www.linkedin.com/in/mariavoloh/",
} as const;

const BOBOYM_AMAZON_STORE =
  "https://www.amazon.com/BOBOYM-20-Inch-Expandable-Suitcase-360%C2%B0Rolling/dp/B0FXWHWTXN/";

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

const AmazonStoreLink = ({ href, name }: { href: string; name: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    aria-label={`${name} store on Amazon`}
  >
    <ShoppingBag className="h-4 w-4" aria-hidden />
    Amazon store
  </a>
);

const brandonPrimaryQuote =
  "For the first time, we have clear, system-level visibility into marketing performance — paired with a platform that continuously optimizes it. The upside is significant. SolCrys is informing how we think about marketing performance in a number of areas — we're already using it to inform content strategy across product launches, campaigns, and major events.";

const brandonScienceQuote =
  "Every time we meet, SolCrys shares insights that surprise me. I'm approached by vendors all the time, but none of them treat this as a science the way SolCrys does. The guardrails and scoring frameworks they've built into the product, along with the level of insight — from citation analysis to prompt diagnosis and content gap identification — are exceptional. It's exactly what we've been looking for.";

const yunQuote =
  "AI is changing how people discover products online, and for consumer brands, showing up correctly in AI answers is becoming incredibly important. The opportunity is about helping the right customers find your products and making it easier for them to buy. SolCrys gives us a better understanding of how Wyze appears across AI engines and where we can improve visibility and trust. We're excited to work with the SolCrys team as they build toward the future of brand discovery and agentic commerce.";

const michelleQuote =
  "SolCrys AI has become a trusted growth partner for our team. What's been most impressive is how they've elevated our approach to PDP content — taking it to a level of precision and impact we hadn't thought possible. On top of that, they've surfaced rich customer insights that are informing our product decisions.";

const toniQuote =
  "What stood out to me about SolCrys is that it goes beyond just showing data. Most tools stop at dashboards and metrics, but SolCrys helps teams understand what the data means and what actions to take next. That's incredibly valuable for communications and marketing leaders who need actionable intelligence, not just reports.";

const mariaQuote =
  "We've been trying out SolCrys AI for a while now, and the MCP feature lets us pull visibility insights on citations, gaps, and monthly action plans — it also recommends next steps in our optimization journey. We can then turn the insights straight into content. We're excited to keep partnering with the SolCrys team to unlock even more of our presence across AI answer engines.";

const garrettQuote =
  "SolCrys' citation data is one of the most exciting features for us. It gives us clearer, more actionable insights than traditional social listening tools. As a startup owner, I'm also impressed by their MCP support — being able to quickly pull our visibility score, identify gaps, integrate with GitHub, and draft content for our website is exactly what we need.";

const jedQuote =
  "SolCrys has helped us tremendously. Their platform gave us a much clearer view of the potential for our store across emerging AI shopping channels such as Amazon Rufus, Alexa for Shopping, and other AI engines. For the first time, we can see where our products show up, where we are missing, and what needs to improve to become more discoverable in these new shopping experiences. It opened our eyes to how much opportunity there is for BOBOYM as AI becomes a bigger part of how people discover and buy products.";

const nextSiliconApproach = [
  {
    Icon: Target,
    title: "Prompt building & benchmarking",
    body:
      "Prompt sets across answer engines measure prompt-level visibility, citation share, sentiment, and recommendation rate against key competitors.",
  },
  {
    Icon: Workflow,
    title: "Continuous content & metadata optimization",
    body:
      "Page-level audits, topic clusters, factual density, comparison framing, and AI-engine-optimized schema applied and validated at scale.",
  },
  {
    Icon: TrendingUp,
    title: "Deep analysis routed to action",
    body:
      "Visibility gaps and next-best actions ranked by priority and effort, then routed to the Actions page where owners, due dates, and progress are tracked through completion.",
  },
];

const whatSolCrysDelivers = [
  {
    Icon: Eye,
    title: "Visibility across AI engines",
    body:
      "Track how your brand appears in ChatGPT, Gemini, Google AI Overviews, AI Mode, and Perplexity — by prompt, by competitor, and by source.",
  },
  {
    Icon: BadgeCheck,
    title: "Accuracy and trust signals",
    body:
      "Surface where answers misstate your offering or omit you entirely, and pinpoint the citations AI systems lean on to form those answers.",
  },
  {
    Icon: ShoppingBag,
    title: "Content precision & decision insight",
    body:
      "Sharpen the pages AI retrieves — product detail, comparison, technical, FAQ — and turn answer-engine signals into product, content, and Q&A decisions.",
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
          {/* Subtle blended aurora — indigo (NextSilicon) and teal (Wyze) */}
          <div
            className="absolute inset-x-0 top-0 h-96 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 0%, ${NEXTSILICON_INDIGO}1F, transparent 60%), radial-gradient(circle at 70% 0%, ${WYZE_TEAL}1A, transparent 60%)`,
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <p className="fade-in-scroll section-label mb-6">Customer Stories</p>
            <h1 className="fade-in-scroll font-heading text-4xl md:text-6xl font-bold leading-tight">
              How leading brands use SolCrys to show up in AI answers.
            </h1>
            <p className="fade-in-scroll mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From HPC and AI infrastructure to consumer smart home — measurable
              visibility, accuracy, and trust across the AI engines where buyers
              now ask, compare, and decide.
            </p>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* Featured customer: NextSilicon */}
        <section className="relative py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="fade-in-scroll flex flex-col items-center mb-10">
              <p className="section-label mb-4">Featured customer</p>
              <img
                src="/customers/nextsilicon-logo.svg"
                alt="NextSilicon"
                className="h-7 md:h-8 w-auto invert dark:invert-0"
                loading="lazy"
              />
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                High-Performance Computing &amp; AI
              </p>
            </div>

            {/* Result metric pull-out */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden mb-8 md:mb-10">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${NEXTSILICON_INDIGO}, transparent)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 80% 50%, ${NEXTSILICON_INDIGO}, transparent 55%)`,
                }}
              />

              <div className="relative grid md:grid-cols-3 gap-0">
                <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-border/40">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Mention rate — before
                  </p>
                  <p className="font-heading text-5xl md:text-6xl font-bold text-foreground/80">
                    1.9%
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Trailing entrenched HPC and AI infrastructure incumbents.
                  </p>
                </div>

                <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-border/40 flex flex-col justify-center items-center text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    In just
                  </p>
                  <p
                    className="font-heading text-5xl md:text-6xl font-bold"
                    style={{ color: NEXTSILICON_INDIGO }}
                  >
                    45 days
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    From kickoff to a measurable, repeatable engine.
                  </p>
                </div>

                <div className="p-8 md:p-10">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Mention rate — after
                  </p>
                  <p
                    className="font-heading text-5xl md:text-6xl font-bold"
                    style={{ color: NEXTSILICON_INDIGO }}
                  >
                    7.4%
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground inline-flex items-center gap-1.5">
                    <TrendingUp
                      className="h-4 w-4"
                      style={{ color: NEXTSILICON_INDIGO }}
                    />
                    Near 4× lift in share of voice
                  </p>
                </div>
              </div>
            </article>

            {/* Primary testimonial — Brandon Draeger */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${NEXTSILICON_INDIGO}, transparent)`,
                }}
              />

              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-0">
                {/* Photo column */}
                <div className="relative bg-muted/30 overflow-hidden min-h-[360px] md:min-h-[560px]">
                  <img
                    src="/customers/brandon-draeger.jpg"
                    alt="Brandon Draeger, VP of Marketing at NextSilicon"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white"
                      style={{ backgroundColor: NEXTSILICON_INDIGO }}
                    >
                      VP, Marketing
                    </span>
                  </div>
                </div>

                {/* Quote column */}
                <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-7xl md:text-8xl leading-none mb-2 select-none"
                    style={{ color: NEXTSILICON_INDIGO, opacity: 0.5 }}
                  >
                    “
                  </div>

                  <blockquote className="font-heading text-xl md:text-2xl lg:text-[1.6rem] leading-snug md:leading-[1.35] text-foreground">
                    {brandonPrimaryQuote}
                  </blockquote>

                  <figcaption className="mt-8 pt-6 border-t border-border/40 flex items-center gap-4">
                    <div
                      className="h-10 w-1 rounded-full"
                      style={{ backgroundColor: NEXTSILICON_INDIGO }}
                    />
                    <div>
                      <p className="font-heading text-base font-semibold text-foreground">
                        Brandon Draeger
                      </p>
                      <p className="text-sm text-muted-foreground">
                        VP of Marketing, NextSilicon
                      </p>
                      <div className="mt-2">
                        <LinkedInLink
                          href={LINKEDIN.brandon}
                          name="Brandon Draeger"
                        />
                      </div>
                    </div>
                  </figcaption>
                </div>
              </div>
            </article>

            {/* Secondary quote — the "science" callout */}
            <article className="fade-in-scroll relative mt-8 md:mt-10 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="p-8 md:p-12 lg:p-14">
                <div
                  aria-hidden
                  className="font-heading text-5xl md:text-6xl leading-none mb-1 select-none"
                  style={{ color: NEXTSILICON_INDIGO, opacity: 0.45 }}
                >
                  “
                </div>
                <blockquote className="font-heading text-lg md:text-xl lg:text-2xl leading-snug md:leading-[1.4] text-foreground max-w-4xl">
                  {brandonScienceQuote}
                </blockquote>
                <figcaption className="mt-6 text-sm text-muted-foreground">
                  — Brandon Draeger, VP of Marketing, NextSilicon
                </figcaption>
              </div>
            </article>

            {/* Read full case study CTA */}
            <div className="fade-in-scroll mt-8 md:mt-10 flex justify-center">
              <Button
                asChild
                variant="hero-outline"
                size="lg"
                className="text-base px-8 py-6 h-auto"
              >
                <a href="/customers/nextsilicon/">
                  Read the full NextSilicon case study
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* About NextSilicon + Why it worked */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-12 md:gap-16">
            <div>
              <p className="fade-in-scroll section-label mb-4">About NextSilicon</p>
              <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-4">
                A challenger in one of tech's most crowded categories.
              </h2>
              <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
                NextSilicon is a high-performance computing pioneer competing
                head-to-head with deeply entrenched incumbents and well-funded
                challengers across HPC and AI infrastructure — a category where
                buyers are highly technical and evaluation cycles are long.
              </p>
            </div>

            <div>
              <p className="fade-in-scroll section-label mb-4">Why it worked</p>
              <h3 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-4">
                A system, not a one-off effort.
              </h3>
              <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
                NextSilicon's results came from a continuous loop of
                measurement, diagnosis, execution, and verification — the core
                of the SolCrys platform — transforming AEO from guesswork into
                a structured, measurable discipline.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {nextSiliconApproach.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="fade-in-scroll rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-7"
              >
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                  style={{
                    backgroundColor: `${NEXTSILICON_INDIGO}1A`,
                    color: NEXTSILICON_INDIGO,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {title}
                </h4>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* Featured customer: Wyze */}
        <section className="relative py-20 md:py-28">
          <div
            className="absolute inset-x-0 top-0 h-72 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${WYZE_TEAL}14, transparent 60%)`,
            }}
          />
          <div className="container mx-auto px-6 max-w-6xl relative">
            <div className="fade-in-scroll flex flex-col items-center mb-10">
              <p className="section-label mb-4">Featured customer</p>
              <img
                src="/customers/wyze-logo.png"
                alt="Wyze"
                className="h-9 md:h-10 w-auto"
                loading="lazy"
              />
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Consumer Smart Home
              </p>
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
                      Head of Amazon
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

        {/* More customer voices — Garrett (ClearlyKept), Jed (BOBOYM), Toni (anonymized) */}
        <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center mb-12">
            <p className="fade-in-scroll section-label mb-4">
              More customer voices
            </p>
            <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground">
              Founders, marketing leaders, and operators using SolCrys to compete in AI discovery.
            </h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Maria Voloh — UiPath */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${UIPATH_ORANGE}, transparent)`,
                }}
              />
              <div className="grid md:grid-cols-[auto_1fr] gap-0">
                <div className="flex md:flex-col items-center md:justify-center gap-4 p-8 md:p-10 md:w-[280px] border-b md:border-b-0 md:border-r border-border/40 bg-muted/20">
                  <div
                    className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-2 shrink-0"
                    style={{ borderColor: `${UIPATH_ORANGE}55` }}
                  >
                    <img
                      src="/customers/maria-voloh.jpg"
                      alt="Maria Voloh"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:mt-5 md:text-center md:flex md:flex-col md:items-center">
                    <p className="font-heading text-base font-semibold text-foreground">
                      Maria Voloh
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Sr. Director, Global Digital Marketing
                    </p>
                    <img
                      src="/customers/uipath-logo.svg"
                      alt="UiPath"
                      className="mt-3 h-7 w-auto"
                      loading="lazy"
                    />
                    <div className="mt-3">
                      <LinkedInLink href={LINKEDIN.maria} name="Maria Voloh" />
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-5xl md:text-6xl leading-none mb-1 select-none"
                    style={{ color: UIPATH_ORANGE, opacity: 0.45 }}
                  >
                    “
                  </div>
                  <blockquote className="font-heading text-lg md:text-xl lg:text-2xl leading-snug md:leading-[1.4] text-foreground">
                    {mariaQuote}
                  </blockquote>
                </div>
              </div>
            </article>

            {/* Garrett Astler — ClearlyKept */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="grid md:grid-cols-[auto_1fr] gap-0">
                <div className="flex md:flex-col items-center md:justify-center gap-4 p-8 md:p-10 md:w-[280px] border-b md:border-b-0 md:border-r border-border/40 bg-muted/20">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border border-border/40 shrink-0">
                    <img
                      src="/customers/garrett-astler.jpg"
                      alt="Garrett Astler"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:mt-5 md:text-center md:flex md:flex-col md:items-center">
                    <p className="font-heading text-base font-semibold text-foreground">
                      Garrett Astler
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Co-founder
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      ClearlyKept
                    </p>
                    <div className="mt-3">
                      <LinkedInLink href={LINKEDIN.garrett} name="Garrett Astler" />
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-5xl md:text-6xl leading-none mb-1 select-none text-muted-foreground/60"
                  >
                    “
                  </div>
                  <blockquote className="font-heading text-lg md:text-xl lg:text-2xl leading-snug md:leading-[1.4] text-foreground">
                    {garrettQuote}
                  </blockquote>
                </div>
              </div>
            </article>

            {/* Jed Li — BOBOYM */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="grid md:grid-cols-[auto_1fr] gap-0">
                <div className="flex md:flex-col items-center md:justify-center gap-4 p-8 md:p-10 md:w-[280px] border-b md:border-b-0 md:border-r border-border/40 bg-muted/20">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border border-border/40 shrink-0">
                    <img
                      src="/customers/jed-li.jpg"
                      alt="Jed Li"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:mt-5 md:text-center md:flex md:flex-col md:items-center">
                    <p className="font-heading text-base font-semibold text-foreground">
                      Jed Li
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      CEO
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      BOBOYM
                    </p>
                    <div className="mt-3">
                      <AmazonStoreLink href={BOBOYM_AMAZON_STORE} name="BOBOYM" />
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-5xl md:text-6xl leading-none mb-1 select-none text-muted-foreground/60"
                  >
                    “
                  </div>
                  <blockquote className="font-heading text-lg md:text-xl lg:text-2xl leading-snug md:leading-[1.4] text-foreground">
                    {jedQuote}
                  </blockquote>
                </div>
              </div>
            </article>

            {/* Toni Iafrate — anonymized */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="grid md:grid-cols-[auto_1fr] gap-0">
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
          </div>

          <p className="fade-in-scroll mt-6 text-center text-xs text-muted-foreground/70">
            Shared with permission. Company names redacted at customer request where noted.
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
                className="fade-in-scroll group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-7 transition-all hover:-translate-y-1 hover-shadow-floating-md"
              >
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                  style={{
                    backgroundColor: `${NEXTSILICON_INDIGO}1A`,
                    color: NEXTSILICON_INDIGO,
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
            Run a free ChatGPT visibility audit. Map high-intent prompts to
            mentions, citations, competitor recommendations, and the content
            gaps your team should fix next.
          </p>
          <div className="fade-in-scroll flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg" className="text-base px-8 py-6 h-auto">
              <a
                href={AUDIT_URL}
                onClick={() => trackAuditClick("customers")}
              >
                Run Free ChatGPT Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="hero-outline" size="lg" className="text-base px-8 py-6 h-auto">
              <a href={APP_PRICING_URL}>See pricing</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerStories;
