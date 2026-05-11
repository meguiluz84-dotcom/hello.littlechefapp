import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import EmptyState from "./EmptyState";

interface Props {
  recipes: Recipe[];
  favorites: string[];
  onPick: (r: Recipe) => void;
  onClose: () => void;
  getName: (r: Recipe) => string;
}

export default function FavoritesScreen({ recipes, favorites, onPick, onClose, getName }: Props) {
  const favRecipes = recipes.filter((r) => favorites.includes(r.id));
  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">❤️ Favoritos</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        {favRecipes.length === 0 ? (
          <EmptyState emoji="🤍" message="Aún no tienes favoritos. Toca el corazón en una receta." />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favRecipes.map((r, i) => (
              <motion.button
                key={r.id} type="button"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", bounce: 0.4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onPick(r)}
                className="flex flex-col items-center overflow-hidden rounded-3xl bg-card kids-shadow-lg"
              >
                <img src={r.image} alt="" className="aspect-square w-full object-cover" />
                <div className="px-2 py-2 text-balance text-center text-sm font-extrabold text-foreground line-clamp-2">
                  {getName(r)}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
