import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

export type Reaction = "😋" | "🙂" | "😖";

export interface Tasting {
  recipeId: string;
  reaction: Reaction;
  date: number;
}

const key = (pid: string) => `lc:p:${pid}:tastings`;

export function useTastings() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [items, setItems] = useState<Tasting[]>([]);

  useEffect(() => {
    if (!pid) { setItems([]); return; }
    try {
      const raw = localStorage.getItem(key(pid));
      setItems(raw ? JSON.parse(raw) : []);
    } catch { setItems([]); }
  }, [pid]);

  const log = useCallback((recipeId: string, reaction: Reaction) => {
    if (!pid) return;
    setItems((prev) => {
      // Replace existing reaction for the same recipe (keep latest).
      const filtered = prev.filter((t) => t.recipeId !== recipeId);
      const next = [...filtered, { recipeId, reaction, date: Date.now() }];
      try { localStorage.setItem(key(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const reactionFor = useCallback(
    (recipeId: string): Reaction | null =>
      items.find((t) => t.recipeId === recipeId)?.reaction ?? null,
    [items],
  );

  const lovedCount = items.filter((t) => t.reaction === "😋").length;

  return { items, log, reactionFor, lovedCount };
}
