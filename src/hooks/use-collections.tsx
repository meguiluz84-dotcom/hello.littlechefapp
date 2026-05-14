import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

export interface FamilyCollection {
  id: string;
  name: string;
  emoji: string;
  recipeIds: string[];
  createdAt: number;
}

const KEY = (pid: string) => `lc:p:${pid}:collections`;

export function useCollections() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [items, setItems] = useState<FamilyCollection[]>([]);

  useEffect(() => {
    if (!pid) { setItems([]); return; }
    try {
      const raw = localStorage.getItem(KEY(pid));
      setItems(raw ? JSON.parse(raw) : []);
    } catch { setItems([]); }
  }, [pid]);

  const persist = (next: FamilyCollection[]) => {
    setItems(next);
    if (pid) { try { localStorage.setItem(KEY(pid), JSON.stringify(next)); } catch { /* ignore */ } }
  };

  const create = useCallback((name: string, emoji = "📒") => {
    const c: FamilyCollection = { id: `col-${Date.now()}`, name, emoji, recipeIds: [], createdAt: Date.now() };
    persist([...items, c]);
    return c;
  }, [items, pid]);

  const update = useCallback((id: string, patch: Partial<FamilyCollection>) => {
    persist(items.map((x) => x.id === id ? { ...x, ...patch } : x));
  }, [items, pid]);

  const remove = useCallback((id: string) => {
    persist(items.filter((x) => x.id !== id));
  }, [items, pid]);

  const toggleRecipe = useCallback((id: string, recipeId: string) => {
    persist(items.map((x) => {
      if (x.id !== id) return x;
      const has = x.recipeIds.includes(recipeId);
      return { ...x, recipeIds: has ? x.recipeIds.filter((r) => r !== recipeId) : [...x.recipeIds, recipeId] };
    }));
  }, [items, pid]);

  return { items, create, update, remove, toggleRecipe };
}
