import { motion } from "framer-motion";

interface Props {
  emoji: string;
  message: string;
  cta?: { label: string; onClick: () => void };
}

export default function EmptyState({ emoji, message, cta }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex max-w-sm flex-col items-center gap-4 rounded-3xl bg-card p-8 text-center kids-shadow"
    >
      <motion.span
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-7xl"
      >
        {emoji}
      </motion.span>
      <p className="text-base font-extrabold text-foreground">{message}</p>
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
