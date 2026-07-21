import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MapPin, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { worker } from "@/lib/mock-data";
import { CI_CITIES } from "@/lib/cities";
import { PageHeader } from "@/components/PageHeader";
import { TextField, SelectField } from "@/components/FormField";
import { useProfileEditRequest } from "@/hooks/useProfileEditRequest";

export const Route = createFileRoute("/edit-profile")({
  component: EditProfile,
});

function EditProfile() {
  const navigate = useNavigate();
  const { request, submitRequest } = useProfileEditRequest();
  const [phone, setPhone] = useState(request?.phone ?? worker.phone);
  const [birthDate, setBirthDate] = useState(request?.birthDate ?? worker.birthDate);
  const [address, setAddress] = useState(request?.address ?? worker.address);
  const [city, setCity] = useState(request?.city ?? worker.city);

  const canSubmit = phone && birthDate && address && city;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    submitRequest({ phone, birthDate, address, city });
    toast.success("Modifications envoyées, en attente de validation");
    navigate({ to: "/profile" });
  };

  return (
    <>
      <PageHeader title="Modifier mes informations" back />
      <div className="screen-enter px-5 py-6">
        <p className="mb-5 text-sm text-muted-foreground">
          Vos modifications seront examinées par notre équipe avant d'être
          appliquées à votre profil.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <TextField
            label="Numéro de téléphone"
            type="tel"
            inputMode="tel"
            icon={<Phone className="h-5 w-5" strokeWidth={1.75} />}
            value={phone}
            onChange={setPhone}
            placeholder="07 00 00 00 00"
          />
          <TextField
            label="Date de naissance"
            type="date"
            icon={<CalendarDays className="h-5 w-5" strokeWidth={1.75} />}
            value={birthDate}
            onChange={setBirthDate}
          />
          <TextField
            label="Adresse"
            icon={<MapPin className="h-5 w-5" strokeWidth={1.75} />}
            value={address}
            onChange={setAddress}
            placeholder="Rue, quartier"
          />
          <SelectField
            label="Ville"
            icon={<MapPin className="h-5 w-5" strokeWidth={1.75} />}
            value={city}
            onChange={setCity}
            placeholder="Sélectionnez votre ville"
            options={CI_CITIES}
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="press mt-2 flex h-13 w-full items-center justify-center rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground shadow-card disabled:opacity-40"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </>
  );
}
