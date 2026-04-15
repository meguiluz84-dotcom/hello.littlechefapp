import { motion } from "framer-motion";
import { recipes, type Recipe } from "@/data/recipes";

const colorMap: Record<string, string> = {
  "kids-pink": "bg-kids-pink",
  "kids-blue": "bg-kids-blue",
  "kids-green": "bg-kids-green",
  "kids-orange": "bg-kids-orange",
  "kids-purple": "bg-kids-purple",
  "kids-yellow": "bg-kids-yellow",
  "kids-red": "bg-kids-red",
  "kids-teal": "bg-kids-teal",
};

interface RecipeHomeProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function RecipeHome({ onSelectRecipe }: RecipeHomeProps) {
  return (
    <div className="min-h-screen bg-background px-4 pb-8 pt-6">
      {/* Header - chef hat icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-6 flex justify-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-5xl kids-shadow">
          👨‍🍳
        </div>
      </motion.div>

      {/* Recipe grid */}
      <div className="mx-auto grid max-w-xl grid-cols-2 gap-4">
        {recipes.map((recipe, i) => (
          <motion.button
            key={recipe.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", bounce: 0.4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelectRecipe(recipe)}
            className="group flex flex-col items-center overflow-hidden rounded-3xl bg-card kids-shadow-lg transition-shadow hover:shadow-2xl"
          >
            <div className={`relative w-full overflow-hidden ${colorMap[recipe.color] ?? "bg-primary"} p-2`}>
              <img
                src={recipe.image}
                alt=""
                className="aspect-square w-full rounded-2xl object-cover"
                loading="lazy"
                width={256}
                height={256}
              />
            </div>
            <div className="flex items-center gap-1 py-3">
              <span className="text-3xl">{recipe.emoji}</span>
              {/* Difficulty stars */}
              <div className="flex">
                {Array.from({ length: recipe.difficulty }).map((_, s) => (
                  <span key={s} className="text-lg">⭐</span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
