import { cn } from "@/lib/utils";

/** Journalia wordmark + monogram logo, tokenized. */
export function Logo({
  size = "md",
  showWord = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showWord?: boolean;
  className?: string;
}) {
  const box = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const word =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "grid shrink-0 place-items-center rounded-2xl bg-primary",
          box,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-1/2 w-1/2"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5 10 17.5 19 6.5" />
        </svg>
      </div>
      {showWord && (
        <span className={cn("font-extrabold tracking-tight text-foreground", word)}>
          Journalia
        </span>
      )}
    </div>
  );
}
