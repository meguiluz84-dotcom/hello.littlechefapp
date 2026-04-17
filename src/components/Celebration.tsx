import { motion } from "framer-motion";
import dinoChef from "@/assets/dino-chef.png";

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

      {/* Dino chef celebrating */}
      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="relative mb-4"
      >
        <motion.img
          src={dinoChef}
          alt=""
          width={192}
          height={192}
          animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="h-44 w-44 object-contain drop-shadow-2xl"
        />
        {/* Speech bubble with recipe emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
          className="absolute -right-2 top-0 rounded-3xl rounded-bl-sm bg-card px-4 py-2 text-3xl kids-shadow"
        >
          {recipeEmoji}🎉
        </motion.div>
      </motion.div>

      {/* Trophy */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
        className="mb-8 text-7xl"
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
