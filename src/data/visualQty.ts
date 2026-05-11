import type { Ingredient } from "./recipes";

export type VisualKind = "piece" | "spoon" | "cup" | "handful" | "slice" | "drop";

export interface VisualQty {
  kind: VisualKind;
  emoji: string;
  count: number;
}

const KIND_EMOJI: Record<VisualKind, string> = {
  piece: "🔢",
  spoon: "🥄",
  cup: "🥛",
  handful: "✋",
  slice: "🍰",
  drop: "💧",
};

// Map ingredient emoji -> kind hint
const KIND_BY_INGREDIENT: Record<string, VisualKind> = {
  "🥛": "cup",
  "🍯": "spoon",
  "🧂": "spoon",
  "🥜": "handful",
  "🌱": "spoon",
  "💧": "cup",
  "🫒": "spoon",
  "🍫": "spoon",
  "🍬": "handful",
  "🌾": "cup",
};

export function getVisualQty(ing: Ingredient): VisualQty {
  const qty = ing.quantity ?? 1;
  const kind = KIND_BY_INGREDIENT[ing.emoji] ?? "piece";
  // Cap visual repeats to keep the UI clean.
  const count = Math.min(qty, kind === "handful" || kind === "cup" ? 2 : 5);
  return { kind, emoji: KIND_EMOJI[kind], count: Math.max(1, count) };
}
