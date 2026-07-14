import { useRef, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight pull-to-refresh for touch scroll containers.
 * Triggers `onRefresh` when the user drags down from the top.
 */
export function PullToRefresh({
  onRefresh,
  children,
  className,
}: {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  className?: string;
}) {
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const THRESHOLD = 64;

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={(e) => {
        if (window.scrollY <= 0 && !refreshing) {
          startY.current = e.touches[0].clientY;
        }
      }}
      onTouchMove={(e) => {
        if (startY.current === null) return;
        const delta = e.touches[0].clientY - startY.current;
        if (delta > 0) setPull(Math.min(delta * 0.5, 80));
      }}
      onTouchEnd={async () => {
        if (pull >= THRESHOLD) {
          setRefreshing(true);
          setPull(THRESHOLD);
          await onRefresh();
          setRefreshing(false);
        }
        setPull(0);
        startY.current = null;
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden transition-[height]"
        style={{ height: refreshing ? THRESHOLD : pull }}
      >
        <div className="flex items-center pt-3 text-primary">
          <Loader2
            className={cn("h-5 w-5", (refreshing || pull > 8) && "animate-spin")}
          />
        </div>
      </div>
      <div
        style={{ transform: `translateY(${refreshing ? THRESHOLD : pull}px)` }}
        className={cn(startY.current === null && "transition-transform")}
      >
        {children}
      </div>
    </div>
  );
}
