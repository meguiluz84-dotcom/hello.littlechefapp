import type { Restrictions } from "./recipeMeta";

export interface Swap {
  from: string;   // ingredient emoji used in recipe
  to: string;     // safe replacement emoji
  label: string;  // very short kid-friendly label of replacement
}

// Map each restriction to a list of safe substitutions.
const SWAPS_BY_RESTRICTION: Record<keyof Restrictions, Swap[]> = {
  nuts: [
    { from: "🥜", to: "🌻", label: "Semillas" },
  ],
  dairy: [
    { from: "🥛", to: "🌾", label: "Bebida de avena" },
    { from: "🧀", to: "🥑", label: "Aguacate" },
    { from: "🍨", to: "🍌", label: "Plátano helado" },
  ],
  gluten: [
    { from: "🍞", to: "🌽", label: "Pan de maíz" },
    { from: "🥞", to: "🥥", label: "Tortita de coco" },
    { from: "🍪", to: "🍌", label: "Galleta de plátano" },
    { from: "🌯", to: "🥬", label: "Hoja de lechuga" },
    { from: "🫓", to: "🥬", label: "Hoja de lechuga" },
    { from: "🥣", to: "🍚", label: "Arroz inflado" },
  ],
  vegetarian: [
    { from: "🥩", to: "🫘", label: "Legumbres" },
  ],
};

export function findSwap(
  emoji: string,
  active: Partial<Restrictions>,
): Swap | null {
  for (const k of Object.keys(active) as (keyof Restrictions)[]) {
    if (!active[k]) continue;
    const list = SWAPS_BY_RESTRICTION[k];
    const hit = list.find((s) => s.from === emoji);
    if (hit) return hit;
  }
  return null;
}

export function activeSwaps(active: Partial<Restrictions>): Swap[] {
  const out: Swap[] = [];
  (Object.keys(active) as (keyof Restrictions)[]).forEach((k) => {
    if (active[k]) out.push(...SWAPS_BY_RESTRICTION[k]);
  });
  return out;
}
