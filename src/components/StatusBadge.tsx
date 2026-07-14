import { cn } from "@/lib/utils";
import type {
  MissionStatus,
  AttendanceStatus,
  AccountStatus,
  PaymentStatus,
  InvitationStatus,
} from "@/lib/mock-data";

type Tone = "success" | "warning" | "danger" | "primary" | "neutral";

const toneClasses: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  primary: "bg-primary-soft text-primary",
  neutral: "bg-muted text-muted-foreground",
};

function Pill({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-success": tone === "success",
          "bg-warning": tone === "warning",
          "bg-danger": tone === "danger",
          "bg-primary": tone === "primary",
          "bg-muted-foreground": tone === "neutral",
        })}
      />
      {children}
    </span>
  );
}

const missionMap: Record<MissionStatus, { tone: Tone; label: string }> = {
  ongoing: { tone: "primary", label: "En cours" },
  upcoming: { tone: "warning", label: "À venir" },
  completed: { tone: "neutral", label: "Terminée" },
};

const attendanceMap: Record<AttendanceStatus, { tone: Tone; label: string }> = {
  present: { tone: "success", label: "Présent" },
  absent: { tone: "danger", label: "Absent" },
  late: { tone: "warning", label: "Retard" },
};

const accountMap: Record<AccountStatus, { tone: Tone; label: string }> = {
  validated: { tone: "success", label: "Validé" },
  pending: { tone: "warning", label: "En attente" },
  rejected: { tone: "danger", label: "Rejeté" },
};

const paymentMap: Record<PaymentStatus, { tone: Tone; label: string }> = {
  paid: { tone: "success", label: "Payé" },
  pending: { tone: "warning", label: "En attente" },
};

const invitationMap: Record<InvitationStatus, { tone: Tone; label: string }> = {
  pending: { tone: "warning", label: "En attente de réponse" },
  accepted: { tone: "success", label: "Acceptée" },
  declined: { tone: "danger", label: "Refusée" },
};

export function MissionBadge({ status, className }: { status: MissionStatus; className?: string }) {
  const { tone, label } = missionMap[status];
  return <Pill tone={tone} className={className}>{label}</Pill>;
}

export function AttendanceBadge({ status, className }: { status: AttendanceStatus; className?: string }) {
  const { tone, label } = attendanceMap[status];
  return <Pill tone={tone} className={className}>{label}</Pill>;
}

export function AccountBadge({ status, className }: { status: AccountStatus; className?: string }) {
  const { tone, label } = accountMap[status];
  return <Pill tone={tone} className={className}>{label}</Pill>;
}

export function PaymentBadge({ status, className }: { status: PaymentStatus; className?: string }) {
  const { tone, label } = paymentMap[status];
  return <Pill tone={tone} className={className}>{label}</Pill>;
}

export function InvitationBadge({ status, className }: { status: InvitationStatus; className?: string }) {
  const { tone, label } = invitationMap[status];
  return <Pill tone={tone} className={className}>{label}</Pill>;
}
