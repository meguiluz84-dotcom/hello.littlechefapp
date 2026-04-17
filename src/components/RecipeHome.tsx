import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recipes, categories, type Recipe, type RecipeCategory } from "@/data/recipes";

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
  isCompleted?: (id: string) => boolean;
}

export default function RecipeHome({ onSelectRecipe, isCompleted }: RecipeHomeProps) {
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(null);

  const filtered = activeCategory
    ? recipes.filter((r) => r.category === activeCategory)
    : recipes;

  const completedCount = isCompleted
    ? recipes.filter((r) => isCompleted(r.id)).length
    : 0;

  return (
    <div className="min-h-screen bg-background px-4 pb-8 pt-6">
      {/* Header - chef hat icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-4 flex justify-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-5xl kids-shadow">
          👨‍🍳
        </div>
      </motion.div>

      {/* Category filter bar */}
      <div className="mx-auto mb-5 flex max-w-xl justify-center gap-2">
        {/* All button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveCategory(null)}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all kids-shadow ${
            activeCategory === null
              ? "bg-primary ring-4 ring-primary/40 scale-110"
              : "bg-card"
          }`}
        >
          🌟
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              setActiveCategory(activeCategory === cat.id ? null : cat.id)
            }
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all kids-shadow ${
              activeCategory === cat.id
                ? "bg-primary ring-4 ring-primary/40 scale-110"
                : "bg-card"
            }`}
          >
            {cat.emoji}
          </motion.button>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="mx-auto grid max-w-xl grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((recipe, i) => (
            <motion.button
              key={recipe.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.04, type: "spring", bounce: 0.3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectRecipe(recipe)}
              className="group flex flex-col items-center overflow-hidden rounded-3xl bg-card kids-shadow-lg transition-shadow hover:shadow-2xl"
            >
              <div
                className={`relative w-full overflow-hidden ${colorMap[recipe.color] ?? "bg-primary"} p-2`}
              >
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
                <div className="flex">
                  {Array.from({ length: recipe.difficulty }).map((_, s) => (
                    <span key={s} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
