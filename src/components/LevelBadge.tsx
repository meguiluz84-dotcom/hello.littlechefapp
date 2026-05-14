import { motion } from "framer-motion";
import { LEVEL_INFO, type RecipeLevel } from "@/data/recipeMeta";
import AdvancedBadge from "./AdvancedBadge";

interface Props {
  level: RecipeLevel;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
}

const sizes = {
  sm: { box: "px-2 py-0.5 text-[10px] gap-1", icon: "text-sm" },
  md: { box: "px-3 py-1 text-xs gap-1", icon: "text-base" },
  lg: { box: "px-4 py-1.5 text-sm gap-2", icon: "text-xl" },
};

const tone: Record<RecipeLevel, string> = {
  1: "bg-kids-green/70",
  2: "bg-kids-blue/70",
  3: "bg-kids-purple/70",
  4: "bg-kids-yellow",
};

export default function LevelBadge({ level, size = "sm", withLabel = true }: Props) {
  if (level === 4) return <AdvancedBadge size={size} withLabel={withLabel} />;
  const s = sizes[size];
  const info = LEVEL_INFO[level];
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className={`flex items-center rounded-full font-extrabold text-foreground kids-shadow ${tone[level]} ${s.box}`}
      aria-label={`Nivel ${info.label}`}
      title={info.label}
    >
      <span className={s.icon} aria-hidden>{info.emoji}</span>
      {withLabel && <span>{info.label}</span>}
    </motion.div>
  );
}
