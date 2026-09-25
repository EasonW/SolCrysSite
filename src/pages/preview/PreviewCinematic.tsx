import { useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import LoopDiagram from "@/components/LoopDiagram";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import {
  CASE, CTA, HERO, LOGOS, LOOP_CENTER, LOOP_STEPS, NAV, PRODUCTS, QUOTE, STATS, WORK,
  auditUrlFor, useDemoFonts,
} from "@/preview/content";
import { PreviewRibbon, usePreviewPage } from "@/preview/PreviewChrome";

/**
 * PREVIEW style D — "Cinematic dark". References: Legora (full-bleed image
 * hero, centered sans headline), Sierra (product card floating over the
 * hero) and Resend (near-black, soft light). The hero IS a piece of our
 * Motion work, so the page proves the craft before it describes it.
 */
const C = {
  bg: "#06080A",
  panel: "#0C1013",
  text: "#F3F4F2",
  muted: "#98A19F",
  line: "rgba(255,255,255,0.09)",
  accent: "#3DDCC4",
};

const scopedVars = {
  "--brand-accent-ink": "171 69% 55%",
  "--background": "210 25% 3%",
  "--foreground": "90 8% 95%",
  "--muted-foreground": "168 4% 61%",
} as CSSProperties;

const sans = { fontFamily: "Geist, Inter, system-ui, sans-serif" } as const;

const PreviewCinematic = () => {
  usePreviewPage("Style D · Cinematic dark");
  useDemoFonts("https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400&display=swap");
  const [domain, setDomain] = useState("");

  return (
    <div className="demo-cinematic min-h-screen" style={{ ...scopedVars, ...sans, background: C.bg, color: C.text }}>
      <PreviewRibbon />
      <style>{`
        .demo-cinematic h1, .demo-cinematic h2, .demo-cinematic h3, .demo-cinematic .font-display { font-family: Geist, Inter, sans-serif !important; }
        .demo-cinematic h3.font-display { font-weight: 500 !important; }
        @keyframes demo-kenburns { from { transform: scale(1.02); } to { transform: scale(1.1); } }
      `}</style>

      {/* Hero: our Motion work on the right, headline left (Sierra / Legora) */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <img
          src="/work/cornelis-demo-wide.jpg"
          alt="Cornelis reference architecture booth interactive, made by SolCrys"
          className="absolute bottom-0 right-[-18%] w-full object-cover opacity-80"
          style={{ height: "calc(100% - 72px)", objectPosition: "center 20%", animation: "demo-kenburns 18s ease-out both" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #06080A 0%, #06080A 34%, rgba(6,8,10,0.55) 58%, rgba(6,8,10,0.1) 80%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,8,10,0.6) 0%, transparent 18%, transparent 75%, #06080A 100%)" }} />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
          <a href="/preview/"><img src="/logo-dark.png" alt="SolCrys" className="h-8 w-auto" /></a>
          <nav className="hidden gap-7 text-sm lg:flex" style={{ color: C.muted }}>
            {NAV.map((n) => <a key={n} href="#" className="hover:text-white">{n}</a>)}
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" style={{ color: C.muted }}>Log in</a>
            <a href={auditUrlFor("")} className="rounded-full px-4 py-2 font-medium" style={{ background: C.text, color: C.bg }}>Start Free</a>
          </div>
        </header>

        <div className="relative z-10 mx-auto my-auto grid w-full max-w-7xl gap-10 px-6 pb-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mb-5 text-xs uppercase tracking-[0.3em]" style={{ color: C.accent }}>{HERO.eyebrow}</p>
            <h1 className="text-[3rem] font-medium leading-[1.02] tracking-[-0.03em] md:text-[5rem]">
              {HERO.lead} {HERO.highlight} {HERO.tail}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: C.muted }}>{HERO.sub}</p>
            <form
              className="mt-9 flex max-w-lg items-center gap-2 rounded-full border p-1.5 pl-5 backdrop-blur-xl"
              style={{ borderColor: C.line, background: "rgba(255,255,255,0.06)" }}
              onSubmit={(e) => { e.preventDefault(); window.location.href = auditUrlFor(domain); }}
            >
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter your website"
                aria-label="Your website"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[#7F8886]"
              />
              <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium" style={{ background: C.accent, color: C.bg }}>
                Start Free <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <EarlyAccessDialog mode="project" surface="hero">
              <button type="button" className="mt-4 text-sm underline-offset-4 hover:underline" style={{ color: C.muted }}>Or start a project</button>
            </EarlyAccessDialog>
          </div>
          <div className="hidden items-end justify-end md:col-span-5 md:flex">
            <div className="w-72 rounded-2xl border p-5 backdrop-blur-xl" style={{ borderColor: C.line, background: "rgba(12,16,19,0.6)" }}>
              <p className="mb-2 text-xs uppercase tracking-[0.16em]" style={{ color: C.accent }}>SolCrys Motion · Cornelis</p>
              <p className="text-[15px] leading-relaxed">“The interactive demo turned our reference architecture into something a visitor could grasp in two minutes at the booth.”</p>
              <p className="mt-3 text-xs" style={{ color: C.muted }}>Nishant Lodha, Senior Director of Marketing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 py-8 opacity-60">
          {LOGOS.map((l) => <img key={l.label} src={l.src} alt={l.label} className="h-5 w-auto brightness-0 invert" />)}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <h2 className="mb-4 max-w-3xl text-4xl font-medium tracking-[-0.02em] md:text-5xl">One story, told everywhere your buyers look.</h2>
        <p className="mb-14 max-w-xl text-lg" style={{ color: C.muted }}>Buyers ask ChatGPT, read your website and stop by your booth. Every product starts from the same approved facts.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article key={p.key} className="group relative flex flex-col overflow-hidden rounded-2xl border p-7" style={{ borderColor: C.line, background: C.panel }}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: "rgba(61,220,196,0.18)" }} />
              <p className="mb-6 text-xs uppercase tracking-[0.16em]" style={{ color: C.accent }}>{p.name}</p>
              <h3 className="mb-3 text-2xl font-medium tracking-[-0.01em]">{p.promise}</h3>
              <p className="mb-10 leading-relaxed" style={{ color: C.muted }}>{p.body}</p>
              <div className="mt-auto flex items-center justify-between border-t pt-4 text-sm" style={{ borderColor: C.line }}>
                <span style={{ color: C.muted }}>{p.meta}</span>
                {p.key === "aeo" ? (
                  <a href={auditUrlFor("")} className="inline-flex items-center gap-1" style={{ color: C.text }}>{p.cta} <ArrowRight className="h-4 w-4" /></a>
                ) : (
                  <EarlyAccessDialog mode="project" surface="home_products">
                    <button type="button" className="inline-flex items-center gap-1" style={{ color: C.text }}>{p.cta} <ArrowRight className="h-4 w-4" /></button>
                  </EarlyAccessDialog>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Loop (original ring) + results */}
      <section className="relative border-t" style={{ borderColor: C.line }}>
        <div className="pointer-events-none absolute left-1/2 top-40 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[140px]" style={{ background: "rgba(61,220,196,0.08)" }} />
        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <h2 className="max-w-3xl text-4xl font-medium tracking-[-0.02em] md:text-5xl">Measure, diagnose, execute, then verify what changed.</h2>
          <LoopDiagram steps={LOOP_STEPS} centerLines={LOOP_CENTER} footnote={null} />
          <div className="mt-20 rounded-2xl border p-8 md:p-10" style={{ borderColor: C.line, background: C.panel }}>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.16em]" style={{ color: C.accent }}>{CASE.kicker}</p>
                <p className="text-2xl font-medium">{CASE.title}</p>
              </div>
              <a href={CASE.href} className="inline-flex items-center gap-1 text-sm">Read the case study <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-6xl font-medium tracking-[-0.03em]" style={{ backgroundImage: "linear-gradient(180deg,#F3F4F2 30%,#3DDCC4)", WebkitBackgroundClip: "text", color: "transparent" }}>{s.value}</p>
                  <p className="mt-3">{s.label}</p>
                  <p className="text-sm" style={{ color: C.muted }}>{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work: large cards */}
      <section className="border-t" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-7xl px-6 py-28">
          <h2 className="mb-12 text-4xl font-medium tracking-[-0.02em] md:text-5xl">Selected work</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {WORK.map((w) => (
              <a key={w.id} href={w.href} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-2xl border" style={{ borderColor: C.line, background: C.panel }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={w.image} alt={w.title} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="border-t p-6" style={{ borderColor: C.line }}>
                  <p className="mb-2 text-xs uppercase tracking-[0.16em]" style={{ color: C.accent }}>{w.line} · {w.client}</p>
                  <h3 className="flex items-start gap-2 text-xl font-medium">{w.title} <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 opacity-60" /></h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>{w.summary}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="border-t" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-4xl px-6 py-28 text-center">
          <p className="text-3xl font-light leading-snug tracking-[-0.01em] md:text-4xl">“{QUOTE.text}”</p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <img src={QUOTE.photo} alt={QUOTE.name} className="h-12 w-12 rounded-full object-cover" />
            <div className="text-left"><p>{QUOTE.name}</p><p className="text-sm" style={{ color: C.muted }}>{QUOTE.role}</p></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t" style={{ borderColor: C.line }}>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]" style={{ background: "rgba(61,220,196,0.12)" }} />
        <div className="relative mx-auto max-w-3xl px-6 py-32 text-center">
          <h2 className="text-5xl font-medium tracking-[-0.03em] md:text-6xl">{CTA.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg" style={{ color: C.muted }}>{CTA.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={auditUrlFor("")} className="rounded-full px-6 py-3 font-medium" style={{ background: C.accent, color: C.bg }}>Start Free</a>
            <EarlyAccessDialog mode="project" surface="cta_section">
              <button type="button" className="rounded-full border px-6 py-3" style={{ borderColor: C.line }}>Start a project</button>
            </EarlyAccessDialog>
          </div>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm" style={{ color: C.muted }}>
          <img src="/logo-dark.png" alt="SolCrys" className="h-6 w-auto" />
          <span>Your brand, AI ready.</span>
          <span>© 2026 SolCrys</span>
        </div>
      </footer>
    </div>
  );
};

export default PreviewCinematic;
