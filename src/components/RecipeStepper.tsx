import { useState, useCallback, useEffect, useReducer, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { stepNeedsAdult, getRecipeMeta } from "@/data/recipeMeta";
import { getStepImage, subscribeStepImages } from "@/data/stepImages";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { detectHygieneActions } from "@/data/hygieneActions";
import { useLongPress } from "@/hooks/use-long-press";
import Celebration from "./Celebration";
import HygieneStep from "./HygieneStep";
import AdultGate from "./AdultGate";
import VisualTimer from "./VisualTimer";

import { useVoice } from "@/hooks/use-voice";
import { lineForAction } from "@/data/voiceLines";
import { getStepTimer } from "@/hooks/use-step-timers";

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
  bake: "🔥",
  chill: "❄️",
  wait: "⏳",
};

// Etiqueta cortísima en español por acción — pensada para no-lectores.
const actionLabels: Record<string, string> = {
  cut: "Corta",
  mix: "Mezcla",
  pour: "Vierte",
  spread: "Unta",
  place: "Coloca",
  shake: "Agita",
  scoop: "Coge",
  peel: "Pela",
  wash: "Lava",
  bake: "Hornea",
  chill: "Enfría",
  wait: "Espera",
};

// Mensajes positivos breves tras completar un paso.
const PRAISE = ["¡Genial!", "¡Bien hecho!", "¡Súper!", "¡Wow!", "¡Eres un chef!", "¡Increíble!"];


const actionAnimations: Record<string, { animate: Record<string, number[]>; transition: { repeat: number; duration: number; ease: string } }> = {
  cut: { animate: { rotate: [0, -20, 0, -20, 0] }, transition: { repeat: Infinity, duration: 1.0, ease: "easeInOut" } },
  mix: { animate: { rotate: [0, 360] }, transition: { repeat: Infinity, duration: 1.5, ease: "linear" } },
  pour: { animate: { rotate: [0, -45, 0], y: [0, 5, 0] }, transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } },
  spread: { animate: { x: [-15, 15, -15] }, transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } },
  place: { animate: { y: [0, -20, 0], scale: [1, 1.1, 1] }, transition: { repeat: Infinity, duration: 1.0, ease: "easeOut" } },
  shake: { animate: { x: [-5, 5, -5, 5, 0], rotate: [-5, 5, -5, 5, 0] }, transition: { repeat: Infinity, duration: 0.5, ease: "easeInOut" } },
  scoop: { animate: { y: [0, 10, -10, 0], rotate: [0, 15, -5, 0] }, transition: { repeat: Infinity, duration: 1.3, ease: "easeInOut" } },
  peel: { animate: { y: [0, -8, 0], x: [0, 8, 0] }, transition: { repeat: Infinity, duration: 1.0, ease: "easeInOut" } },
  wash: { animate: { y: [0, -5, 0], opacity: [1, 0.7, 1] }, transition: { repeat: Infinity, duration: 0.7, ease: "easeInOut" } },
  bake: { animate: { scale: [1, 1.15, 1], rotate: [-5, 5, -5] }, transition: { repeat: Infinity, duration: 1.4, ease: "easeInOut" } },
  chill: { animate: { y: [0, -6, 0], opacity: [1, 0.7, 1] }, transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" } },
  wait: { animate: { rotate: [0, 360] }, transition: { repeat: Infinity, duration: 4, ease: "linear" } },
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
  bake: { freq: 180, duration: 350, type: "sawtooth", ramp: 110 },
  chill: { freq: 900, duration: 200, type: "sine", ramp: 1100 },
  wait: { freq: 440, duration: 150, type: "sine" },
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
  displayName?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAnother?: () => void;
  newMedalId?: string | null;
  onComplete?: () => void;
  onTaste?: () => void;
}

export default function RecipeStepper({
  recipe, onFinish, onBack, onHome,
  startAt = 0, soundOn = true, onPause, onClearResume,
  displayName, isFavorite, onToggleFavorite, onAnother, newMedalId, onComplete, onTaste,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const voice = useVoice();
  const [step, setStep] = useState(Math.min(startAt, recipe.steps.length - 1));
  const [direction, setDirection] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [hygieneDone, setHygieneDone] = useState(() => {
    if (startAt > 0) return true;
    try {
      const ts = Number(sessionStorage.getItem("lc:hygiene-ts") ?? 0);
      // Manos limpias durante 30 min dentro de la misma sesión
      return ts > 0 && Date.now() - ts < 30 * 60 * 1000;
    } catch { return false; }
  });
  const markHygieneDone = useCallback(() => {
    try { sessionStorage.setItem("lc:hygiene-ts", String(Date.now())); } catch { /* ignore */ }
    setHygieneDone(true);
  }, []);
  const [adultConfirmedStep, setAdultConfirmedStep] = useState<number | null>(null);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [praise, setPraise] = useState<string | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const unsub = subscribeStepImages(forceUpdate);
    return () => { unsub(); };
  }, []);
  const total = recipe.steps.length;
  const current = recipe.steps[step];
  const meta = getRecipeMeta(recipe.id);
  const isAdvanced = meta.level === 4;
  const needsAdult = useMemo(
    () => stepNeedsAdult(current.actionIcon, current.emoji, current.adultRequired),
    [current]
  );
  const adultBlocking = needsAdult && adultConfirmedStep !== step;
  const hygieneActions = useMemo(
    () => detectHygieneActions(recipe.ingredients.map((i) => i.emoji), isAdvanced),
    [recipe, isAdvanced]
  );

  // Speak the line for the current step when voice is enabled.
  useEffect(() => {
    if (!voice.enabled || adultBlocking) return;
    voice.speak(lineForAction(current.actionIcon));
  }, [step, voice.enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave progress on every step change and when the tab is hidden/closed,
  // so the user can resume even if they don't tap "Salir y guardar".
  useEffect(() => {
    if (showCelebration) return;
    onPause?.(step);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const save = () => { if (!showCelebration) onPause?.(step); };
    const onVis = () => { if (document.visibilityState === "hidden") save(); };
    // Periodic safety-net autosave in case the browser kills the tab
    // without firing pagehide (mobile background, OOM, force-quit).
    const interval = window.setInterval(save, 5000);
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    window.addEventListener("blur", save);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
      window.removeEventListener("blur", save);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [step, showCelebration, onPause]);

  const next = useCallback(() => {
    setDirection(1);
    if (step < total - 1) {
      playActionSound(current.actionIcon, soundOn);
      // Mensaje positivo breve antes de avanzar.
      const msg = PRAISE[Math.floor(Math.random() * PRAISE.length)];
      setPraise(msg);
      window.setTimeout(() => {
        setPraise(null);
        setStep((s) => s + 1);
      }, 700);
    } else {
      playDoneSound(soundOn);
      onClearResume?.();
      onComplete?.();
      setShowCelebration(true);
    }
  }, [step, total, current.actionIcon, soundOn, onClearResume, onComplete]);


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

  const exitLongPress = useLongPress(() => setExitConfirm(true), 800);

  if (showCelebration) {
    return (
      <Celebration
        recipe={recipe}
        displayName={displayName}
        onHome={onFinish}
        onAnother={onAnother ? () => { onAnother(); } : undefined}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        newMedalId={newMedalId ?? null}
        onTaste={onTaste}
      />
    );
  }

  if (!hygieneDone) {
    return <HygieneStep soundOn={soundOn} onDone={markHygieneDone} actions={hygieneActions} />;
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
      {/* Top-right controls: long-press to exit + home */}
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          {...exitLongPress}
          onClick={() => setExitConfirm(true)}
          aria-label="Mantén pulsado para salir"
          title="Mantén pulsado para salir"
          className="flex h-14 w-14 min-h-14 min-w-14 items-center justify-center rounded-full bg-card text-2xl kids-shadow md:h-20 md:w-20 md:text-4xl"
        >
          ⏸️
        </motion.button>
        {onHome && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setExitConfirm(true)}
            className="flex h-14 w-14 min-h-14 min-w-14 items-center justify-center rounded-full bg-card text-3xl kids-shadow md:h-20 md:w-20 md:text-5xl"
            aria-label="Inicio"
          >
            🏠
          </motion.button>
        )}
      </div>

      {/* Persistent adult-required banner — stays visible even after the gate
          so the adult keeps supervising the step. Cannot be dismissed. */}
      {needsAdult && (
        <motion.div
          key={`adult-banner-${step}`}
          initial={reduced ? false : { y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          role="status"
          aria-live="polite"
          className="mt-2 mb-1 flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-kids-orange/80 px-4 py-2 text-sm font-extrabold text-foreground kids-shadow ring-2 ring-kids-orange"
        >
          <span className="text-2xl" aria-hidden>🧑</span>
          <span>Adulto necesario en este paso</span>
        </motion.div>
      )}

      {/* Progress bar con estrellas */}
      <div className={`${needsAdult ? "mt-2" : "mt-12"} flex w-full max-w-md items-center justify-center gap-1.5`}>
        {recipe.steps.map((_, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <motion.span
              key={i}
              initial={false}
              animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={active ? { repeat: Infinity, duration: 1.6, ease: "easeInOut" } : { duration: 0.2 }}
              className={`text-2xl md:text-3xl ${done ? "drop-shadow-md" : active ? "" : "opacity-40 grayscale"}`}
              aria-hidden
            >
              {done || active ? "⭐" : "☆"}
            </motion.span>
          );
        })}
      </div>

      {/* Step content — ilustración gigante + instrucción corta */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${step}-${replayKey}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", bounce: 0.25, duration: reduced ? 0.2 : 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            className={`relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-[2.5rem] bg-card kids-shadow-lg md:h-[26rem] md:w-[26rem] ${
              needsAdult ? "ring-8 ring-kids-orange/70" : "ring-4 ring-primary/15"
            }`}
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
              <motion.span
                className="text-[10rem] leading-none drop-shadow-md md:text-[14rem]"
                {...(reduced ? {} : actionAnim)}


              >
                {current.emoji}
              </motion.span>
            )}
            {/* Badge con número de paso */}
            <span className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground kids-shadow md:h-14 md:w-14 md:text-2xl">
              {step + 1}
            </span>
          </motion.div>

          {/* Instrucción corta: emoji + verbo */}
          <motion.div
            key={`label-${step}`}
            initial={reduced ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 rounded-full bg-card px-6 py-3 kids-shadow"
          >
            <span className="text-4xl md:text-5xl" aria-hidden>{actionIcons[current.actionIcon] ?? current.emoji}</span>
            <span className="text-3xl font-extrabold text-foreground md:text-4xl">
              {actionLabels[current.actionIcon] ?? "¡Vamos!"}
            </span>
          </motion.div>


          {(() => {
            const wait = getStepTimer(recipe.id, step) || (current.timerSeconds ?? 0);
            if (wait <= 0) return null;
            return (
              <VisualTimer
                key={`timer-${step}-${replayKey}`}
                seconds={wait}
                emoji={current.emoji}
                soundOn={soundOn}
                storageKey={`lc:timer:${recipe.id}:${step}`}
                onDone={() => { /* timer rings; user advances manually */ }}
              />
            );
          })()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation — extra tactile on tablets and phones */}
      <div className="flex w-full max-w-2xl items-center justify-between gap-4 sm:gap-6 px-2 pb-[env(safe-area-inset-bottom)]">
        <motion.button
          whileTap={{ scale: 0.88, backgroundColor: "hsl(var(--accent))" }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          onClick={prev}
          aria-label="Anterior"
          className="flex h-20 w-20 min-h-20 min-w-20 touch-manipulation select-none items-center justify-center rounded-full bg-muted text-4xl kids-shadow ring-4 ring-transparent transition-shadow active:ring-foreground/20 active:shadow-inner md:h-28 md:w-28 md:text-5xl"
        >
          ⬅️
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88, backgroundColor: "hsl(var(--accent))" }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          onClick={replay}
          aria-label="Repetir"
          className="flex h-20 w-20 min-h-20 min-w-20 touch-manipulation select-none items-center justify-center rounded-full bg-card text-4xl kids-shadow ring-4 ring-transparent transition-shadow active:ring-foreground/20 active:shadow-inner md:h-28 md:w-28 md:text-5xl"
        >
          🔁
        </motion.button>

        {voice.supported && voice.enabled && (
          <motion.button
            whileTap={{ scale: 0.88, backgroundColor: "hsl(var(--accent))" }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            onClick={() => voice.speak(lineForAction(current.actionIcon))}
            aria-label="Escuchar"
            className="flex h-20 w-20 min-h-20 min-w-20 touch-manipulation select-none items-center justify-center rounded-full bg-card text-4xl kids-shadow ring-4 ring-transparent transition-shadow active:ring-foreground/20 active:shadow-inner md:h-28 md:w-28 md:text-5xl"
          >
            🗣️
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.88 }}
          animate={reduced ? {} : { scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={next}
          aria-label={step < total - 1 ? "Siguiente" : "Terminar"}
          className="flex h-24 w-24 min-h-24 min-w-24 touch-manipulation select-none items-center justify-center rounded-full bg-accent text-5xl text-accent-foreground kids-shadow-lg ring-4 ring-transparent transition-all active:ring-accent-foreground/30 active:shadow-inner md:h-36 md:w-36 md:text-6xl"
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

      {exitConfirm && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-background/95 px-6 backdrop-blur"
        >
          <div className="text-7xl">🧑</div>
          <h2 className="text-balance text-center text-xl font-extrabold text-foreground">
            ¿Salir de la receta?
          </h2>
          <p className="text-balance text-center text-sm font-bold text-muted-foreground">
            Guardamos por dónde vas para continuar luego.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => { setExitConfirm(false); pauseAndExit(); }}
              className="min-h-16 rounded-full bg-accent px-6 py-3 text-lg font-extrabold text-accent-foreground kids-shadow-lg"
            >
              ✅ Salir y guardar
            </button>
            <button
              type="button"
              onClick={() => setExitConfirm(false)}
              className="min-h-16 rounded-full bg-card px-6 py-3 text-base font-extrabold text-foreground kids-shadow"
            >
              ⬅️ Seguir cocinando
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
