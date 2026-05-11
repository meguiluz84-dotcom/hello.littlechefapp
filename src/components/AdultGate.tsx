import { motion } from "framer-motion";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdultGate({ onConfirm, onCancel }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background/95 px-4 backdrop-blur"
    >
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-8xl"
      >🧑</motion.div>
      <h2 className="text-balance text-center text-2xl font-extrabold text-foreground">
        ¡Necesito a un adulto!
      </h2>
      <p className="text-balance text-center text-base font-bold text-muted-foreground">
        Este paso usa cuchillo, calor o algo delicado.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onConfirm}
          className="min-h-16 rounded-full bg-accent px-8 py-4 text-xl font-extrabold text-accent-foreground kids-shadow-lg"
        >
          ✅ Adulto presente
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-16 rounded-full bg-card px-6 py-3 text-base font-extrabold text-foreground kids-shadow"
        >
          ⬅️ Volver
        </button>
      </div>
    </motion.div>
  );
}
