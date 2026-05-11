import type { Recipe } from "./recipes";
import { getRecipeMeta } from "./recipeMeta";

export interface Medal {
  id: string;
  emoji: string;
  label: string;
  description: string;
  earned: (ctx: MedalCtx) => boolean;
}

export interface MedalCtx {
  completed: string[];
  challengesDone: number;
  recipes: Recipe[];
}

export const MEDALS: Medal[] = [
  {
    id: "first-recipe",
    emoji: "🥇",
    label: "Primera receta",
    description: "Completaste tu primera receta",
    earned: (c) => c.completed.length >= 1,
  },
  {
    id: "five-recipes",
    emoji: "🏅",
    label: "5 recetas",
    description: "Completaste 5 recetas",
    earned: (c) => c.completed.length >= 5,
  },
  {
    id: "ten-recipes",
    emoji: "🏆",
    label: "10 recetas",
    description: "Completaste 10 recetas",
    earned: (c) => c.completed.length >= 10,
  },
  {
    id: "all-fruits",
    emoji: "🍓",
    label: "Maestro frutal",
    description: "Hiciste todas las recetas de fruta",
    earned: (c) => {
      const fruits = c.recipes.filter((r) => getRecipeMeta(r.id).tags.includes("fruta"));
      return fruits.length > 0 && fruits.every((r) => c.completed.includes(r.id));
    },
  },
  {
    id: "challenger-3",
    emoji: "🎯",
    label: "Reto x3",
    description: "Completaste 3 retos del día",
    earned: (c) => c.challengesDone >= 3,
  },
  {
    id: "level-up",
    emoji: "⭐",
    label: "Nivel 3",
    description: "Completaste una receta de nivel 3",
    earned: (c) => c.recipes.some((r) => c.completed.includes(r.id) && getRecipeMeta(r.id).level === 3),
  },
  // Family medals — celebrate cooking together, not just kid progress.
  {
    id: "family-trio",
    emoji: "👨‍👩‍👧",
    label: "Equipo familia",
    description: "3 recetas cocinadas en familia",
    earned: (c) => c.completed.length >= 3,
  },
  {
    id: "family-week",
    emoji: "🗓️",
    label: "Semana en familia",
    description: "7 recetas completadas",
    earned: (c) => c.completed.length >= 7,
  },
  {
    id: "family-variety",
    emoji: "🌈",
    label: "Variedad familiar",
    description: "Recetas de 3 categorías distintas",
    earned: (c) => {
      const cats = new Set(c.recipes.filter((r) => c.completed.includes(r.id)).map((r) => r.category));
      return cats.size >= 3;
    },
  },
];

export function earnedMedalIds(ctx: MedalCtx): string[] {
  return MEDALS.filter((m) => m.earned(ctx)).map((m) => m.id);
}
