import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import Celebration from "./Celebration";

const actionIcons: Record<string, string> = {
  cut: "🔪",
  mix: "🥄",
  pour: "💧",
  spread: "🧈",
  place: "👆",
  shake: "🫨",
  scoop: "🥄",
  peel: "✋",
  wash: "🚿",
};

interface Props {
  recipe: Recipe;
  onFinish: () => void;
  onBack: () => void;
}

function playSound(type: "step" | "done") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "done") {
      osc.frequency.value = 523;
      gain.gain.value = 0.15;
      osc.start();
      setTimeout(() => { osc.frequency.value = 659; }, 150);
      setTimeout(() => { osc.frequency.value = 784; }, 300);
      setTimeout(() => { osc.stop(); ctx.close(); }, 500);
    } else {
      osc.frequency.value = 440;
      gain.gain.value = 0.1;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 120);
    }
  } catch {
    // audio not available
  }
}

export default function RecipeStepper({ recipe, onFinish, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const total = recipe.steps.length;
  const current = recipe.steps[step];

  const next = useCallback(() => {
    if (step < total - 1) {
      playSound("step");
      setStep((s) => s + 1);
    } else {
      playSound("done");
      setShowCelebration(true);
    }
  }, [step, total]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
    else onBack();
  }, [step, onBack]);

  if (showCelebration) {
    return <Celebration onDone={onFinish} recipeEmoji={recipe.emoji} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-4 pb-8 pt-6">
      {/* Progress dots */}
      <div className="flex gap-2">
        {recipe.steps.map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === step ? "w-8 bg-primary" : i < step ? "w-3 bg-accent" : "w-3 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step number */}
      <motion.div
        key={step}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
      >
        {step + 1}
      </motion.div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Action emoji - big */}
          <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-card kids-shadow-lg">
            <span className="text-7xl">{current.emoji}</span>
          </div>

          {/* Action icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-5xl"
          >
            {actionIcons[current.actionIcon]}
          </motion.div>

          {/* Ingredient chips */}
          {current.ingredientEmojis.length > 0 && (
            <div className="flex gap-2">
              {current.ingredientEmojis.map((e, i) => (
                <div key={i} className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-3xl">
                  {e}
                </div>
              ))}
            </div>
          )}

          {/* Arrow pointing right */}
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-4xl text-primary"
          >
            👉
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex w-full max-w-xs items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={prev}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl kids-shadow"
          aria-label="Previous"
        >
          ⬅️
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={next}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-4xl kids-shadow-lg"
          aria-label="Next"
        >
          {step < total - 1 ? "➡️" : "🎉"}
        </motion.button>
      </div>
    </div>
  );
}
