import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recipes, categories, type Recipe, type RecipeCategory } from "@/data/recipes";
import { avatarById, type AvatarId } from "@/data/avatars";

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
  avatarId: AvatarId;
  onChangeAvatar: () => void;
  getRecipeName: (recipe: Recipe) => string;
}

export default function RecipeHome({ onSelectRecipe, isCompleted, avatarId, onChangeAvatar, getRecipeName }: RecipeHomeProps) {
  const avatar = avatarById(avatarId);
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(null);

  const filtered = activeCategory
    ? recipes.filter((r) => r.category === activeCategory)
    : recipes;

  const completedCount = isCompleted
    ? recipes.filter((r) => isCompleted(r.id)).length
    : 0;

  return (
    <div className="min-h-screen bg-background px-4 pb-8 pt-6">
      {/* Header - avatar mascot + change button */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <motion.button
          type="button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onChangeAvatar}
          aria-label="Cambiar avatar"
          className={`relative flex h-24 w-24 items-center justify-center rounded-full ${avatar.color} kids-shadow-lg`}
        >
          <img
            src={avatar.image}
            alt={avatar.label}
            width={96}
            height={96}
            className="h-20 w-20 object-contain"
          />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-card text-base kids-shadow ring-2 ring-background">
            🔄
          </span>
        </motion.button>
      </div>

      {/* Stars trophy counter */}
      {completedCount > 0 && (
        <motion.div
          initial={{ scale: 0, y: -10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-kids-yellow px-4 py-2 kids-shadow"
        >
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-extrabold text-foreground">×{completedCount}</span>
        </motion.div>
      )}

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
                {isCompleted?.(recipe.id) && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: -15 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="absolute -right-1 -top-1 flex h-12 w-12 items-center justify-center rounded-full bg-kids-yellow text-3xl kids-shadow-lg ring-4 ring-background"
                  >
                    ⭐
                  </motion.div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1 px-2 py-3">
                <div className="text-center text-sm font-extrabold leading-tight text-foreground">
                  {getRecipeName(recipe)}
                </div>
                <div className="flex">
                  {Array.from({ length: recipe.difficulty }).map((_, s) => (
                    <span key={s} className="text-base">
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
