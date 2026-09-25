import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { LOGO_MONO } from "@/components/customerLogos";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Target,
  SearchX,
  FileText,
  LineChart,
  Layers,
} from "lucide-react";

const CORNELIS_PURPLE = "#9B23E8";

const LINKEDIN_BRANDON = "https://www.linkedin.com/in/brandondraeger/";
const CORNELIS_URL = "https://www.cornelis.com/";
const CORNELIS_ACF_URL = "https://www.cornelis.com/technology/active-compute-fabric";
/** The interactive built for the Cornelis booth, hosted by SolCrys. The inner
 *  frame is embedded directly so the demo's own page chrome isn't nested here.
 *  It is authored portrait (9:16) for the show-floor kiosk. */
const CORNELIS_DEMO_URL =
  "https://cms.solcrys.com/cornelis/technology/active-compute-fabric/demo";
const CORNELIS_DEMO_EMBED_URL =
  "https://cms.solcrys.com/cornelis/assets/active-compute-fabric-demo/interactive/index.html";

const primaryQuote =
  "The world needs Active Compute Fabric to unlock more innovation and meet the demands of AI infrastructure. When work that would otherwise stall the GPU runs inside the fabric, customers get far more out of the accelerators they already own. SolCrys AI took a deeply technical concept and turned it into real content mapped to different technical levels, and measured the effectiveness of every piece they produced.";

const secondaryQuotes = [
  {
    quote:
      "I have worked with many web tools and agencies. SolCrys revamped our web experience in a remarkably short period of time, to a very high bar. I cannot think of a better product launch partner.",
    name: "Ina Felsheim",
    role: "Senior Director of Marketing, Cornelis Networks",
    photo: "/customers/ina-felsheim.jpg",
  },
  {
    quote:
      "The interactive demo turned our reference architecture into something a visitor could grasp in two minutes at the booth. SolCrys understood the technology well enough to explain it the way our own engineers would.",
    name: "Nishant Lodha",
    role: "Senior Director of Marketing, Cornelis Networks",
    photo: "/customers/nishant-lodha.jpg",
  },
];

const problemRequirements = [
  {
    title: "Prompt set design",
    body: "The questions buyers would actually ask about the new category.",
  },
  {
    title: "Content on the web",
    body:
      "A redone homepage to reintroduce Cornelis to customers, plus a category page and supporting pages the engines could read, extract, and quote in Cornelis's own words.",
  },
  {
    title: "Content on the show floor",
    body:
      "Booth assets carrying the same message, so it landed virtually and in person alike.",
  },
];

const solutionSteps = [
  {
    Icon: Target,
    title: "Measure visibility",
    body:
      "A baseline measurement and prompt sets designed with the SolCrys AI Golden Prompt Set methodology. The prompt sets were built hand in hand with Cornelis's messaging and positioning, so SolCrys tracks the prompts that reflect customer voices.",
  },
  {
    Icon: SearchX,
    title: "Diagnose gaps",
    body:
      "Prompts where Cornelis measured zero presence became the FAQ questions and the headings on the new category page and its supporting pages.",
  },
  {
    Icon: FileText,
    title: "Activate the right actions",
    body:
      "One new category page, a redone homepage as well as a product page, and show floor assets, all grounded in the Cornelis Corporate Context managed by SolCrys AI. SolCrys partnered closely with the Cornelis marketing and web development teams by delivering AI-ready copy as well as design.",
  },
  {
    Icon: LineChart,
    title: "Verify impact",
    body:
      "The same prompt sets re-run against the baseline, so Cornelis could see the impact of the moment, and of every asset created for it.",
  },
  {
    Icon: Layers,
    title: "Map assets to depth",
    body:
      "One story told at three depths: L100–L200 on the homepage, L200 on the category page, and L300 in the reference architecture, explained through an interactive demo video at the booth, so a buyer could go as deep as they wanted without the message changing.",
  },
];

const highlightShots = [
  {
    src: "/customers/cornelis/shot-0.jpg",
    label: "The redone Cornelis homepage",
    href: CORNELIS_URL,
  },
  {
    src: "/customers/cornelis/shot-1.jpg",
    label: "Active Compute Fabric category page",
    href: CORNELIS_ACF_URL,
  },
];

const CornelisCaseStudy = () => {
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
              background: `radial-gradient(circle at 50% 0%, ${CORNELIS_PURPLE}22, transparent 60%)`,
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
              style={{ color: CORNELIS_PURPLE }}
            >
              Case Study · AI &amp; HPC Networking
            </p>
            <h1 className="fade-in-scroll font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              How Cornelis made a brand-new category answerable — in four weeks.
            </h1>
            <p className="fade-in-scroll mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              Cornelis named a new networking architecture and planned to unveil
              it at the AI Infra Summit. SolCrys made the term answerable on the
              web, in AI answers, and on the show floor — in Cornelis's own
              words.
            </p>
          </div>
        </section>

        {/* Metric pull-out */}
        <section className="max-w-5xl mx-auto px-6 mb-16 md:mb-20">
          <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${CORNELIS_PURPLE}, transparent)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                background: `radial-gradient(circle at 80% 50%, ${CORNELIS_PURPLE}, transparent 55%)`,
              }}
            />

            <div className="relative grid md:grid-cols-3 gap-0">
              <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-border/40">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  AI-readiness score
                </p>
                <p
                  className="font-heading text-5xl md:text-6xl font-bold"
                  style={{ color: CORNELIS_PURPLE }}
                >
                  2×
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  On the marquee product page.
                </p>
              </div>

              <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-border/40">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Mention rate
                </p>
                <p
                  className="font-heading text-5xl md:text-6xl font-bold"
                  style={{ color: CORNELIS_PURPLE }}
                >
                  12×
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  On the new category prompt set.
                </p>
              </div>

              <div className="p-8 md:p-10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Share of voice
                </p>
                <p
                  className="font-heading text-5xl md:text-6xl font-bold"
                  style={{ color: CORNELIS_PURPLE }}
                >
                  #2
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Unseating the incumbent #2.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* Meet the customer */}
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="fade-in-scroll grid md:grid-cols-2 gap-0 rounded-3xl border border-border/40 overflow-hidden">
            <div className="relative min-h-[300px] md:min-h-[420px] bg-muted/30">
              <img
                src="/customers/cornelis/hero.jpg"
                alt="Cornelis Active Compute Fabric brand visual"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-5 left-5 rounded-xl bg-background/95 px-5 py-3 backdrop-blur-sm">
                <img
                  src="/customers/cornelis-logo.png"
                  alt="Cornelis"
                  className={`h-8 w-auto ${LOGO_MONO}`}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="p-8 md:p-12 bg-card/40">
              <p className="section-label mb-3">Meet the customer</p>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-5">
                Cornelis
              </h2>
              <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
                <p>
                  Cornelis delivers high-performance, scale-out and scale-up
                  networking solutions that accelerate AI and HPC workloads.
                  Cornelis technology enables lossless, congestion-free
                  networking that reduces training time, improves inference, and
                  maximizes compute utilization.
                </p>
                <p>
                  From foundation model training to complex climate modeling and
                  real-time analytics, Cornelis solutions power the most
                  demanding workloads across commercial, academic, government,
                  and cloud environments.
                </p>
                <p>
                  With a focus on performance, scalability, and efficiency,
                  Cornelis helps organizations achieve faster insights and
                  greater return on infrastructure investments.
                </p>
              </div>
              <a
                href={CORNELIS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: CORNELIS_PURPLE }}
              >
                Learn more at cornelis.com
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* The problem */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <p className="fade-in-scroll section-label mb-3">The problem</p>
          <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
            A category they named, in a term the engines had never heard.
          </h2>
          <div className="fade-in-scroll space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              Cornelis set out to introduce a new architecture built to address a
              challenge facing the entire industry, and planned to unveil it at
              the AI Infra Summit.
            </p>
            <p>
              Landing that message on the web, in AI answers, and in person meant
              getting three things right before the show:
            </p>
          </div>

          <ul className="fade-in-scroll mt-7 space-y-4">
            {problemRequirements.map(({ title, body }) => (
              <li key={title} className="flex gap-3.5">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CORNELIS_PURPLE }}
                />
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  <strong className="text-foreground">{title}.</strong> {body}
                </p>
              </li>
            ))}
          </ul>

          <p className="fade-in-scroll mt-7 text-muted-foreground text-base md:text-lg leading-relaxed">
            For a term nobody had published yet, no material existed. Cornelis
            needed a partner that could translate deep technical concepts into
            content people could readily understand, and meet customers at the
            right time, with the right message, in the right format.
          </p>

          <blockquote
            className="fade-in-scroll mt-10 rounded-r-2xl border-l-[3px] bg-card/50 px-6 py-5"
            style={{ borderColor: CORNELIS_PURPLE }}
          >
            <p className="font-heading text-lg md:text-xl text-foreground leading-snug">
              The challenge: make a brand-new category answerable, in the
              company's own words.
            </p>
          </blockquote>
        </section>

        <div className="glow-line w-full" />

        {/* The SolCrys solution */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-12">
            <p className="fade-in-scroll section-label mb-3">The SolCrys solution</p>
            <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
              From insight to execution.
            </h2>
            <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
              SolCrys measured the baseline before a word was drafted, diagnosed
              which dimension of AI-readiness was actually broken, and shipped
              five deliverables in four weeks. Each piece of content mapped to a
              step in the buyer's journey across the web, the AI engines, and the
              show floor, so the same message met them wherever they looked.
            </p>
          </div>

          <ol className="space-y-px">
            {solutionSteps.map(({ Icon, title, body }, i) => (
              <li
                key={title}
                className="fade-in-scroll flex flex-col gap-4 border-t border-border/40 py-7 sm:flex-row sm:gap-7 last:border-b"
              >
                <div className="flex shrink-0 items-center gap-4 sm:w-28">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${CORNELIS_PURPLE}1A`,
                      color: CORNELIS_PURPLE,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className="font-heading text-sm font-semibold tabular-nums"
                    style={{ color: CORNELIS_PURPLE }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="glow-line w-full" />

        {/* The outcome */}
        <section className="relative py-20 md:py-28">
          <div
            className="absolute inset-x-0 top-0 h-72 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${CORNELIS_PURPLE}14, transparent 60%)`,
            }}
          />
          <div className="container mx-auto px-6 max-w-6xl relative">
            <div className="max-w-3xl mb-10">
              <p className="fade-in-scroll section-label mb-3">The outcome</p>
              <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-5">
                A stronger presence, and a repeatable way forward.
              </h2>
              <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
                In four weeks, overall AI mention rate rose nearly seven
                percentage points, the new category prompt set moved twelvefold,
                and Cornelis took second place in share of voice for the first
                time.
              </p>
            </div>

            {/* Primary testimonial — Brandon Draeger */}
            <article className="fade-in-scroll relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${CORNELIS_PURPLE}, transparent)`,
                }}
              />

              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-0">
                <div className="relative bg-muted/30 overflow-hidden min-h-[360px] md:min-h-[520px]">
                  <img
                    src="/customers/brandon-draeger.jpg"
                    alt="Brandon Draeger, Chief Marketing Officer at Cornelis Networks"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white"
                      style={{ backgroundColor: CORNELIS_PURPLE }}
                    >
                      CMO
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-7xl md:text-8xl leading-none mb-2 select-none"
                    style={{ color: CORNELIS_PURPLE, opacity: 0.5 }}
                  >
                    “
                  </div>

                  <blockquote className="font-heading text-xl md:text-2xl lg:text-[1.55rem] leading-snug md:leading-[1.35] text-foreground">
                    {primaryQuote}
                  </blockquote>

                  <figcaption className="mt-8 pt-6 border-t border-border/40 flex items-center gap-4">
                    <div
                      className="h-10 w-1 rounded-full"
                      style={{ backgroundColor: CORNELIS_PURPLE }}
                    />
                    <div>
                      <p className="font-heading text-base font-semibold text-foreground">
                        Brandon Draeger
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Chief Marketing Officer, Cornelis Networks
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

            {/* Secondary testimonials */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {secondaryQuotes.map(({ quote, name, role, photo }) => (
                <article
                  key={name}
                  className="fade-in-scroll rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm p-8 md:p-10"
                >
                  <div
                    aria-hidden
                    className="font-heading text-5xl leading-none mb-1 select-none"
                    style={{ color: CORNELIS_PURPLE, opacity: 0.45 }}
                  >
                    “
                  </div>
                  <blockquote className="font-heading text-lg md:text-xl leading-snug md:leading-[1.4] text-foreground">
                    {quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3.5">
                    <img
                      src={photo}
                      alt={`${name}, ${role}`}
                      className="h-11 w-11 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-heading text-sm font-semibold text-foreground">
                        {name}
                      </p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                  </figcaption>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line w-full" />

        {/* Solution highlight */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="fade-in-scroll flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div className="max-w-2xl">
              <p className="section-label mb-3">Solution highlight</p>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-4">
                Active Compute Fabric
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                The homepage, the category page, the reference architecture, and
                the show floor demo, all saying the same thing.
              </p>
            </div>
            <div className="shrink-0 md:text-right">
              <p className="text-sm text-muted-foreground mb-2">
                Cornelis networking for AI and HPC workloads
              </p>
              <a
                href={CORNELIS_ACF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: CORNELIS_PURPLE }}
              >
                Explore the technology
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {highlightShots.map(({ src, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="fade-in-scroll group block overflow-hidden rounded-2xl border border-border/40 bg-card/40 transition-colors hover:border-border"
              >
                <img
                  src={src}
                  alt={label}
                  className="aspect-[4/3] w-full object-cover object-top"
                  loading="lazy"
                />
                <span className="flex items-center justify-between gap-3 border-t border-border/40 px-5 py-3.5 text-sm text-muted-foreground">
                  {label}
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
                </span>
              </a>
            ))}
          </div>

          {/* The booth interactive, running live */}
          <div className="mt-6 grid items-center gap-8 rounded-2xl border border-border/40 bg-card/40 p-6 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-12 md:p-10">
            <div className="fade-in-scroll mx-auto w-full max-w-[320px]">
              <div
                className="overflow-hidden rounded-2xl border border-border/40"
                style={{ aspectRatio: "9 / 16", backgroundColor: "#03050c" }}
              >
                <iframe
                  src={CORNELIS_DEMO_EMBED_URL}
                  title="Cornelis reference architecture — interactive demo"
                  loading="lazy"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            </div>

            <div className="fade-in-scroll">
              <p className="section-label mb-3">Live from the show floor</p>
              <h3 className="font-heading text-xl md:text-2xl text-foreground mb-4">
                The reference architecture, explained in two minutes.
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                This is the L300 layer of the same story — the interactive that
                ran at the Cornelis booth, built to take a visitor from the
                whole fabric down to a single node without the message
                changing. It is running here exactly as it ran at the summit.
              </p>
              <a
                href={CORNELIS_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: CORNELIS_PURPLE }}
              >
                Open the full demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
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
            Run a free AI visibility audit. Map high-intent prompts to mentions,
            citations, answer accuracy, and the content gaps your team should fix
            next.
          </p>
          <div className="fade-in-scroll flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg" className="text-base px-8 py-6 h-auto">
              <a
                href={AUDIT_URL}
                onClick={() => trackAuditClick("customers-cornelis")}
              >
                Start Free
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

export default CornelisCaseStudy;
