import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "solcrys-theme";

const getResolved = (theme: Theme): "light" | "dark" => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
};

const readStored = (): Theme => {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "system";
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(readStored);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.toggle("dark", getResolved(theme) === "dark");
      root.style.colorScheme = getResolved(theme);
    };
    apply();

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  // Keep tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setThemeState(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    if (next === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, next);
    }
  };

  return { theme, setTheme };
};
