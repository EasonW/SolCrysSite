import { Bot, Check, X, ArrowRight, TrendingUp } from "lucide-react";
import siteContent from "@/content/siteContent.json";

const HeroComparison = () => {
  const { heroComparison } = siteContent.home;

  return (
    <div className="relative w-full max-w-4xl mx-auto text-left">
      {/* Prompt header */}
      <div className="mb-5 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Same prompt · before and after
        </p>
        <p className="font-display text-base md:text-lg text-foreground/90 italic">
          "{heroComparison.prompt}"
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 relative">
        {/* Connecting arrow on desktop */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="h-10 w-10 rounded-full bg-background border border-[hsl(195_90%_55%/0.4)] flex items-center justify-center shadow-[0_0_24px_hsl(195_90%_55%/0.3)]">
            <ArrowRight className="h-5 w-5 text-[hsl(195_90%_55%)]" />
          </div>
        </div>

        {/* BEFORE card */}
        <article className="rounded-xl border border-[hsl(0_70%_55%/0.22)] bg-[hsl(0_70%_55%/0.04)] backdrop-blur-md p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                AI answer
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{heroComparison.before.label}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85 mb-4 min-h-[5.5rem]">
            {heroComparison.before.answer}
          </p>
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[hsl(0_70%_55%/0.15)]">
            <div className="flex items-center gap-2 min-w-0">
              <X className="h-4 w-4 text-[hsl(0_70%_55%)] shrink-0" />
              <span className="text-sm font-medium text-[hsl(0_70%_55%)] truncate">
                {heroComparison.before.brandStatus}
              </span>
            </div>
            <span className="rounded-full px-2 py-1 text-[10px] font-medium bg-[hsl(0_70%_55%/0.12)] text-[hsl(0_70%_55%)] border border-[hsl(0_70%_55%/0.25)] uppercase tracking-wider whitespace-nowrap">
              {heroComparison.before.tag}
            </span>
          </div>
        </article>

        {/* AFTER card */}
        <article className="rounded-xl border border-[hsl(150_65%_45%/0.28)] bg-[hsl(150_65%_45%/0.05)] backdrop-blur-md p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                AI answer
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{heroComparison.after.label}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85 mb-4 min-h-[5.5rem]">
            {heroComparison.after.answer}
          </p>
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[hsl(150_65%_45%/0.15)]">
            <div className="flex items-center gap-2 min-w-0">
              <Check className="h-4 w-4 text-[hsl(150_65%_45%)] shrink-0" />
              <span className="text-sm font-medium text-[hsl(150_65%_45%)] truncate">
                {heroComparison.after.brandStatus}
              </span>
            </div>
            <span className="rounded-full px-2 py-1 text-[10px] font-medium bg-[hsl(150_65%_45%/0.12)] text-[hsl(150_65%_45%)] border border-[hsl(150_65%_45%/0.25)] uppercase tracking-wider whitespace-nowrap">
              {heroComparison.after.tag}
            </span>
          </div>
        </article>
      </div>

      {/* Lift bar */}
      <div className="mt-5 rounded-xl border border-[hsl(195_90%_55%/0.25)] bg-gradient-to-r from-[hsl(195_90%_55%/0.07)] via-[hsl(40_85%_55%/0.04)] to-[hsl(150_65%_45%/0.07)] backdrop-blur-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-[hsl(195_90%_55%)] shrink-0" />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-base md:text-lg font-semibold text-foreground">
                {heroComparison.lift.primary}
              </span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="font-display text-base md:text-lg font-semibold text-foreground">
                {heroComparison.lift.secondary}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80 leading-relaxed md:text-right">
            {heroComparison.lift.context}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroComparison;
