import { motion } from "framer-motion";
import { PACKS, packRecipes, type RecipePack } from "@/data/recipePacks";
import type { Recipe } from "@/data/recipes";

interface Props {
  allowed: Recipe[];
  isCompleted?: (id: string) => boolean;
  onPick: (pack: RecipePack) => void;
}

export default function RecipePacks({ allowed, isCompleted, onPick }: Props) {
  return (
    <div className="mb-5">
      <div className="mb-2 px-1 text-sm font-extrabold text-foreground">📦 Packs</div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
        {PACKS.map((p, i) => {
          const list = packRecipes(p, allowed);
          if (list.length === 0) return null;
          const done = isCompleted ? list.filter((r) => isCompleted(r.id)).length : 0;
          return (
            <motion.button
              key={p.id}
              type="button"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", bounce: 0.4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onPick(p)}
              className={`flex w-32 shrink-0 snap-start flex-col items-center gap-1 rounded-3xl ${p.color} p-3 kids-shadow-lg`}
              aria-label={`Pack ${p.label}, ${done} de ${list.length}`}
            >
              <span className="text-5xl">{p.emoji}</span>
              <span className="text-balance text-center text-xs font-extrabold leading-tight text-foreground line-clamp-2">{p.label}</span>
              <span className="rounded-full bg-card/80 px-2 py-0.5 text-[10px] font-extrabold text-foreground">{done}/{list.length} ⭐</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
