import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import LoopDiagram from "@/components/LoopDiagram";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import {
  CASE, CTA, FAQS, HERO, LOGOS, LOOP_CENTER, LOOP_STEPS, PRODUCTS, QUOTE, STATS, WORK,
  auditUrlFor, useDemoFonts,
} from "@/preview/content";
import { PreviewRibbon, usePreviewPage } from "@/preview/PreviewChrome";

/**
 * PREVIEW style E — "Bright platform". Reference: UiPath's agentic AI page
 * (ice-blue and white bands, pastel light strip, tight bold geometric sans,
 * square buttons, sticky in-page tabs, gradient accent bars, a dark pixel
 * mosaic band, big-number stat cards). SolCrys teal and violet replace
 * UiPath's orange so it reads as ours, not theirs.
 */
const C = {
  ink: "#0F1B2D",
  body: "#44546A",
  muted: "#6B7A8F",
  ice: "#EEF6FA",
  line: "#DCE6EE",
  teal: "#0A7C72",
  tealHover: "#086A61",
  link: "#1464D8",
  navy: "#16222F",
};

const scopedVars = {
  "--brand-accent-ink": "175 85% 26%",
  "--background": "0 0% 100%",
  "--foreground": "215 50% 12%",
  "--muted-foreground": "215 20% 35%",
} as CSSProperties;

const head = { fontFamily: "Poppins, Inter, system-ui, sans-serif" } as const;
const GRADIENT = "linear-gradient(90deg, #2ECFB3 0%, #7251DB 55%, #3B82F6 100%)";

const TABS = [
  { id: "products", label: "Products" },
  { id: "method", label: "Method" },
  { id: "work", label: "Work" },
  { id: "results", label: "Results" },
  { id: "faqs", label: "FAQs" },
];

const WORK_BULLETS: Record<string, string[]> = {
  "cornelis-homepage": [
    "AI-ready copy and design, grounded in Cornelis's Corporate Context.",
    "Built with the Cornelis marketing and web development teams.",
  ],
  "cornelis-acf-category": [
    "Headings and FAQs came from prompts where Cornelis had zero presence.",
    "The L200 layer of one story told at three depths.",
  ],
  "cornelis-booth-interactive": [
    "The L300 layer: the reference architecture, explained at the booth.",
    "Still live after the event, hosted by SolCrys.",
  ],
};

const Bar = ({ className = "" }: { className?: string }) => (
  <span className={`block h-[3px] w-10 rounded-full ${className}`} style={{ background: GRADIENT }} />
);

/** Deterministic pixel mosaic (UiPath-style), drawn with CSS grid. */
const Mosaic = ({ dark = false, cols = 28, rows = 8 }: { dark?: boolean; cols?: number; rows?: number }) => {
  const cells = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: cols * rows }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const r = rand();
      // Accent squares only in the bottom row, right side: below the content.
      const corner = row === rows - 1 && col > cols * 0.7;
      if (dark && corner && r > 0.45) return r > 0.75 ? "#2ECFB3" : "#7251DB";
      return dark ? `rgba(255,255,255,${(r * 0.06).toFixed(3)})` : `rgba(20,100,216,${(r * 0.07).toFixed(3)})`;
    });
  }, [dark, cols, rows]);
  return (
    <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }} aria-hidden="true">
      {cells.map((bg, i) => <span key={i} style={{ background: bg }} />)}
    </div>
  );
};

const QuoteButton = ({ label, surface }: { label: string; surface: "hero" | "home_products" | "cta_section" }) => (
  <EarlyAccessDialog mode="project" surface={surface}>
    <button type="button" className="inline-flex items-center gap-2 border-[1.5px] px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-white" style={{ ...head, borderColor: C.ink, color: C.ink }}>
      {label} <ArrowRight className="h-4 w-4" />
    </button>
  </EarlyAccessDialog>
);

const PrimaryButton = ({ href, label }: { href: string; label: string }) => (
  <a href={href} className="inline-flex items-center gap-2 px-5 py-3 text-[15px] font-semibold text-white transition-colors" style={{ ...head, background: C.teal }}>
    {label} <ArrowRight className="h-4 w-4" />
  </a>
);

const PreviewBright = () => {
  useDemoFonts("https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");
  usePreviewPage("Style E: Bright platform");
  const [active, setActive] = useState("products");
  const [filter, setFilter] = useState<"All" | "Sites" | "Motion">("All");
  const [statIndex, setStatIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    TABS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const work = WORK.filter((w) => filter === "All" || w.line === filter);

  return (
    <div className="demo-bright min-h-screen bg-white" style={{ ...scopedVars, color: C.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      <PreviewRibbon />
      <style>{`
        .demo-bright h1, .demo-bright h2, .demo-bright h3, .demo-bright .font-display { font-family: Poppins, Inter, sans-serif !important; letter-spacing: -0.02em; }
        .demo-bright svg .font-display { letter-spacing: 0; }
      `}</style>

      {/* Pastel light strip + announcement */}
      <a href={CASE.href} className="relative block overflow-hidden py-3 text-center text-[13px] font-medium" style={{ color: C.ink }}>
        <span className="absolute inset-0 opacity-70" style={{ background: "linear-gradient(90deg, #F7F7F7 5%, #CFF3F9 30%, #D9D2FF 55%, #FBE3F0 75%, #F7F7F7 95%)" }} />
        <span className="relative">New: SolCrys Sites and SolCrys Motion, launched with Cornelis at AI Infra Summit. <span style={{ color: C.link }}>See the story →</span></span>
      </a>

      {/* Header */}
      <header className="border-b bg-white" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-[1344px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-10">
            <a href="/preview/"><img src="/logo-light.png" alt="SolCrys" className="h-8 w-auto" /></a>
            <nav className="hidden gap-7 text-[15px] font-semibold lg:flex" style={head}>
              {["Products", "Work", "Customers", "Resources", "Company"].map((n) => <a key={n} href="#" className="hover:opacity-70">{n}</a>)}
            </nav>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold" style={head}>
            <a href="#" className="hidden sm:inline">Contact us</a>
            <a href="#" className="hidden sm:inline">Log in</a>
            <a href={auditUrlFor("")} className="px-4 py-2.5 text-white" style={{ background: C.teal }}>Start Free</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.ice} 0%, #F8FBFD 70%, #FFFFFF 100%)` }}>
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-24 text-center">
          <p className="mb-5 text-[15px] font-semibold uppercase tracking-[0.04em]" style={{ ...head, color: C.muted }}>{HERO.eyebrow}</p>
          <h1 className="text-[2.8rem] font-bold leading-[1.05] tracking-[-0.035em] md:text-[4.2rem]">
            {HERO.lead} {HERO.highlight} {HERO.tail}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: C.body }}>{HERO.sub}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <PrimaryButton href={auditUrlFor("")} label="Start Free" />
            <QuoteButton label="Start a project" surface="hero" />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-12 opacity-70 grayscale">
          {LOGOS.map((l) => <img key={l.label} src={l.src} alt={l.label} className={`h-6 w-auto ${l.onLight ?? ""}`} />)}
        </div>
      </section>

      {/* Sticky in-page tabs */}
      <nav className="sticky top-0 z-30 border-y bg-white/95 backdrop-blur" style={{ borderColor: C.line }}>
        <div className="mx-auto grid max-w-[1344px] grid-cols-5 px-6">
          {TABS.map((t) => {
            const on = active === t.id;
            return (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="relative py-4 text-center text-[15px] font-semibold transition-colors md:text-[17px]"
                style={{ ...head, color: on ? C.ink : "#8A97A8", background: on ? `linear-gradient(180deg, ${C.ice}, #FFFFFF)` : "transparent" }}
              >
                {on ? <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: C.ink }} /> : null}
                {t.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Products: heading left, 2x2 features right */}
      <section id="products" className="scroll-mt-16" style={{ background: C.ice }}>
        <div className="mx-auto grid max-w-[1200px] gap-14 px-6 py-24 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-[2.2rem] font-bold leading-[1.1] md:text-[2.6rem]">One story, told everywhere your buyers look.</h2>
            <p className="mt-5 text-[16px] leading-relaxed" style={{ color: C.body }}>
              Buyers ask ChatGPT, read your website and stop by your booth. Every SolCrys product starts from the same approved facts, so each stop tells the same story.
            </p>
            <div className="mt-8"><QuoteButton label="Talk to us" surface="home_products" /></div>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 md:col-span-7">
            {PRODUCTS.map((p) => (
              <div key={p.key}>
                <Bar className="mb-4" />
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: C.teal }}>{p.name}</p>
                <h3 className="mb-2 text-xl font-semibold">{p.promise}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: C.body }}>{p.body}</p>
                <p className="mt-3 text-sm font-medium" style={{ color: C.muted }}>{p.meta}</p>
              </div>
            ))}
            <div>
              <Bar className="mb-4" />
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: C.teal }}>Corporate Context</p>
              <h3 className="mb-2 text-xl font-semibold">Built on what is true.</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: C.body }}>Your approved facts, claims and proof, kept current, so nothing we make drifts from what is true.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Method: centered heading + original Loop ring */}
      <section id="method" className="scroll-mt-16 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <div className="text-center">
            <Bar className="mx-auto mb-8 w-20" />
            <h2 className="mx-auto max-w-3xl text-[2.2rem] font-bold leading-[1.1] md:text-[2.6rem]">Measure, diagnose, execute, then verify what changed.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px]" style={{ color: C.body }}>The same method runs every project, from an AI answer to a booth demo.</p>
          </div>
          <LoopDiagram steps={LOOP_STEPS} centerLines={LOOP_CENTER} footnote={null} />
        </div>
      </section>

      {/* Work: filter pills + split rows */}
      <section id="work" className="scroll-mt-16" style={{ background: C.ice }}>
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <div className="mb-14 flex flex-col items-center gap-6 text-center">
            <Bar className="w-20" />
            <h2 className="text-[2.2rem] font-bold leading-[1.1] md:text-[2.6rem]">Selected work</h2>
            <div className="flex gap-2">
              {(["All", "Sites", "Motion"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors"
                  style={{ ...head, borderColor: filter === f ? C.ink : C.line, background: filter === f ? C.ink : "#FFFFFF", color: filter === f ? "#FFFFFF" : C.ink }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-20">
            {work.map((w, i) => (
              <div key={w.id} className="grid items-center gap-10 md:grid-cols-2">
                <div className={i % 2 ? "md:order-2" : ""}>
                  <Bar className="mb-5" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: C.teal }}>SolCrys {w.line} · {w.client}</p>
                  <h3 className="mb-4 text-[1.7rem] font-semibold leading-tight">{w.title}</h3>
                  <p className="mb-5 text-[15px] leading-relaxed" style={{ color: C.body }}>{w.summary}</p>
                  <ul className="mb-6 grid gap-2">
                    {(WORK_BULLETS[w.id] ?? []).map((b) => (
                      <li key={b} className="flex gap-3 text-[15px]" style={{ color: C.body }}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.link }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a href={w.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-semibold" style={{ ...head, color: C.link }}>
                    View it live <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <a href={w.href} target="_blank" rel="noopener noreferrer" className={`block overflow-hidden border bg-white shadow-[0_24px_60px_-30px_rgba(15,27,45,0.35)] ${i % 2 ? "md:order-1" : ""}`} style={{ borderColor: C.line }}>
                  <img src={w.image} alt={w.title} className="aspect-[4/3] w-full object-cover object-top" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results: dark mosaic band with quote + stat carousel */}
      <section id="results" className="relative scroll-mt-16 overflow-hidden" style={{ background: C.navy, color: "#FFFFFF" }}>
        <Mosaic dark />
        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 pb-36 pt-24 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "#7FE3D2" }}>{CASE.kicker}</p>
            <h2 className="text-[2.2rem] font-bold leading-[1.1] md:text-[2.6rem]">{CASE.title}</h2>
            <blockquote className="mt-8 border-l-2 pl-5 text-[17px] leading-relaxed text-white/85" style={{ borderColor: "#2ECFB3" }}>
              “{QUOTE.text}”
              <footer className="mt-4 flex items-center gap-3 text-sm text-white/60">
                <img src={QUOTE.photo} alt={QUOTE.name} className="h-10 w-10 rounded-full object-cover" />
                {QUOTE.name}, {QUOTE.role}
              </footer>
            </blockquote>
            <a href={CASE.href} className="mt-8 inline-flex items-center gap-1.5 text-[15px] font-semibold" style={{ ...head, color: "#7FB6FF" }}>
              Read the case study <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="md:col-span-6">
            <div className="relative overflow-hidden bg-[#EAF2F7] px-8 py-14 text-center" style={{ color: C.ink }}>
              <Mosaic cols={16} rows={6} />
              <div className="relative">
                <div className="flex items-center justify-center gap-5">
                  <span className="h-px w-16" style={{ background: "#A9B8C6" }} />
                  <p className="text-6xl font-bold tracking-[-0.03em] md:text-7xl" style={head}>{STATS[statIndex].value}</p>
                  <span className="h-px w-16" style={{ background: "#A9B8C6" }} />
                </div>
                <p className="mt-4 text-[17px] font-semibold" style={head}>{STATS[statIndex].label}</p>
                <p className="mt-1 text-[15px]" style={{ color: C.body }}>{STATS[statIndex].note}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm font-semibold" style={head}>
                <span>0{statIndex + 1}</span>
                <span className="relative h-[2px] w-24 bg-white/20">
                  <span className="absolute inset-y-0 left-0 bg-white" style={{ width: `${((statIndex + 1) / STATS.length) * 100}%` }} />
                </span>
                <span className="text-white/60">0{STATS.length}</span>
              </div>
              <div className="flex gap-3">
                {[-1, 1].map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-label={d < 0 ? "Previous result" : "Next result"}
                    onClick={() => setStatIndex((statIndex + d + STATS.length) % STATS.length)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
                  >
                    {d < 0 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs accordion */}
      <section id="faqs" className="scroll-mt-16 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <div className="mb-10 text-center">
            <Bar className="mx-auto mb-8 w-20" />
            <h2 className="text-[2.2rem] font-bold md:text-[2.6rem]">FAQs</h2>
          </div>
          <div className="border-t" style={{ borderColor: C.line }}>
            {FAQS.map((f, i) => (
              <div key={f.question} className="border-b" style={{ borderColor: C.line }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold"
                  style={head}
                  aria-expanded={openFaq === i}
                >
                  {f.question}
                  <Plus className={`h-5 w-5 shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`} />
                </button>
                {openFaq === i ? <p className="pb-6 text-[15px] leading-relaxed" style={{ color: C.body }}>{f.answer}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.ice}, #FFFFFF)` }}>
        <span className="absolute inset-x-0 top-0 h-2" style={{ background: "linear-gradient(90deg, #CFF3F9, #D9D2FF, #FBE3F0)" }} />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-[2.4rem] font-bold leading-[1.1] md:text-[3rem]">{CTA.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: C.body }}>{CTA.body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <PrimaryButton href={auditUrlFor("")} label="Start Free" />
            <QuoteButton label="Start a project" surface="cta_section" />
          </div>
        </div>
      </section>

      <footer style={{ background: C.navy, color: "rgba(255,255,255,0.7)" }}>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm">
          <img src="/logo-dark.png" alt="SolCrys" className="h-7 w-auto" />
          <span>Your brand, AI ready.</span>
          <span>© 2026 SolCrys</span>
        </div>
      </footer>
    </div>
  );
};

export default PreviewBright;
