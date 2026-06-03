import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Target,
  FileText,
  Code2,
  Network,
  Workflow,
} from "lucide-react";

const NEXTSILICON_INDIGO = "#5700FF";

const LINKEDIN_BRANDON = "https://www.linkedin.com/in/brandondraeger/";

const primaryQuote =
  "For the first time, we have clear, system-level visibility into marketing performance — paired with a platform that continuously optimizes it. The upside is significant. SolCrys is informing how we think about marketing performance in a number of areas — we're already using it to inform content strategy across product launches, campaigns, and major events.";

const scienceQuote =
  "Every time we meet, SolCrys shares insights that surprise me. I'm approached by vendors all the time, but none of them treat this as a science the way SolCrys does. The guardrails and scoring frameworks they've built into the product, along with the level of insight — from citation analysis to prompt diagnosis and content gap identification — are exceptional. It's exactly what we've been looking for.";

const approachPillars = [
  {
    Icon: Target,
    title: "Prompt building",
    body:
      "Prompt sets developed across answer engines to measure prompt-level AI visibility, citation share, sentiment, and recommendation rate.",
  },
  {
    Icon: FileText,
    title: "Content optimization",
    body:
      "Auditing webpages, identifying topic clusters, strengthening factual density, refining comparison framing, and recommending high-impact claims.",
  },
  {
    Icon: Code2,
    title: "Metadata intelligence",
    body:
      "Schema, structured data, and AI-engine-optimized descriptions applied and validated at scale across the site.",
  },
  {
    Icon: Network,
    title: "Authority mapping",
    body:
      "High-value citation sources and PR opportunities pinpointed and aligned to category relevance.",
  },
  {
    Icon: Workflow,
    title: "Deep analysis & workflows",
    body:
      "Visibility gaps analyzed, next-best actions ranked by priority and effort, then routed to the Actions page where teams assign owners, set due dates, collaborate cross-functionally, and track progress through completion.",
  },
];

const NextSiliconCaseStudy = () => {
  const containerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main ref={containerRef} className="text-foreground overflow-x-hidden pt-16">
        {/* Hero */}
        <section className="relative pt-20 pb-12 md:pt-28 md:pb-16">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-96 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${NEXTSILICON_INDIGO}22, transparent 60%)`,
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <div className="mb-6">
              <a
                href="/customers/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                All customer stories
              </a>
            </div>

            <p
              className="fade-in-scroll text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: NEXTSILICON_INDIGO }}
            >
              Case Study · High-Performance Computing &amp; AI
            </p>
            <h1 className="fade-in-scroll font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              How NextSilicon quadrupled its share of voice in HPC &amp; AI — in 45 days.
            </h1>
            <p className="fade-in-scroll mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              A challenger in one of tech's most crowded categories used SolCrys
              to close the visibility gap with incumbents.
            </p>
          </div>
        </section>

        {/* Metric pull-out */}
        <section className="max-w-5xl mx-auto px-6 mb-16 md:mb-20">
          <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
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
        </section>

        {/* The Customer */}
        <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <p className="fade-in-scroll section-label mb-3">The customer</p>
          <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
            NextSilicon — high-performance computing pioneer.
          </h2>
          <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
            NextSilicon is a high-performance computing pioneer competing in one
            of the most technically demanding markets in technology. The
            company goes head-to-head with deeply entrenched incumbents and
            well-funded challengers across HPC and AI infrastructure — a
            category where buyers are highly technical and evaluation cycles
            are long.
          </p>
        </section>

        <div className="glow-line w-full" />

        {/* The Challenge */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <p className="fade-in-scroll section-label mb-3">The challenge</p>
          <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
            A 1.9% mention rate in a category dominated by established names.
          </h2>
          <div className="fade-in-scroll space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              In a category dominated by established names, NextSilicon's share
              of voice was lagging. Their mention rate — the frequency with
              which the company appeared in AI-generated answers about HPC and
              AI infrastructure — sat at just{" "}
              <strong className="text-foreground">1.9%</strong>. For a business
              whose buyers increasingly rely on AI assistants to research
              vendors, build shortlists, and validate claims, that was a
              serious gap.
            </p>
            <p>
              The marketing team needed to understand exactly where they were
              losing ground, why competitors were being surfaced more often,
              and which specific moves would shift AI-generated answers in
              their favor.
            </p>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* The SolCrys Approach */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-12">
            <p className="fade-in-scroll section-label mb-3">The SolCrys approach</p>
            <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
              A continuously updated optimization roadmap.
            </h2>
            <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
              NextSilicon onboarded to SolCrys in March 2026. Within days,
              SolCrys completed a full audit of their content, benchmarked
              their performance against key competitors, and surfaced critical
              gaps impacting their visibility. From there, the platform
              generated a continuously updated optimization roadmap:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approachPillars.map(({ Icon, title, body }) => (
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
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <p className="fade-in-scroll mt-12 max-w-3xl text-muted-foreground text-base md:text-lg leading-relaxed">
            Rather than a one-time engagement, SolCrys operates as a
            self-improving operating system — continuously analyzing,
            prioritizing, and optimizing AI performance over time.
          </p>
        </section>

        <div className="glow-line w-full" />

        {/* The Results */}
        <section className="relative py-20 md:py-28">
          <div
            className="absolute inset-x-0 top-0 h-72 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${NEXTSILICON_INDIGO}14, transparent 60%)`,
            }}
          />
          <div className="container mx-auto px-6 max-w-6xl relative">
            <div className="max-w-3xl mb-10">
              <p className="fade-in-scroll section-label mb-3">The results</p>
              <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
                Mention rate 1.9% → 7.4% — a near 4× lift, in 45 days.
              </h2>
              <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
                Within 45 days, NextSilicon's mention rate climbed from 1.9% to
                7.4% — a near 4× increase in a category where incumbents have
                spent years building authority. The gains compounded as new
                content shipped and existing content was re-optimized against
                SolCrys' scoring framework, giving the team a measurable,
                repeatable engine rather than a one-off lift.
              </p>
            </div>

            {/* Primary testimonial — Brandon Draeger */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${NEXTSILICON_INDIGO}, transparent)`,
                }}
              />

              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-0">
                <div className="relative bg-muted/30 overflow-hidden min-h-[360px] md:min-h-[520px]">
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

                <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-7xl md:text-8xl leading-none mb-2 select-none"
                    style={{ color: NEXTSILICON_INDIGO, opacity: 0.5 }}
                  >
                    “
                  </div>

                  <blockquote className="font-heading text-xl md:text-2xl lg:text-[1.55rem] leading-snug md:leading-[1.35] text-foreground">
                    {primaryQuote}
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
                      <a
                        href={LINKEDIN_BRANDON}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Brandon Draeger on LinkedIn"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </figcaption>
                </div>
              </div>
            </article>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* Why It Worked */}
        <section className="max-w-4xl mx-auto px-6 py-20 md:py-24">
          <p className="fade-in-scroll section-label mb-3">Why it worked</p>
          <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
            A system, not a one-off effort.
          </h2>
          <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
            NextSilicon's results came from a continuous loop of measurement,
            diagnosis, execution, and verification. That loop is at the core
            of the SolCrys platform, transforming AEO from guesswork into a
            structured, measurable discipline.
          </p>

          {/* Science quote callout */}
          <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
            <div className="p-8 md:p-12">
              <div
                aria-hidden
                className="font-heading text-5xl md:text-6xl leading-none mb-1 select-none"
                style={{ color: NEXTSILICON_INDIGO, opacity: 0.45 }}
              >
                “
              </div>
              <blockquote className="font-heading text-lg md:text-xl lg:text-2xl leading-snug md:leading-[1.4] text-foreground">
                {scienceQuote}
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">
                — Brandon Draeger, VP of Marketing, NextSilicon
              </figcaption>
            </div>
          </article>
        </section>

        <div className="glow-line w-full" />

        {/* About SolCrys */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <p className="fade-in-scroll section-label mb-3">About SolCrys AI</p>
          <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
            SolCrys helps brands improve visibility and compete in high-stakes
            categories. We help marketing organizations measure how often they
            appear in AI-generated answers, understand why, and systematically
            close the gap with competitors.
          </p>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="fade-in-scroll section-label mb-4">Get started</p>
          <h2 className="fade-in-scroll font-heading text-3xl md:text-4xl text-foreground mb-5">
            See where your brand shows up — and where it doesn't.
          </h2>
          <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Run a free AI visibility audit. Map high-intent prompts to
            mentions, citations, answer accuracy, and the content gaps your team
            should fix next.
          </p>
          <div className="fade-in-scroll flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg" className="text-base px-8 py-6 h-auto">
              <a
                href={AUDIT_URL}
                onClick={() => trackAuditClick("customers-nextsilicon")}
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="hero-outline" size="lg" className="text-base px-8 py-6 h-auto">
              <a href="/customers/">More customer stories</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NextSiliconCaseStudy;
