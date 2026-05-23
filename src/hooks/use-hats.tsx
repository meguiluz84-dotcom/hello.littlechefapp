import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlayers } from "./use-players";
import { useCompletedRecipes } from "./use-completed-recipes";
import { HATS, hatsUnlocked, nextHat, type ChefHat } from "@/data/hats";

const equippedKey = (pid: string) => `lc:p:${pid}:hat-equipped`;
const seenKey = (pid: string) => `lc:p:${pid}:hats-seen`;

export function useHats() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const { completed } = useCompletedRecipes();
  const count = completed.length;

  const unlocked = useMemo(() => hatsUnlocked(count), [count]);
  const next = useMemo(() => nextHat(count), [count]);

  const [equippedId, setEquippedId] = useState<string>("classic");
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    if (!pid) return;
    try {
      setEquippedId(localStorage.getItem(equippedKey(pid)) || "classic");
      const raw = localStorage.getItem(seenKey(pid));
      setSeen(raw ? JSON.parse(raw) : []);
    } catch { /* ignore */ }
  }, [pid]);

  const equip = useCallback((id: string) => {
    if (!pid) return;
    if (!unlocked.some((h) => h.id === id)) return;
    setEquippedId(id);
    try { localStorage.setItem(equippedKey(pid), id); } catch { /* ignore */ }
  }, [pid, unlocked]);

  const markSeen = useCallback((ids: string[]) => {
    if (!pid || ids.length === 0) return;
    setSeen((prev) => {
      const next = Array.from(new Set([...prev, ...ids]));
      try { localStorage.setItem(seenKey(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  // Hats unlocked but not yet seen by the kid.
  const freshHats: ChefHat[] = unlocked.filter((h) => !seen.includes(h.id));

  const equipped: ChefHat =
    unlocked.find((h) => h.id === equippedId) ?? unlocked[unlocked.length - 1] ?? HATS[0];

  return { all: HATS, unlocked, next, equipped, equip, freshHats, markSeen };
}
