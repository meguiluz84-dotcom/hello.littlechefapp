import { useCallback, useEffect, useState } from "react";

// Per-step timer durations configured by the adult.
// Stored globally (not per-player) since the recipe is shared.
// Shape: { [recipeId]: { [stepIndex]: seconds } }

const KEY = "lc:step-timers-v1";

type Map = Record<string, Record<number, number>>;

function read(): Map {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Map;
  } catch { return {}; }
}

function write(v: Map) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ }
}

const listeners = new Set<() => void>();
let cache: Map | null = null;
function getCache(): Map {
  if (cache === null) cache = read();
  return cache;
}
function setCache(v: Map) {
  cache = v;
  write(v);
  listeners.forEach((cb) => cb());
}

export function getStepTimer(recipeId: string, stepIndex: number): number {
  const m = getCache()[recipeId];
  return m?.[stepIndex] ?? 0;
}

export function useStepTimers() {
  const [, force] = useState(0);
  useEffect(() => {
    const cb = () => force((x) => x + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);

  const get = useCallback((recipeId: string, stepIndex: number): number => {
    return getCache()[recipeId]?.[stepIndex] ?? 0;
  }, []);

  const set = useCallback((recipeId: string, stepIndex: number, seconds: number) => {
    const map = { ...getCache() };
    const recipe = { ...(map[recipeId] ?? {}) };
    if (seconds > 0) recipe[stepIndex] = seconds;
    else delete recipe[stepIndex];
    if (Object.keys(recipe).length === 0) delete map[recipeId];
    else map[recipeId] = recipe;
    setCache(map);
  }, []);

  return { get, set };
}
