import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import DinoBubble from "./DinoBubble";

interface Props {
  recipe: Recipe;
  onStart: () => void;
  onBack: () => void;
}

export default function RecipeIngredients({ recipe, onStart, onBack }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6">
      {/* Dino guide */}
      <div className="mb-4 self-start">
        <DinoBubble emojis={`🧺${recipe.emoji}`} size="md" />
      </div>

      {/* Recipe image */}
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={recipe.image}
        alt=""
        className="mb-6 h-32 w-32 rounded-3xl object-cover kids-shadow-lg"
        width={128}
        height={128}
      />

      {/* Ingredients grid */}
      <div className="mx-auto mb-8 grid max-w-sm grid-cols-3 gap-5">
        {recipe.ingredients.map((ing, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 + i * 0.1, type: "spring", bounce: 0.5 }}
            className="relative flex flex-col items-center gap-1"
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-card kids-shadow">
              <span className="text-4xl">{ing.emoji}</span>
              {ing.quantity && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring", bounce: 0.6 }}
                  className="absolute -bottom-2 -right-2 flex h-9 min-w-9 items-center justify-center rounded-full bg-primary px-2 text-base font-extrabold text-primary-foreground kids-shadow"
                >
                  ×{ing.quantity}
                </motion.div>
              )}
            </div>
            {ing.grams && (
              <div className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground kids-shadow">
                {ing.grams}g
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex w-full max-w-xs items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onBack}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl kids-shadow"
          aria-label="Back"
        >
          ⬅️
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={onStart}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-4xl kids-shadow-lg"
          aria-label="Start cooking"
        >
          ▶️
        </motion.button>
      </div>
    </div>
  );
}
