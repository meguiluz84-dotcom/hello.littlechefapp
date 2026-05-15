import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

// 4 reactions per the family-feedback spec.
// 😍 me encantó · 🙂 estuvo bien · 😖 no me gustó · 🔁 quiero repetir
export type Reaction = "😍" | "🙂" | "😖" | "🔁";

export interface Tasting {
  recipeId: string;
  reaction: Reaction;
  date: number;
  note?: string;
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
      const parsed = raw ? (JSON.parse(raw) as Tasting[]) : [];
      // Migrate legacy "😋" → "😍".
      const migrated = parsed.map((t) =>
        (t.reaction as unknown as string) === "😋" ? { ...t, reaction: "😍" as Reaction } : t,
      );
      setItems(migrated);
    } catch { setItems([]); }
  }, [pid]);

  const log = useCallback((recipeId: string, reaction: Reaction, note?: string) => {
    if (!pid) return;
    setItems((prev) => {
      const filtered = prev.filter((t) => t.recipeId !== recipeId);
      const next = [...filtered, { recipeId, reaction, date: Date.now(), ...(note ? { note } : {}) }];
      try { localStorage.setItem(key(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const setNote = useCallback((recipeId: string, note: string) => {
    if (!pid) return;
    setItems((prev) => {
      const next = prev.map((t) => t.recipeId === recipeId ? { ...t, note } : t);
      try { localStorage.setItem(key(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const reactionFor = useCallback(
    (recipeId: string): Reaction | null =>
      items.find((t) => t.recipeId === recipeId)?.reaction ?? null,
    [items],
  );

  const lovedCount = items.filter((t) => t.reaction === "😍").length;

  return { items, log, setNote, reactionFor, lovedCount };
}
