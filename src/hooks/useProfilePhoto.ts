import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "journaliers-profile-photo";

/** Persisted profile photo (data URL), mirroring useTheme's SSR-safe read pattern. */
export function useProfilePhoto() {
  const [photo, setPhotoState] = useState<string | null>(null);

  useEffect(() => {
    setPhotoState(window.localStorage.getItem(STORAGE_KEY));
  }, []);

  const setPhoto = useCallback((dataUrl: string | null) => {
    if (dataUrl) window.localStorage.setItem(STORAGE_KEY, dataUrl);
    else window.localStorage.removeItem(STORAGE_KEY);
    setPhotoState(dataUrl);
  }, []);

  return { photo, setPhoto };
}
