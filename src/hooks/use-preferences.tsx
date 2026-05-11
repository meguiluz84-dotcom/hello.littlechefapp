import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";
import type { Restrictions } from "@/data/recipeMeta";

export type AgeBucket = "2-3" | "4-5" | "6+";

export interface OnboardingPrefs {
  age: AgeBucket;
  restrictions: Restrictions;
}

const SHARED_KEYS = {
  sound: "lc:sound",
  lastRecipe: "lc:last-recipe",
} as const;

const playerKey = (pid: string, name: string) => `lc:p:${pid}:${name}`;

const DEFAULT_RESTR: Restrictions = { nuts: false, dairy: false, gluten: false, vegetarian: false };

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

export function usePreferences() {
  const { active, hydrated: pHydrated, update } = usePlayers();
  const pid = active?.id ?? null;

  const [hydrated, setHydrated] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [soundOn, setSoundOnState] = useState(true);
  const [lastRecipe, setLastRecipeState] = useState<string | null>(null);

  useEffect(() => {
    if (!pHydrated) return;
    setFavorites(pid ? readJSON<string[]>(playerKey(pid, "favorites"), []) : []);
    const s = localStorage.getItem(SHARED_KEYS.sound);
    setSoundOnState(s === null ? true : s === "1");
    setLastRecipeState(localStorage.getItem(SHARED_KEYS.lastRecipe));
    setHydrated(true);
  }, [pid, pHydrated]);

  // Onboarding now lives on the player itself
  const onboarding: OnboardingPrefs | null = active
    ? { age: active.age, restrictions: active.restrictions }
    : null;

  const setOnboarding = useCallback((p: OnboardingPrefs) => {
    if (pid) update(pid, { age: p.age, restrictions: p.restrictions });
  }, [pid, update]);

  const setSoundOn = useCallback((on: boolean) => {
    setSoundOnState(on);
    try { localStorage.setItem(SHARED_KEYS.sound, on ? "1" : "0"); } catch { /* ignore */ }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    if (!pid) return;
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeJSON(playerKey(pid, "favorites"), next);
      return next;
    });
  }, [pid]);

  const setLastRecipe = useCallback((id: string | null) => {
    setLastRecipeState(id);
    try {
      if (id) localStorage.setItem(SHARED_KEYS.lastRecipe, id);
      else localStorage.removeItem(SHARED_KEYS.lastRecipe);
    } catch { /* ignore */ }
  }, []);

  const saveResume = useCallback((recipeId: string, step: number) => {
    if (!pid) return;
    writeJSON(playerKey(pid, `resume-${recipeId}`), { step, ts: Date.now() });
  }, [pid]);

  const getResume = useCallback((recipeId: string): number | null => {
    if (!pid) return null;
    const v = readJSON<{ step: number; ts: number } | null>(playerKey(pid, `resume-${recipeId}`), null);
    return v?.step ?? null;
  }, [pid]);

  const clearResume = useCallback((recipeId: string) => {
    if (!pid) return;
    try { localStorage.removeItem(playerKey(pid, `resume-${recipeId}`)); } catch { /* ignore */ }
  }, [pid]);

  return {
    hydrated: hydrated && pHydrated,
    onboarding,
    setOnboarding,
    favorites,
    toggleFavorite,
    isFavorite: (id: string) => favorites.includes(id),
    soundOn,
    setSoundOn,
    lastRecipe,
    setLastRecipe,
    saveResume,
    getResume,
    clearResume,
    DEFAULT_RESTR,
  };
}
