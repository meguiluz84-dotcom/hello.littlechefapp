import { useEffect, useState, useCallback } from "react";
import type { AvatarId } from "@/data/avatars";

const KEY = "little-chef:avatar";

export function useAvatar() {
  const [avatarId, setAvatarIdState] = useState<AvatarId | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY) as AvatarId | null;
      if (v) setAvatarIdState(v);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setAvatarId = useCallback((id: AvatarId) => {
    setAvatarIdState(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      // ignore
    }
  }, []);

  const clearAvatar = useCallback(() => {
    setAvatarIdState(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }, []);

  return { avatarId, setAvatarId, clearAvatar, hydrated };
}
