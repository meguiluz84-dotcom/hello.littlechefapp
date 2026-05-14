import type { Ingredient } from "./recipes";

export type VisualKind = "piece" | "spoon" | "cup" | "handful" | "slice" | "drop" | "cup-half";

export interface VisualQty {
  kind: VisualKind;
  emoji: string;
  count: number;
  label?: string;
}

const KIND_EMOJI: Record<VisualKind, string> = {
  piece: "🔢",
  spoon: "🥄",
  cup: "🥛",
  "cup-half": "🥛",
  handful: "✋",
  slice: "🍰",
  drop: "💧",
};

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

// Map explicit quantityLabel → visual kind + count
function fromLabel(label: string): VisualQty | null {
  const l = label.toLowerCase().trim();
  if (l === "1 taza" || l === "una taza")     return { kind: "cup",      emoji: "🥛", count: 1, label: "1 taza" };
  if (l === "media taza" || l === "1/2 taza") return { kind: "cup-half", emoji: "🥛", count: 1, label: "½ taza" };
  if (l === "1 cuchara" || l === "una cuchara") return { kind: "spoon",  emoji: "🥄", count: 1, label: "1 cuchara" };
  return null;
}

export function getVisualQty(ing: Ingredient): VisualQty {
  if (ing.quantityLabel) {
    const fromL = fromLabel(ing.quantityLabel);
    if (fromL) return fromL;
  }
  const qty = ing.quantity ?? 1;
  const kind = KIND_BY_INGREDIENT[ing.emoji] ?? "piece";
  const count = Math.min(qty, kind === "handful" || kind === "cup" ? 2 : 5);
  return { kind, emoji: KIND_EMOJI[kind], count: Math.max(1, count) };
}
