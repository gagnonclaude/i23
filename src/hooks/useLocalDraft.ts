import { useState, useEffect, useCallback } from "react";

/**
 * Auto-save dans localStorage.
 * Sauvegarde à chaque changement, restaure au rechargement, efface à la soumission.
 */
export function useLocalDraft<T>(key: string, initial: T) {
  const storageKey = `i23_draft_${key}`;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // localStorage plein ou indisponible -- on continue sans erreur
    }
  }, [storageKey, value]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  return [value, setValue, clear] as const;
}
