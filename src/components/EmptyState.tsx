import { motion } from "framer-motion";
import dinoChef from "@/assets/dino-chef.png";

interface CTA {
  label: string;
  onClick: () => void;
}

interface Props {
  /** Big emoji shown in the kawaii bubble next to dino */
  emoji?: string;
  /** Short, warm headline (always under ~6 words) */
  message: string;
  /** Optional secondary line (kept short) */
  hint?: string;
  /** Primary action button */
  cta?: CTA;
  /** Optional softer secondary action */
  secondaryCta?: CTA;
  /** When false, hides the dino mascot (rare) */
  showDino?: boolean;
  /** Visual tone of the speech bubble */
  tone?: "yellow" | "green" | "blue" | "pink" | "purple" | "orange";
}

const toneMap = {
  yellow: "bg-kids-yellow/70",
  green: "bg-kids-green/60",
  blue: "bg-kids-blue/60",
  pink: "bg-kids-pink/60",
  purple: "bg-kids-purple/60",
  orange: "bg-kids-orange/60",
};

export default function EmptyState({
  emoji = "✨",
  message,
  hint,
  cta,
  secondaryCta,
  showDino = true,
  tone = "yellow",
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
            className={`relative mb-2 rounded-3xl rounded-bl-sm ${toneMap[tone]} px-4 py-2 text-3xl kids-shadow`}
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
          className="min-h-16 rounded-full bg-accent px-6 py-3 text-lg font-extrabold text-accent-foreground kids-shadow active:scale-95 active:shadow-inner touch-manipulation"
        >
          {cta.label}
        </button>
      )}
      {secondaryCta && (
        <button
          type="button"
          onClick={secondaryCta.onClick}
          className="min-h-12 rounded-full bg-card px-5 py-2 text-sm font-extrabold text-foreground kids-shadow active:scale-95 touch-manipulation"
        >
          {secondaryCta.label}
        </button>
      )}
    </motion.div>
  );
}
