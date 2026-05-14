import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

const KEY = (pid: string) => `lc:p:${pid}:no-cook`;

export function useNoCook() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!pid) { setEnabled(false); return; }
    try { setEnabled(localStorage.getItem(KEY(pid)) === "1"); } catch { setEnabled(false); }
  }, [pid]);

  const set = useCallback((v: boolean) => {
    setEnabled(v);
    if (!pid) return;
    try { localStorage.setItem(KEY(pid), v ? "1" : "0"); } catch { /* ignore */ }
  }, [pid]);

  const toggle = useCallback(() => set(!enabled), [enabled, set]);
  return { enabled, set, toggle };
}

const HOT_ACTIONS = new Set(["bake", "cut"]);
const HOT_EMOJIS = new Set(["🔥", "🔪", "🍳", "🫕", "♨️"]);

export function recipeIsNoCook(recipe: { steps: { actionIcon: string; emoji: string; adultRequired?: boolean }[] }): boolean {
  return recipe.steps.every((s) => !HOT_ACTIONS.has(s.actionIcon) && !HOT_EMOJIS.has(s.emoji));
}
