import { AnimatePresence, motion } from "framer-motion";
import ChefMascot from "./ChefMascot";

interface Props {
  open: boolean;
  sticker: string;
  praise: string;
  streak: number;
  onClose: () => void;
}

const confetti = ["🎉", "⭐", "🌟", "✨", "🎈", "💖", "🥳", "🍭"];

export default function DailyRewardModal({ open, sticker, praise, streak, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-5"
          role="dialog" aria-modal="true" aria-label="Premio del día"
        >
          {confetti.map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: -40, x: Math.random() * 320 - 160, opacity: 0 }}
              animate={{ y: [0, 600], opacity: [1, 0], rotate: [0, 360] }}
              transition={{ duration: 2 + Math.random() * 1.5, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.8 }}
              className="pointer-events-none absolute top-0 text-4xl"
            >
              {c}
            </motion.span>
          ))}

          <motion.div
            initial={{ scale: 0.6, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.55 }}
            className="relative w-full max-w-sm rounded-[2.5rem] bg-card p-7 text-center kids-shadow-lg ring-4 ring-kids-yellow"
          >
            <div className="text-sm font-extrabold uppercase tracking-wide text-kids-pink">
              🎁 Premio del día
            </div>

            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mx-auto mt-3 flex h-32 w-32 items-center justify-center rounded-full bg-kids-yellow text-7xl kids-shadow-lg"
            >
              {sticker}
            </motion.div>

            <h2 className="mt-4 text-2xl font-extrabold text-foreground">{praise}</h2>
            <p className="mt-1 text-sm font-bold text-muted-foreground">¡Sticker nuevo para tu colección!</p>

            {streak > 1 && (
              <div className="mx-auto mt-3 inline-flex items-center gap-1 rounded-full bg-kids-orange/30 px-3 py-1 text-xs font-extrabold text-foreground">
                🔥 {streak} días seguidos
              </div>
            )}

            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={onClose}
              className="kids-press mt-6 w-full rounded-full bg-kids-green py-4 text-xl font-extrabold text-primary-foreground"
            >
              ¡Genial!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
