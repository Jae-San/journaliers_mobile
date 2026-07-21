import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ShieldCheck, CalendarCheck, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Welcome,
});

const highlights = [
  { icon: CalendarCheck, text: "Suivez vos jours de présence" },
  { icon: Wallet, text: "Consultez vos paiements en FCFA" },
  { icon: ShieldCheck, text: "Vos documents sécurisés" },
];

function Welcome() {
  return (
    <div className="screen-enter flex min-h-dvh flex-col px-6 pb-8 pt-[calc(env(safe-area-inset-top)+2rem)]">
      <div className="flex flex-1 flex-col justify-center">
        <Logo size="lg" />

        <div className="mt-10">
          <h1 className="text-[2.15rem] font-extrabold leading-[1.1] tracking-tight text-foreground">
            Gérez vos missions
            <br />
            <span className="text-primary">en toute simplicité</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Missions, présence et rémunérations de travailleur journalier,
            réunis dans une seule application.
          </p>
        </div>

        <div className="mt-9 space-y-3">
          {highlights.map(({ icon: Icon, text }, i) => (
            <Link
              key={text}
              to="/login"
              style={{ animationDelay: `${i * 70}ms` }}
              className="press feed-card stagger flex items-center gap-3 rounded-2xl px-4 py-3.5"
            >
              <span className="grid h-10 w-10 shrink-0 animate-pulse place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-foreground">{text}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Link
          to="/register"
          className="press flex h-13 w-full items-center justify-center rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground shadow-card"
        >
          Créer mon compte
        </Link>
        <Link
          to="/login"
          className="press feed-card flex w-full items-center justify-center rounded-full py-4 text-[15px] font-semibold text-foreground"
        >
          J'ai déjà un compte
        </Link>
      </div>
    </div>
  );
}
