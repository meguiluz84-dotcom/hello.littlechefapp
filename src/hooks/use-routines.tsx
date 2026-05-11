import { useCallback, useEffect, useState } from "react";

// Family cooking routines configured by the adult.
// Stored globally — they describe family rituals, not per-child progress.

export type RoutineDay = "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";

export interface Routine {
  id: string;
  emoji: string;
  label: string;
  day: RoutineDay;
  time: string; // HH:MM
}

const KEY = "lc:routines-v1";
const DAYS: { id: RoutineDay; label: string }[] = [
  { id: "lun", label: "Lun" }, { id: "mar", label: "Mar" }, { id: "mie", label: "Mié" },
  { id: "jue", label: "Jue" }, { id: "vie", label: "Vie" }, { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

function read(): Routine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Routine[];
  } catch { return []; }
}

function write(v: Routine[]) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ }
}

export function useRoutines() {
  const [items, setItems] = useState<Routine[]>([]);
  useEffect(() => { setItems(read()); }, []);

  const add = useCallback((r: Omit<Routine, "id">) => {
    setItems((prev) => {
      const next = [...prev, { ...r, id: `r_${Math.random().toString(36).slice(2, 8)}` }];
      write(next); return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => { const next = prev.filter((x) => x.id !== id); write(next); return next; });
  }, []);

  return { items, add, remove, days: DAYS };
}
