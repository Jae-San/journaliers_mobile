import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { Bell, ChevronRight, Clock, CheckCircle2, MapPin } from "lucide-react";
import {
  worker,
  currentMission,
  lastPayment,
  totalEarnings,
} from "@/lib/mock-data";
import { formatFCFA, formatDate, formatRange } from "@/lib/format";
import { MissionBadge, AccountBadge } from "@/components/StatusBadge";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/home")({
  component: Home,
});

function Home() {
  const loading = useSimulatedLoad();
  const bellRef = useRef<HTMLButtonElement>(null);

  const refresh = () =>
    new Promise<void>((res) =>
      setTimeout(() => {
        toast.success("Données actualisées");
        res();
      }, 900),
    );

  const initials = worker.firstName[0] + worker.lastName[0];

  const ringBell = () => {
    toast("Aucune nouvelle notification");
    const el = bellRef.current;
    if (!el) return;
    el.classList.remove("shake-bell");
    void el.offsetWidth;
    el.classList.add("shake-bell");
  };

  return (
    <PullToRefresh onRefresh={refresh}>
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Bonjour,</p>
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-foreground">
              {worker.firstName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              ref={bellRef}
              onClick={ringBell}
              aria-label="Notifications"
              className="press-sm relative grid h-11 w-11 place-items-center rounded-full bg-secondary"
            >
              <Bell className="h-5 w-5 text-foreground" strokeWidth={1.75} />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-background" />
            </button>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials}
            </div>
          </div>
        </div>

        {loading ? (
          <HomeSkeleton />
        ) : (
          <div className="mt-5 space-y-4">
            {/* Account status */}
            <div className="feed-card stagger rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">Compte validé</p>
                    <AccountBadge status={worker.accountStatus} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Votre profil est vérifié. Vous pouvez recevoir des missions.
                  </p>
                </div>
              </div>
            </div>

            {/* Total earnings glance */}
            <Link
              to="/payments"
              className="press block rounded-2xl bg-primary p-5 shadow-card"
            >
              <p className="text-sm font-medium text-primary-foreground/75">
                Total perçu
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-primary-foreground">
                {formatFCFA(totalEarnings)}
              </p>
              <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary-foreground/90">
                Voir mes paiements
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </p>
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
