import { useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const iconFor = (theme: Theme): LucideIcon =>
  theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const ActiveIcon = iconFor(theme);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        aria-label={`Theme: ${theme}. Click to change.`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ActiveIcon className="h-5 w-5" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-36 rounded-md border border-border/40 bg-background/95 backdrop-blur-xl shadow-floating-md z-50 overflow-hidden"
        >
          {options.map((option) => {
            const Icon = option.icon;
            const active = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-muted/50 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{option.label}</span>
                {active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(195_90%_55%)]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ThemeToggle;
