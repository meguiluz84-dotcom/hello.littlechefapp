import { motion } from "framer-motion";
import { TAG_INFO, type FoodTag } from "@/data/recipeMeta";

interface Props {
  active: FoodTag | null;
  onChange: (t: FoodTag | null) => void;
}

const TAGS: FoodTag[] = ["desayuno", "merienda", "fruta", "salado", "sin-coccion"];

export default function CategoryFilters({ active, onChange }: Props) {
  return (
    <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <FilterChip
        active={active === null}
        emoji="✨"
        label="Todas"
        onClick={() => onChange(null)}
      />
      {TAGS.map((t) => (
        <FilterChip
          key={t}
          active={active === t}
          emoji={TAG_INFO[t].emoji}
          label={TAG_INFO[t].label}
          onClick={() => onChange(active === t ? null : t)}
        />
      ))}
    </div>
  );
}

function FilterChip({
  active, emoji, label, onClick,
}: { active: boolean; emoji: string; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold kids-shadow ${
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      {label}
    </motion.button>
  );
}
