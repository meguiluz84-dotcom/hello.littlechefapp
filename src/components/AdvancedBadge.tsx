import { motion } from "framer-motion";

interface Props {
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
}

const sizes = {
  sm: { box: "px-2 py-1 text-[10px] gap-1", icon: "text-base" },
  md: { box: "px-3 py-1.5 text-xs gap-1", icon: "text-lg" },
  lg: { box: "px-4 py-2 text-sm gap-2", icon: "text-2xl" },
};

export default function AdvancedBadge({ size = "md", withLabel = true }: Props) {
  const s = sizes[size];
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className={`flex items-center rounded-full bg-kids-yellow font-extrabold text-foreground ring-4 ring-kids-orange/70 kids-shadow ${s.box}`}
      aria-label="Receta de Chef Avanzado"
      title="Chef Avanzado"
    >
      <span className={s.icon} aria-hidden>👨‍🍳</span>
      <span className={s.icon} aria-hidden>⭐</span>
      {withLabel && <span>Chef Avanzado</span>}
    </motion.div>
  );
}
