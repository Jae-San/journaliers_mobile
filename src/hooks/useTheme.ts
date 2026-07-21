import { useCallback, useLayoutEffect, useState } from "react";

export type Theme = "light" | "dark";
const STORAGE_KEY = "journaliers-theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readStoredTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Reads/writes the persisted theme. The root shell's inline script sets the
 * `dark` class pre-paint (no flash), but SSR always assumes "light" since the
 * server can't see localStorage   so state starts at "light" on every render
 * pass and only syncs to the real value in a layout effect, after hydration
 * has committed, to avoid a server/client mismatch.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useLayoutEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
