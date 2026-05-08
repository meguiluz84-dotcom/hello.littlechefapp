import { useCallback, useEffect, useState } from "react";
import type { Restrictions } from "@/data/recipeMeta";

export type AgeBucket = "2-3" | "4-5" | "6+";

export interface OnboardingPrefs {
  age: AgeBucket;
  restrictions: Restrictions;
}

const KEYS = {
  onboarding: "lc:onboarding-v2",
  lastRecipe: "lc:last-recipe",
  resume: (id: string) => `lc:resume-${id}`,
  favorites: "lc:favorites",
  sound: "lc:sound",
} as const;

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
  const [hydrated, setHydrated] = useState(false);
  const [onboarding, setOnboardingState] = useState<OnboardingPrefs | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [soundOn, setSoundOnState] = useState(true);
  const [lastRecipe, setLastRecipeState] = useState<string | null>(null);

  useEffect(() => {
    setOnboardingState(readJSON<OnboardingPrefs | null>(KEYS.onboarding, null));
    setFavorites(readJSON<string[]>(KEYS.favorites, []));
    const s = localStorage.getItem(KEYS.sound);
    setSoundOnState(s === null ? true : s === "1");
    setLastRecipeState(localStorage.getItem(KEYS.lastRecipe));
    setHydrated(true);
  }, []);

  const setOnboarding = useCallback((p: OnboardingPrefs) => {
    setOnboardingState(p);
    writeJSON(KEYS.onboarding, p);
  }, []);

  const resetOnboarding = useCallback(() => {
    setOnboardingState(null);
    try { localStorage.removeItem(KEYS.onboarding); } catch { /* ignore */ }
  }, []);

  const setSoundOn = useCallback((on: boolean) => {
    setSoundOnState(on);
    try { localStorage.setItem(KEYS.sound, on ? "1" : "0"); } catch { /* ignore */ }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeJSON(KEYS.favorites, next);
      return next;
    });
  }, []);

  const setLastRecipe = useCallback((id: string | null) => {
    setLastRecipeState(id);
    try {
      if (id) localStorage.setItem(KEYS.lastRecipe, id);
      else localStorage.removeItem(KEYS.lastRecipe);
    } catch { /* ignore */ }
  }, []);

  const saveResume = useCallback((recipeId: string, step: number) => {
    writeJSON(KEYS.resume(recipeId), { step, ts: Date.now() });
  }, []);

  const getResume = useCallback((recipeId: string): number | null => {
    const v = readJSON<{ step: number; ts: number } | null>(KEYS.resume(recipeId), null);
    return v?.step ?? null;
  }, []);

  const clearResume = useCallback((recipeId: string) => {
    try { localStorage.removeItem(KEYS.resume(recipeId)); } catch { /* ignore */ }
  }, []);

  return {
    hydrated,
    onboarding,
    setOnboarding,
    resetOnboarding,
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
