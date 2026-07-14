import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapPin, CalendarDays, Wallet, User, Check, X, Users } from "lucide-react";
import { getNotification, getInvitation } from "@/lib/mock-data";
import { formatFCFA, formatRange, formatDate } from "@/lib/format";
import { InvitationBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { useInvitations, markNotificationRead, setInvitationStatus } from "@/hooks/useNotifications";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/notifications/$id")({
  component: NotificationDetail,
});

function NotificationDetail() {
  const { id } = useParams({ from: "/_tabs/notifications/$id" });
  const notification = getNotification(id);
  const invitations = useInvitations();

  useEffect(() => {
    if (notification && !notification.read) markNotificationRead(notification.id);
  }, [notification]);

  if (!notification) {
    return (
      <>
        <PageHeader title="Notification" back />
        <div className="px-4 py-16 text-center text-muted-foreground">
          Notification introuvable.
        </div>
      </>
    );
  }

  if (notification.type !== "mission_invitation" || !notification.invitationId) {
    return (
      <>
        <PageHeader title="Notification" back />
        <div className="screen-enter px-4 py-4">
          <div className="feed-card rounded-2xl p-5">
            <h2 className="text-lg font-bold text-foreground">{notification.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(notification.date)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {notification.body}
            </p>
          </div>
        </div>
      </>
    );
  }

  const invitation = invitations.find((i) => i.id === notification.invitationId);
  const staticInvitation = getInvitation(notification.invitationId);
  const inv = invitation ?? staticInvitation;

  if (!inv) {
    return (
      <>
        <PageHeader title="Proposition de mission" back />
        <div className="px-4 py-16 text-center text-muted-foreground">
          Proposition introuvable.
        </div>
      </>
    );
  }

  const accept = () => {
    setInvitationStatus(inv.id, "accepted");
    toast.success("Mission acceptée — retrouvez-la dans vos missions");
  };
  const decline = () => {
    setInvitationStatus(inv.id, "declined");
    toast("Mission refusée");
  };

  return (
    <>
      <PageHeader title="Proposition de mission" back />
      <div className="screen-enter px-4 py-4">
        <div className="feed-card rounded-2xl p-5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground">
              {inv.siteName}
            </h2>
            <InvitationBadge status={inv.status} />
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" strokeWidth={1.75} />
            {inv.location}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <InfoTile
              icon={<CalendarDays className="h-4 w-4" strokeWidth={1.75} />}
              label="Période"
              value={formatRange(inv.from, inv.to)}
            />
            <InfoTile
              icon={<Wallet className="h-4 w-4" strokeWidth={1.75} />}
              label="Rémunération / jour"
              value={formatFCFA(inv.dailyRate)}
            />
            <InfoTile
              icon={<User className="h-4 w-4" strokeWidth={1.75} />}
              label="Poste"
              value={inv.role}
            />
            <InfoTile
              icon={<User className="h-4 w-4" strokeWidth={1.75} />}
              label="Chef de chantier"
              value={inv.supervisor}
            />
          </div>
        </div>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-1.5 text-base font-semibold text-foreground">
            <Users className="h-4 w-4" strokeWidth={1.75} />
            Collègues sur cette mission
          </h3>
          <div className="feed-card overflow-hidden rounded-2xl">
            {inv.colleagues.map((c, i) => (
              <div
                key={c.name}
                className={
                  "flex items-center gap-3 px-4 py-3" +
                  (i > 0 ? " border-t border-border" : "")
                }
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {c.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {inv.status === "pending" ? (
          <div className="mt-6 flex gap-3">
            <button
              onClick={decline}
              className="press feed-card flex h-13 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-bold text-danger"
            >
              <X className="h-5 w-5" strokeWidth={2} />
              Refuser
            </button>
            <button
              onClick={accept}
              className="press flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-bold text-primary-foreground shadow-card"
            >
              <Check className="h-5 w-5" strokeWidth={2} />
              Accepter
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              {inv.status === "accepted"
                ? "Vous avez accepté cette mission."
                : "Vous avez refusé cette mission."}
            </p>
            {inv.status === "accepted" && (
              <Link
                to="/missions"
                className="press flex h-13 w-full items-center justify-center rounded-full bg-primary text-[15px] font-bold text-primary-foreground shadow-card"
              >
                Voir mes missions
              </Link>
            )}
          </div>
        )}
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
