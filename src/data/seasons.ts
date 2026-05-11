// Seasonal themes per recipe. Northern hemisphere by default.
// A recipe can match several seasons; "all" means available year-round.

export type Season = "primavera" | "verano" | "otono" | "invierno";

export const SEASON_INFO: Record<Season, { emoji: string; label: string; months: number[] }> = {
  primavera: { emoji: "🌸", label: "Primavera", months: [3, 4, 5] },
  verano:    { emoji: "🌞", label: "Verano",    months: [6, 7, 8] },
  otono:     { emoji: "🍂", label: "Otoño",     months: [9, 10, 11] },
  invierno:  { emoji: "❄️", label: "Invierno",  months: [12, 1, 2] },
};

// Recipes explicitly tagged. Anything missing is considered year-round.
const RECIPE_SEASONS: Record<string, Season[]> = {
  "fruit-salad":    ["primavera", "verano"],
  "smoothie":       ["primavera", "verano"],
  "fruit-kabobs":   ["verano"],
  "polos-fresa":    ["verano"],
  "banana-pops":    ["verano"],
  "parfait":        ["primavera", "verano"],
  "cookies":        ["otono", "invierno"],
  "galletas-cacao": ["otono", "invierno"],
  "rosquitas":      ["invierno"],
  "empanadas":      ["otono", "invierno"],
  "pancakes-brocoli": ["invierno"],
  "arepas-chia":    ["otono", "invierno"],
  "pinchos-queso":  ["primavera"],
  "pizza-vegetal":  ["primavera", "verano"],
  "veggie-wrap":    ["primavera", "verano"],
  "mini-pizza":     ["otono"],
  "ants-on-log":    ["otono"],
  "trail-mix":      ["otono", "invierno"],
  "fruit-faces":    ["primavera", "verano"],
  "rainbow-toast":  ["primavera", "verano"],
  "cloud-cup":      ["primavera", "verano"],
  "cucumber-boats": ["verano"],
  "happy-pizza":    ["otono", "invierno"],
  "banana-pancakes": ["otono", "invierno"],
  "rice-eggs":      ["otono"],
  "banana-icecream": ["verano"],
  "oat-balls":      ["otono", "invierno"],
  "snake-wrap":     ["primavera", "verano"],
};

export function recipeSeasons(id: string): Season[] {
  return RECIPE_SEASONS[id] ?? [];
}

export function currentSeason(now: Date = new Date()): Season {
  const m = now.getMonth() + 1;
  for (const [k, v] of Object.entries(SEASON_INFO)) {
    if (v.months.includes(m)) return k as Season;
  }
  return "primavera";
}

export function isInSeason(id: string, now: Date = new Date()): boolean {
  const s = recipeSeasons(id);
  if (s.length === 0) return false;
  return s.includes(currentSeason(now));
}
