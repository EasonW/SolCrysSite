import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { ArrowRight, BookOpen, ChevronDown, Menu, Search, X } from "lucide-react";
import ResourcesMegaMenu from "./ResourcesMegaMenu";
import SearchCommand from "./SearchCommand";
import SolutionsMegaMenu from "./SolutionsMegaMenu";
import {
  RESOURCES_COLUMNS,
  RESOURCES_FOOTER_LINKS,
} from "./resourcesMenuData";
import { SOLUTIONS_MENU_ITEMS } from "./solutionsMenuData";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { APP_PRICING_URL } from "@/lib/pricing-url";
import siteContent from "@/content/siteContent.json";

const publishedResourceCount = siteContent.resourcePages.filter(
  (p) => (p as { status?: string }).status !== "draft"
).length;

// Single source of truth for the top-row order. Flat anchors/routes
// only — dropdowns (Solutions / Resources / Company) are rendered
// separately so they can carry their own open-state + mega-menu body.
// Order convention: product-side first (Platform → Pricing → Customers),
// discovery-side second (handled via dropdown insertion below).
//
// 2026-05 nav cleanup removed two items vs the prior structure:
//   - "The Loop" (#loop): a same-page anchor with no destination —
//     the homepage section still exists, just unlinked from the nav.
//   - "News": moved to the footer's Company column. The /news/ feed
//     ships infrequently enough that footer is sufficient; this also
//     lets the Company entry stay a flat link rather than a 1-item
//     dropdown.
const flatNavLinks = [
  { href: "/#features", label: "Platform" },
  // Phase E: /pricing is now hosted on app.solcrys.com. Internal link is
  // absolute so the SPA does a full cross-subdomain navigation rather than
  // routing client-side to the legacy <Pricing /> component. The bridge
  // page at solcrys.com/pricing/ still exists for bookmarks / AI citations
  // / inbound links from elsewhere (meta-refresh + canonical to the app).
  { href: APP_PRICING_URL, label: "Pricing" },
  { href: "/customers/", label: "Customers" },
  { href: "/about/", label: "Company" },
];

type OpenMenu = "resources" | "solutions" | null;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Single open-menu enum so opening one dropdown auto-closes the
  // others. Replaces the prior boolean-per-menu pattern that would
  // otherwise allow two mega menus to overlap.
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  // Mobile accordion state mirrors OpenMenu but stays independent —
  // mobile users can have a section expanded while desktop has none.
  const [mobileSection, setMobileSection] = useState<OpenMenu>(null);
  const closeTimer = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const openDropdown = (menu: Exclude<OpenMenu, null>) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenMenu(menu);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 150);
  };

  // Outside-click + Escape: close whichever dropdown is open.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  // Global ⌘K / Ctrl+K toggles the search palette from anywhere on the site.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeAll = () => {
    setMobileOpen(false);
    setMobileSection(null);
    setOpenMenu(null);
  };

  // Helper renderers so the desktop bar stays readable.

  const renderFlatLink = (link: { href: string; label: string }) => (
    <a
      key={link.href}
      href={link.href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {link.label}
    </a>
  );

  const renderDropdownTrigger = (
    menu: Exclude<OpenMenu, null>,
    label: string,
    body: React.ReactNode,
    /** Visual width of the dropdown panel. Solutions + Resources need
     *  the full ~1180px; Company is a small column. */
    panelWidth: "wide" | "narrow",
  ) => {
    const isOpen = openMenu === menu;
    const panelClasses =
      panelWidth === "wide"
        ? "w-[min(calc(100vw-2rem),1180px)] -translate-x-1/2 left-1/2 fixed top-[4.5rem]"
        : "absolute left-0 top-full mt-3 w-[18rem]";
    return (
      <div
        className="relative"
        onMouseEnter={() => openDropdown(menu)}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setOpenMenu(isOpen ? null : menu)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen ? (
          <div
            className={`z-50 ${panelClasses}`}
            onMouseEnter={() => openDropdown(menu)}
            onMouseLeave={scheduleClose}
          >
            {body}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <a href="/" aria-label="SolCrys home" className="inline-flex items-center">
            <img src="/logo-light.png" alt="SolCrys Logo" className="h-10 w-auto block dark:hidden" />
            <img src="/logo-dark.png" alt="SolCrys Logo" className="h-10 w-auto hidden dark:block" />
          </a>
        </div>

        {/* Desktop nav — order:
            Platform · Solutions ▾ · Pricing · Customers · Resources ▾ · Company  */}
        <div ref={wrapperRef} className="hidden lg:flex items-center gap-8">
          {renderFlatLink(flatNavLinks[0])}

          {renderDropdownTrigger(
            "solutions",
            "Solutions",
            <SolutionsMegaMenu onItemClick={() => setOpenMenu(null)} />,
            "wide",
          )}

          {renderFlatLink(flatNavLinks[1])}
          {renderFlatLink(flatNavLinks[2])}

          <a
            href="/prompt-pulse/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Prompt Pulse
          </a>

          {renderDropdownTrigger(
            "resources",
            "Resources",
            <ResourcesMegaMenu onItemClick={() => setOpenMenu(null)} />,
            "wide",
          )}

          {renderFlatLink(flatNavLinks[3])}
        </div>

        {/* Right cluster: search + theme toggle + mobile hamburger + Free Audit CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search resources"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          {/* Login routes to the app on the subdomain. External nav, not an
              internal route — keep as a plain anchor so it survives the
              cross-domain navigation cleanly. Desktop-only to keep the
              mobile header from crowding; mobile users get the same link
              inside the dropdown panel below. */}
          <a
            href="https://app.solcrys.com/login"
            className="hidden lg:inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
          >
            Login
          </a>
          {/* Free Audit now routes directly to the in-app audit funnel
              at app.solcrys.com/audit (self-serve as of 2026-05-20).
              Previous EarlyAccessDialog modal is retained for the
              "founder chat" sales path only (see Pricing.tsx). */}
          <Button asChild variant="hero" size="sm">
            <a
              href={AUDIT_URL}
              onClick={() => trackAuditClick("navbar")}
            >
              Run Free Audit
            </a>
          </Button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen ? (
        <div
          id="mobile-nav-panel"
          className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-3 flex flex-col">
            {/* Platform */}
            <a
              href={flatNavLinks[0].href}
              onClick={closeAll}
              className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
            >
              {flatNavLinks[0].label}
            </a>

            {/* Mobile Solutions accordion */}
            <MobileAccordion
              label="Solutions"
              isOpen={mobileSection === "solutions"}
              onToggle={() =>
                setMobileSection((m) => (m === "solutions" ? null : "solutions"))
              }
            >
              <ul className="space-y-1">
                {SOLUTIONS_MENU_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={closeAll}
                      className="flex items-start gap-3 py-2 text-sm text-foreground/90 hover:text-[hsl(195_90%_55%)] transition-colors"
                    >
                      <item.Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="min-w-0">
                        <span className="block font-medium">{item.title}</span>
                        <span className="block text-[11px] text-muted-foreground leading-snug">
                          {item.audience}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/#solutions"
                    onClick={closeAll}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-[hsl(195_90%_55%)]"
                  >
                    All solutions
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              </ul>
            </MobileAccordion>

            {/* Pricing + Customers */}
            <a
              href={flatNavLinks[1].href}
              onClick={closeAll}
              className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
            >
              {flatNavLinks[1].label}
            </a>
            <a
              href={flatNavLinks[2].href}
              onClick={closeAll}
              className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
            >
              {flatNavLinks[2].label}
            </a>

            <a
              href="/prompt-pulse/"
              onClick={closeAll}
              className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
            >
              Prompt Pulse
            </a>

            {/* Mobile Resources accordion */}
            <MobileAccordion
              label="Resources"
              isOpen={mobileSection === "resources"}
              onToggle={() =>
                setMobileSection((m) => (m === "resources" ? null : "resources"))
              }
            >
              <div className="space-y-4">
                {RESOURCES_COLUMNS.map((col) => (
                  <div key={col.label}>
                    <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mt-2 mb-2">
                      {col.label}
                    </p>
                    <ul className="space-y-1">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            onClick={closeAll}
                            className="flex items-center gap-3 py-2 text-sm text-foreground/90 hover:text-[hsl(195_90%_55%)] transition-colors"
                          >
                            <item.Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{item.title}</span>
                          </a>
                        </li>
                      ))}
                      {col.seeAll ? (
                        <li>
                          <a
                            href={col.seeAll.href}
                            onClick={closeAll}
                            className="block py-2 text-xs font-medium text-[hsl(195_90%_55%)]"
                          >
                            {col.seeAll.label}
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ))}
                <a
                  href="/resources/"
                  onClick={closeAll}
                  className="mt-2 group flex items-center justify-between rounded-xl border border-[hsl(195_90%_55%/0.35)] bg-[hsl(195_90%_55%/0.06)] hover:bg-[hsl(195_90%_55%/0.12)] transition-colors px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-none rounded-md bg-[hsl(195_90%_55%/0.18)] p-2">
                      <BookOpen className="h-4 w-4 text-[hsl(195_90%_55%)]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-[hsl(195_90%_55%)]">
                        All resources
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        Browse all {publishedResourceCount} guides
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[hsl(195_90%_55%)] group-hover:translate-x-1 transition-transform" />
                </a>
                {RESOURCES_FOOTER_LINKS.length > 0 ? (
                  <div className="pt-3 border-t border-border/20 space-y-1">
                    {RESOURCES_FOOTER_LINKS.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closeAll}
                        className="flex items-center gap-3 py-2 text-sm text-foreground/90 hover:text-[hsl(195_90%_55%)] transition-colors"
                      >
                        <item.Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{item.title}</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </MobileAccordion>

            {/* Company — flat link, no dropdown (News moved to footer). */}
            <a
              href={flatNavLinks[3].href}
              onClick={closeAll}
              className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
            >
              {flatNavLinks[3].label}
            </a>

            {/* Mobile Login — visually separated below the nav block since
                it's an action, not a section link. */}
            <a
              href="https://app.solcrys.com/login"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-border/60 px-4 py-3 text-base font-medium text-foreground hover:bg-accent/40 transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      ) : null}

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
};

/**
 * Mobile-only accordion wrapper. Three siblings (Solutions, Resources,
 * Company) all need the same header + collapsible body pattern; pulling
 * it into a small component keeps the mobile panel readable.
 */
function MobileAccordion({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-center justify-between py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div className="pl-2 py-2 border-b border-border/20">{children}</div>
      ) : null}
    </>
  );
}

export default Navbar;
