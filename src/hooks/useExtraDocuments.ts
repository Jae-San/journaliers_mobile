import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "journaliers-extra-documents";

export interface ExtraDocument {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
}

function readStored(): ExtraDocument[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ExtraDocument[]) : [];
  } catch {
    return [];
  }
}

/** Persisted list of extra uploaded documents, mirroring useTheme's SSR-safe read pattern. */
export function useExtraDocuments() {
  const [documents, setDocuments] = useState<ExtraDocument[]>([]);

  useEffect(() => {
    setDocuments(readStored());
  }, []);

  const addDocument = useCallback((doc: Omit<ExtraDocument, "id">) => {
    setDocuments((prev) => {
      const next = [...prev, { ...doc, id: `doc-${Date.now()}` }];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => {
      const next = prev.filter((d) => d.id !== id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { documents, addDocument, removeDocument };
}
