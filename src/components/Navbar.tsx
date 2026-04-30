import { Button } from "@/components/ui/button";
import EarlyAccessDialog from "./EarlyAccessDialog";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <a href="/" aria-label="SolCrys AI home">
              <img src="/logo.png" alt="SolCrys AI Logo" className="h-10 w-auto" />
            </a>
          </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#aeo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why AEO</a>
          <a href="/#approach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Approach</a>
          <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="/resources/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Resources</a>
          <a href="/about/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a>
        </div>
        <EarlyAccessDialog>
          <Button variant="hero" size="sm">Request Audit</Button>
        </EarlyAccessDialog>
      </div>
    </nav>
  );
};

export default Navbar;
