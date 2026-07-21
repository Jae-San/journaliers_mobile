import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/change-password")({
  component: ChangePassword,
});

function ChangePassword() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const mismatch = next.length > 0 && confirm.length > 0 && next !== confirm;
  const canSubmit = current && next && confirm && !mismatch;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      toast.success("Mot de passe mis à jour");
      navigate({ to: "/profile" });
    }, 700);
  };

  return (
    <>
      <PageHeader title="Modifier le mot de passe" back />
      <div className="screen-enter px-5 py-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Mot de passe actuel" value={current} onChange={setCurrent} show={show} />
          <Field label="Nouveau mot de passe" value={next} onChange={setNext} show={show} />
          <Field
            label="Confirmer le nouveau mot de passe"
            value={confirm}
            onChange={setConfirm}
            show={show}
            error={mismatch ? "Les mots de passe ne correspondent pas" : undefined}
          />

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="press-sm flex items-center gap-1.5 text-[13px] font-semibold text-primary"
          >
            {show ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            )}
            {show ? "Masquer les mots de passe" : "Afficher les mots de passe"}
          </button>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="press mt-2 flex h-13 w-full items-center justify-center rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground shadow-card disabled:opacity-40"
          >
            {loading ? "Mise à jour…" : "Mettre à jour"}
          </button>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  show,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <span className="text-muted-foreground">
          <Lock className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <input
          required
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </label>
  );
}
