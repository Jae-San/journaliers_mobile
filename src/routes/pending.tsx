import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/pending")({
  component: Pending,
});

function Pending() {
  const navigate = useNavigate();
  return (
    <div className="screen-enter flex min-h-screen flex-col items-center justify-center px-8 text-center">
      {/* Illustration */}
      <div className="pop-in mb-8">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-warning-soft">
          <Clock className="h-12 w-12 text-warning" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Demande en cours de vérification
      </h1>
      <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
        Merci ! Votre compte est en cours de validation par notre équipe. Vous
        recevrez une notification dès qu'il sera activé.
      </p>

      <div className="feed-card mt-8 w-full max-w-xs rounded-2xl p-4 text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Délai estimé
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          24 à 48 heures ouvrées
        </p>
      </div>

      <button
        onClick={() => navigate({ to: "/home" })}
        className="press mt-8 flex h-13 w-full max-w-xs items-center justify-center rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground shadow-card"
      >
        Continuer vers l'accueil
      </button>
    </div>
  );
}
