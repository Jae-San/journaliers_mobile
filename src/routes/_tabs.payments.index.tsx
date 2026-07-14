import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download, ChevronRight, Wallet } from "lucide-react";
import { payslips, worker, company, getMission } from "@/lib/mock-data";
import { formatFCFA, formatDate } from "@/lib/format";
import { downloadPayslipPdf } from "@/lib/payslip-pdf";
import { PaymentBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/payments/")({
  component: Payments,
});

type Period = "this" | "prev" | "all";
const periods: { key: Period; label: string }[] = [
  { key: "this", label: "Ce mois" },
  { key: "prev", label: "Mois précédent" },
  { key: "all", label: "Tout" },
];

function inMonth(date: string, offset: number) {
  const d = new Date(date + "T00:00:00");
  const ref = new Date();
  ref.setMonth(ref.getMonth() - offset);
  // Mock data is anchored around 2025-07; compare to a fixed "current" month.
  const now = new Date("2025-07-15T00:00:00");
  now.setMonth(now.getMonth() - offset);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function Payments() {
  const loading = useSimulatedLoad();
  const [period, setPeriod] = useState<Period>("all");

  const list =
    period === "all"
      ? payslips
      : payslips.filter((p) => inMonth(p.date, period === "this" ? 0 : 1));

  const total = list.reduce((s, p) => s + p.netAmount, 0);

  const refresh = () =>
    new Promise<void>((res) => setTimeout(() => res(), 800));

  return (
    <>
      <PageHeader title="Paiements" />
      <PullToRefresh onRefresh={refresh}>
        <div className="px-4 py-4">
          {/* Total */}
          {loading ? (
            <Skeleton className="h-28 w-full rounded-2xl" />
          ) : (
            <div className="rounded-2xl bg-primary p-5 shadow-card">
              <p className="text-sm font-medium text-primary-foreground/75">
                Total perçu ({periods.find((p) => p.key === period)?.label})
              </p>
              <p className="mt-1 text-[32px] font-extrabold leading-tight tracking-tight text-primary-foreground">
                {formatFCFA(total)}
              </p>
              <p className="mt-1 text-sm font-medium text-primary-foreground/90">
                {list.length} fiche{list.length > 1 ? "s" : ""} de paie
              </p>
            </div>
          )}

          {/* Period filter */}
          <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={cn(
                  "press-sm shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  period === p.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
                <Wallet className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">
                Aucun paiement
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Aucune fiche de paie sur cette période.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {list.map((p, i) => (
                <div
                  key={p.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="feed-card stagger flex items-center gap-3 rounded-2xl p-4"
                >
                  <Link
                    to="/payments/$id"
                    params={{ id: p.id }}
                    className="press flex min-w-0 flex-1 items-center gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {p.siteName}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(p.date)}
                        </span>
                        <PaymentBadge status={p.status} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatFCFA(p.netAmount)}
                      </p>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" strokeWidth={2} />
                    </div>
                  </Link>
                  <button
                    aria-label="Télécharger"
                    onClick={() => {
                      downloadPayslipPdf(p, getMission(p.missionId), worker, company);
                      toast.success("Fiche de paie téléchargée");
                    }}
                    className="press-sm grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"
                  >
                    <Download className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PullToRefresh>
    </>
  );
}
