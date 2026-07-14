import {
  notifications as initialNotifications,
  missionInvitations as initialInvitations,
  type AppNotification,
  type MissionInvitation,
  type InvitationStatus,
} from "./mock-data";

type Listener = () => void;

let notificationsState: AppNotification[] = [...initialNotifications];
let invitationsState: MissionInvitation[] = [...initialInvitations];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getNotifications() {
  return notificationsState;
}

export function getInvitations() {
  return invitationsState;
}

export function getUnreadCount() {
  return notificationsState.filter((n) => !n.read).length;
}

export function markNotificationRead(id: string) {
  const target = notificationsState.find((n) => n.id === id);
  if (!target || target.read) return;
  notificationsState = notificationsState.map((n) =>
    n.id === id ? { ...n, read: true } : n,
  );
  emit();
}

export function setInvitationStatus(id: string, status: InvitationStatus) {
  invitationsState = invitationsState.map((i) =>
    i.id === id ? { ...i, status } : i,
  );
  emit();
}
