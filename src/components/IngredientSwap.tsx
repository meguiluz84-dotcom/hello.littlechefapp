import { motion } from "framer-motion";
import type { Swap } from "@/data/ingredientSwaps";

interface Props {
  swap: Swap;
}

// Tiny visual swap pegatina shown next to an ingredient: original ❌ → new
export default function IngredientSwap({ swap }: Props) {
  return (
    <motion.div
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="mt-1 flex items-center gap-1 rounded-full bg-kids-yellow/70 px-1.5 py-0.5 text-[10px] font-extrabold text-foreground kids-shadow"
      title={`Cambia por ${swap.label}`}
      aria-label={`Sustituye por ${swap.label}`}
    >
      <span className="line-through opacity-60">{swap.from}</span>
      <span>➡️</span>
      <span className="text-base leading-none">{swap.to}</span>
    </motion.div>
  );
}
