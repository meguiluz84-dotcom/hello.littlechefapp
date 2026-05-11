import type { Ingredient } from "@/data/recipes";
import { getVisualQty } from "@/data/visualQty";

interface Props {
  ingredient: Ingredient;
  showAdult?: boolean;
}

export default function VisualQuantity({ ingredient, showAdult }: Props) {
  const v = getVisualQty(ingredient);
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
