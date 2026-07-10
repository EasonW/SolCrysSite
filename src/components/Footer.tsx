// Footer expanded 2026-05 nav cleanup: from a single 5-link strip to
// 4 thematic columns (Product / Resources / Company / Legal). Mirrors
// industry-standard B2B SaaS footer IA so we surface destinations the
// slimmed top-nav no longer exposes (e.g., individual AI engine pages
// previously buried in the mega menu, blog/news, terms).
//
// Source of truth for the link sets stays inline here — these are
// stable enough to not warrant a data file, and intentionally diverge
// from the mega-menu data (e.g., footer surfaces all 8 AI engines,
// whereas the nav mega only shows 4 + a "see all" link).

import { APP_PRICING_URL } from "@/lib/pricing-url";

const productLinks = [
  { href: "/#features", label: "Platform" },
  // Phase E: pricing moved to app.solcrys.com/pricing. See Navbar.tsx for
  // the full rationale; bridge page at /pricing/ still handles bookmarks.
  { href: APP_PRICING_URL, label: "Pricing" },
  { href: "/customers/", label: "Customers" },
  { href: "/#solutions", label: "Solutions" },
];

const resourcesLinks = [
  { href: "/prompt-pulse/", label: "Prompt Pulse" },
  { href: "/free-chatgpt-visibility-tracker/", label: "Free ChatGPT Tracker" },
  { href: "/resources/", label: "All guides" },
  { href: "/compare/", label: "Compare SolCrys" },
  { href: "/optimize-for-chatgpt-search/", label: "ChatGPT" },
  { href: "/optimize-for-gemini/", label: "Gemini" },
  { href: "/optimize-for-perplexity/", label: "Perplexity" },
  { href: "/optimize-for-google-ai-overviews-ai-mode/", label: "Google AI Overviews" },
  { href: "/optimize-for-claude/", label: "Claude" },
  { href: "/amazon-rufus-optimization/", label: "Alexa for Shopping" },
  { href: "/walmart-sparky-optimization/", label: "Walmart Sparky" },
  { href: "/chatgpt-shopping-optimization/", label: "ChatGPT Shopping" },
];

const companyLinks = [
  { href: "/about/", label: "About" },
  { href: "/news/", label: "News" },
  { href: "/customers/", label: "Customer stories" },
  { href: "https://app.solcrys.com/login", label: "Login" },
];

const legalLinks = [
  { href: "/privacy.html", label: "Privacy Policy" },
  { href: "/terms.html", label: "Terms of Service" },
];

interface FooterColumnProps {
  heading: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider font-medium text-foreground mb-3">
        {heading}
      </p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="border-t border-border/40 pt-14 pb-8">
      <div className="container mx-auto px-6">
        {/* 4-column link grid. Collapses to 2 cols on tablet, 1 on phones. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column — gets its own slot so the link columns stay
              right-justified relative to it. */}
          <div className="lg:col-span-1">
            <a href="/" aria-label="SolCrys home" className="inline-flex items-center mb-3">
              <img src="/logo-light.png" alt="SolCrys Logo" className="h-10 w-auto block dark:hidden" />
              <img src="/logo-dark.png" alt="SolCrys Logo" className="h-10 w-auto hidden dark:block" />
            </a>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Turn AI answer gaps into governed marketing execution.
            </p>
            {/* NVIDIA Inception badge — a program/credibility signal, housed in
                the footer trust row rather than crowding the testimonial section.
                Badge stays on white per NVIDIA brand guidelines. */}
            <a
              href="https://www.nvidia.com/en-us/startups/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Member of the NVIDIA Inception Program"
              className="mt-5 inline-block rounded-md bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            >
              <img
                src="/nvidia-inception-badge.jpg"
                alt="Member of NVIDIA Inception Program"
                width={120}
                height={60}
                loading="lazy"
                className="h-auto w-[120px] block"
              />
            </a>
          </div>

          <FooterColumn heading="Product" links={productLinks} />
          <FooterColumn heading="Resources" links={resourcesLinks} />
          <FooterColumn heading="Company" links={companyLinks} />
          <FooterColumn heading="Legal" links={legalLinks} />
        </div>

        {/* Copyright strip */}
        <div className="mt-12 pt-6 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 SolCrys. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button
              type="button"
              data-consent-preferences
              className="hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Analytics preferences
            </button>
            <span>Built for the AEO era.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
