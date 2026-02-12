import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(195_90%_55%/0.08)] blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(40_85%_55%/0.06)] blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(270_60%_50%/0.04)] blur-[140px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(195_90%_55%/0.3)] bg-[hsl(195_90%_55%/0.08)] px-4 py-1.5 mb-8 opacity-0 animate-fade-up">
          <div className="h-1.5 w-1.5 rounded-full bg-[hsl(195_90%_55%)] animate-pulse-glow" />
          <span className="text-xs font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase">Now Launching</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 opacity-0 animate-fade-up-delay-1">
          Be the Answer{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">AI Chooses</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up-delay-2">The AI-native growth engine that grounds AI discovery in user intent—not inference or guesswork

        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up-delay-3">
          <Button variant="hero" size="lg" className="text-base px-8 py-6">
            Get Early Access
            <ArrowRight className="ml-1" />
          </Button>
        </div>
      </div>
    </section>);

};

export default HeroSection;