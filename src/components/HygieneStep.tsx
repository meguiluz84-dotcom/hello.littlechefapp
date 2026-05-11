import { useState } from "react";
import { motion } from "framer-motion";
import VisualTimer from "./VisualTimer";

interface Props {
  onDone: () => void;
  soundOn?: boolean;
}

export default function HygieneStep({ onDone, soundOn }: Props) {
  const [done, setDone] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background px-4"
    >
      <h1 className="text-balance text-center text-3xl font-extrabold text-foreground">
        🧼 ¡Manos limpias!
      </h1>
      <VisualTimer seconds={20} emoji="🧼" soundOn={soundOn} onDone={() => setDone(true)} />
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        animate={done ? { scale: [1, 1.08, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        disabled={!done}
        onClick={onDone}
        aria-label="Listo, manos limpias"
        className="flex min-h-16 items-center gap-2 rounded-full bg-accent px-8 py-4 text-2xl font-extrabold text-accent-foreground kids-shadow-lg disabled:opacity-40"
      >
        ✅ ¡Listo!
      </motion.button>
    </motion.div>
  );
}
