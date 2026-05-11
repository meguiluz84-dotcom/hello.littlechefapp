import { motion } from "framer-motion";

interface Props {
  onDone: () => void;
  soundOn?: boolean;
}

export default function HygieneStep({ onDone }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-8xl"
      >
        🧼
      </motion.div>
      <h1 className="text-balance text-center text-3xl font-extrabold text-foreground">
        ¡Lávate las manos antes de empezar!
      </h1>
      <p className="text-balance text-center text-lg text-muted-foreground">
        Con agua y jabón 🫧
      </p>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={onDone}
        aria-label="Listo, manos limpias"
        className="flex min-h-16 items-center gap-2 rounded-full bg-accent px-8 py-4 text-2xl font-extrabold text-accent-foreground kids-shadow-lg"
      >
        ✅ ¡Listo!
      </motion.button>
    </motion.div>
  );
}
