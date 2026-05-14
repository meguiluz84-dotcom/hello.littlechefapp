import { motion } from "framer-motion";
import { type RecipePack, packRecipes } from "@/data/recipePacks";
import { getRecipeMeta } from "@/data/recipeMeta";
import LevelBadge from "./LevelBadge";
import type { Recipe } from "@/data/recipes";

interface Props {
  pack: RecipePack;
  allowed: Recipe[];
  isCompleted?: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  onPick: (r: Recipe) => void;
  onClose: () => void;
  getName: (r: Recipe) => string;
}

export default function PackScreen({
  pack, allowed, isCompleted, isFavorite, onPick, onClose, getName,
}: Props) {
  const list = packRecipes(pack, allowed);
  const done = isCompleted ? list.filter((r) => isCompleted(r.id)).length : 0;

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-6">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-5 flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }} onClick={onClose} aria-label="Volver"
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-2xl kids-shadow"
          >⬅️</motion.button>
          <div className={`flex flex-1 items-center gap-2 rounded-2xl ${pack.color} px-4 py-3 kids-shadow`}>
            <span className="text-3xl">{pack.emoji}</span>
            <div className="flex flex-1 flex-col">
              <span className="text-lg font-extrabold text-foreground leading-tight">{pack.label}</span>
              <span className="text-[10px] font-bold text-foreground/80">{done}/{list.length} ⭐</span>
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl bg-card p-6 text-center text-sm font-extrabold text-foreground kids-shadow">
            No hay recetas en este pack todavía.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {list.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", bounce: 0.3 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onPick(r)}
                className="flex flex-col items-center overflow-hidden rounded-3xl bg-card kids-shadow-lg"
              >
                <div className="relative w-full p-2">
                  <img src={r.image} alt="" className="aspect-square w-full rounded-2xl object-cover" loading="lazy" />
                  {isCompleted?.(r.id) && (
                    <div className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-kids-yellow text-2xl kids-shadow ring-4 ring-background">⭐</div>
                  )}
                  {isFavorite(r.id) && (
                    <div className="absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-card text-base kids-shadow">❤️</div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 px-2 py-2">
                  <div className="text-center text-sm font-extrabold leading-tight text-foreground line-clamp-2">{getName(r)}</div>
                  <LevelBadge level={getRecipeMeta(r.id).level} size="sm" withLabel={false} />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
