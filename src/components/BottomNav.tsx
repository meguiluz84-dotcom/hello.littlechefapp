import { motion } from "framer-motion";

export type NavTab = "home" | "packs" | "plan" | "progress" | "profile";

interface Props {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const items: { id: NavTab; emoji: string; label: string }[] = [
  { id: "home",     emoji: "🏠", label: "Inicio" },
  { id: "packs",    emoji: "📦", label: "Packs" },
  { id: "plan",     emoji: "📅", label: "Plan" },
  { id: "progress", emoji: "🏅", label: "Logros" },
  { id: "profile",  emoji: "👥", label: "Perfil" },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur kids-shadow-lg"
      aria-label="Navegación principal"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-xl items-stretch justify-around">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <motion.button
              key={it.id}
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => onChange(it.id)}
              aria-current={on ? "page" : undefined}
              aria-label={it.label}
              className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-extrabold ${on ? "text-foreground" : "text-muted-foreground"}`}
            >
              <span className={`text-2xl transition-transform ${on ? "scale-125" : ""}`}>{it.emoji}</span>
              <span>{it.label}</span>
              {on && <span className="mt-0.5 h-1 w-6 rounded-full bg-primary" />}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
