import { motion, AnimatePresence } from "framer-motion";
import dinoChef from "@/assets/dino-chef.png";

interface Props {
  emojis: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Bubble side relative to dino */
  side?: "right" | "left";
  /** Re-key to re-trigger entrance animation when emojis change */
  bubbleKey?: string | number;
}

const dinoSizes = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-28 w-28",
};

export default function DinoBubble({
  emojis,
  size = "md",
  side = "right",
  bubbleKey,
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
          key={bubbleKey ?? emojis}
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={`relative mb-2 rounded-3xl bg-card px-4 py-2 text-2xl kids-shadow ${
            side === "right"
              ? "rounded-bl-sm before:left-[-8px]"
              : "rounded-br-sm before:right-[-8px]"
          } before:absolute before:bottom-2 before:h-4 before:w-4 before:rotate-45 before:bg-card`}
        >
          {emojis}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
