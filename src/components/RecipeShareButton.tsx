import { useState } from "react";
import type { Recipe } from "@/data/recipes";
import { getIngredientName } from "@/data/ingredientNames";

interface Props {
  recipe: Recipe;
  displayName?: string;
}

// Shares a visual summary of the recipe with caregivers/grandparents.
// Uses Web Share API when available; falls back to copying a printable link.
export default function RecipeShareButton({ recipe, displayName }: Props) {
  const [done, setDone] = useState<"shared" | "copied" | null>(null);

  const buildText = () => {
    const ing = recipe.ingredients
      .map((i) => `${i.emoji} ${getIngredientName(i.emoji) ?? ""}${i.quantity ? ` ×${i.quantity}` : ""}`.trim())
      .join("\n");
    const steps = recipe.steps
      .map((s, i) => `${i + 1}. ${s.emoji} ${s.ingredientEmojis.join(" ")}`)
      .join("\n");
    return `🍳 ${displayName ?? recipe.name}\n\nIngredientes:\n${ing}\n\nPasos:\n${steps}\n\nReceta visual de Little Chef.`;
  };

  const onShare = async () => {
    const text = buildText();
    const url = `${window.location.origin}/imprimir/${recipe.id}`;
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> })
          .share({ title: displayName ?? recipe.name, text, url });
        setDone("shared");
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        setDone("copied");
      }
      setTimeout(() => setDone(null), 1800);
    } catch { /* user cancelled */ }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className="flex min-h-14 items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
      aria-label="Compartir receta"
    >
      <span className="text-2xl" aria-hidden>📤</span>
      <span>{done === "copied" ? "¡Copiado!" : done === "shared" ? "¡Enviado!" : "Compartir"}</span>
    </button>
  );
}
