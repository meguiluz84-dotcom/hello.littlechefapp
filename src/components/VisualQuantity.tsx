import type { Ingredient } from "@/data/recipes";
import { getVisualQty } from "@/data/visualQty";

interface Props {
  ingredient: Ingredient;
  showAdult?: boolean;
}

export default function VisualQuantity({ ingredient, showAdult }: Props) {
  const v = getVisualQty(ingredient);

  // Half-cup gets a special visual: cup with a "½" overlay.
  if (v.kind === "cup-half") {
    return (
      <div className="flex flex-col items-center gap-1" aria-label="media taza">
        <div className="relative">
          <span className="text-2xl">🥛</span>
          <span className="absolute -bottom-1 -right-2 rounded-full bg-card px-1 text-[10px] font-extrabold text-foreground kids-shadow">½</span>
        </div>
        <span className="text-[10px] font-extrabold text-muted-foreground">½ taza</span>
        {showAdult && ingredient.grams && (
          <div className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">{ingredient.grams}g</div>
        )}
      </div>
    );
  }

  if (v.label && (v.kind === "cup" || v.kind === "spoon")) {
    return (
      <div className="flex flex-col items-center gap-1" aria-label={v.label}>
        <span className="text-2xl">{v.emoji}</span>
        <span className="text-[10px] font-extrabold text-muted-foreground">{v.label}</span>
        {showAdult && ingredient.grams && (
          <div className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">{ingredient.grams}g</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-0.5" aria-label={`${v.count} ${v.kind}`}>
        {Array.from({ length: v.count }).map((_, i) => (
          <span key={i} className="text-base">{v.emoji}</span>
        ))}
      </div>
      {showAdult && ingredient.grams && (
        <div className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
          {ingredient.grams}g
        </div>
      )}
    </div>
  );
}
