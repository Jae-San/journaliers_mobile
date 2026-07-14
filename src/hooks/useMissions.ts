import { missions as staticMissions, type Mission, type MissionInvitation } from "@/lib/mock-data";
import { useInvitations } from "./useNotifications";

function invitationToMission(inv: MissionInvitation): Mission {
  return {
    id: inv.id,
    siteName: inv.siteName,
    location: inv.location,
    from: inv.from,
    to: inv.to,
    dailyRate: inv.dailyRate,
    status: "upcoming",
    role: inv.role,
    supervisor: inv.supervisor,
    attendance: [],
    colleagues: inv.colleagues,
  };
}

/** Static missions plus any mission invitation the worker has accepted. */
export function useAllMissions(): Mission[] {
  const invitations = useInvitations();
  const accepted = invitations
    .filter((i) => i.status === "accepted")
    .map(invitationToMission);
  return [...staticMissions, ...accepted];
}

export function useMission(id: string): Mission | undefined {
  return useAllMissions().find((m) => m.id === id);
}
