import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, CheckCircle2, Eye, EyeOff, MapPin, Wallet } from "lucide-react";
import {
  worker,
  currentMission,
  lastPayment,
  totalEarnings,
  payslips,
} from "@/lib/mock-data";
import { formatFCFA, formatDate, formatRange } from "@/lib/format";
import { Logo } from "@/components/Logo";
import { MissionBadge } from "@/components/StatusBadge";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useHiddenBalance } from "@/hooks/useHiddenBalance";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/home")({
  component: Home,
});

function Home() {
  const loading = useSimulatedLoad();
  const unreadCount = useUnreadCount();
  const { hidden, toggle: toggleHidden } = useHiddenBalance();

  const pendingPayments = payslips.filter((p) => p.status === "pending");
  const pendingTotal = pendingPayments.reduce((s, p) => s + p.netAmount, 0);

  const refresh = () =>
    new Promise<void>((res) =>
      setTimeout(() => {
        toast.success("Données actualisées");
        res();
      }, 900),
    );

  const initials = worker.firstName[0] + worker.lastName[0];

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="press-sm relative grid h-11 w-11 place-items-center rounded-full bg-secondary"
          >
            <Bell className="h-5 w-5 text-foreground" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-background" />
            )}
          </Link>
          <Link
            to="/profile"
            aria-label="Profil"
            className="press-sm grid h-11 w-11 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
          >
            {initials}
          </Link>
        </div>
      </header>

      <PullToRefresh onRefresh={refresh}>
        <div className="px-4">
          {/* Greeting */}
          <div className="mt-5">
            <p className="text-sm text-muted-foreground">Bonjour,</p>
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-foreground">
              {worker.firstName}
            </h1>
          </div>

          {loading ? (
            <HomeSkeleton />
          ) : (
            <div className="mt-5 space-y-4">
              {/* Pending payments glance */}
              {pendingPayments.length > 0 && (
                <div className="stagger relative rounded-2xl bg-primary p-5 shadow-card">
                  <button
                    onClick={toggleHidden}
                    aria-label={hidden ? "Afficher le solde" : "Masquer le solde"}
                    className="press-sm absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-primary-foreground"
                  >
                    {hidden ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.75} />
                    )}
                  </button>
                  <Link to="/payments" className="press block pr-10">
                    <p className="text-sm font-medium text-primary-foreground/75">
                      Paiement{pendingPayments.length > 1 ? "s" : ""} en attente
                    </p>
                    <p className="mt-1 text-3xl font-extrabold tracking-tight text-primary-foreground">
                      {hidden ? "•••••• FCFA" : formatFCFA(pendingTotal)}
                    </p>
                    <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary-foreground/90">
                      Voir mes paiements
                      <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </p>
                  </Link>
                </div>
              )}

              {/* Total earnings */}
              <Link
                to="/payments"
                className="press stagger feed-card flex items-center gap-3 rounded-2xl p-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Wallet className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">Total perçu</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFCFA(totalEarnings)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
              </Link>

              {/* Current mission */}
              <section>
                <SectionHeader title="Mission en cours" to="/missions" />
                <Link
                  to="/missions/$id"
                  params={{ id: currentMission.id }}
                  className="press feed-card mt-3 block rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug text-foreground">
                      {currentMission.siteName}
                    </h3>
                    <MissionBadge status={currentMission.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {currentMission.location}
                  </p>
                  <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Période</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatRange(currentMission.from, currentMission.to)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Par jour</p>
                      <p className="text-sm font-bold text-primary">
                        {formatFCFA(currentMission.dailyRate)}
                      </p>
                    </div>
                  </div>
                </Link>
              </section>

              {/* Last payment */}
              <section>
                <SectionHeader title="Dernier paiement" to="/payments" />
                <Link
                  to="/payments/$id"
                  params={{ id: lastPayment.id }}
                  className="press feed-card mt-3 flex items-center gap-3 rounded-2xl p-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {lastPayment.siteName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(lastPayment.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatFCFA(lastPayment.netAmount)}
                    </p>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" strokeWidth={2} />
                  </div>
                </Link>
              </section>
            </div>
          )}
        </div>
      </PullToRefresh>
    </>
  );
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <Link
        to={to}
        className={cn(
          "press-sm flex items-center gap-0.5 text-sm font-medium text-primary",
        )}
      >
        Tout voir
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </Link>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="mt-5 space-y-4">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}
