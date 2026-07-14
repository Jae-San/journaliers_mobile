/** Format a number as "XXX XXX FCFA" with spaces as thousands separators. */
export function formatFCFA(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const digits = Math.abs(Math.round(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${digits} FCFA`;
}

/** Format an ISO date (yyyy-mm-dd) to "12 juin 2025". */
export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Short date "12 juin". */
export function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/** Format a date range "12 juin – 30 juin 2025". */
export function formatRange(from: string, to: string): string {
  return `${formatDateShort(from)} – ${formatDate(to)}`;
}

/** Payslip reference shown on the document, e.g. "p-9001" -> "BP-9001". */
export function formatPayslipRef(payslipId: string): string {
  return `BP-${payslipId.replace(/^p-/, "").toUpperCase()}`;
}
