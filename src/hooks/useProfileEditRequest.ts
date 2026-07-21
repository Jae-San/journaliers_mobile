import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "journaliers-profile-edit-request";

export interface ProfileEditRequest {
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  submittedAt: string;
}

/** Persisted pending profile-info edit request, awaiting admin validation. */
export function useProfileEditRequest() {
  const [request, setRequestState] = useState<ProfileEditRequest | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    setRequestState(raw ? (JSON.parse(raw) as ProfileEditRequest) : null);
  }, []);

  const submitRequest = useCallback((data: Omit<ProfileEditRequest, "submittedAt">) => {
    const next: ProfileEditRequest = { ...data, submittedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setRequestState(next);
  }, []);

  return { request, submitRequest };
}
