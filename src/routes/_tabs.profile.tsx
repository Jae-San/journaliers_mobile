import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Phone, MapPin, CalendarDays, ChevronRight, Moon } from "lucide-react";
import { worker } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { AccountBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/profile")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const initials = worker.firstName[0] + worker.lastName[0];

  return (
    <>
      <PageHeader title="Profil" />
      <div className="screen-enter px-4 py-4">
        {/* Identity */}
        <div className="flex flex-col items-center py-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground">
            {initials}
          </div>
          <h2 className="mt-3 text-lg font-bold tracking-tight text-foreground">
            {worker.firstName} {worker.lastName}
          </h2>
          <div className="mt-2">
            <AccountBadge status={worker.accountStatus} />
          </div>
        </div>

        {/* Appearance */}
        <section className="mt-2">
          <h3 className="mb-2 px-1 text-sm font-semibold text-foreground">
            Apparence
          </h3>
          <div className="feed-card flex items-center gap-3 rounded-2xl px-4 py-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
              <Moon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Mode sombre</p>
              <p className="text-sm text-muted-foreground">
                Basculez entre clair et sombre
              </p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Personal info */}
        <section className="mt-6">
          <h3 className="mb-2 px-1 text-sm font-semibold text-foreground">
            Informations personnelles
          </h3>
          <div className="feed-card overflow-hidden rounded-2xl">
            <InfoRow
              icon={<Phone className="h-5 w-5" strokeWidth={1.75} />}
              label="Téléphone"
              value={worker.phone}
            />
            <InfoRow
              icon={<CalendarDays className="h-5 w-5" strokeWidth={1.75} />}
              label="Date de naissance"
              value={formatDate(worker.birthDate)}
            />
            <InfoRow
              icon={<MapPin className="h-5 w-5" strokeWidth={1.75} />}
              label="Adresse"
              value={`${worker.address}, ${worker.city}`}
            />
          </div>
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Pour modifier vos informations, contactez votre administrateur.
          </p>
        </section>

        {/* ID document */}
        <section className="mt-6">
          <h3 className="mb-2 px-1 text-sm font-semibold text-foreground">
            Pièce d'identité
          </h3>
          <button
            onClick={() => toast("Aperçu de la pièce d'identité")}
            className="press feed-card flex w-full items-center gap-3 rounded-2xl p-3"
          >
            <img
              src={worker.idDocumentUrl}
              alt="Pièce d'identité"
              className="h-14 w-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="font-medium text-foreground">Carte d'identité</p>
              <p className="text-sm text-success">Vérifiée</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
          </button>
        </section>

        {/* Logout */}
        <button
          onClick={() => {
            toast("Déconnexion");
            navigate({ to: "/login" });
          }}
          className="press-sm mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-semibold text-danger"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.75} />
          Se déconnecter
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Journaliers · Version 1.0.0
        </p>
      </div>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
