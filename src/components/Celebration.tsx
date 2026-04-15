import { motion } from "framer-motion";

interface Props {
  onDone: () => void;
  recipeEmoji: string;
}

const confetti = ["🎉", "⭐", "🌟", "✨", "🎈", "🎊", "💖", "🥳"];

export default function Celebration({ onDone, recipeEmoji }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Floating confetti */}
      {confetti.map((c, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, x: Math.random() * 300 - 150, opacity: 0 }}
          animate={{
            y: [0, 600],
            opacity: [1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="pointer-events-none absolute top-0 text-4xl"
        >
          {c}
        </motion.span>
      ))}

      {/* Big recipe emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-8 text-9xl"
      >
        {recipeEmoji}
      </motion.div>

      {/* Trophy */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-10 text-7xl"
      >
        🏆
      </motion.div>

      {/* Home button */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onDone}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-4xl kids-shadow-lg"
        aria-label="Go home"
      >
        🏠
      </motion.button>
    </div>
  );
}
