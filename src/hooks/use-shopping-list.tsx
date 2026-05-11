import { useCallback, useEffect, useState } from "react";

export interface ShoppingItem {
  emoji: string;
  checked: boolean;
}

const KEY = "lc:shopping-list";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch { setItems([]); }
  }, []);

  const persist = (next: ShoppingItem[]) => {
    setItems(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const addEmojis = useCallback((emojis: string[]) => {
    setItems((prev) => {
      const map = new Map(prev.map((i) => [i.emoji, i]));
      emojis.forEach((e) => { if (!map.has(e)) map.set(e, { emoji: e, checked: false }); });
      const next = Array.from(map.values());
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggle = useCallback((emoji: string) => {
    setItems((prev) => {
      const next = prev.map((i) => i.emoji === emoji ? { ...i, checked: !i.checked } : i);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const remove = useCallback((emoji: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.emoji !== emoji);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const clear = useCallback(() => persist([]), []);

  return { items, addEmojis, toggle, remove, clear };
}
