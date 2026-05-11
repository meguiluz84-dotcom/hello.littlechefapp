import type { Recipe } from "./recipes";
import { getRecipeMeta, stepNeedsAdult } from "./recipeMeta";

export type DifficultyTag =
  | "easy"
  | "no-cook"
  | "needs-adult"
  | "needs-cut"
  | "needs-heat";

export interface DifficultyBadge {
  id: DifficultyTag;
  emoji: string;
  label: string;
  short: string;
  tone: "good" | "warn" | "danger";
}

const HEAT_EMOJIS = new Set(["🔥", "🍳", "🥘", "🫕", "♨️"]);

export function getRecipeDifficulty(recipe: Recipe): DifficultyBadge[] {
  const meta = getRecipeMeta(recipe.id);
  const needsCut = recipe.steps.some((s) => s.actionIcon === "cut");
  const needsHeat = recipe.steps.some((s) => HEAT_EMOJIS.has(s.emoji));
  const noCook = meta.tags.includes("sin-coccion");
  const needsAdult =
    meta.adultHelp !== "low" ||
    recipe.steps.some((s) => stepNeedsAdult(s.actionIcon, s.emoji));
  const easy = meta.level === 1 && !needsAdult && !needsCut && !needsHeat;

  const out: DifficultyBadge[] = [];
  if (easy) out.push({ id: "easy", emoji: "👶", label: "Fácil", short: "Fácil", tone: "good" });
  if (noCook) out.push({ id: "no-cook", emoji: "❄️", label: "Sin cocción", short: "Sin cocción", tone: "good" });
  if (needsAdult) out.push({ id: "needs-adult", emoji: "🧑", label: "Con ayuda de adulto", short: "Adulto", tone: "warn" });
  if (needsCut) out.push({ id: "needs-cut", emoji: "🔪", label: "Hay que cortar", short: "Cortar", tone: "warn" });
  if (needsHeat) out.push({ id: "needs-heat", emoji: "🔥", label: "Hay calor", short: "Calor", tone: "danger" });
  return out;
}
