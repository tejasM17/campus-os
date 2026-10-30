"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const THEME_STORAGE_KEY = "campus-os-theme";
const ThemeContext = createContext<{ isDark: boolean; setIsDark: (value: boolean) => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextIsDark = savedTheme === null || savedTheme === "dark";
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
  }, []);

  function updateTheme(nextIsDark: boolean) {
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("ThemeToggle must be used inside ThemeProvider");

  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <Sun aria-hidden="true" className="size-4 text-muted-foreground" />
      <Switch
        aria-label="Toggle dark mode"
        checked={theme.isDark}
        onCheckedChange={theme.setIsDark}
      />
      <Moon aria-hidden="true" className="size-4 text-muted-foreground" />
    </span>
  );
}
