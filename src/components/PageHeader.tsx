import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  back = false,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]",
        className,
      )}
    >
      {back && (
        <button
          aria-label="Retour"
          onClick={() => router.history.back()}
          className="press-sm -ml-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  );
}
