import { motion } from "framer-motion";
import { HYGIENE_ACTIONS, type HygieneActionId } from "@/data/hygieneActions";

interface Props {
  onDone: () => void;
  soundOn?: boolean;
  actions?: HygieneActionId[];
}

export default function HygieneStep({ onDone, actions = ["washHands"] }: Props) {
  const list = actions.map((id) => HYGIENE_ACTIONS[id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background px-4"
    >
      <h1 className="text-balance text-center text-2xl font-extrabold text-foreground">
        Antes de cocinar…
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        {list.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", bounce: 0.5 }}
            className="flex w-32 flex-col items-center gap-2 rounded-3xl bg-card p-4 kids-shadow"
            aria-label={a.label}
          >
            <span className="text-6xl" aria-hidden>{a.emoji}</span>
            <span className="text-balance text-center text-sm font-extrabold text-foreground">{a.label}</span>
            <span className="text-balance text-center text-[11px] font-bold text-muted-foreground">{a.hint}</span>
          </motion.div>
        ))}
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={onDone}
        aria-label="Listo, todo limpio"
        className="flex min-h-16 items-center gap-2 rounded-full bg-accent px-8 py-4 text-2xl font-extrabold text-accent-foreground kids-shadow-lg"
      >
        ✅ ¡Listo!
      </motion.button>
    </motion.div>
  );
}
