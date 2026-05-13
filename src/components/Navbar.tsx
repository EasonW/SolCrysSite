import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "./EarlyAccessDialog";
import ThemeToggle from "./ThemeToggle";
import { ChevronDown, Menu, X } from "lucide-react";
import ResourcesMegaMenu from "./ResourcesMegaMenu";
import {
  RESOURCES_COLUMNS,
  RESOURCES_FOOTER_LINKS,
} from "./resourcesMenuData";

const flatNavLinks = [
  { href: "/#features", label: "Platform" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#loop", label: "The Loop" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/customers/", label: "Customers" },
];

const trailingNavLinks = [
  { href: "/news/", label: "News" },
  { href: "/about/", label: "Company" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const openResources = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setResourcesOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setResourcesOpen(false), 150);
  };

  // Outside-click + Escape: close desktop dropdown.
  useEffect(() => {
    if (!resourcesOpen) return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResourcesOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [resourcesOpen]);

  const closeAll = () => {
    setMobileOpen(false);
    setMobileResourcesOpen(false);
    setResourcesOpen(false);
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

        {/* Desktop nav */}
        <div ref={wrapperRef} className="hidden lg:flex items-center gap-8">
          {flatNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Resources dropdown trigger */}
          <div
            className="relative"
            onMouseEnter={openResources}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={resourcesOpen}
              onClick={() => setResourcesOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Resources
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  resourcesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {resourcesOpen ? (
              <div
                className="fixed left-1/2 top-[4.5rem] z-50 w-[min(calc(100vw-2rem),1180px)] -translate-x-1/2"
                onMouseEnter={openResources}
                onMouseLeave={scheduleClose}
              >
                <ResourcesMegaMenu
                  onItemClick={() => setResourcesOpen(false)}
                  onAuditClick={() => setAuditOpen(true)}
                />
              </div>
            ) : null}
          </div>

          {trailingNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right cluster: theme toggle + mobile hamburger + Free Audit CTA */}
        <div className="flex items-center gap-2">
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
          <EarlyAccessDialog surface="navbar" open={auditOpen} onOpenChange={setAuditOpen}>
            <Button variant="hero" size="sm">Free Audit</Button>
          </EarlyAccessDialog>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen ? (
        <div
          id="mobile-nav-panel"
          className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-3 flex flex-col">
            {flatNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Resources accordion */}
            <button
              type="button"
              onClick={() => setMobileResourcesOpen((v) => !v)}
              aria-expanded={mobileResourcesOpen}
              className="flex items-center justify-between py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20"
            >
              <span>Resources</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  mobileResourcesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileResourcesOpen ? (
              <div className="pl-2 py-2 border-b border-border/20 space-y-4">
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
                    </ul>
                  </div>
                ))}
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
              </div>
            ) : null}

            {trailingNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors border-b border-border/20 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
