// Extended metadata per recipe id. Kept separate from recipes.ts so the
// existing data shape stays intact and we don't have to rewrite 21 entries.

export type FoodTag = "desayuno" | "merienda" | "fruta" | "salado" | "sin-coccion";

// 14 alérgenos oficiales UE + vegetariano (preferencia)
export interface Restrictions {
  gluten: boolean;
  dairy: boolean;       // lácteos
  nuts: boolean;        // frutos de cáscara
  peanuts: boolean;     // cacahuetes
  eggs: boolean;        // huevo
  soy: boolean;         // soja
  fish: boolean;        // pescado
  crustaceans: boolean; // crustáceos
  molluscs: boolean;    // moluscos
  sesame: boolean;      // sésamo
  mustard: boolean;     // mostaza
  celery: boolean;      // apio
  sulphites: boolean;   // sulfitos
  lupin: boolean;       // altramuces
  vegetarian: boolean;
}

export const EMPTY_RESTR: Restrictions = {
  gluten: false, dairy: false, nuts: false, peanuts: false, eggs: false,
  soy: false, fish: false, crustaceans: false, molluscs: false, sesame: false,
  mustard: false, celery: false, sulphites: false, lupin: false,
  vegetarian: false,
};

export type RecipeLevel = 1 | 2 | 3;

export interface RecipeMeta {
  tags: FoodTag[];
  restrictions: Restrictions;
  adultHelp: "low" | "medium" | "high";
  ageMin: 2 | 4 | 6;
  level: RecipeLevel; // 1: sin cuchillo/calor, 2: con ayuda puntual, 3: receta completa
}

const veg = (extra: Partial<Restrictions> = {}): Restrictions => ({
  ...EMPTY_RESTR, vegetarian: true, ...extra,
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
  "fruit-faces":      { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "rainbow-toast":    { tags: ["merienda", "salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "medium", ageMin: 2, level: 2 },
  "cloud-cup":        { tags: ["desayuno", "merienda", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "cucumber-boats":   { tags: ["salado", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "happy-pizza":      { tags: ["salado"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "banana-pancakes":  { tags: ["desayuno"], restrictions: veg({ gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "rice-eggs":        { tags: ["salado", "merienda"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "banana-icecream":  { tags: ["merienda"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "oat-balls":        { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true, gluten: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "snake-wrap":       { tags: ["salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "star-sandwich":    { tags: ["merienda", "salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "banana-rolls":     { tags: ["merienda", "sin-coccion"], restrictions: veg({ nuts: true, gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "tomato-ladybugs":  { tags: ["merienda", "salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "broccoli-forest":  { tags: ["salado"], restrictions: veg(), adultHelp: "low", ageMin: 2, level: 1 },
  "egg-boats":        { tags: ["salado", "merienda"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "snail-rolls":      { tags: ["salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "butterfly-pizza":  { tags: ["salado"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "fruit-worm":       { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "rice-clouds":      { tags: ["salado"], restrictions: veg({ dairy: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "garden-toast":     { tags: ["salado", "merienda", "sin-coccion"], restrictions: veg({ gluten: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "banana-sushi":     { tags: ["merienda", "sin-coccion"], restrictions: veg({ gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "chickpea-burgers": { tags: ["salado"], restrictions: veg({ gluten: true }), adultHelp: "high", ageMin: 6, level: 3 },
  "rainbow-sticks":   { tags: ["merienda", "salado", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "green-pancakes":   { tags: ["salado", "desayuno"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 6, level: 3 },
  "moon-bowl":        { tags: ["desayuno", "merienda", "sin-coccion"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "low", ageMin: 2, level: 1 },
  "smile-empanadas":  { tags: ["salado"], restrictions: veg({ dairy: true, gluten: true }), adultHelp: "high", ageMin: 6, level: 3 },
  "mini-tacos":       { tags: ["salado"], restrictions: { nuts: false, dairy: true, gluten: true, vegetarian: false }, adultHelp: "medium", ageMin: 4, level: 2 },
  "apple-donut":      { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "watermelon-pops":  { tags: ["fruta", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4, level: 2 },
  "veggie-train":     { tags: ["salado", "merienda", "sin-coccion"], restrictions: veg({ dairy: true }), adultHelp: "high", ageMin: 4, level: 2 },
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
