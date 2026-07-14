import { createFileRoute, useParams } from "@tanstack/react-router";
import { MapPin, User, CalendarDays, Wallet } from "lucide-react";
import { getMission, missionTotal } from "@/lib/mock-data";
import { formatFCFA, formatRange, formatDate } from "@/lib/format";
import { MissionBadge, AttendanceBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_tabs/missions/$id")({
  component: MissionDetail,
});

function MissionDetail() {
  const { id } = useParams({ from: "/_tabs/missions/$id" });
  const mission = getMission(id);

  if (!mission) {
    return (
      <>
        <PageHeader title="Mission" back />
        <div className="px-4 py-16 text-center text-muted-foreground">
          Mission introuvable.
        </div>
      </>
    );
  }

  const total = missionTotal(mission);
  const daysWorked = mission.attendance.filter((a) => a.status !== "absent").length;

  return (
    <>
      <PageHeader title="Détail mission" back />
      <div className="screen-enter px-4 py-4">
        {/* Overview */}
        <div className="feed-card rounded-2xl p-5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground">
              {mission.siteName}
            </h2>
            <MissionBadge status={mission.status} />
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" strokeWidth={1.75} />
            {mission.location}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <InfoTile
              icon={<CalendarDays className="h-4 w-4" strokeWidth={1.75} />}
              label="Période"
              value={formatRange(mission.from, mission.to)}
            />
            <InfoTile
              icon={<Wallet className="h-4 w-4" strokeWidth={1.75} />}
              label="Rémunération / jour"
              value={formatFCFA(mission.dailyRate)}
            />
            <InfoTile
              icon={<User className="h-4 w-4" strokeWidth={1.75} />}
              label="Poste"
              value={mission.role}
            />
            <InfoTile
              icon={<User className="h-4 w-4" strokeWidth={1.75} />}
              label="Chef de chantier"
              value={mission.supervisor}
            />
          </div>
        </div>

        {/* Cumulative pay */}
        <div className="mt-4 rounded-2xl bg-primary p-5 shadow-card">
          <p className="text-sm font-medium text-primary-foreground/75">
            Rémunération cumulée
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-primary-foreground">
            {formatFCFA(total)}
          </p>
          <p className="mt-1 text-sm font-medium text-primary-foreground/90">
            {daysWorked} jour{daysWorked > 1 ? "s" : ""} travaillé
            {daysWorked > 1 ? "s" : ""}
          </p>
        </div>

        {/* Attendance history */}
        <section className="mt-6">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Historique de présence
          </h3>
          {mission.attendance.length === 0 ? (
            <div className="feed-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
              La mission n'a pas encore commencé.
            </div>
          ) : (
            <div className="feed-card overflow-hidden rounded-2xl">
              {mission.attendance.map((a, i) => (
                <div
                  key={a.date}
                  className={
                    "flex items-center justify-between gap-3 px-4 py-3.5" +
                    (i > 0 ? " border-t border-border" : "")
                  }
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(a.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.amount > 0 ? formatFCFA(a.amount) : "Non rémunéré"}
                    </p>
                  </div>
                  <AttendanceBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
