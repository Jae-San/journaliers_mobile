import { jsPDF } from "jspdf";
import type { Payslip, Mission, Worker, Company } from "./mock-data";
import { formatFCFA, formatDate, formatPayslipRef } from "./format";

const PERIWINKLE: [number, number, number] = [98, 96, 255];
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
  doc.setFillColor(...PERIWINKLE);
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
  doc.text(
    `Émise le ${formatDate(new Date().toISOString().slice(0, 10))}`,
    pageWidth - marginX,
    27,
    {
      align: "right",
    },
  );

  let y = 52;

  const sectionTitle = (title: string) => {
    doc.setTextColor(...PERIWINKLE);
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
    doc.setTextColor(...(opts?.bold ? PERIWINKLE : INK));
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
  const deductionRate =
    payslip.grossAmount > 0 ? Math.round((payslip.deductions / payslip.grossAmount) * 100) : 0;
  row(`Cotisation sociale (${deductionRate}%)`, `- ${formatFCFA(payslip.deductions)}`);
  y += 1;
  doc.setDrawColor(...PERIWINKLE);
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
    "Document généré automatiquement par Journaliers. Ce bulletin atteste du paiement effectué au",
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

/** Builds a downloadable summary document listing every payment, one line each, with a grand total. */
export function downloadPayslipsSummaryPdf(
  payslipsList: Payslip[],
  worker: Worker,
  company: Company,
  periodLabel: string,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;

  // Header band
  doc.setFillColor(...PERIWINKLE);
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
  doc.text("RÉCAPITULATIF DES PAIEMENTS", pageWidth - marginX, 16, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(periodLabel, pageWidth - marginX, 22, { align: "right" });
  doc.text(
    `Émis le ${formatDate(new Date().toISOString().slice(0, 10))}`,
    pageWidth - marginX,
    27,
    {
      align: "right",
    },
  );

  let y = 48;
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(`Salarié : ${worker.firstName} ${worker.lastName}`, marginX, y);
  y += 10;

  // Table columns
  const columns = [
    { label: "Date", width: 26, align: "left" as const },
    { label: "Chantier", width: 58, align: "left" as const },
    { label: "Heures", width: 18, align: "right" as const },
    { label: "Brut", width: 30, align: "right" as const },
    { label: "Retenue", width: 28, align: "right" as const },
    { label: "Net", width: 30, align: "right" as const },
  ];
  const tableWidth = columns.reduce((s, c) => s + c.width, 0);
  const startX = marginX + (pageWidth - 2 * marginX - tableWidth) / 2;

  const drawHeaderRow = () => {
    doc.setFillColor(...PERIWINKLE);
    doc.rect(startX, y - 5.5, tableWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    let x = startX;
    for (const col of columns) {
      const tx = col.align === "right" ? x + col.width - 2 : x + 2;
      doc.text(col.label, tx, y, { align: col.align === "right" ? "right" : "left" });
      x += col.width;
    }
    y += 7;
  };

  drawHeaderRow();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  const statusLabel: Record<string, string> = { paid: "Payé", pending: "En attente" };

  payslipsList.forEach((p, i) => {
    if (y > pageHeight - 45) {
      doc.addPage();
      y = 25;
      drawHeaderRow();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
    }

    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 255);
      doc.rect(startX, y - 4.5, tableWidth, 7, "F");
    }

    doc.setTextColor(...INK);
    let x = startX;
    const cells = [
      formatDate(p.date),
      p.siteName,
      `${p.hours} h`,
      formatFCFA(p.grossAmount),
      `- ${formatFCFA(p.deductions)}`,
      formatFCFA(p.netAmount),
    ];
    cells.forEach((text, ci) => {
      const col = columns[ci];
      const maxChars = ci === 1 ? 34 : 20;
      const clipped = text.length > maxChars ? text.slice(0, maxChars - 1) + "…" : text;
      const tx = col.align === "right" ? x + col.width - 2 : x + 2;
      doc.text(clipped, tx, y, { align: col.align === "right" ? "right" : "left" });
      x += col.width;
    });
    y += 7;

    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(`Statut : ${statusLabel[p.status] ?? p.status}`, startX + 2, y - 1.5);
    doc.setFontSize(8.5);
    y += 3.5;
  });

  y += 4;
  doc.setDrawColor(...PERIWINKLE);
  doc.line(startX, y, startX + tableWidth, y);
  y += 8;

  const totalGross = payslipsList.reduce((s, p) => s + p.grossAmount, 0);
  const totalDeductions = payslipsList.reduce((s, p) => s + p.deductions, 0);
  const totalNet = payslipsList.reduce((s, p) => s + p.netAmount, 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`${payslipsList.length} paiement${payslipsList.length > 1 ? "s" : ""}`, startX, y);
  doc.setTextColor(...INK);
  doc.text(`Total brut : ${formatFCFA(totalGross)}`, startX + tableWidth, y, { align: "right" });
  y += 6.5;
  doc.text(`Total retenues : - ${formatFCFA(totalDeductions)}`, startX + tableWidth, y, {
    align: "right",
  });
  y += 8;
  doc.setFontSize(13);
  doc.setTextColor(...PERIWINKLE);
  doc.text(`Total net perçu : ${formatFCFA(totalNet)}`, startX + tableWidth, y, { align: "right" });

  // Footer
  const footerY = pageHeight - 20;
  doc.setDrawColor(...LINE);
  doc.line(marginX, footerY, pageWidth - marginX, footerY);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Document généré automatiquement par Journaliers. Ce récapitulatif liste l'ensemble des paiements",
    marginX,
    footerY + 6,
  );
  doc.text(
    "effectués au travailleur désigné ci-dessus sur la période indiquée, à des fins de contrôle administratif.",
    marginX,
    footerY + 10,
  );

  doc.save(`Recapitulatif-paiements-${new Date().toISOString().slice(0, 10)}.pdf`);
}
