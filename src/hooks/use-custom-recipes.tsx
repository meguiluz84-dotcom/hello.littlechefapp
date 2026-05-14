import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";
import type { Recipe, RecipeCategory, ActionIcon, Ingredient, RecipeStep } from "@/data/recipes";
import type { Restrictions, RecipeLevel, FoodTag } from "@/data/recipeMeta";
import { EMPTY_RESTR } from "@/data/recipeMeta";
import { emojiImage } from "@/lib/recipeImage";

export interface CustomRecipeMeta {
  level: RecipeLevel;
  tags: FoodTag[];
  restrictions: Restrictions;
  adultHelp: "low" | "medium" | "high";
  ageMin: 2 | 4 | 6;
  privateToFamily: boolean;
  notes?: string; // adult-only notes (allergens, swaps, safety)
}

export interface CustomRecipe {
  id: string;             // "custom-<timestamp>"
  name: string;
  emoji: string;
  color: string;          // tailwind kids-* token
  category: RecipeCategory;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  difficulty: 1 | 2 | 3;
  meta: CustomRecipeMeta;
  createdAt: number;
}

const KEY = (pid: string) => `lc:p:${pid}:custom-recipes`;

export function customToRecipe(c: CustomRecipe): Recipe {
  return {
    id: c.id,
    name: c.name,
    image: emojiImage(c.emoji, c.id),
    emoji: c.emoji,
    color: c.color,
    category: c.category,
    ingredients: c.ingredients,
    steps: c.steps,
    difficulty: c.difficulty,
    challengeModeCompatible: true,
  };
}

export const DEFAULT_CUSTOM_META: CustomRecipeMeta = {
  level: 1,
  tags: ["merienda"],
  restrictions: { ...EMPTY_RESTR, vegetarian: true },
  adultHelp: "low",
  ageMin: 4,
  privateToFamily: true,
};

export function blankCustomRecipe(): CustomRecipe {
  return {
    id: `custom-${Date.now()}`,
    name: "Mi receta",
    emoji: "🍽️",
    color: "kids-yellow",
    category: "snacks",
    ingredients: [],
    steps: [],
    difficulty: 1,
    meta: DEFAULT_CUSTOM_META,
    createdAt: Date.now(),
  };
}

export const ACTION_ICONS: ActionIcon[] = [
  "wash", "peel", "cut", "mix", "pour", "spread", "place", "shake", "scoop", "bake", "chill", "wait",
];

export function useCustomRecipes() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [items, setItems] = useState<CustomRecipe[]>([]);

  useEffect(() => {
    if (!pid) { setItems([]); return; }
    try {
      const raw = localStorage.getItem(KEY(pid));
      setItems(raw ? JSON.parse(raw) : []);
    } catch { setItems([]); }
  }, [pid]);

  const persist = (next: CustomRecipe[]) => {
    setItems(next);
    if (pid) { try { localStorage.setItem(KEY(pid), JSON.stringify(next)); } catch { /* ignore */ } }
  };

  const upsert = useCallback((r: CustomRecipe) => {
    persist([...items.filter((x) => x.id !== r.id), r]);
  }, [items, pid]);

  const remove = useCallback((id: string) => {
    persist(items.filter((x) => x.id !== id));
  }, [items, pid]);

  return { items, upsert, remove };
}
