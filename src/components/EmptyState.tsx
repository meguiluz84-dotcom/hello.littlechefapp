import { motion } from "framer-motion";
import dinoChef from "@/assets/dino-chef.png";

interface Props {
  /** Big emoji shown in the kawaii bubble next to dino */
  emoji?: string;
  /** Short, warm headline */
  message: string;
  /** Optional secondary line (kept short) */
  hint?: string;
  cta?: { label: string; onClick: () => void };
  /** When false, hides the dino mascot (rare) */
  showDino?: boolean;
}

export default function EmptyState({
  emoji = "✨",
  message,
  hint,
  cta,
  showDino = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex max-w-sm flex-col items-center gap-4 rounded-3xl bg-card p-6 text-center kids-shadow"
    >
      {showDino && (
        <div className="flex items-end gap-2">
          <motion.img
            src={dinoChef}
            alt=""
            width={96}
            height={96}
            animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="h-24 w-24 object-contain drop-shadow-lg"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.15 }}
            className="relative mb-2 rounded-3xl rounded-bl-sm bg-kids-yellow/70 px-4 py-2 text-3xl kids-shadow"
          >
            {emoji}
          </motion.div>
        </div>
      )}
      <p className="text-balance text-base font-extrabold text-foreground">{message}</p>
      {hint && (
        <p className="text-balance text-xs font-bold text-muted-foreground">{hint}</p>
      )}
      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="min-h-16 rounded-full bg-accent px-6 py-3 text-lg font-extrabold text-accent-foreground kids-shadow"
        >
          {cta.label}
        </button>
      )}
    </motion.div>
  );
}
