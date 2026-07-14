import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, ChevronRight, Briefcase } from "lucide-react";
import { type MissionStatus } from "@/lib/mock-data";
import { formatFCFA, formatRange } from "@/lib/format";
import { MissionBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useSimulatedLoad } from "@/hooks/useSimulatedLoad";
import { useAllMissions } from "@/hooks/useMissions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/missions/")({
  component: Missions,
});

const filters: { key: MissionStatus | "all"; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "ongoing", label: "En cours" },
  { key: "upcoming", label: "À venir" },
  { key: "completed", label: "Terminées" },
];

function Missions() {
  const loading = useSimulatedLoad();
  const missions = useAllMissions();
  const [filter, setFilter] = useState<MissionStatus | "all">("all");

  const list =
    filter === "all" ? missions : missions.filter((m) => m.status === filter);

  const refresh = () =>
    new Promise<void>((res) => setTimeout(() => res(), 800));

  return (
    <>
      <PageHeader title="Missions" subtitle={`${missions.length} missions attribuées`} />
      <PullToRefresh onRefresh={refresh}>
        <div className="px-4 py-4">
          {/* Filters */}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "press-sm shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-36 w-full rounded-2xl" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <EmptyState onReset={() => { setFilter("all"); toast("Filtre réinitialisé"); }} />
          ) : (
            <div className="mt-4 space-y-3">
              {list.map((m, i) => (
                <Link
                  key={m.id}
                  to="/missions/$id"
                  params={{ id: m.id }}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="press feed-card stagger block rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug text-foreground">
                      {m.siteName}
                    </h3>
                    <MissionBadge status={m.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {m.location}
                  </p>
                  <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Période</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatRange(m.from, m.to)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Par jour</p>
                      <p className="flex items-center gap-1 text-sm font-bold text-primary">
                        {formatFCFA(m.dailyRate)}
                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PullToRefresh>
    </>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-16 flex flex-col items-center px-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
        <Briefcase className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 font-semibold text-foreground">
        Aucune mission pour le moment
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Aucune mission ne correspond à ce filtre.
      </p>
      <button
        onClick={onReset}
        className="press-sm mt-4 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary"
      >
        Réinitialiser
      </button>
    </div>
  );
}
