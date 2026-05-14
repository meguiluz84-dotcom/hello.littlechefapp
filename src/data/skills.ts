// Achievements based on actions performed across recipes (separate from MEDALS).
import type { Recipe } from "./recipes";
import { getRecipeMeta } from "./recipeMeta";
import { detectHygieneActions } from "./hygieneActions";

export interface SkillCounters {
  mix: number;
  decorate: number;     // place/spread/scoop
  fruits: number;
  veggies: number;
  hygiene: number;
  quantities: number;
  family: number;       // recipes completed
  challenge: number;    // challenge-mode completions
}

export const EMPTY_SKILLS: SkillCounters = {
  mix: 0, decorate: 0, fruits: 0, veggies: 0,
  hygiene: 0, quantities: 0, family: 0, challenge: 0,
};

export interface SkillDef {
  id: keyof SkillCounters | "any";
  emoji: string;
  label: string;
  description: string;
  threshold: number;
  count: (s: SkillCounters) => number;
}

export const SKILLS: SkillDef[] = [
  { id: "mix",        emoji: "🥄", label: "Mezclador",        description: "Mezcla 5 veces",          threshold: 5, count: (s) => s.mix },
  { id: "decorate",   emoji: "🎨", label: "Decorador",        description: "Decora 5 veces",          threshold: 5, count: (s) => s.decorate },
  { id: "fruits",     emoji: "🍓", label: "Explorador frutal", description: "Cocina 3 recetas de fruta", threshold: 3, count: (s) => s.fruits },
  { id: "veggies",    emoji: "🥦", label: "Probador verde",   description: "Cocina 3 recetas con verdura", threshold: 3, count: (s) => s.veggies },
  { id: "hygiene",    emoji: "🧼", label: "Chef limpio",      description: "Higiene en 3 recetas",    threshold: 3, count: (s) => s.hygiene },
  { id: "quantities", emoji: "🥛", label: "Maestro cantidades", description: "Mide en 3 recetas",     threshold: 3, count: (s) => s.quantities },
  { id: "family",     emoji: "👨‍👩‍👧", label: "Ayudante familiar", description: "5 recetas en familia", threshold: 5, count: (s) => s.family },
  { id: "challenge",  emoji: "🎯", label: "Reto completado",  description: "Termina 1 modo reto",     threshold: 1, count: (s) => s.challenge },
];

export function recipeContributes(recipe: Recipe): Partial<SkillCounters> {
  const out: Partial<SkillCounters> = { family: 1 };
  let mix = 0, decorate = 0;
  for (const s of recipe.steps) {
    if (s.actionIcon === "mix") mix++;
    if (s.actionIcon === "place" || s.actionIcon === "spread" || s.actionIcon === "scoop") decorate++;
    if (s.quantity) out.quantities = 1;
  }
  if (mix) out.mix = mix;
  if (decorate) out.decorate = decorate;
  const tags = getRecipeMeta(recipe.id).tags;
  if (tags.includes("fruta")) out.fruits = 1;
  if (recipe.ingredients.some((i) => ["🥦", "🥕", "🥒", "🌶️", "🥬", "🌽", "🍅"].includes(i.emoji))) out.veggies = 1;
  const hyg = detectHygieneActions(recipe);
  if (hyg.length > 0) out.hygiene = 1;
  return out;
}

export function earnedSkillIds(s: SkillCounters): string[] {
  return SKILLS.filter((sk) => sk.count(s) >= sk.threshold).map((sk) => sk.id);
}
