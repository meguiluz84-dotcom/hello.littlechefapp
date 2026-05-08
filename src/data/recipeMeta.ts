// Extended metadata per recipe id. Kept separate from recipes.ts so the
// existing data shape stays intact and we don't have to rewrite 21 entries.

export type FoodTag = "desayuno" | "merienda" | "fruta" | "salado" | "sin-coccion";

export interface Restrictions {
  nuts: boolean;     // contains nuts
  dairy: boolean;    // contains dairy
  gluten: boolean;   // contains gluten
  vegetarian: boolean; // is vegetarian
}

export interface RecipeMeta {
  tags: FoodTag[];
  restrictions: Restrictions;
  adultHelp: "low" | "medium" | "high";
  ageMin: 2 | 4 | 6;
}

const veg = (extra: Partial<Restrictions> = {}): Restrictions => ({
  nuts: false, dairy: false, gluten: false, vegetarian: true, ...extra,
});

export const recipeMeta: Record<string, RecipeMeta> = {
  "fruit-salad":      { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg(), adultHelp: "low", ageMin: 2 },
  "sandwich":         { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true, gluten: true }), adultHelp: "low", ageMin: 2 },
  "smoothie":         { tags: ["desayuno", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2 },
  "cookies":          { tags: ["merienda"], restrictions: veg({ nuts: true }), adultHelp: "high", ageMin: 4 },
  "ants-on-log":      { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true }), adultHelp: "low", ageMin: 2 },
  "parfait":          { tags: ["desayuno", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2 },
  "mini-pizza":       { tags: ["salado"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "medium", ageMin: 4 },
  "veggie-wrap":      { tags: ["salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "medium", ageMin: 4 },
  "banana-pops":      { tags: ["merienda"], restrictions: veg(), adultHelp: "medium", ageMin: 4 },
  "trail-mix":        { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true }), adultHelp: "low", ageMin: 2 },
  "rice-balls":       { tags: ["salado"], restrictions: veg(), adultHelp: "medium", ageMin: 4 },
  "fruit-kabobs":     { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg(), adultHelp: "medium", ageMin: 4 },
  "granola-yogur":    { tags: ["desayuno", "merienda"], restrictions: veg({ dairy: true, nuts: true, gluten: true }), adultHelp: "low", ageMin: 2 },
  "pinchos-queso":    { tags: ["merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "medium", ageMin: 4 },
  "pancakes-brocoli": { tags: ["desayuno", "salado"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 6 },
  "arepas-chia":      { tags: ["desayuno", "salado"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4 },
  "empanadas":        { tags: ["salado"], restrictions: { nuts: false, dairy: false, gluten: true, vegetarian: false }, adultHelp: "high", ageMin: 6 },
  "pizza-vegetal":    { tags: ["salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "low", ageMin: 4 },
  "galletas-cacao":   { tags: ["merienda"], restrictions: veg(), adultHelp: "high", ageMin: 4 },
  "rosquitas":        { tags: ["merienda"], restrictions: veg({ gluten: true }), adultHelp: "high", ageMin: 6 },
  "polos-fresa":      { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2 },
};

const DEFAULT_META: RecipeMeta = {
  tags: ["merienda"],
  restrictions: veg(),
  adultHelp: "low",
  ageMin: 2,
};

export function getRecipeMeta(id: string): RecipeMeta {
  return recipeMeta[id] ?? DEFAULT_META;
}

// Steps with these action types involve sharp tools or heat → need adult.
const ADULT_ACTIONS = new Set(["cut"]);
const ADULT_EMOJIS = new Set(["🔥", "🔪", "🍳"]);

export function stepNeedsAdult(actionIcon: string, emoji: string): boolean {
  return ADULT_ACTIONS.has(actionIcon) || ADULT_EMOJIS.has(emoji);
}

export const TAG_INFO: Record<FoodTag, { emoji: string; label: string }> = {
  desayuno: { emoji: "🥣", label: "Desayuno" },
  merienda: { emoji: "🍎", label: "Merienda" },
  fruta: { emoji: "🍓", label: "Fruta" },
  salado: { emoji: "🥪", label: "Salado" },
  "sin-coccion": { emoji: "❄️", label: "Sin cocción" },
};

export const RESTRICTION_INFO: Record<keyof Restrictions, { emoji: string; label: string }> = {
  nuts: { emoji: "🥜", label: "Sin frutos secos" },
  dairy: { emoji: "🥛", label: "Sin lácteos" },
  gluten: { emoji: "🌾", label: "Sin gluten" },
  vegetarian: { emoji: "🥬", label: "Vegetariano" },
};

// Returns true if the recipe is allowed under user's restriction toggles.
// A toggle = true means "exclude recipes containing this".
// vegetarian toggle = true means "only show vegetarian recipes".
export function recipeMatchesRestrictions(
  meta: RecipeMeta,
  active: Partial<Restrictions>,
): boolean {
  if (active.nuts && meta.restrictions.nuts) return false;
  if (active.dairy && meta.restrictions.dairy) return false;
  if (active.gluten && meta.restrictions.gluten) return false;
  if (active.vegetarian && !meta.restrictions.vegetarian) return false;
  return true;
}
