import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  Check,
  Camera,
  FileText,
  X,
  User,
  MapPin,
  CalendarDays,
  ChevronDown,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CI_CITIES } from "@/lib/cities";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";

export const Route = createFileRoute("/register")({
  component: Register,
});

const steps = ["Identité", "Adresse", "Document", "Récapitulatif"];

interface FormData {
  lastName: string;
  firstName: string;
  phone: string;
  password: string;
  birthDate: string;
  address: string;
  city: string;
  idImage: string | null;
}

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    lastName: "",
    firstName: "",
    phone: "",
    password: "",
    birthDate: "",
    address: "",
    city: "",
    idImage: null,
  });

  const set = (k: keyof FormData, v: string | null) =>
    setData((d) => ({ ...d, [k]: v }));

  const canNext =
    step === 0
      ? data.lastName && data.firstName && data.phone && data.password
      : step === 1
        ? data.birthDate && data.address && data.city
        : step === 2
          ? data.idImage
          : true;

  const next = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else navigate({ to: "/pending" });
  };
  const back = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigate({ to: "/" });
  };

  const socialSignup = (provider: "Google" | "Facebook") => {
    const demo =
      provider === "Google"
        ? { firstName: "Aïcha", lastName: "Koné", phone: "07 01 02 03 04" }
        : { firstName: "Yves", lastName: "Kouamé", phone: "05 06 07 08 09" };
    setData((d) => ({ ...d, ...demo, password: "social-oauth" }));
    toast.success(`Compte ${provider} connecté`);
    setStep(1);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-3 px-4 pb-2 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <button
          onClick={back}
          aria-label="Retour"
          className="press-sm -ml-1.5 grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          Étape {step + 1} sur {steps.length}
        </span>
      </header>

      {/* Stepper */}
      <div className="flex items-center gap-2 px-5 py-4">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all",
                  i < step
                    ? "bg-success text-success-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full transition-colors",
                    i < step ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium",
                i === step ? "text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div key={step} className="screen-enter flex-1 overflow-y-auto px-5 pb-6">
        {step === 0 && (
          <StepIdentity data={data} set={set} onSocialSignup={socialSignup} />
        )}
        {step === 1 && <StepAddress data={data} set={set} />}
        {step === 2 && <StepDocument image={data.idImage} set={set} />}
        {step === 3 && <StepSummary data={data} />}
      </div>

      <div className="border-t border-border bg-card px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <button
          disabled={!canNext}
          onClick={next}
          className="press flex h-13 w-full items-center justify-center rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground shadow-card disabled:opacity-40"
        >
          {step === steps.length - 1 ? "Soumettre" : "Continuer"}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "tel" | "numeric";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}

function Select({
  label,
  icon,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none bg-transparent text-[15px] outline-none",
            value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-foreground">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      </div>
    </label>
  );
}

function StepIdentity({
  data,
  set,
  onSocialSignup,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  onSocialSignup: (provider: "Google" | "Facebook") => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle title="Vos informations" sub="Renseignez votre identité" />
      <Input
        label="Nom"
        icon={<User className="h-5 w-5" strokeWidth={1.75} />}
        value={data.lastName}
        onChange={(v) => set("lastName", v)}
        placeholder="N'Guessan"
      />
      <Input
        label="Prénoms"
        value={data.firstName}
        onChange={(v) => set("firstName", v)}
        placeholder="Kouadio"
      />
      <Input
        label="Numéro de téléphone"
        type="tel"
        inputMode="tel"
        value={data.phone}
        onChange={(v) => set("phone", v)}
        placeholder="07 00 00 00 00"
      />
      <Input
        label="Mot de passe"
        type="password"
        value={data.password}
        onChange={(v) => set("password", v)}
        placeholder="••••••••"
      />

      <div className="pt-2">
        <SocialAuthButtons
          onGoogle={() => onSocialSignup("Google")}
          onFacebook={() => onSocialSignup("Facebook")}
        />
      </div>
    </div>
  );
}

function StepAddress({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
}) {
  const [locating, setLocating] = useState(false);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Géolocalisation non disponible sur cet appareil");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const json = await res.json();
          const displayAddress = json?.display_name as string | undefined;
          const detectedCity: string | undefined =
            json?.address?.city ?? json?.address?.town ?? json?.address?.county;

          set("address", displayAddress ?? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);

          const matchedCity = CI_CITIES.find(
            (c) => c.toLowerCase() === detectedCity?.toLowerCase(),
          );
          if (matchedCity) set("city", matchedCity);

          toast.success("Position détectée");
        } catch {
          set("address", `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          toast("Position détectée (adresse non résolue)");
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error("Localisation refusée ou indisponible");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Adresse" sub="Où résidez-vous ?" />
      <Input
        label="Date de naissance"
        type="date"
        icon={<CalendarDays className="h-5 w-5" strokeWidth={1.75} />}
        value={data.birthDate}
        onChange={(v) => set("birthDate", v)}
      />
      <div className="space-y-2">
        <Input
          label="Adresse"
          icon={<MapPin className="h-5 w-5" strokeWidth={1.75} />}
          value={data.address}
          onChange={(v) => set("address", v)}
          placeholder="Rue, quartier"
        />
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="press-sm flex items-center gap-1.5 text-[13px] font-semibold text-primary disabled:opacity-60"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            <LocateFixed className="h-4 w-4" strokeWidth={1.75} />
          )}
          {locating ? "Localisation en cours…" : "Utiliser ma position actuelle"}
        </button>
      </div>
      <Select
        label="Ville"
        icon={<MapPin className="h-5 w-5" strokeWidth={1.75} />}
        value={data.city}
        onChange={(v) => set("city", v)}
        placeholder="Sélectionnez votre ville"
        options={CI_CITIES}
      />
    </div>
  );
}

function StepDocument({
  image,
  set,
}: {
  image: string | null;
  set: (k: keyof FormData, v: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("idImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Pièce d'identité"
        sub="Ajoutez une photo lisible de votre CNI ou passeport"
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {image ? (
        <div className="feed-card overflow-hidden rounded-2xl">
          <div className="relative">
            <img src={image} alt="Pièce d'identité" className="h-56 w-full object-cover" />
            <button
              onClick={() => set("idImage", null)}
              aria-label="Supprimer"
              className="press-sm absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 text-success">
            <Check className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-sm font-medium">Document ajouté</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="press flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-input bg-card py-12"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Camera className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold text-foreground">
            Prendre une photo ou importer
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            JPG, PNG : 5 Mo max
          </span>
        </button>
      )}
    </div>
  );
}

function StepSummary({ data }: { data: FormData }) {
  const rows: [string, string][] = [
    ["Nom", data.lastName],
    ["Prénoms", data.firstName],
    ["Téléphone", data.phone],
    ["Date de naissance", data.birthDate],
    ["Adresse", data.address],
    ["Ville", data.city],
  ];
  return (
    <div className="space-y-4">
      <SectionTitle
        title="Récapitulatif"
        sub="Vérifiez vos informations avant de soumettre"
      />
      <div className="feed-card overflow-hidden rounded-2xl">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={cn(
              "flex items-center justify-between gap-3 px-4 py-3.5",
              i > 0 && "border-t border-border",
            )}
          >
            <span className="text-sm text-muted-foreground">{k}</span>
            <span className="max-w-[60%] truncate text-sm font-medium text-foreground">
              {v || "—"}
            </span>
          </div>
        ))}
      </div>
      {data.idImage && (
        <div className="feed-card overflow-hidden rounded-2xl">
          <img src={data.idImage} alt="Pièce d'identité" className="h-40 w-full object-cover" />
          <p className="px-4 py-3 text-sm text-muted-foreground">
            Pièce d'identité jointe
          </p>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-1">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}
