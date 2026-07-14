import { createFileRoute, useParams } from "@tanstack/react-router";
import { Download, Building2 } from "lucide-react";
import { getPayslip, getMission, worker, company } from "@/lib/mock-data";
import { formatFCFA, formatDate, formatPayslipRef } from "@/lib/format";
import { downloadPayslipPdf } from "@/lib/payslip-pdf";
import { AttendanceBadge, PaymentBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/payments/$id")({
  component: PayslipDetail,
});

function PayslipDetail() {
  const { id } = useParams({ from: "/_tabs/payments/$id" });
  const p = getPayslip(id);

  if (!p) {
    return (
      <>
        <PageHeader title="Fiche de paie" back />
        <div className="px-4 py-16 text-center text-muted-foreground">
          Fiche introuvable.
        </div>
      </>
    );
  }

  const mission = getMission(p.missionId);
  const deductionRate =
    p.grossAmount > 0 ? Math.round((p.deductions / p.grossAmount) * 100) : 0;

  const download = () => {
    downloadPayslipPdf(p, mission, worker, company);
    toast.success("Fiche de paie téléchargée en PDF");
  };

  return (
    <>
      <PageHeader title="Fiche de paie" back />
      <div className="screen-enter px-4 py-4">
        {/* Document card: mirrors the PDF that gets downloaded */}
        <div className="feed-card overflow-hidden rounded-2xl">
          {/* Letterhead */}
          <div className="bg-primary px-5 py-5 text-primary-foreground">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15">
                  <Building2 className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight">{company.name}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-primary-foreground/80">
                    {company.address}
                  </p>
                  <p className="text-[11px] leading-tight text-primary-foreground/80">
                    RCCM/NCC : {company.taxId}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/85">
                  Fiche de paie
                </p>
                <p className="text-[11px] text-primary-foreground/80">
                  N° {formatPayslipRef(p.id)}
                </p>
              </div>
            </div>
          </div>

          {/* Net highlight */}
          <div className="border-b border-border px-5 py-5 text-center">
            <p className="text-sm text-muted-foreground">Montant net</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-foreground">
              {formatFCFA(p.netAmount)}
            </p>
            <div className="mt-3 flex justify-center">
              <PaymentBadge status={p.status} />
            </div>
          </div>

          <Section title="Salarié">
            <Row k="Nom et prénoms" v={`${worker.firstName} ${worker.lastName}`} />
            <Row k="Téléphone" v={worker.phone} />
          </Section>

          <Section title="Chantier & mission">
            <Row k="Chantier" v={p.siteName} />
            {mission && <Row k="Poste" v={mission.role} />}
            <Row k="Date" v={formatDate(p.date)} />
            <Row k="Présence" v={<AttendanceBadge status={p.attendance} />} />
            <Row k="Heures" v={`${p.hours} h`} />
          </Section>

          <Section title="Détail du calcul" noBorder>
            <Row k="Montant brut" v={formatFCFA(p.grossAmount)} />
            <Row
              k={`Cotisation sociale (${deductionRate}%)`}
              v={<span className="text-danger">- {formatFCFA(p.deductions)}</span>}
            />
            <div className="flex items-center justify-between border-t border-border px-4 py-3.5">
              <span className="text-sm font-semibold text-foreground">Montant net</span>
              <span className="text-base font-bold text-primary">
                {formatFCFA(p.netAmount)}
              </span>
            </div>
          </Section>

          <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
            Document généré automatiquement par Journalia. Ce bulletin atteste du
            paiement effectué au travailleur désigné ci-dessus pour la mission et
            la date indiquées, à des fins de contrôle administratif.
          </p>
        </div>

        <button
          onClick={download}
          className="press mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground shadow-card"
        >
          <Download className="h-5 w-5" strokeWidth={1.75} />
          Télécharger PDF
        </button>
      </div>
    </>
  );
}

function Section({
  title,
  children,
  noBorder,
}: {
  title: string;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <section className={noBorder ? "" : "border-b border-border"}>
      <h3 className="px-4 pt-4 text-xs font-bold uppercase tracking-wide text-primary">
        {title}
      </h3>
      <div className="pb-1 pt-2">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="text-right text-sm font-medium text-foreground">{v}</span>
    </div>
  );
}
