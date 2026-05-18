import { motion, AnimatePresence } from "framer-motion";
import dinoChef from "@/assets/dino-chef.png";

interface Props {
  /** Big emoji string shown in the bubble (e.g. "👋🥕") */
  emojis?: string;
  /** Optional short warm text shown below the emojis (kawaii speech) */
  message?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Bubble side relative to dino */
  side?: "right" | "left";
  /** Re-key to re-trigger entrance animation when content changes */
  bubbleKey?: string | number;
  /** Soft pastel tint for the bubble */
  tone?: "default" | "yellow" | "green" | "blue" | "pink" | "purple" | "orange";
}

const dinoSizes = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-28 w-28",
};

const toneMap = {
  default: "bg-card",
  yellow: "bg-kids-yellow/70",
  green: "bg-kids-green/60",
  blue: "bg-kids-blue/60",
  pink: "bg-kids-pink/60",
  purple: "bg-kids-purple/60",
  orange: "bg-kids-orange/60",
};

const toneTailMap = {
  default: "before:bg-card",
  yellow: "before:bg-kids-yellow/70",
  green: "before:bg-kids-green/60",
  blue: "before:bg-kids-blue/60",
  pink: "before:bg-kids-pink/60",
  purple: "before:bg-kids-purple/60",
  orange: "before:bg-kids-orange/60",
};

export default function DinoBubble({
  emojis,
  message,
  size = "md",
  side = "right",
  bubbleKey,
  tone = "default",
}: Props) {
  return (
    <div
      className={`flex items-end gap-2 ${side === "left" ? "flex-row-reverse" : ""}`}
    >
      <motion.img
        src={dinoChef}
        alt=""
        width={128}
        height={128}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={`${dinoSizes[size]} object-contain drop-shadow-lg`}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={bubbleKey ?? `${emojis ?? ""}-${message ?? ""}`}
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={`relative mb-2 flex max-w-[16rem] flex-col items-center gap-0.5 rounded-3xl ${toneMap[tone]} px-4 py-2 kids-shadow ${
            side === "right"
              ? "rounded-bl-sm before:left-[-8px]"
              : "rounded-br-sm before:right-[-8px]"
          } before:absolute before:bottom-2 before:h-4 before:w-4 before:rotate-45 ${toneTailMap[tone]}`}
        >
          {emojis && <span className="text-2xl leading-none">{emojis}</span>}
          {message && (
            <span className="text-balance text-center text-sm font-extrabold leading-tight text-foreground">
              {message}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
