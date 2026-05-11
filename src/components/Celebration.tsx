import { motion } from "framer-motion";
import dinoChef from "@/assets/dino-chef.png";
import type { Recipe } from "@/data/recipes";
import { MEDALS } from "@/data/medals";

interface Props {
  recipe?: Recipe;
  displayName?: string;
  onHome: () => void;
  onAnother?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  newMedalId?: string | null;
  // Back-compat with older callers
  onDone?: () => void;
  recipeEmoji?: string;
}

const confetti = ["🎉", "⭐", "🌟", "✨", "🎈", "🎊", "💖", "🥳"];

export default function Celebration({
  recipe, displayName, onHome, onAnother, isFavorite, onToggleFavorite,
  newMedalId, onDone, recipeEmoji,
}: Props) {
  const finishHome = onHome ?? onDone ?? (() => {});
  const dishEmoji = recipe?.emoji ?? recipeEmoji ?? "🍽️";
  const newMedal = newMedalId ? MEDALS.find((m) => m.id === newMedalId) ?? null : null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-background px-4 pb-8 pt-8">
      {/* Floating confetti */}
      {confetti.map((c, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, x: Math.random() * 300 - 150, opacity: 0 }}
          animate={{ y: [0, 600], opacity: [1, 0], rotate: [0, 360] }}
          transition={{ duration: 2 + Math.random() * 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }}
          className="pointer-events-none absolute top-0 text-4xl"
        >
          {c}
        </motion.span>
      ))}

      {/* Dino chef + dish */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="relative"
        >
          <motion.img
            src={dinoChef} alt="" width={144} height={144}
            animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="h-32 w-32 object-contain drop-shadow-2xl"
          />
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="absolute -right-2 top-0 rounded-3xl rounded-bl-sm bg-card px-3 py-1.5 text-2xl kids-shadow"
          >
            {dishEmoji}🎉
          </motion.div>
        </motion.div>

        {/* Finished dish plate */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
          className="relative mt-3 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full bg-card kids-shadow-lg ring-8 ring-kids-yellow/60"
          aria-label={displayName ?? "Plato terminado"}
        >
          {recipe ? (
            <img src={recipe.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-7xl">{dishEmoji}</span>
          )}
        </motion.div>

        {displayName && (
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-3 text-balance text-center text-2xl font-extrabold text-foreground"
          >
            ¡{displayName} listo!
          </motion.h1>
        )}
      </div>

      {/* Medal earned */}
      {newMedal ? (
        <motion.div
          initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", bounce: 0.6 }}
          className="flex flex-col items-center gap-1 rounded-3xl bg-kids-yellow/70 px-5 py-3 kids-shadow-lg"
          aria-label={`Nueva medalla: ${newMedal.label}`}
        >
          <div className="text-xs font-extrabold text-foreground">¡Nueva medalla!</div>
          <div className="flex items-center gap-2">
            <span className="text-5xl">{newMedal.emoji}</span>
            <span className="text-lg font-extrabold text-foreground">{newMedal.label}</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
          className="text-7xl"
        >
          🏆
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex w-full max-w-sm items-center justify-center gap-3">
        {onToggleFavorite && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            aria-pressed={!!isFavorite}
            className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-card text-3xl kids-shadow"
          >
            {isFavorite ? "❤️" : "🤍"}
          </motion.button>
        )}

        {onAnother && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            onClick={onAnother}
            aria-label="Hacer otra receta"
            className="flex h-20 min-h-16 items-center gap-2 rounded-full bg-accent px-6 text-3xl font-extrabold text-accent-foreground kids-shadow-lg"
          >
            🍳 ➕
          </motion.button>
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={finishHome}
          aria-label="Inicio"
          className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground kids-shadow-lg"
        >
          🏠
        </motion.button>
      </div>
    </div>
  );
}
