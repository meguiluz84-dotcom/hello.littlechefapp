import { motion } from "framer-motion";
import { LEVEL_INFO, type RecipeLevel } from "@/data/recipeMeta";

interface Props {
  active: RecipeLevel | null;
  onChange: (l: RecipeLevel | null) => void;
  progress?: Partial<Record<RecipeLevel, { done: number; total: number }>>;
}

const LEVELS: RecipeLevel[] = [1, 2, 3, 4];

export default function LevelFilters({ active, onChange, progress }: Props) {
  return (
    <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip
        active={active === null}
        emoji="🍽️"
        label="Todos"
        onClick={() => onChange(null)}
      />
      {LEVELS.map((l) => {
        const info = LEVEL_INFO[l];
        const p = progress?.[l];
        if (p && p.total === 0) return null;
        return (
          <Chip
            key={l}
            active={active === l}
            emoji={info.emoji}
            label={info.label}
            sub={p ? `${p.done}/${p.total}` : undefined}
            onClick={() => onChange(active === l ? null : l)}
            highlight={l === 4}
          />
        );
      })}
    </div>
  );
}

function Chip({
  active, emoji, label, sub, onClick, highlight,
}: {
  active: boolean; emoji: string; label: string;
  sub?: string; onClick: () => void; highlight?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold kids-shadow ${
        active
          ? "bg-primary text-primary-foreground"
          : highlight
            ? "bg-kids-yellow text-foreground ring-2 ring-kids-orange"
            : "bg-card text-foreground"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <span>{label}</span>
      {sub && (
        <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-extrabold">
          {sub} ⭐
        </span>
      )}
    </motion.button>
  );
}
