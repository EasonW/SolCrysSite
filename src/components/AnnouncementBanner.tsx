import { ArrowRight, Sparkles } from "lucide-react";

const AnnouncementBanner = () => {
  return (
    <a
      href="/news/why-prompt-pulse-and-the-chatgpt-tracker-are-free/"
      className="group inline-flex w-full max-w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/40 px-3 py-2 text-center text-xs backdrop-blur-md transition-colors hover:border-[hsl(195_90%_55%/0.45)] sm:w-auto sm:flex-row sm:rounded-full sm:px-4 sm:py-1.5 md:text-sm"
    >
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[hsl(195_90%_55%/0.12)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[hsl(195_90%_55%)]">
        <Sparkles className="h-3 w-3" />
        New
      </span>
      <span className="min-w-0 max-w-full text-muted-foreground">
        <span className="block max-w-full truncate font-medium text-foreground sm:inline sm:whitespace-normal">Free ChatGPT Visibility Tracker + Prompt Pulse</span>
        <span className="hidden sm:inline"> — two free tools, and why we made them free</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 font-medium text-[hsl(195_90%_55%)]">
        Read
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
};

export default AnnouncementBanner;
