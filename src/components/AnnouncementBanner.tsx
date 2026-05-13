import { ArrowRight, Sparkles } from "lucide-react";

const AnnouncementBanner = () => {
  return (
    <a
      href="/news/raejeanne-skillern-strategic-advisor/"
      className="group inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-full border border-border/50 bg-card/40 backdrop-blur-md px-4 py-1.5 mb-6 max-w-full text-xs md:text-sm transition-colors hover:border-[hsl(195_90%_55%/0.45)]"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(195_90%_55%/0.12)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[hsl(195_90%_55%)]">
        <Sparkles className="h-3 w-3" />
        New
      </span>
      <span className="text-muted-foreground">
        <span className="font-medium text-foreground">Raejeanne Skillern</span>
        <span className="hidden sm:inline"> — former AWS CMO —</span> joins as Strategic Advisor
      </span>
      <span className="inline-flex items-center gap-1 font-medium text-[hsl(195_90%_55%)]">
        Read
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
};

export default AnnouncementBanner;
