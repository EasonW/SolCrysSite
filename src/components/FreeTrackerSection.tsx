import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { trackEvent } from "@/lib/analytics";

/**
 * Loose URL-shape check — accepts apex domains, subdomains, and paths.
 * Same regex the /audit AuditFlow uses; kept local so this section can
 * reject typos before the cross-domain redirect.
 */
function isValidUrlShape(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
  const host = withoutProtocol.split(/[/?#]/)[0];
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host);
}

/**
 * Free ChatGPT Visibility Tracker — a standalone homepage section (its own
 * block, deliberately NOT the hero). The brand thesis + Loop lead the page;
 * this is the "try it free" conversion beat. The domain form deep-links to
 * the in-app free tier (app.solcrys.com/audit?domain=) — the same handoff
 * the dedicated /free-chatgpt-visibility-tracker landing page uses.
 */
const FreeTrackerSection = () => {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!isValidUrlShape(trimmed)) {
      setError("Please enter a valid URL (e.g., acme.com).");
      return;
    }
    setError(null);
    trackAuditClick("home_tracker_section");
    trackEvent("request_audit_open_with_domain", {
      surface: "home_tracker_section",
      domain: trimmed,
    });
    window.location.href = `${AUDIT_URL}?domain=${encodeURIComponent(trimmed)}&autostart=1`;
  };

  return (
    <section id="free-tracker" className="py-20 md:py-28 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="rounded-2xl border border-[hsl(var(--brand-accent)/0.25)] bg-[hsl(var(--brand-accent)/0.05)] p-8 md:p-12 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent))]">
            Free ChatGPT visibility tracker
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            See if ChatGPT recommends your brand — then fix it, free
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Most free AI-visibility tools hand you a score and stop. This is
            your free way into the SolCrys Loop: enter your domain to see where
            ChatGPT mentions, cites, or skips you — or names a competitor
            instead — then a free audit in the same workspace hands you the
            exact change to ship, the schema block, the heading rewrite. You
            leave with a fix, not homework. About 5 minutes to your first read,
            no credit card.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="max-w-2xl mx-auto mb-3"
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus-within:border-[hsl(var(--brand-accent)/0.6)] focus-within:ring-4 focus-within:ring-[hsl(var(--brand-accent)/0.12)] transition-all">
              <label htmlFor="home-tracker-domain" className="sr-only">
                Your website URL
              </label>
              <input
                id="home-tracker-domain"
                name="domain"
                type="url"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://acme.com"
                autoComplete="url"
                inputMode="url"
                className="flex-1 min-w-0 px-5 py-4 sm:py-5 text-base sm:text-lg bg-transparent focus:outline-none placeholder:text-muted-foreground/70 text-foreground rounded-xl sm:rounded-l-xl sm:rounded-r-none text-left"
              />
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="text-base px-6 sm:px-7 py-4 sm:py-5 h-auto min-w-0 whitespace-normal sm:whitespace-nowrap rounded-xl sm:rounded-l-none sm:rounded-r-xl"
              >
                Track ChatGPT Visibility, Free
                <ArrowRight className="ml-2 w-5 h-5 shrink-0" />
              </Button>
            </div>
            {error ? (
              <p role="alert" className="mt-2.5 text-sm text-[hsl(var(--brand-accent))]">
                {error}
              </p>
            ) : null}
          </form>

          <p className="text-sm text-muted-foreground/85">
            Free
            <span className="mx-2 text-muted-foreground/50">·</span>
            No credit card
            <span className="mx-2 text-muted-foreground/50">·</span>
            ChatGPT only
            <span className="mx-2 text-muted-foreground/50">·</span>
            <a
              href="/free-chatgpt-visibility-tracker/"
              className="text-[hsl(var(--brand-accent))] hover:underline"
            >
              How it works
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeTrackerSection;
