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
 * PREVIEW style B — "Editorial". References: Granola (warm paper, big serif,
 * product collage in the hero) and Resend (serif display, restraint).
 * Paper background, one deep-teal accent, real work as the hero visual.
 */
const C = {
  paper: "#F6F3EC",
  card: "#FFFDF8",
  ink: "#1B1A17",
  muted: "#6B675E",
  rule: "#E2DDD1",
  accent: "#0F5E57",
  accentSoft: "#DCEBE6",
};

const scopedVars = {
  "--brand-accent-ink": "173 72% 21%",
  "--background": "43 38% 95%",
  "--foreground": "45 8% 10%",
  "--muted-foreground": "43 5% 40%",
} as CSSProperties;

const serif = { fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 } as const;

const DomainForm = ({ dark = true }: { dark?: boolean }) => {
  const [domain, setDomain] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = auditUrlFor(domain);
      }}
      className="flex w-full max-w-md items-center gap-2 rounded-full border p-1.5 pl-5"
      style={{ borderColor: C.rule, background: C.card }}
    >
      <input
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="yourcompany.com"
        aria-label="Your website"
        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#A39E92]"
        style={{ color: C.ink }}
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium"
        style={{ background: dark ? C.ink : C.accent, color: C.paper }}
      >
        Start Free <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
};

const PreviewEditorial = () => {
  usePreviewPage("Style B · Editorial");
  useDemoFonts(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap",
  );

  return (
    <div
      className="demo-editorial min-h-screen"
      style={{ ...scopedVars, background: C.paper, color: C.ink, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <PreviewRibbon />
      <style>{`
        .demo-editorial .font-display { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400 !important; font-size: 1.45rem; }
        .demo-editorial svg .font-display { font-size: 18px !important; }
      `}</style>

      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/preview/" className="flex items-center gap-2">
          <img src="/logo-light.png" alt="SolCrys" className="h-8 w-auto" />
        </a>
        <nav className="hidden gap-8 text-[15px] md:flex" style={{ color: C.muted }}>
          {NAV.map((n) => (
            <a key={n} href="#" className="hover:text-[#1B1A17]">{n}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-[15px]">
          <a href="#" className="hidden sm:inline" style={{ color: C.muted }}>Log in</a>
          <a href={auditUrlFor("")} className="rounded-full px-4 py-2 font-medium" style={{ background: C.ink, color: C.paper }}>
            Start Free
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-10 md:grid-cols-12 md:pt-16">
        <div className="md:col-span-6">
          <span
            className="mb-7 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px]"
            style={{ background: C.accentSoft, color: C.accent }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.accent }} />
            {HERO.eyebrow}
          </span>
          <h1 className="mb-7 text-[3.4rem] leading-[0.98] tracking-[-0.01em] md:text-[5.2rem]" style={serif}>
            {HERO.lead} <em style={{ color: C.accent }}>{HERO.highlight}</em> {HERO.tail}
          </h1>
          <p className="mb-9 max-w-md text-lg leading-relaxed" style={{ color: C.muted }}>{HERO.sub}</p>
          <DomainForm />
          <EarlyAccessDialog mode="project" surface="hero">
            <button type="button" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium underline-offset-4 hover:underline" style={{ color: C.ink }}>
              Or start a project with us <ArrowRight className="h-4 w-4" />
            </button>
          </EarlyAccessDialog>
        </div>

        {/* Collage of real work */}
        <div className="relative hidden min-h-[520px] md:col-span-6 md:block">
          <figure className="absolute right-0 top-0 w-[82%] rotate-[1.5deg] overflow-hidden rounded-xl border shadow-[0_30px_60px_-30px_rgba(40,30,10,0.35)]" style={{ borderColor: C.rule, background: C.card }}>
            <img src={WORK[0].image} alt={WORK[0].title} className="block w-full" />
            <figcaption className="px-4 py-2.5 text-xs" style={{ color: C.muted }}>Sites · Cornelis homepage</figcaption>
          </figure>
          <figure className="absolute bottom-0 left-0 w-[52%] -rotate-[2.5deg] overflow-hidden rounded-xl border shadow-[0_30px_60px_-30px_rgba(40,30,10,0.45)]" style={{ borderColor: C.rule, background: C.card }}>
            <img src={WORK[2].image} alt={WORK[2].title} className="block w-full" />
            <figcaption className="px-4 py-2.5 text-xs" style={{ color: C.muted }}>Motion · booth interactive</figcaption>
          </figure>
          <div className="absolute bottom-10 right-4 w-56 rounded-xl border p-5" style={{ borderColor: C.rule, background: C.card }}>
            <p className="text-5xl" style={{ ...serif, color: C.accent }}>12×</p>
            <p className="mt-1 text-sm" style={{ color: C.muted }}>mention rate on the new category prompts, in four weeks</p>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="mx-auto max-w-6xl border-y px-6 py-8" style={{ borderColor: C.rule }}>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 opacity-70 grayscale">
          {LOGOS.map((l) => (
            <img key={l.label} src={l.src} alt={l.label} className={`h-6 w-auto ${l.onLight ?? ""}`} />
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-14 max-w-2xl text-5xl leading-[1.05]" style={serif}>
          One story, told everywhere your buyers look.
        </h2>
        <div className="grid md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <article key={p.key} className={`py-8 md:px-8 ${i > 0 ? "border-t md:border-l md:border-t-0" : "md:pl-0"}`} style={{ borderColor: C.rule }}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: C.accent }}>{p.name}</p>
              <h3 className="mb-4 text-[2rem] leading-tight" style={serif}>{p.promise}</h3>
              <p className="mb-8 leading-relaxed" style={{ color: C.muted }}>{p.body}</p>
              <p className="text-sm" style={{ color: C.muted }}>{p.meta}</p>
              {p.key === "aeo" ? (
                <a href={auditUrlFor("")} className="mt-3 inline-flex items-center gap-1 text-[15px] font-medium" style={{ color: C.ink }}>
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <EarlyAccessDialog mode="project" surface="home_products">
                  <button type="button" className="mt-3 inline-flex items-center gap-1 text-[15px] font-medium" style={{ color: C.ink }}>
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </button>
                </EarlyAccessDialog>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Loop (original ring) */}
      <section className="border-t" style={{ borderColor: C.rule, background: C.card }}>
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-2xl text-5xl leading-[1.05]" style={serif}>
            Measure, diagnose, execute, then verify what changed.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: C.muted }}>
            The same method runs every project, from an AI answer to a booth demo.
          </p>
          <LoopDiagram steps={LOOP_STEPS} centerLines={LOOP_CENTER} footnote={null} />

          <div className="mt-16 border-t pt-10" style={{ borderColor: C.rule }}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: C.accent }}>{CASE.kicker}</p>
                <p className="text-3xl" style={serif}>{CASE.title}</p>
              </div>
              <a href={CASE.href} className="inline-flex items-center gap-1 text-[15px] font-medium">Read the case study <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-7xl leading-none" style={{ ...serif, color: C.accent }}>{s.value}</p>
                  <p className="mt-3 font-medium">{s.label}</p>
                  <p className="text-sm" style={{ color: C.muted }}>{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="text-5xl" style={serif}>Selected work</h2>
          <p className="max-w-xs text-sm" style={{ color: C.muted }}>Live today. We add each project once the client approves it.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {WORK.map((w) => (
            <a key={w.id} href={w.href} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="mb-5 aspect-[4/3] overflow-hidden rounded-xl border" style={{ borderColor: C.rule }}>
                <img src={w.image} alt={w.title} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: C.accent }}>{w.line} · {w.client}</p>
              <h3 className="mb-2 flex items-start gap-2 text-2xl leading-tight" style={serif}>
                {w.title} <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 opacity-50" />
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: C.muted }}>{w.summary}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="border-y" style={{ borderColor: C.rule }}>
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-[2.1rem] leading-snug md:text-[2.6rem]" style={serif}>“{QUOTE.text}”</p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <img src={QUOTE.photo} alt={QUOTE.name} className="h-12 w-12 rounded-full object-cover" />
            <div className="text-left">
              <p className="font-medium">{QUOTE.name}</p>
              <p className="text-sm" style={{ color: C.muted }}>{QUOTE.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid items-end gap-10 md:grid-cols-2">
          <h2 className="text-6xl leading-[1.02]" style={serif}>{CTA.title}</h2>
          <div>
            <p className="mb-6 text-lg leading-relaxed" style={{ color: C.muted }}>{CTA.body}</p>
            <DomainForm />
          </div>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: C.rule }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm" style={{ color: C.muted }}>
          <img src="/logo-light.png" alt="SolCrys" className="h-6 w-auto" />
          <span style={serif} className="text-lg">Your brand, AI ready.</span>
          <span>© 2026 SolCrys</span>
        </div>
      </footer>
    </div>
  );
};

export default PreviewEditorial;
