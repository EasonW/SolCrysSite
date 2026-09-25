import { useState, type CSSProperties } from "react";
import LoopDiagram from "@/components/LoopDiagram";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import {
  CASE, CTA, HERO, LOGOS, LOOP_CENTER, LOOP_STEPS, NAV, PRODUCTS, QUOTE, STATS, WORK,
  auditUrlFor, useDemoFonts,
} from "@/preview/content";
import { PreviewRibbon, usePreviewPage } from "@/preview/PreviewChrome";

/**
 * PREVIEW style C — "Technical / lab". Reference: Factory (light gray field,
 * uppercase grotesk headline, monospace labels, bracketed buttons, visible
 * grid). Reads as a measurement lab, which is the "scientific method" story.
 */
const C = {
  field: "#EFEFEC",
  panel: "#F7F7F5",
  ink: "#111111",
  muted: "#6E6E69",
  line: "#D6D6D1",
  accent: "#00897B",
};

const scopedVars = {
  "--brand-accent-ink": "174 100% 27%",
  "--background": "60 9% 96%",
  "--foreground": "0 0% 7%",
  "--muted-foreground": "60 2% 42%",
} as CSSProperties;

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" } as const;
const grot = { fontFamily: "'Inter Tight', Inter, system-ui, sans-serif" } as const;

const Bracket = ({ children, solid = false, onClick, href }: { children: string; solid?: boolean; onClick?: () => void; href?: string }) => {
  const cls = "inline-flex items-center justify-center border px-5 py-3 text-[13px] uppercase tracking-[0.08em] transition-colors";
  const style = solid
    ? { ...mono, background: C.ink, color: C.field, borderColor: C.ink }
    : { ...mono, background: "transparent", color: C.ink, borderColor: C.ink };
  return href ? (
    <a href={href} className={cls} style={style}>[ {children} ]</a>
  ) : (
    <button type="button" onClick={onClick} className={cls} style={style}>[ {children} ]</button>
  );
};

const Label = ({ children }: { children: string }) => (
  <p className="mb-6 text-[12px] uppercase tracking-[0.14em]" style={{ ...mono, color: C.muted }}>{children}</p>
);

const PreviewTechnical = () => {
  usePreviewPage("Style C · Technical lab");
  useDemoFonts(
    "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap",
  );
  const [domain, setDomain] = useState("");

  return (
    <div
      className="demo-technical min-h-screen"
      style={{
        ...scopedVars,
        background: C.field,
        color: C.ink,
        fontFamily: "Inter, system-ui, sans-serif",
        backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    >
      <PreviewRibbon />
      <style>{`
        .demo-technical .font-display { font-family: 'Inter Tight', Inter, sans-serif; text-transform: uppercase; letter-spacing: 0.02em; }
        .demo-technical .font-body, .demo-technical span.block { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ borderColor: C.line, background: `${C.field}E6` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/preview/"><img src="/logo-light.png" alt="SolCrys" className="h-7 w-auto" /></a>
          <nav className="hidden gap-8 text-[13px] uppercase tracking-[0.08em] lg:flex" style={{ ...mono, color: C.muted }}>
            {NAV.map((n) => <a key={n} href="#" className="hover:text-black">{n}</a>)}
          </nav>
          <div className="flex gap-2">
            <Bracket href="#">Log in</Bracket>
            <Bracket solid href={auditUrlFor("")}>Start free</Bracket>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-24 text-center">
        <p className="mb-8 text-[13px] uppercase tracking-[0.2em]" style={{ ...mono, color: C.accent }}>
          ● {HERO.eyebrow}
        </p>
        <h1 className="mx-auto max-w-5xl text-[3rem] font-semibold uppercase leading-[0.95] tracking-[-0.02em] md:text-[5.6rem]" style={grot}>
          {HERO.lead} {HERO.highlight} {HERO.tail}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-[15px] uppercase leading-relaxed tracking-[0.04em]" style={{ ...mono, color: C.muted }}>
          {HERO.sub}
        </p>
        <form
          className="mx-auto mt-10 flex max-w-xl border"
          style={{ borderColor: C.ink, background: C.panel }}
          onSubmit={(e) => { e.preventDefault(); window.location.href = auditUrlFor(domain); }}
        >
          <span className="flex items-center pl-4 text-[13px]" style={{ ...mono, color: C.muted }}>https://</span>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourcompany.com"
            aria-label="Your website"
            className="min-w-0 flex-1 bg-transparent px-2 py-3.5 text-[14px] outline-none"
            style={mono}
          />
          <button type="submit" className="px-5 text-[13px] uppercase tracking-[0.08em]" style={{ ...mono, background: C.ink, color: C.field }}>
            [ Start free ]
          </button>
        </form>
        <div className="mt-4">
          <EarlyAccessDialog mode="project" surface="hero">
            <button type="button" className="text-[13px] uppercase tracking-[0.08em] underline underline-offset-4" style={{ ...mono, color: C.ink }}>
              Or start a project →
            </button>
          </EarlyAccessDialog>
        </div>
      </section>

      {/* Spec strip: the three lines */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid border md:grid-cols-3" style={{ borderColor: C.ink, background: C.panel }}>
          {PRODUCTS.map((p, i) => (
            <article key={p.key} className={`flex flex-col p-7 ${i > 0 ? "border-t md:border-l md:border-t-0" : ""}`} style={{ borderColor: C.ink }}>
              <div className="mb-8 flex items-center justify-between text-[12px] uppercase tracking-[0.12em]" style={{ ...mono, color: C.muted }}>
                <span>0{i + 1}</span>
                <span>{p.name}</span>
              </div>
              <h3 className="mb-4 text-2xl font-semibold uppercase leading-tight" style={grot}>{p.promise}</h3>
              <p className="mb-8 text-[15px] leading-relaxed" style={{ color: C.muted }}>{p.body}</p>
              <div className="mt-auto flex items-center justify-between border-t pt-4 text-[12px] uppercase tracking-[0.08em]" style={{ ...mono, borderColor: C.line }}>
                <span style={{ color: C.muted }}>{p.meta}</span>
                {p.key === "aeo" ? (
                  <a href={auditUrlFor("")} className="shrink-0 whitespace-nowrap" style={{ color: C.accent }}>{p.cta} →</a>
                ) : (
                  <EarlyAccessDialog mode="project" surface="home_products">
                    <button type="button" className="shrink-0 whitespace-nowrap uppercase" style={{ color: C.accent }}>{p.cta} →</button>
                  </EarlyAccessDialog>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 opacity-60 grayscale">
          {LOGOS.map((l) => <img key={l.label} src={l.src} alt={l.label} className={`h-5 w-auto ${l.onLight ?? ""}`} />)}
        </div>
      </section>

      {/* Loop (original ring) */}
      <section className="border-y" style={{ borderColor: C.ink, background: C.panel }}>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Label>§ 01 · Method</Label>
          <h2 className="max-w-3xl text-4xl font-semibold uppercase leading-[1] md:text-6xl" style={grot}>
            Measure, diagnose, execute, then verify what changed.
          </h2>
          <LoopDiagram steps={LOOP_STEPS} centerLines={LOOP_CENTER} footnote={null} />
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Label>§ 02 · Results</Label>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-3xl text-3xl font-semibold uppercase leading-tight md:text-4xl" style={grot}>{CASE.title}</h2>
          <a href={CASE.href} className="text-[13px] uppercase tracking-[0.08em] underline underline-offset-4" style={mono}>Read the case study →</a>
        </div>
        <div className="grid border md:grid-cols-3" style={{ borderColor: C.ink, background: C.panel }}>
          {STATS.map((s, i) => (
            <div key={s.label} className={`p-8 ${i > 0 ? "border-t md:border-l md:border-t-0" : ""}`} style={{ borderColor: C.ink }}>
              <p className="text-[12px] uppercase tracking-[0.12em]" style={{ ...mono, color: C.muted }}>{s.label}</p>
              <p className="my-4 text-7xl font-semibold tracking-tight" style={{ ...grot, color: C.accent }}>{s.value}</p>
              <p className="text-[13px] uppercase" style={{ ...mono, color: C.muted }}>{s.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] uppercase tracking-[0.1em]" style={{ ...mono, color: C.muted }}>{CASE.kicker}</p>
      </section>

      {/* Work */}
      <section className="border-t" style={{ borderColor: C.ink }}>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Label>§ 03 · Work</Label>
          <div className="grid gap-6 md:grid-cols-3">
            {WORK.map((w, i) => (
              <a key={w.id} href={w.href} target="_blank" rel="noopener noreferrer" className="group border" style={{ borderColor: C.ink, background: C.panel }}>
                <div className="flex items-center justify-between border-b px-4 py-2 text-[11px] uppercase tracking-[0.12em]" style={{ ...mono, borderColor: C.ink, color: C.muted }}>
                  <span>W-0{i + 1}</span><span>{w.line}</span>
                </div>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={w.image} alt={w.title} className="h-full w-full object-cover object-top grayscale transition duration-500 group-hover:grayscale-0" />
                </div>
                <div className="border-t p-5" style={{ borderColor: C.ink }}>
                  <h3 className="mb-2 text-lg font-semibold uppercase leading-tight" style={grot}>{w.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: C.muted }}>{w.summary}</p>
                  <p className="mt-4 text-[12px] uppercase tracking-[0.1em]" style={{ ...mono, color: C.accent }}>{w.client} ↗</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="border-y" style={{ borderColor: C.ink, background: C.ink, color: C.field }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-12">
          <p className="text-[12px] uppercase tracking-[0.14em] md:col-span-3" style={{ ...mono, color: "#9A9A94" }}>§ 04 · Client</p>
          <div className="md:col-span-9">
            <p className="text-2xl font-medium leading-snug md:text-3xl" style={grot}>“{QUOTE.text}”</p>
            <p className="mt-8 text-[13px] uppercase tracking-[0.1em]" style={{ ...mono, color: "#9A9A94" }}>{QUOTE.name} — {QUOTE.role}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-28 text-center">
        <h2 className="mx-auto max-w-4xl text-4xl font-semibold uppercase leading-[1] md:text-6xl" style={grot}>{CTA.title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed" style={{ color: C.muted }}>{CTA.body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Bracket solid href={auditUrlFor("")}>Start free</Bracket>
          <EarlyAccessDialog mode="project" surface="cta_section">
            <button type="button" className="inline-flex items-center border px-5 py-3 text-[13px] uppercase tracking-[0.08em]" style={{ ...mono, borderColor: C.ink }}>[ Start a project ]</button>
          </EarlyAccessDialog>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: C.ink }}>
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-6 py-6 text-[12px] uppercase tracking-[0.1em]" style={{ ...mono, color: C.muted }}>
          <span>SolCrys © 2026</span>
          <span>Your brand, AI ready</span>
          <span>SolCrys AEO · Sites · Motion</span>
        </div>
      </footer>
    </div>
  );
};

export default PreviewTechnical;
