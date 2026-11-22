import { ReactNode, useEffect, useMemo, useState } from "react";

import { Theme, ThemeProviderContext, ThemeProviderState } from "@/lib/theme";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const darkSchemeQuery = "(prefers-color-scheme: dark)";

const isTheme = (value: string | null): value is Theme =>
  value === "dark" || value === "light" || value === "system";

/**
 * Adapted from https://ui.shadcn.com/docs/dark-mode/vite
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme"
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    return isTheme(stored) ? stored : defaultTheme;
  });
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() =>
    window.matchMedia(darkSchemeQuery).matches ? "dark" : "light"
  );

  // Follow OS theme changes while the app is open
  useEffect(() => {
    const mediaQuery = window.matchMedia(darkSchemeQuery);
    const onChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", onChange);
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      }
    }),
    [theme, resolvedTheme, storageKey]
  );

  return <ThemeProviderContext value={value}>{children}</ThemeProviderContext>;
}
