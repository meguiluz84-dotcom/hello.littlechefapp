import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { getStepImage } from "@/data/stepImages";
import Celebration from "./Celebration";
import DinoBubble from "./DinoBubble";

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

// Unique animation per action type
const actionAnimations: Record<string, { animate: object; transition: object }> = {
  cut: {
    animate: { rotate: [0, -20, 0, -20, 0] },
    transition: { repeat: Infinity, duration: 1.0, ease: "easeInOut" },
  },
  mix: {
    animate: { rotate: [0, 360] },
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
  pour: {
    animate: { rotate: [0, -45, 0], y: [0, 5, 0] },
    transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
  },
  spread: {
    animate: { x: [-15, 15, -15] },
    transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" },
  },
  place: {
    animate: { y: [0, -20, 0], scale: [1, 1.1, 1] },
    transition: { repeat: Infinity, duration: 1.0, ease: "easeOut" },
  },
  shake: {
    animate: { x: [-5, 5, -5, 5, 0], rotate: [-5, 5, -5, 5, 0] },
    transition: { repeat: Infinity, duration: 0.5, ease: "easeInOut" },
  },
  scoop: {
    animate: { y: [0, 10, -10, 0], rotate: [0, 15, -5, 0] },
    transition: { repeat: Infinity, duration: 1.3, ease: "easeInOut" },
  },
  peel: {
    animate: { y: [0, -8, 0], x: [0, 8, 0] },
    transition: { repeat: Infinity, duration: 1.0, ease: "easeInOut" },
  },
  wash: {
    animate: { y: [0, -5, 0], opacity: [1, 0.7, 1] },
    transition: { repeat: Infinity, duration: 0.7, ease: "easeInOut" },
  },
};

// Sound profiles per action type
const soundProfiles: Record<string, { freq: number; duration: number; type: OscillatorType; ramp?: number }> = {
  cut: { freq: 800, duration: 80, type: "sawtooth" },
  mix: { freq: 300, duration: 200, type: "sine", ramp: 500 },
  pour: { freq: 200, duration: 250, type: "sine", ramp: 100 },
  spread: { freq: 350, duration: 150, type: "triangle" },
  place: { freq: 520, duration: 100, type: "sine" },
  shake: { freq: 600, duration: 120, type: "square" },
  scoop: { freq: 400, duration: 180, type: "sine", ramp: 600 },
  peel: { freq: 700, duration: 100, type: "sawtooth", ramp: 400 },
  wash: { freq: 250, duration: 300, type: "sine", ramp: 350 },
};

function playActionSound(action: string) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const profile = soundProfiles[action] ?? { freq: 440, duration: 120, type: "sine" as OscillatorType };
    osc.type = profile.type;
    osc.frequency.value = profile.freq;
    gain.gain.value = 0.12;

    if (profile.ramp) {
      osc.frequency.linearRampToValueAtTime(profile.ramp, ctx.currentTime + profile.duration / 1000);
    }

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + profile.duration / 1000);
    setTimeout(() => { osc.stop(); ctx.close(); }, profile.duration + 50);
  } catch {
    // audio not available
  }
}

function playDoneSound() {
  try {
    const ctx = new AudioContext();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.value = 0.12;
      osc.start(ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {
    // audio not available
  }
}

// Step transition variants
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.85 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.85 }),
};

interface Props {
  recipe: Recipe;
  onFinish: () => void;
  onBack: () => void;
}

export default function RecipeStepper({ recipe, onFinish, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const total = recipe.steps.length;
  const current = recipe.steps[step];

  const next = useCallback(() => {
    setDirection(1);
    if (step < total - 1) {
      playActionSound(current.actionIcon);
      setStep((s) => s + 1);
    } else {
      playDoneSound();
      setShowCelebration(true);
    }
  }, [step, total, current.actionIcon]);

  const prev = useCallback(() => {
    setDirection(-1);
    if (step > 0) setStep((s) => s - 1);
    else onBack();
  }, [step, onBack]);

  if (showCelebration) {
    return <Celebration onDone={onFinish} recipeEmoji={recipe.emoji} />;
  }

  const actionAnim = actionAnimations[current.actionIcon] ?? actionAnimations.place;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-4 pb-8 pt-6">
      {/* Progress bar with dots */}
      <div className="flex w-full max-w-xs items-center gap-1.5">
        {recipe.steps.map((_, i) => (
          <motion.div
            key={i}
            layout
            className={`h-3 rounded-full transition-colors duration-300 ${
              i === step
                ? "bg-primary"
                : i < step
                  ? "bg-accent"
                  : "bg-muted"
            }`}
            style={{ flex: i === step ? 2.5 : 1 }}
          />
        ))}
      </div>

      {/* Dino guide with action emoji */}
      <div className="self-start">
        <DinoBubble
          emojis={`${actionIcons[current.actionIcon]}${current.emoji}`}
          size="sm"
          bubbleKey={step}
        />
      </div>

      {/* Step number badge */}
      <motion.div
        key={`num-${step}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground kids-shadow"
      >
        {step + 1}
      </motion.div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          {/* Main infographic card (image if available, else emoji) */}
          <motion.div
            className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-3xl bg-card kids-shadow-lg"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
          >
            {getStepImage(recipe.id, step) ? (
              <img
                src={getStepImage(recipe.id, step)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">{current.emoji}</span>
            )}

            {/* Sparkle particles on step change */}
            {[...Array(4)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xl"
                initial={{ opacity: 1, scale: 0 }}
                animate={{
                  opacity: [1, 0],
                  scale: [0, 1.5],
                  x: [0, (i % 2 === 0 ? 1 : -1) * 40],
                  y: [0, (i < 2 ? -1 : 1) * 40],
                }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
              >
                ✨
              </motion.span>
            ))}
          </motion.div>

          {/* Action icon with unique animation */}
          <motion.div
            animate={actionAnim.animate as Record<string, number[]>}
            transition={actionAnim.transition as Record<string, unknown>}
            className="text-6xl"
          >
            {actionIcons[current.actionIcon]}
          </motion.div>

          {/* Ingredient chips with staggered pop-in */}
          {current.ingredientEmojis.length > 0 && (
            <div className="flex gap-3">
              {current.ingredientEmojis.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    bounce: 0.6,
                    delay: 0.3 + i * 0.1,
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-3xl kids-shadow"
                >
                  {e}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex w-full max-w-xs items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          onClick={prev}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl kids-shadow"
          aria-label="Previous"
        >
          ⬅️
        </motion.button>

        {/* Pulsing next button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 0 0 rgba(var(--accent), 0)",
              "0 0 0 12px rgba(var(--accent), 0.15)",
              "0 0 0 0 rgba(var(--accent), 0)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
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
