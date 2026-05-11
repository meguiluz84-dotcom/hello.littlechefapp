import type { Recipe } from "@/data/recipes";
import { getRecipeDifficulty } from "@/data/recipeDifficulty";

interface Props {
  recipe: Recipe;
  size?: "sm" | "md";
  compact?: boolean; // emoji-only chips for tight spaces (cards)
}

const TONE_BG: Record<string, string> = {
  good: "bg-kids-green/60",
  warn: "bg-kids-yellow/70",
  danger: "bg-kids-red/60",
};

export default function DifficultyBadges({ recipe, size = "md", compact = false }: Props) {
  const badges = getRecipeDifficulty(recipe);
  if (badges.length === 0) return null;
  const text = size === "sm" ? "text-[10px]" : "text-xs";
  const emoji = size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {badges.map((b) => (
        <div
          key={b.id}
          aria-label={b.label}
          title={b.label}
          className={`flex items-center gap-1 rounded-full px-2 py-1 font-extrabold text-foreground kids-shadow ${TONE_BG[b.tone] ?? "bg-card"}`}
        >
          <span className={emoji}>{b.emoji}</span>
          {!compact && <span className={text}>{b.short}</span>}
        </div>
      ))}
    </div>
  );
}
