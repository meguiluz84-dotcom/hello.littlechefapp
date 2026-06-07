import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UnlockEvent } from "@/data/collectibles";
import { useVoice } from "@/hooks/use-voice";

interface Props {
  events: UnlockEvent[];
  onClose: () => void;
}

/**
 * Cofre sorpresa: aparece tras cocinar cuando hay desbloqueos nuevos.
 * 1) Cofre cerrado pulsando para abrir.
 * 2) Explosión de confeti + lista grande de premios.
 */
export default function SurpriseChest({ events, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const voice = useVoice();

  const handleOpen = () => {
    setOpen(true);
    voice.sfx("jingle");
    const first = events[0];
    if (first) {
      // Speak the first unlock so non-readers know what they got.
      window.setTimeout(() => voice.speak(`¡Sorpresa! ${first.message}`, { pitch: 1.3 }), 350);
    }
  };


  if (events.length === 0) return null;

  const confetti = ["✨", "⭐", "🎉", "💖", "🌟", "🎊", "💫"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 px-4 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="closed"
            type="button"
            onClick={handleOpen}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", bounce: 0.6 }}
            whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center gap-4"
            aria-label="Abrir cofre sorpresa"
          >
            <motion.span
              className="text-[10rem] drop-shadow-2xl"
              animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              🎁
            </motion.span>
            <motion.span
              className="rounded-full bg-kids-yellow px-6 py-3 text-2xl font-extrabold text-foreground kids-shadow"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              ¡Toca para abrir!
            </motion.span>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative w-full max-w-sm rounded-[2.5rem] bg-card p-6 kids-shadow-lg"
          >
            {/* Confeti */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  style={{ left: `${(i * 37) % 100}%`, top: "-10%" }}
                  initial={{ y: -40, opacity: 0, rotate: 0 }}
                  animate={{ y: 600, opacity: [0, 1, 1, 0], rotate: 360 }}
                  transition={{ duration: 2.4 + (i % 5) * 0.3, repeat: Infinity, delay: (i % 8) * 0.15, ease: "linear" }}
                >
                  {confetti[i % confetti.length]}
                </motion.span>
              ))}
            </div>

            <div className="relative flex flex-col items-center gap-3">
              <motion.span
                className="text-7xl"
                animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1 }}
              >
                🎉
              </motion.span>
              <h2 className="text-balance text-center text-3xl font-extrabold text-foreground">
                ¡Sorpresa!
              </h2>

              <ul className="mt-2 flex w-full flex-col gap-3">
                {events.slice(0, 5).map((ev, i) => (
                  <motion.li
                    key={ev.item.id}
                    initial={{ x: -50, opacity: 0, scale: 0.7 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.18, type: "spring", bounce: 0.55 }}
                    className={`flex items-center gap-4 rounded-3xl ${ev.item.bg} p-4 kids-shadow`}
                  >
                    <motion.span
                      className="text-6xl drop-shadow-md"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.2 }}
                    >
                      {ev.item.emoji}
                    </motion.span>
                    <span className="flex-1 text-balance text-lg font-extrabold leading-tight text-foreground">
                      {ev.message}
                    </span>
                  </motion.li>
                ))}
                {events.length > 5 && (
                  <li className="text-center text-sm font-extrabold text-muted-foreground">
                    +{events.length - 5} más ✨
                  </li>
                )}
              </ul>

              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{ scale: 0.94 }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="kids-press mt-4 w-full rounded-full bg-kids-green px-6 py-4 text-xl font-extrabold text-foreground ring-4 ring-kids-green/30"
              >
                ¡Genial! 🌟
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
