import { useState } from "react";
import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { getIngredientName } from "@/data/ingredientNames";
import { getRecipeMeta, RESTRICTION_INFO, type Restrictions } from "@/data/recipeMeta";
import DinoBubble from "./DinoBubble";

interface Props {
  recipe: Recipe;
  onStart: () => void;
  onBack: () => void;
  displayName?: string;
  hasResume?: boolean;
  onResume?: () => void;
  onResumeClear?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function RecipeIngredients({
  recipe, onStart, onBack, displayName,
  hasResume, onResume, onResumeClear,
  isFavorite, onToggleFavorite,
}: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const meta = getRecipeMeta(recipe.id);

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });

  // Surface allergen badges (real allergens present in recipe)
  const allergenBadges = (Object.keys(RESTRICTION_INFO) as (keyof Restrictions)[])
    .filter((k) => k !== "vegetarian" && meta.restrictions[k]);

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6">
      {/* Top row: back + favorite */}
      <div className="mb-2 flex w-full max-w-sm items-center justify-between">
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={onBack}
          aria-label="Volver"
          className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
        >
          ⬅️
        </motion.button>
        {onToggleFavorite && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            aria-pressed={!!isFavorite}
            className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-card text-3xl kids-shadow"
          >
            {isFavorite ? "❤️" : "🤍"}
          </motion.button>
        )}
      </div>

      {/* Dino guide */}
      <div className="mb-2 self-start">
        <DinoBubble emojis={`🧺${recipe.emoji}`} size="md" />
      </div>

      {/* Recipe image + name */}
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={recipe.image}
        alt=""
        className="mb-3 h-32 w-32 rounded-3xl object-cover kids-shadow-lg"
        width={128}
        height={128}
      />
      <h1 className="mb-2 text-balance text-center text-2xl font-extrabold text-foreground">
        {displayName ?? recipe.name}
      </h1>

      {/* Allergen badges (concise, visual) */}
      {allergenBadges.length > 0 && (
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {allergenBadges.map((k) => (
            <div
              key={k}
              className="flex items-center gap-1 rounded-full bg-kids-yellow/60 px-3 py-1 text-xs font-extrabold text-foreground kids-shadow"
              title={`Contiene ${RESTRICTION_INFO[k].label.replace("Sin ", "")}`}
            >
              {RESTRICTION_INFO[k].emoji}
            </div>
          ))}
        </div>
      )}

      {/* Resume banner */}
      {hasResume && onResume && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 flex w-full max-w-sm items-center gap-3 rounded-2xl bg-accent p-3 kids-shadow"
        >
          <span className="text-3xl">⏸️</span>
          <button
            type="button"
            onClick={onResume}
            className="flex-1 min-h-12 rounded-xl bg-card px-3 py-2 text-base font-extrabold text-foreground kids-shadow"
          >
            ▶️ Continuar
          </button>
          {onResumeClear && (
            <button
              type="button"
              onClick={onResumeClear}
              aria-label="Empezar de nuevo"
              className="flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-xl bg-card text-2xl kids-shadow"
            >
              🔄
            </button>
          )}
        </motion.div>
      )}

      {/* Ingredients checklist */}
      <div className="mx-auto mb-8 grid max-w-sm grid-cols-3 gap-5">
        {recipe.ingredients.map((ing, i) => {
          const isChecked = checked.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05 + i * 0.06, type: "spring", bounce: 0.5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggle(i)}
              aria-pressed={isChecked}
              aria-label={`${getIngredientName(ing.emoji) ?? "ingrediente"}${isChecked ? " marcado" : ""}`}
              className="relative flex flex-col items-center gap-1"
            >
              <div
                className={`relative flex h-20 w-20 min-h-16 min-w-16 items-center justify-center rounded-2xl kids-shadow transition-colors ${
                  isChecked ? "bg-accent/30 ring-4 ring-accent" : "bg-card"
                }`}
              >
                <span className="text-4xl">{ing.emoji}</span>
                {ing.quantity && (
                  <div className="absolute -bottom-2 -right-2 flex h-9 min-w-9 items-center justify-center rounded-full bg-primary px-2 text-base font-extrabold text-primary-foreground kids-shadow">
                    ×{ing.quantity}
                  </div>
                )}
                {isChecked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base kids-shadow"
                  >
                    ✅
                  </motion.div>
                )}
              </div>
              {getIngredientName(ing.emoji) && (
                <div className="text-center text-xs font-bold leading-tight text-foreground">
                  {getIngredientName(ing.emoji)}
                </div>
              )}
              {ing.grams && (
                <div className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground kids-shadow">
                  {ing.grams}g
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Start button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={onStart}
        className="flex h-20 w-20 min-h-16 min-w-16 items-center justify-center rounded-full bg-accent text-4xl kids-shadow-lg"
        aria-label="Empezar a cocinar"
      >
        ▶️
      </motion.button>
    </div>
  );
}
