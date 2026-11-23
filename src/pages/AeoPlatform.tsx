import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import platform from "@/content/aeoPlatform.json";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { APP_PRICING_URL } from "@/lib/pricing-url";

const AeoPlatform = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto max-w-5xl px-6 pb-20 pt-28">
      <header className="max-w-3xl py-8 md:py-14">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent-ink))]">
          {platform.name}
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{platform.heading}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{platform.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="hero" size="lg">
            <a href={AUDIT_URL} onClick={() => trackAuditClick("aeo_platform")}>Start free</a>
          </Button>
          <Button asChild variant="hero-outline" size="lg">
            <a href={APP_PRICING_URL}>See plans and pricing</a>
          </Button>
        </div>
      </header>

      <section className="mt-8 border-t border-border/50 pt-10">
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">How SolCrys AEO works</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {platform.sections.map(({ title, text, link }) => (
            <article key={title} className="rounded-xl border border-border/50 bg-card/40 p-6">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
              <a className="mt-4 inline-block text-[hsl(var(--brand-accent-ink))] underline underline-offset-4" href={link.href}>{link.label}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border/50 pt-10">
        <h2 className="mb-5 text-3xl font-semibold tracking-tight">{platform.toolsHeading}</h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {platform.tools.map(({ href, label, text }) => (
            <li key={href} className="rounded-xl border border-border/50 bg-card/40 p-6">
              <a className="font-semibold text-[hsl(var(--brand-accent-ink))] underline underline-offset-4" href={href}>{label}</a>
              <p className="mt-2 text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
    <Footer />
  </div>
);

export default AeoPlatform;
