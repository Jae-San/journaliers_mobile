import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: Login,
});

type LoginMethod = "phone" | "email";

function Login() {
  const navigate = useNavigate();
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>("phone");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Connexion réussie");
      navigate({ to: "/home" });
    }, 700);
  };

  const socialLogin = (provider: "Google") => {
    toast.success(`Connecté avec ${provider}`);
    navigate({ to: "/home" });
  };

  return (
    <div className="screen-enter flex min-h-dvh flex-col px-6 pb-8 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <button
        onClick={() => router.history.back()}
        aria-label="Retour"
        className="press-sm -ml-1.5 grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-muted"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="flex flex-1 flex-col justify-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-foreground">
          Bon retour
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Connectez-vous pour accéder à vos missions
        </p>

        <div className="mt-6 flex gap-2 rounded-full bg-secondary p-1">
          {(
            [
              { key: "phone", label: "Téléphone" },
              { key: "email", label: "E-mail" },
            ] as const
          ).map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMethod(m.key)}
              className={cn(
                "press-sm flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
                method === m.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {method === "phone" ? (
            <Field
              icon={<Phone className="h-5 w-5" strokeWidth={1.75} />}
              label="Numéro de téléphone"
            >
              <input
                required
                type="tel"
                inputMode="tel"
                placeholder="07 00 00 00 00"
                className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </Field>
          ) : (
            <Field
              icon={<Mail className="h-5 w-5" strokeWidth={1.75} />}
              label="Adresse e-mail"
            >
              <input
                required
                type="email"
                inputMode="email"
                placeholder="nom@exemple.com"
                className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </Field>
          )}

          <Field
            icon={<Lock className="h-5 w-5" strokeWidth={1.75} />}
            label="Mot de passe"
            action={
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="press-sm text-muted-foreground"
                aria-label="Afficher le mot de passe"
              >
                {showPwd ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.75} />
                )}
              </button>
            }
          >
            <input
              required
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </Field>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-semibold text-primary"
              onClick={() => toast("Un lien de réinitialisation a été envoyé")}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="press mt-2 flex h-13 w-full items-center justify-center rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground shadow-card disabled:opacity-70"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <div className="mt-6">
          <SocialAuthButtons onGoogle={() => socialLogin("Google")} />
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-semibold text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

function Field({
  icon,
  label,
  action,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <span className="text-muted-foreground">{icon}</span>
        <div className="min-w-0 flex-1">{children}</div>
        {action}
      </div>
    </label>
  );
}
