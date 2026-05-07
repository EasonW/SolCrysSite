import { useState } from "react";
import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "./EarlyAccessDialog";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#aeo", label: "Why AEO" },
  { href: "/#loop", label: "The Loop" },
  { href: "/#features", label: "Features" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/resources/", label: "Resources" },
  { href: "/about/", label: "About Us" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right cluster: theme toggle + mobile hamburger + Free Audit CTA (always visible) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <EarlyAccessDialog surface="navbar">
            <Button variant="hero" size="sm">Free Audit</Button>
          </EarlyAccessDialog>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open ? (
        <div
          id="mobile-nav-panel"
          className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
        >
          <div className="container mx-auto px-6 py-3 flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
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
