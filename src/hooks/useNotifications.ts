import { useSyncExternalStore } from "react";
import * as store from "@/lib/notifications-store";

export function useNotifications() {
  return useSyncExternalStore(store.subscribe, store.getNotifications, store.getNotifications);
}

export function useInvitations() {
  return useSyncExternalStore(store.subscribe, store.getInvitations, store.getInvitations);
}

export function useUnreadCount() {
  return useSyncExternalStore(store.subscribe, store.getUnreadCount, store.getUnreadCount);
}

export { markNotificationRead, setInvitationStatus } from "@/lib/notifications-store";
