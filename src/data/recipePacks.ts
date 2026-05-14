import type { Recipe } from "./recipes";
import { getRecipeMeta } from "./recipeMeta";
import { recipeIsNoCook } from "@/hooks/use-no-cook";

export interface RecipePack {
  id: string;
  label: string;
  emoji: string;
  color: string; // tailwind bg-* token
  description: string;
  match: (r: Recipe) => boolean;
}

export const PACKS: RecipePack[] = [
  {
    id: "desayunos", label: "Desayunos", emoji: "🥣", color: "bg-kids-yellow",
    description: "Recetas perfectas para empezar el día",
    match: (r) => getRecipeMeta(r.id).tags.includes("desayuno"),
  },
  {
    id: "meriendas", label: "Meriendas", emoji: "🍎", color: "bg-kids-pink",
    description: "Para la tarde con poco lío",
    match: (r) => getRecipeMeta(r.id).tags.includes("merienda"),
  },
  {
    id: "fruta", label: "Fruta", emoji: "🍓", color: "bg-kids-red",
    description: "Frutas divertidas y de colores",
    match: (r) => getRecipeMeta(r.id).tags.includes("fruta"),
  },
  {
    id: "verduras", label: "Verduras divertidas", emoji: "🥦", color: "bg-kids-green",
    description: "Verduras que dan ganas de probar",
    match: (r) => /broccoli|cucumber|veggie|garden|rainbow|green|train|forest/i.test(r.id),
  },
  {
    id: "sin-coccion", label: "Sin cocción", emoji: "❄️", color: "bg-kids-blue",
    description: "Sin horno, sin sartén, sin cuchillo",
    match: (r) => recipeIsNoCook(r),
  },
  {
    id: "cumpleanos", label: "Cumpleaños", emoji: "🎉", color: "bg-kids-purple",
    description: "Para celebrar y compartir",
    match: (r) => /pizza|cookies|cup|pops|sushi|donut|sandwich|empanadas|kabobs/i.test(r.id),
  },
  {
    id: "chef-avanzado", label: "Chef Avanzado", emoji: "👨‍🍳", color: "bg-kids-orange",
    description: "Recetas con más pasos, medición y medalla",
    match: (r) => getRecipeMeta(r.id).level === 4,
  },
];

export function packRecipes(pack: RecipePack, allowed: Recipe[]): Recipe[] {
  return allowed.filter(pack.match);
}
