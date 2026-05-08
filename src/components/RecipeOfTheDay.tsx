import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";

interface Props {
  recipe: Recipe;
  displayName: string;
  onOpen: (r: Recipe) => void;
}

export default function RecipeOfTheDay({ recipe, displayName, onOpen }: Props) {
  // Simple shimmer effect
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setHover((h) => !h), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onOpen(recipe)}
      aria-label={`Receta del día: ${displayName}`}
      className="relative mb-5 flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-accent to-primary p-3 kids-shadow-lg"
    >
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-card kids-shadow">
        <img src={recipe.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-1 text-left">
        <div className="flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 text-xs font-extrabold text-foreground">
          ⭐ Receta del día
        </div>
        <div className="text-lg font-extrabold leading-tight text-primary-foreground line-clamp-2">
          {displayName}
        </div>
        <div className="flex">
          {Array.from({ length: recipe.difficulty }).map((_, i) => (
            <span key={i} className="text-base">⭐</span>
          ))}
        </div>
      </div>
      <motion.span
        animate={{ scale: hover ? 1.15 : 1 }}
        className="text-4xl"
      >
        ▶️
      </motion.span>
    </motion.button>
  );
}
