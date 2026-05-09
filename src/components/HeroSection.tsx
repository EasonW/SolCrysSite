import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import EarlyAccessDialog from "./EarlyAccessDialog";
import LoopDiagram from "./LoopDiagram";
import siteContent from "@/content/siteContent.json";

const HeroSection = () => {
  const heroTitleHighlight = "governed marketing execution.";
  const heroTitleLead = siteContent.home.title
    .replace(heroTitleHighlight, "")
    .trim();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-16">
      {/* Aurora Borealis Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-transparent blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-500/10 to-transparent blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(195_90%_55%/0.3)] bg-[hsl(195_90%_55%/0.08)] px-4 py-1.5 mb-8 opacity-0 animate-fade-up">
          <div className="h-1.5 w-1.5 rounded-full bg-[hsl(195_90%_55%)] animate-pulse-glow" />
          <span className="text-xs font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase">BETA · FREE AI VISIBILITY AUDIT</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 opacity-0 animate-fade-up-delay-1">
          {heroTitleLead} <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">{heroTitleHighlight}</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up-delay-2">
          {siteContent.home.description}
        </p>
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up-delay-3 mb-16">
          <EarlyAccessDialog surface="hero">
            <Button variant="hero" size="lg" className="text-base px-8 py-6 h-auto">
              Get a Free AI Visibility Audit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </EarlyAccessDialog>
          <Button asChild variant="hero-outline" size="lg" className="text-base px-8 py-6 h-auto">
            <a href="#loop">See the SolCrys Loop</a>
          </Button>
        </div>

        {/* The SolCrys Loop — operational visualization, not aspirational claims */}
        <div className="opacity-0 animate-fade-up-delay-3 translate-y-4">
          <LoopDiagram />
        </div>

        {/* Trust Bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-medium">Monitor visibility across:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200">ChatGPT</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200">Gemini</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200">Amazon Rufus</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200">Perplexity</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200">Google AI Overview</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200">Claude</span>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;
