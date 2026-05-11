import { useState, useCallback, useEffect, useReducer, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { stepNeedsAdult } from "@/data/recipeMeta";
import { getStepImage, subscribeStepImages } from "@/data/stepImages";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import Celebration from "./Celebration";
import DinoBubble from "./DinoBubble";
import HygieneStep from "./HygieneStep";
import AdultGate from "./AdultGate";

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

const actionAnimations: Record<string, { animate: object; transition: object }> = {
  cut: { animate: { rotate: [0, -20, 0, -20, 0] }, transition: { repeat: Infinity, duration: 1.0, ease: "easeInOut" } },
  mix: { animate: { rotate: [0, 360] }, transition: { repeat: Infinity, duration: 1.5, ease: "linear" } },
  pour: { animate: { rotate: [0, -45, 0], y: [0, 5, 0] }, transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } },
  spread: { animate: { x: [-15, 15, -15] }, transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } },
  place: { animate: { y: [0, -20, 0], scale: [1, 1.1, 1] }, transition: { repeat: Infinity, duration: 1.0, ease: "easeOut" } },
  shake: { animate: { x: [-5, 5, -5, 5, 0], rotate: [-5, 5, -5, 5, 0] }, transition: { repeat: Infinity, duration: 0.5, ease: "easeInOut" } },
  scoop: { animate: { y: [0, 10, -10, 0], rotate: [0, 15, -5, 0] }, transition: { repeat: Infinity, duration: 1.3, ease: "easeInOut" } },
  peel: { animate: { y: [0, -8, 0], x: [0, 8, 0] }, transition: { repeat: Infinity, duration: 1.0, ease: "easeInOut" } },
  wash: { animate: { y: [0, -5, 0], opacity: [1, 0.7, 1] }, transition: { repeat: Infinity, duration: 0.7, ease: "easeInOut" } },
};

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

function playActionSound(action: string, enabled: boolean) {
  if (!enabled) return;
  try {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const profile = soundProfiles[action] ?? { freq: 440, duration: 120, type: "sine" as OscillatorType };
    osc.type = profile.type;
    osc.frequency.value = profile.freq;
    gain.gain.value = 0.12;
    if (profile.ramp) osc.frequency.linearRampToValueAtTime(profile.ramp, ctx.currentTime + profile.duration / 1000);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + profile.duration / 1000);
    setTimeout(() => { osc.stop(); ctx.close(); }, profile.duration + 50);
  } catch { /* no audio */ }
}

function playDoneSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AC();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.value = 0.12;
      osc.start(ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
    setTimeout(() => ctx.close(), 800);
  } catch { /* no audio */ }
}

interface Props {
  recipe: Recipe;
  onFinish: () => void;
  onBack: () => void;
  onHome?: () => void;
  startAt?: number;
  soundOn?: boolean;
  onPause?: (step: number) => void;
  onClearResume?: () => void;
}

export default function RecipeStepper({
  recipe, onFinish, onBack, onHome,
  startAt = 0, soundOn = true, onPause, onClearResume,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(Math.min(startAt, recipe.steps.length - 1));
  const [direction, setDirection] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [hygieneDone, setHygieneDone] = useState(startAt > 0);
  const [adultConfirmedStep, setAdultConfirmedStep] = useState<number | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const unsub = subscribeStepImages(forceUpdate);
    return () => { unsub(); };
  }, []);
  const total = recipe.steps.length;
  const current = recipe.steps[step];
  const needsAdult = useMemo(
    () => stepNeedsAdult(current.actionIcon, current.emoji),
    [current]
  );
  const adultBlocking = needsAdult && adultConfirmedStep !== step;

  const next = useCallback(() => {
    setDirection(1);
    if (step < total - 1) {
      playActionSound(current.actionIcon, soundOn);
      setStep((s) => s + 1);
    } else {
      playDoneSound(soundOn);
      onClearResume?.();
      setShowCelebration(true);
    }
  }, [step, total, current.actionIcon, soundOn, onClearResume]);

  const prev = useCallback(() => {
    setDirection(-1);
    if (step > 0) setStep((s) => s - 1);
    else onBack();
  }, [step, onBack]);

  const replay = useCallback(() => {
    playActionSound(current.actionIcon, soundOn);
    setReplayKey((k) => k + 1);
  }, [current.actionIcon, soundOn]);

  const pauseAndExit = useCallback(() => {
    onPause?.(step);
    onBack();
  }, [step, onPause, onBack]);

  if (showCelebration) {
    return <Celebration onDone={onFinish} recipeEmoji={recipe.emoji} />;
  }

  if (!hygieneDone) {
    return <HygieneStep soundOn={soundOn} onDone={() => setHygieneDone(true)} />;
  }

  const actionAnim = reduced
    ? { animate: {}, transition: {} }
    : (actionAnimations[current.actionIcon] ?? actionAnimations.place);

  const slideVariants = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.85 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.85 }),
      };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-background px-4 pb-8 pt-6">
      {/* Top-right controls: pause + home */}
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
        {onPause && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={pauseAndExit}
            aria-label="Pausar y salir"
            className="flex h-14 w-14 min-h-14 min-w-14 items-center justify-center rounded-full bg-card text-2xl kids-shadow md:h-20 md:w-20 md:text-4xl"
          >
            ⏸️
          </motion.button>
        )}
        {onHome && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            onClick={onHome}
            className="flex h-14 w-14 min-h-14 min-w-14 items-center justify-center rounded-full bg-card text-3xl kids-shadow md:h-20 md:w-20 md:text-5xl"
            aria-label="Inicio"
          >
            🏠
          </motion.button>
        )}
      </div>

      {/* Adult-required badge */}
      {needsAdult && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-kids-yellow px-3 py-2 kids-shadow"
          aria-label="Necesita ayuda de un adulto"
          title="Necesita ayuda de un adulto"
        >
          <span className="text-2xl">🧑</span>
          <span className="text-xs font-extrabold text-foreground">¡Adulto!</span>
        </motion.div>
      )}

      {/* Progress bar with dots */}
      <div className="mt-12 flex w-full max-w-xs items-center gap-1.5">
        {recipe.steps.map((_, i) => (
          <motion.div
            key={i}
            layout={!reduced}
            className={`h-3 rounded-full transition-colors duration-300 ${
              i === step ? "bg-primary" : i < step ? "bg-accent" : "bg-muted"
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
        initial={reduced ? false : { scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground kids-shadow md:h-20 md:w-20 md:text-4xl"
      >
        {step + 1}
      </motion.div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${step}-${replayKey}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", bounce: 0.25, duration: reduced ? 0.2 : 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <motion.div
            className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-3xl bg-card kids-shadow-lg"
            initial={reduced ? false : { rotateY: 90 }}
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
          </motion.div>

          <motion.div
            animate={actionAnim.animate as Record<string, number[]>}
            transition={actionAnim.transition as Record<string, unknown>}
            className="text-6xl"
          >
            {actionIcons[current.actionIcon]}
          </motion.div>

          {current.ingredientEmojis.length > 0 && (
            <div className="flex gap-3">
              {current.ingredientEmojis.map((e, i) => (
                <motion.div
                  key={i}
                  initial={reduced ? false : { scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.3 + i * 0.1 }}
                  className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-2xl bg-secondary text-3xl kids-shadow"
                >
                  {e}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex w-full max-w-sm items-center justify-between gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={prev}
          aria-label="Anterior"
          className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-muted text-3xl kids-shadow md:h-24 md:w-24 md:text-5xl"
        >
          ⬅️
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={replay}
          aria-label="Repetir"
          className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-card text-3xl kids-shadow"
        >
          🔁
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          animate={reduced ? {} : { scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={next}
          aria-label={step < total - 1 ? "Siguiente" : "Terminar"}
          className="flex h-20 w-20 min-h-16 min-w-16 items-center justify-center rounded-full bg-accent text-4xl kids-shadow-lg md:h-32 md:w-32 md:text-6xl"
        >
          {step < total - 1 ? "➡️" : "🎉"}
        </motion.button>
      </div>

      {adultBlocking && (
        <AdultGate
          onConfirm={() => setAdultConfirmedStep(step)}
          onCancel={pauseAndExit}
        />
      )}
    </div>
  );
}
