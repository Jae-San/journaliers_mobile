import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import {
  LogOut,
  Phone,
  MapPin,
  CalendarDays,
  ChevronRight,
  Moon,
  Camera,
  KeyRound,
  FileText,
  Plus,
  X,
} from "lucide-react";
import { worker } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { AccountBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useExtraDocuments } from "@/hooks/useExtraDocuments";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/profile")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const initials = worker.firstName[0] + worker.lastName[0];
  const { photo, setPhoto } = useProfilePhoto();
  const fileRef = useRef<HTMLInputElement>(null);
  const { documents, addDocument, removeDocument } = useExtraDocuments();
  const docFileRef = useRef<HTMLInputElement>(null);

  const onPhotoFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      toast.success("Photo de profil mise à jour");
    };
    reader.readAsDataURL(file);
  };

  const onDocumentFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      addDocument({
        name: file.name,
        mimeType: file.type,
        dataUrl: reader.result as string,
      });
      toast.success("Document ajouté");
    };
    reader.readAsDataURL(file);
    if (docFileRef.current) docFileRef.current.value = "";
  };

  return (
    <>
      <PageHeader title="Profil" />
      <div className="screen-enter px-4 py-4">
        {/* Identity */}
        <div className="flex flex-col items-center py-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhotoFile(e.target.files?.[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            aria-label="Changer la photo de profil"
            className="press relative grid h-20 w-20 place-items-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground"
          >
            {photo ? (
              <img
                src={photo}
                alt="Photo de profil"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              initials
            )}
            <span className="absolute -bottom-0.5 -right-0.5 grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-secondary text-foreground">
              <Camera className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </button>
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
            Pour modifier vos informations, contactez le support technique.
          </p>
        </section>

        {/* Security */}
        <section className="mt-6">
          <h3 className="mb-2 px-1 text-sm font-semibold text-foreground">
            Sécurité
          </h3>
          <Link
            to="/change-password"
            className="press feed-card flex w-full items-center gap-3 rounded-2xl p-3.5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
              <KeyRound className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-medium text-foreground">Modifier le mot de passe</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
          </Link>
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

        {/* Extra documents */}
        <section className="mt-6">
          <h3 className="mb-2 px-1 text-sm font-semibold text-foreground">
            Autres documents
          </h3>
          <input
            ref={docFileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => onDocumentFile(e.target.files?.[0])}
          />
          {documents.length > 0 && (
            <div className="feed-card mb-2 overflow-hidden rounded-2xl">
              {documents.map((doc, i) => (
                <div
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3",
                    i > 0 && "border-t border-border",
                  )}
                >
                  {doc.mimeType.startsWith("image/") ? (
                    <img
                      src={doc.dataUrl}
                      alt={doc.name}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <FileText className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  )}
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {doc.name}
                  </p>
                  <button
                    onClick={() => {
                      removeDocument(doc.id);
                      toast("Document supprimé");
                    }}
                    aria-label={`Supprimer ${doc.name}`}
                    className="press-sm grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => docFileRef.current?.click()}
            className="press flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-input bg-card px-4 py-3.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Plus className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-sm font-semibold text-foreground">
              Ajouter un document
            </span>
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
