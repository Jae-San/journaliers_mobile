export type AccountStatus = "pending" | "validated" | "rejected";
export type MissionStatus = "ongoing" | "upcoming" | "completed";
export type AttendanceStatus = "present" | "absent" | "late";
export type PaymentStatus = "paid" | "pending";

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  accountStatus: AccountStatus;
  rejectionReason?: string;
  idDocumentUrl: string;
}

export interface Attendance {
  date: string;
  status: AttendanceStatus;
  amount: number;
}

export interface Mission {
  id: string;
  siteName: string;
  location: string;
  from: string;
  to: string;
  dailyRate: number;
  status: MissionStatus;
  role: string;
  supervisor: string;
  attendance: Attendance[];
}

export interface Payslip {
  id: string;
  date: string;
  siteName: string;
  missionId: string;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  hours: number;
  attendance: AttendanceStatus;
  status: PaymentStatus;
}

export interface Company {
  name: string;
  address: string;
  taxId: string;
}

export const company: Company = {
  name: "BTP Ivoire Construction",
  address: "Zone Industrielle, Yopougon, Abidjan",
  taxId: "CI-ABJ-2019-B-58214",
};

export const worker: Worker = {
  id: "w-001",
  firstName: "Kouadio",
  lastName: "N'Guessan",
  phone: "+225 07 58 42 19 03",
  birthDate: "1994-03-12",
  address: "Rue L112, Angré 8e Tranche",
  city: "Abidjan",
  accountStatus: "validated",
  idDocumentUrl:
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=60",
};

export const missions: Mission[] = [
  {
    id: "m-101",
    siteName: "Résidence Les Palmiers",
    location: "Cocody, Abidjan",
    from: "2025-06-16",
    to: "2025-07-18",
    dailyRate: 12000,
    status: "ongoing",
    role: "Maçon",
    supervisor: "Ibrahim Traoré",
    attendance: [
      { date: "2025-07-07", status: "present", amount: 12000 },
      { date: "2025-07-05", status: "present", amount: 12000 },
      { date: "2025-07-04", status: "late", amount: 10000 },
      { date: "2025-07-03", status: "present", amount: 12000 },
      { date: "2025-07-02", status: "absent", amount: 0 },
      { date: "2025-07-01", status: "present", amount: 12000 },
      { date: "2025-06-30", status: "present", amount: 12000 },
    ],
  },
  {
    id: "m-102",
    siteName: "Pont de Jacqueville — Lot 3",
    location: "Jacqueville",
    from: "2025-07-21",
    to: "2025-08-30",
    dailyRate: 15000,
    status: "upcoming",
    role: "Coffreur",
    supervisor: "Aya Koffi",
    attendance: [],
  },
  {
    id: "m-103",
    siteName: "Marché de Treichville — Réhabilitation",
    location: "Treichville, Abidjan",
    from: "2025-04-02",
    to: "2025-05-28",
    dailyRate: 11000,
    status: "completed",
    role: "Manœuvre",
    supervisor: "Serge Bamba",
    attendance: [
      { date: "2025-05-28", status: "present", amount: 11000 },
      { date: "2025-05-27", status: "present", amount: 11000 },
      { date: "2025-05-26", status: "late", amount: 9000 },
      { date: "2025-05-23", status: "present", amount: 11000 },
    ],
  },
];

export const payslips: Payslip[] = [
  {
    id: "p-9001",
    date: "2025-07-07",
    siteName: "Résidence Les Palmiers",
    missionId: "m-101",
    grossAmount: 12000,
    deductions: 600,
    netAmount: 11400,
    hours: 8,
    attendance: "present",
    status: "paid",
  },
  {
    id: "p-9002",
    date: "2025-07-05",
    siteName: "Résidence Les Palmiers",
    missionId: "m-101",
    grossAmount: 12000,
    deductions: 600,
    netAmount: 11400,
    hours: 8,
    attendance: "present",
    status: "paid",
  },
  {
    id: "p-9003",
    date: "2025-07-04",
    siteName: "Résidence Les Palmiers",
    missionId: "m-101",
    grossAmount: 10000,
    deductions: 500,
    netAmount: 9500,
    hours: 6.5,
    attendance: "late",
    status: "paid",
  },
  {
    id: "p-9004",
    date: "2025-07-01",
    siteName: "Résidence Les Palmiers",
    missionId: "m-101",
    grossAmount: 12000,
    deductions: 600,
    netAmount: 11400,
    hours: 8,
    attendance: "present",
    status: "pending",
  },
  {
    id: "p-9005",
    date: "2025-06-30",
    siteName: "Résidence Les Palmiers",
    missionId: "m-101",
    grossAmount: 12000,
    deductions: 600,
    netAmount: 11400,
    hours: 8,
    attendance: "present",
    status: "paid",
  },
  {
    id: "p-8005",
    date: "2025-05-28",
    siteName: "Marché de Treichville",
    missionId: "m-103",
    grossAmount: 11000,
    deductions: 550,
    netAmount: 10450,
    hours: 8,
    attendance: "present",
    status: "paid",
  },
  {
    id: "p-8004",
    date: "2025-05-27",
    siteName: "Marché de Treichville",
    missionId: "m-103",
    grossAmount: 11000,
    deductions: 550,
    netAmount: 10450,
    hours: 8,
    attendance: "present",
    status: "paid",
  },
  {
    id: "p-8003",
    date: "2025-05-26",
    siteName: "Marché de Treichville",
    missionId: "m-103",
    grossAmount: 9000,
    deductions: 450,
    netAmount: 8550,
    hours: 6,
    attendance: "late",
    status: "paid",
  },
];

export const totalEarnings = payslips.reduce((s, p) => s + p.netAmount, 0);

export const lastPayment = payslips.find((p) => p.status === "paid")!;

export const currentMission = missions.find((m) => m.status === "ongoing")!;

export function getMission(id: string) {
  return missions.find((m) => m.id === id);
}

export function getPayslip(id: string) {
  return payslips.find((p) => p.id === id);
}

export function missionTotal(m: Mission) {
  return m.attendance.reduce((s, a) => s + a.amount, 0);
}
