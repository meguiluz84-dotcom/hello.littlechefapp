import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

const playerKey = (pid: string) => `lc:p:${pid}:completed`;

export function useCompletedRecipes() {
  const { active, hydrated } = usePlayers();
  const pid = active?.id ?? null;
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    if (!pid) { setCompleted([]); return; }
    try {
      const raw = localStorage.getItem(playerKey(pid));
      setCompleted(raw ? JSON.parse(raw) : []);
    } catch { setCompleted([]); }
  }, [pid, hydrated]);

  const markCompleted = useCallback((recipeId: string) => {
    if (!pid) return;
    setCompleted((prev) => {
      if (prev.includes(recipeId)) return prev;
      const next = [...prev, recipeId];
      try { localStorage.setItem(playerKey(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const reset = useCallback(() => {
    if (!pid) return;
    setCompleted([]);
    try { localStorage.removeItem(playerKey(pid)); } catch { /* ignore */ }
  }, [pid]);

  const isCompleted = useCallback(
    (recipeId: string) => completed.includes(recipeId),
    [completed],
  );

  return { completed, markCompleted, isCompleted, reset };
}
