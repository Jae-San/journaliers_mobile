import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Wallet, Info, Bell } from "lucide-react";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/notifications/")({
  component: Notifications,
});

const iconByType: Record<NotificationType, typeof Briefcase> = {
  mission_invitation: Briefcase,
  payment: Wallet,
  info: Info,
};

function Notifications() {
  const notifications = useNotifications();
  const sorted = [...notifications].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <PageHeader title="Notifications" back />
      <div className="px-4 py-4">
        {sorted.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <Bell className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 font-semibold text-foreground">Aucune notification</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Vous serez averti ici des nouvelles missions et paiements.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((n, i) => {
              const Icon = iconByType[n.type];
              return (
                <Link
                  key={n.id}
                  to="/notifications/$id"
                  params={{ id: n.id }}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className={cn(
                    "press feed-card stagger flex items-start gap-3 rounded-2xl p-4",
                    !n.read && "border-primary/30",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                      n.type === "mission_invitation" && "bg-primary-soft text-primary",
                      n.type === "payment" && "bg-success-soft text-success",
                      n.type === "info" && "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-foreground">{n.title}</p>
                      {!n.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                      {n.body}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(n.date)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
