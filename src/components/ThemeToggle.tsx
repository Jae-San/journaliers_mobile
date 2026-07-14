import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      className={cn(
        "press-sm relative flex h-9 w-16 shrink-0 items-center rounded-full bg-secondary px-1 transition-colors",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full bg-card text-primary shadow-card transition-transform duration-200",
          isDark && "translate-x-7",
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Sun className="h-4 w-4" strokeWidth={1.75} />
        )}
      </span>
    </button>
  );
}
