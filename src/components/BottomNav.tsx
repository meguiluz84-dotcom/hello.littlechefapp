import { motion } from "framer-motion";

export type NavTab = "home" | "play" | "awards";

interface Props {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const items: { id: NavTab; emoji: string; label: string; color: string }[] = [
  { id: "home",   emoji: "🍕", label: "Cocinar", color: "bg-kids-green" },
  { id: "play",   emoji: "🎮", label: "Jugar",   color: "bg-kids-blue"  },
  { id: "awards", emoji: "⭐", label: "Premios", color: "bg-kids-yellow"},
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-card/95 backdrop-blur kids-shadow-lg"
      aria-label="Navegación principal"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <motion.button
              key={it.id}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => onChange(it.id)}
              aria-current={on ? "page" : undefined}
              aria-label={it.label}
              className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 text-xs font-extrabold transition-colors ${on ? `${it.color} text-foreground kids-shadow` : "text-muted-foreground"}`}
            >
              <span className={`text-3xl transition-transform ${on ? "scale-110" : ""}`}>{it.emoji}</span>
              <span>{it.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
