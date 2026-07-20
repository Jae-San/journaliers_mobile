import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "journaliers-hide-pending-balance";

/** Persisted "hide balance" preference, mirroring useTheme's SSR-safe read pattern. */
export function useHiddenBalance() {
  const [hidden, setHiddenState] = useState(false);

  useEffect(() => {
    setHiddenState(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const toggle = useCallback(() => {
    setHiddenState((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return { hidden, toggle };
}
