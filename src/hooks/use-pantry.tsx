import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

const key = (pid: string) => `lc:p:${pid}:pantry`;

export function usePantry() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (!pid) { setItems([]); return; }
    try {
      const raw = localStorage.getItem(key(pid));
      setItems(raw ? JSON.parse(raw) : []);
    } catch { setItems([]); }
  }, [pid]);

  const persist = (next: string[]) => {
    setItems(next);
    if (pid) try { localStorage.setItem(key(pid), JSON.stringify(next)); } catch { /* ignore */ }
  };

  const toggle = useCallback((emoji: string) => {
    setItems((prev) => {
      const next = prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji];
      if (pid) try { localStorage.setItem(key(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const has = useCallback((emoji: string) => items.includes(emoji), [items]);
  const clear = useCallback(() => persist([]), [pid]); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, toggle, has, clear };
}

// Compute % match between recipe ingredients and pantry.
export function pantryMatch(ingredientEmojis: string[], pantry: string[]) {
  if (ingredientEmojis.length === 0) return { have: 0, total: 0, ratio: 0 };
  const have = ingredientEmojis.filter((e) => pantry.includes(e)).length;
  return { have, total: ingredientEmojis.length, ratio: have / ingredientEmojis.length };
}
