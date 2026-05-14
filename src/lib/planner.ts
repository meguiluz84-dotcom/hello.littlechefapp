// Balanced week-plan auto-fill: tries to cover fruta, verdura/sin-coccion,
// nueva, favorita, etc. Pure function, no React.
import type { Recipe } from "@/data/recipes";
import { getRecipeMeta } from "@/data/recipeMeta";
import type { WeekPlan, DayKey, MealKey } from "@/hooks/use-week-plan";

const DAYS: DayKey[] = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
const MEALS: MealKey[] = ["desayuno", "merienda"];

interface FillCtx {
  recipes: Recipe[];
  isFavorite: (id: string) => boolean;
  isCompleted: (id: string) => boolean;
}

function pickRecipe(pool: Recipe[], used: Set<string>): Recipe | null {
  const fresh = pool.filter((r) => !used.has(r.id));
  if (fresh.length === 0) return pool[0] ?? null;
  return fresh[Math.floor(Math.random() * fresh.length)];
}

export function buildBalancedPlan(current: WeekPlan, ctx: FillCtx): WeekPlan {
  const next: WeekPlan = { ...current };
  const used = new Set<string>(Object.values(current).filter(Boolean) as string[]);

  // Pools by intention
  const fruta = ctx.recipes.filter((r) => getRecipeMeta(r.id).tags.includes("fruta"));
  const sinCoc = ctx.recipes.filter((r) => getRecipeMeta(r.id).tags.includes("sin-coccion"));
  const desayuno = ctx.recipes.filter((r) => getRecipeMeta(r.id).tags.includes("desayuno"));
  const merienda = ctx.recipes.filter((r) => getRecipeMeta(r.id).tags.includes("merienda"));
  const favoritas = ctx.recipes.filter((r) => ctx.isFavorite(r.id));
  const nuevas = ctx.recipes.filter((r) => !ctx.isCompleted(r.id));

  // Deterministic-ish "intentions" per slot.
  const intentions: { day: DayKey; meal: MealKey; pool: Recipe[] }[] = [
    { day: "lun", meal: "desayuno", pool: fruta.length ? fruta : desayuno },
    { day: "lun", meal: "merienda", pool: sinCoc.length ? sinCoc : merienda },
    { day: "mar", meal: "desayuno", pool: desayuno },
    { day: "mar", meal: "merienda", pool: favoritas.length ? favoritas : merienda },
    { day: "mie", meal: "desayuno", pool: nuevas.length ? nuevas : desayuno },
    { day: "mie", meal: "merienda", pool: fruta.length ? fruta : merienda },
    { day: "jue", meal: "desayuno", pool: desayuno },
    { day: "jue", meal: "merienda", pool: sinCoc.length ? sinCoc : merienda },
    { day: "vie", meal: "desayuno", pool: favoritas.length ? favoritas : desayuno },
    { day: "vie", meal: "merienda", pool: merienda },
    { day: "sab", meal: "desayuno", pool: nuevas.length ? nuevas : desayuno },
    { day: "sab", meal: "merienda", pool: merienda },
    { day: "dom", meal: "desayuno", pool: desayuno },
    { day: "dom", meal: "merienda", pool: fruta.length ? fruta : merienda },
  ];

  for (const it of intentions) {
    const k = `${it.day}-${it.meal}` as const;
    if (next[k]) continue; // respect existing assignments
    const pick = pickRecipe(it.pool.length ? it.pool : ctx.recipes, used);
    if (pick) { next[k] = pick.id; used.add(pick.id); }
  }

  return next;
}

export interface SmartRecommendation {
  recipe: Recipe;
  reason: string;
  emoji: string;
}

export function recommendNext(ctx: FillCtx, max = 3): SmartRecommendation[] {
  const out: SmartRecommendation[] = [];
  const seen = new Set<string>();
  const push = (r: Recipe | undefined, reason: string, emoji: string) => {
    if (!r || seen.has(r.id)) return;
    seen.add(r.id);
    out.push({ recipe: r, reason, emoji });
  };

  // Favorita no hecha esta semana
  push(ctx.recipes.find((r) => ctx.isFavorite(r.id) && !ctx.isCompleted(r.id)), "Tu favorita aún no hecha", "❤️");
  // Algo de fruta nuevo
  push(ctx.recipes.find((r) => getRecipeMeta(r.id).tags.includes("fruta") && !ctx.isCompleted(r.id)), "Receta de fruta nueva", "🍎");
  // Sin cocción rápida
  push(ctx.recipes.find((r) => getRecipeMeta(r.id).tags.includes("sin-coccion") && !ctx.isCompleted(r.id)), "Sin cocción y rápida", "❄️");
  // Pendiente cualquiera
  push(ctx.recipes.find((r) => !ctx.isCompleted(r.id)), "Aún no la has probado", "✨");

  return out.slice(0, max);
}
