import { jsPDF } from "jspdf";
import type { Payslip, Mission, Worker, Company } from "./mock-data";
import { formatFCFA, formatDate, formatPayslipRef } from "./format";

const ORANGE: [number, number, number] = [234, 88, 12];
const INK: [number, number, number] = [30, 30, 30];
const MUTED: [number, number, number] = [110, 110, 110];
const LINE: [number, number, number] = [225, 225, 225];

const attendanceLabel: Record<string, string> = {
  present: "Présent",
  absent: "Absent",
  late: "Retard",
};

/** Builds a real, downloadable payslip document (not a stub) and saves it as a PDF. */
export function downloadPayslipPdf(
  payslip: Payslip,
  mission: Mission | undefined,
  worker: Worker,
  company: Company,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;
  const ref = formatPayslipRef(payslip.id);

  // Header band
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageWidth, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(company.name, marginX, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(company.address, marginX, 22);
  doc.text(`RCCM/NCC : ${company.taxId}`, marginX, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("FICHE DE PAIE JOURNALIÈRE", pageWidth - marginX, 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`N° ${ref}`, pageWidth - marginX, 22, { align: "right" });
  doc.text(`Émise le ${formatDate(new Date().toISOString().slice(0, 10))}`, pageWidth - marginX, 27, {
    align: "right",
  });

  let y = 52;

  const sectionTitle = (title: string) => {
    doc.setTextColor(...ORANGE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(title.toUpperCase(), marginX, y);
    y += 2;
    doc.setDrawColor(...LINE);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 6;
  };

  const row = (label: string, value: string, opts?: { bold?: boolean; big?: boolean }) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(opts?.big ? 12 : 10);
    doc.setTextColor(...MUTED);
    doc.text(label, marginX, y);
    doc.setTextColor(...(opts?.bold ? ORANGE : INK));
    doc.text(value, pageWidth - marginX, y, { align: "right" });
    y += opts?.big ? 8 : 6.5;
  };

  sectionTitle("Salarié");
  row("Nom et prénoms", `${worker.firstName} ${worker.lastName}`);
  row("Téléphone", worker.phone);
  y += 4;

  sectionTitle("Chantier & mission");
  row("Chantier", payslip.siteName);
  if (mission) row("Poste occupé", mission.role);
  row("Date travaillée", formatDate(payslip.date));
  row("Présence", attendanceLabel[payslip.attendance] ?? payslip.attendance);
  row("Heures effectuées", `${payslip.hours} h`);
  y += 4;

  sectionTitle("Détail du calcul");
  row("Salaire journalier (brut)", formatFCFA(payslip.grossAmount));
  const deductionRate = payslip.grossAmount > 0
    ? Math.round((payslip.deductions / payslip.grossAmount) * 100)
    : 0;
  row(`Cotisation sociale (${deductionRate}%)`, `- ${formatFCFA(payslip.deductions)}`);
  y += 1;
  doc.setDrawColor(...ORANGE);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 7;
  row("Net à payer", formatFCFA(payslip.netAmount), { bold: true, big: true });

  // Footer
  const footerY = 270;
  doc.setDrawColor(...LINE);
  doc.line(marginX, footerY, pageWidth - marginX, footerY);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Document généré automatiquement par Journalia. Ce bulletin atteste du paiement effectué au",
    marginX,
    footerY + 6,
  );
  doc.text(
    "travailleur désigné ci-dessus, pour la mission et la date indiquées, à des fins de contrôle administratif.",
    marginX,
    footerY + 10,
  );

  doc.setFont("helvetica", "normal");
  doc.text("Signature de l'employeur :", pageWidth - marginX - 55, footerY + 6);
  doc.setDrawColor(...INK);
  doc.line(pageWidth - marginX - 55, footerY + 16, pageWidth - marginX, footerY + 16);

  doc.save(`Fiche-de-paie-${ref}-${payslip.date}.pdf`);
}
