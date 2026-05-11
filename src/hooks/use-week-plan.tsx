import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

export type DayKey = "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";
export type MealKey = "desayuno" | "merienda";

export const DAYS: { id: DayKey; label: string }[] = [
  { id: "lun", label: "Lun" },
  { id: "mar", label: "Mar" },
  { id: "mie", label: "Mié" },
  { id: "jue", label: "Jue" },
  { id: "vie", label: "Vie" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

export const MEALS: { id: MealKey; emoji: string; label: string }[] = [
  { id: "desayuno", emoji: "🥣", label: "Desayuno" },
  { id: "merienda", emoji: "🍎", label: "Merienda" },
];

export type WeekPlan = Partial<Record<`${DayKey}-${MealKey}`, string>>; // recipeId

const planKey = (pid: string) => `lc:p:${pid}:week-plan`;

const DAY_INDEX: DayKey[] = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
export function todayKey(): DayKey {
  return DAY_INDEX[new Date().getDay()];
}

export function useWeekPlan() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [plan, setPlan] = useState<WeekPlan>({});

  useEffect(() => {
    if (!pid) { setPlan({}); return; }
    try {
      const raw = localStorage.getItem(planKey(pid));
      setPlan(raw ? JSON.parse(raw) : {});
    } catch { setPlan({}); }
  }, [pid]);

  const setSlot = useCallback((day: DayKey, meal: MealKey, recipeId: string | null) => {
    if (!pid) return;
    setPlan((prev) => {
      const next = { ...prev };
      const k = `${day}-${meal}` as const;
      if (recipeId) next[k] = recipeId;
      else delete next[k];
      try { localStorage.setItem(planKey(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const clear = useCallback(() => {
    if (!pid) return;
    setPlan({});
    try { localStorage.removeItem(planKey(pid)); } catch { /* ignore */ }
  }, [pid]);

  return { plan, setSlot, clear };
}
