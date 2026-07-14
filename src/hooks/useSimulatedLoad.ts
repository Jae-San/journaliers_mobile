import { useEffect, useState } from "react";

/** Simulate a network fetch delay so skeleton loaders are visible. */
export function useSimulatedLoad(delay = 850) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return loading;
}
