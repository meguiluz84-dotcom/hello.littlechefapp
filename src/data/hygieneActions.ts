// Visual hygiene reminders that show before a recipe starts.

export type HygieneActionId = "washHands" | "cleanTable" | "washVeggies";

export interface HygieneAction {
  id: HygieneActionId;
  emoji: string;
  label: string;
  hint: string;
}

export const HYGIENE_ACTIONS: Record<HygieneActionId, HygieneAction> = {
  washHands:   { id: "washHands",   emoji: "🧼", label: "Lava tus manos",     hint: "Con agua y jabón 🫧" },
  cleanTable:  { id: "cleanTable",  emoji: "🧽", label: "Limpia la mesa",     hint: "Mesa lista para cocinar" },
  washVeggies: { id: "washVeggies", emoji: "🚿", label: "Lava frutas y verduras", hint: "Bajo el grifo 💧" },
};

// Emojis that count as fresh produce — when present in a recipe we add washVeggies.
const PRODUCE = new Set([
  "🍓","🍌","🍎","🍇","🫐","🥝","🍊","🍋","🍑","🍒","🍐","🍉","🍈","🍍","🥭",
  "🥒","🥕","🍅","🥬","🥦","🌽","🫑","🥑","🌶️","🍆","🧄","🧅","🥔","🍠","🌿","🥜",
]);

export function detectHygieneActions(
  ingredientEmojis: string[],
  isAdvanced: boolean,
): HygieneActionId[] {
  const out: HygieneActionId[] = ["washHands"];
  if (isAdvanced) out.push("cleanTable");
  if (ingredientEmojis.some((e) => PRODUCE.has(e))) out.push("washVeggies");
  return out;
}
