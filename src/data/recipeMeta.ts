// Extended metadata per recipe id. Kept separate from recipes.ts so the
// existing data shape stays intact and we don't have to rewrite 21 entries.

export type FoodTag = "desayuno" | "merienda" | "fruta" | "salado" | "sin-coccion";

export interface Restrictions {
  nuts: boolean;
  dairy: boolean;
  gluten: boolean;
  vegetarian: boolean;
}

export type RecipeLevel = 1 | 2 | 3;

export interface RecipeMeta {
  tags: FoodTag[];
  restrictions: Restrictions;
  adultHelp: "low" | "medium" | "high";
  ageMin: 2 | 4 | 6;
  level: RecipeLevel; // 1: sin cuchillo/calor, 2: con ayuda puntual, 3: receta completa
}

const veg = (extra: Partial<Restrictions> = {}): Restrictions => ({
  nuts: false, dairy: false, gluten: false, vegetarian: true, ...extra,
});

export const recipeMeta: Record<string, RecipeMeta> = {
  "fruit-salad":      { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg(), adultHelp: "low", ageMin: 2, level: 1 },
  "sandwich":         { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true, gluten: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "smoothie":         { tags: ["desayuno", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "cookies":          { tags: ["merienda"], restrictions: veg({ nuts: true }), adultHelp: "high", ageMin: 4, level: 3 },
  "ants-on-log":      { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "parfait":          { tags: ["desayuno", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "mini-pizza":       { tags: ["salado"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "medium", ageMin: 4, level: 2 },
  "veggie-wrap":      { tags: ["salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "medium", ageMin: 4, level: 2 },
  "banana-pops":      { tags: ["merienda"], restrictions: veg(), adultHelp: "medium", ageMin: 4, level: 2 },
  "trail-mix":        { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "rice-balls":       { tags: ["salado"], restrictions: veg(), adultHelp: "medium", ageMin: 4, level: 2 },
  "fruit-kabobs":     { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg(), adultHelp: "medium", ageMin: 4, level: 2 },
  "granola-yogur":    { tags: ["desayuno", "merienda"], restrictions: veg({ dairy: true, nuts: true, gluten: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "pinchos-queso":    { tags: ["merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "medium", ageMin: 4, level: 2 },
  "pancakes-brocoli": { tags: ["desayuno", "salado"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 6, level: 3 },
  "arepas-chia":      { tags: ["desayuno", "salado"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4, level: 3 },
  "empanadas":        { tags: ["salado"], restrictions: { nuts: false, dairy: false, gluten: true, vegetarian: false }, adultHelp: "high", ageMin: 6, level: 3 },
  "pizza-vegetal":    { tags: ["salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "low", ageMin: 4, level: 2 },
  "galletas-cacao":   { tags: ["merienda"], restrictions: veg(), adultHelp: "high", ageMin: 4, level: 3 },
  "rosquitas":        { tags: ["merienda"], restrictions: veg({ gluten: true }), adultHelp: "high", ageMin: 6, level: 3 },
  "polos-fresa":      { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2, level: 1 },
};

const DEFAULT_META: RecipeMeta = {
  tags: ["merienda"],
  restrictions: veg(),
  adultHelp: "low",
  ageMin: 2,
  level: 1,
};

export function getRecipeMeta(id: string): RecipeMeta {
  return recipeMeta[id] ?? DEFAULT_META;
}

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

export const LEVEL_INFO: Record<RecipeLevel, { emoji: string; label: string }> = {
  1: { emoji: "👶", label: "Fácil" },
  2: { emoji: "🧒", label: "Medio" },
  3: { emoji: "🧑", label: "Reto" },
};

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

// Map child age bucket to max recipe level allowed.
export function maxLevelForAge(age: "2-3" | "4-5" | "6+"): RecipeLevel {
  if (age === "2-3") return 1;
  if (age === "4-5") return 2;
  return 3;
}

export function recipeAllowedForAge(meta: RecipeMeta, age: "2-3" | "4-5" | "6+"): boolean {
  return meta.level <= maxLevelForAge(age);
}
