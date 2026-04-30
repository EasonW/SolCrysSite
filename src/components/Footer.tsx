const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <a href="/" aria-label="SolCrys AI home">
             <img src="/logo.png" alt="SolCrys AI Logo" className="h-10 w-auto" />
           </a>
         </div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
           <div className="flex gap-4 text-xs text-muted-foreground">
             <a href="/resources/" className="hover:text-foreground transition-colors">Resources</a>
             <a href="/privacy.html" className="hover:text-foreground transition-colors">Privacy Policy</a>
             <a href="/terms.html" className="hover:text-foreground transition-colors">Terms of Service</a>
           </div>
           <p className="text-xs text-muted-foreground">© 2026 SolCrys AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
