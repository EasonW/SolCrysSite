import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import EarlyAccessDialog from "./EarlyAccessDialog";

const HeroSection = () => {
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
          <span className="text-xs font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase">BETA: AI BRAND AUDIT AVAILABLE</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 opacity-0 animate-fade-up-delay-1">
          Stop Flying Blind. <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">Control What AI Says About Your Brand.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up-delay-2">
          The first AEO platform to monitor real-time mentions, audit hallucination risks, and optimize your brand's ranking across ChatGPT, Amazon Rufus, Gemini, Perplexity, Google AI Overview and more.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up-delay-3 mb-16">
          <EarlyAccessDialog>
            <Button variant="hero" size="lg" className="text-base px-8 py-6 h-auto">
              Check Your AI Visibility Score
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </EarlyAccessDialog>
        </div>

        {/* Dashboard Placeholder - Share of Voice Chart */}
        <div className="relative w-full max-w-4xl mx-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden opacity-0 animate-fade-up-delay-3 translate-y-4">
           {/* Mock Window Controls */}
           <div className="h-8 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/20" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
             <div className="w-3 h-3 rounded-full bg-green-500/20" />
           </div>
           
           {/* Dashboard Content Mockup */}
           <div className="p-6 md:p-10 grid gap-8">
             <div className="flex items-center justify-between mb-4">
               <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
               <div className="h-8 w-24 bg-primary/20 rounded animate-pulse" />
             </div>
             
             {/* Chart Area */}
             <div className="relative h-[300px] w-full bg-gradient-to-b from-transparent to-primary/5 rounded border border-white/5 p-4 flex items-end gap-2 md:gap-4 overflow-hidden">
                {/* SVG Line Chart Mockup */}
                <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 400 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="180" x2="400" y2="180" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                  <line x1="0" y1="140" x2="400" y2="140" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="white" strokeOpacity="0.05" strokeWidth="1" />

                  {/* Competitor Line (Gray/Blue) */}
                  <path d="M0,150 C50,140 100,130 150,145 C200,160 250,120 300,130 C350,140 400,110 400,100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                  
                  {/* MyBrand Line (Primary/Gradient) */}
                  <path d="M0,170 C50,160 100,100 150,80 C200,60 250,90 300,50 C350,20 400,30 400,30" fill="none" stroke="url(#gradient)" strokeWidth="3" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(195, 90%, 55%)" />
                      <stop offset="100%" stopColor="hsl(40, 85%, 55%)" />
                    </linearGradient>
                  </defs>
                  
                   {/* Tooltip Mockup */}
                   <circle cx="300" cy="50" r="4" fill="white" />
                   <rect x="270" y="10" width="60" height="24" rx="4" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" />
                   <text x="300" y="27" textAnchor="middle" fill="white" fontSize="10" fontFamily="sans-serif">85% SoV</text>
                </svg>
             </div>
             
             {/* Stats Row */}
             <div className="grid grid-cols-3 gap-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="h-16 rounded bg-white/5 border border-white/5" />
               ))}
             </div>
           </div>
           
           {/* Glass overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
        </div>

        {/* Trust Bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
           <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-medium">Monitor your narrative across:</p>
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