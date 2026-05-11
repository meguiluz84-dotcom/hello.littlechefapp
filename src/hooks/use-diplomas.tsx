import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";
import type { RecipeCategory } from "@/data/recipes";

const playerKey = (pid: string) => `lc:p:${pid}:diplomas`;

export function useDiplomas() {
  const { active, hydrated } = usePlayers();
  const pid = active?.id ?? null;
  const [awarded, setAwarded] = useState<RecipeCategory[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    if (!pid) { setAwarded([]); return; }
    try {
      const raw = localStorage.getItem(playerKey(pid));
      setAwarded(raw ? JSON.parse(raw) : []);
    } catch { setAwarded([]); }
  }, [pid, hydrated]);

  const award = useCallback((cat: RecipeCategory) => {
    if (!pid) return;
    setAwarded((prev) => {
      if (prev.includes(cat)) return prev;
      const next = [...prev, cat];
      try { localStorage.setItem(playerKey(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const has = useCallback((cat: RecipeCategory) => awarded.includes(cat), [awarded]);

  return { awarded, award, has };
}
