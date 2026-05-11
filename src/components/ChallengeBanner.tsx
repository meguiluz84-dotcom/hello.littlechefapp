import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";

interface Props {
  recipe: Recipe | null;
  displayName: string;
  onPick: (r: Recipe) => void;
}

export default function ChallengeBanner({ recipe, displayName, onPick }: Props) {
  if (!recipe) return null;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onPick(recipe)}
      className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-kids-yellow to-kids-orange p-3 kids-shadow-lg"
      aria-label={`Reto del día: ${displayName}`}
    >
      <span className="text-4xl">🏆</span>
      <div className="flex flex-1 flex-col items-start text-left">
        <span className="text-xs font-extrabold text-foreground/80">Reto del día</span>
        <span className="text-base font-extrabold text-foreground line-clamp-2">{displayName}</span>
      </div>
      <img src={recipe.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
    </motion.button>
  );
}
