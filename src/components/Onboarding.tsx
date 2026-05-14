import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarPicker from "./AvatarPicker";
import type { AvatarId } from "@/data/avatars";
import type { OnboardingPrefs, AgeBucket } from "@/hooks/use-preferences";
import { RESTRICTION_INFO, type Restrictions, EMPTY_RESTR } from "@/data/recipeMeta";
import { GOAL_INFO, recommendedLevelLabel, type FamilyGoal } from "@/hooks/use-players";

interface Props {
  initialAvatar: AvatarId | null;
  onComplete: (
    avatar: AvatarId,
    prefs: OnboardingPrefs,
    name: string,
    goal: FamilyGoal | null,
  ) => void;
  showName?: boolean;
}

const AGE_OPTIONS: { id: AgeBucket; emoji: string; label: string }[] = [
  { id: "2-3", emoji: "🍼", label: "2-3" },
  { id: "4-5", emoji: "🧒", label: "4-5" },
  { id: "6+",  emoji: "🧑", label: "6+" },
];

const GOALS: FamilyGoal[] = ["verduras", "meriendas", "juntos", "sin-coccion"];

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export default function Onboarding({ initialAvatar, onComplete, showName = true }: Props) {
  const [step, setStep] = useState<Step>(initialAvatar ? 1 : 0);
  const [avatar, setAvatar] = useState<AvatarId | null>(initialAvatar);
  const [age, setAge] = useState<AgeBucket | null>(null);
  const [restr, setRestr] = useState<Restrictions>({ ...EMPTY_RESTR });
  const [goal, setGoal] = useState<FamilyGoal | null>(null);
  const [name, setName] = useState("");

  const toggle = (k: keyof Restrictions) =>
    setRestr((r) => ({ ...r, [k]: !r[k] }));

  if (step === 0) {
    return (
      <AvatarPicker
        currentId={avatar}
        onSelect={(id) => { setAvatar(id); setStep(1); }}
        title="¿Quién cocina hoy?"
      />
    );
  }

  const finish = () => {
    if (!avatar || !age) return;
    onComplete(avatar, { age, restrictions: restr }, name.trim() || "Chef", goal);
  };

  const totalSteps = showName ? 5 : 4;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background px-4 pb-8 pt-8 overflow-y-auto">
      <div className="mx-auto mb-6 flex w-full max-w-xs items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="age"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="mx-auto flex w-full max-w-md flex-col items-center"
          >
            <h1 className="mb-6 text-center text-2xl font-extrabold text-foreground">¿Qué edad tienes?</h1>
            <div className="grid w-full grid-cols-3 gap-3">
              {AGE_OPTIONS.map((opt, i) => (
                <motion.button
                  key={opt.id} type="button"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08, type: "spring", bounce: 0.5 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setAge(opt.id)}
                  aria-label={`Edad ${opt.label}`}
                  className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl p-4 kids-shadow-lg ${
                    age === opt.id ? "bg-primary ring-4 ring-accent" : "bg-card"
                  }`}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className={`text-xl font-extrabold ${age === opt.id ? "text-primary-foreground" : "text-foreground"}`}>
                    {opt.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {age && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl bg-kids-yellow/40 px-4 py-3 text-center kids-shadow"
              >
                <div className="text-xs font-bold text-muted-foreground">Nivel recomendado</div>
                <div className="text-lg font-extrabold text-foreground">👨‍🍳 {recommendedLevelLabel(age)}</div>
              </motion.div>
            )}

            <motion.button
              type="button" whileTap={{ scale: 0.92 }}
              animate={age ? { scale: [1, 1.06, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.6 }}
              disabled={!age}
              onClick={() => setStep(2)}
              className="mt-8 min-h-16 rounded-full bg-accent px-8 py-4 text-2xl font-extrabold text-accent-foreground kids-shadow-lg disabled:opacity-40"
            >➡️</motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="restr"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="mx-auto flex w-full max-w-md flex-col items-center"
          >
            <h1 className="mb-2 text-center text-2xl font-extrabold text-foreground">¿Algo que evitar?</h1>
            <p className="mb-6 text-center text-sm font-bold text-muted-foreground">Toca para activar (opcional)</p>
            <div className="grid w-full grid-cols-2 gap-3">
              {(Object.keys(RESTRICTION_INFO) as (keyof Restrictions)[]).map((k, i) => {
                const info = RESTRICTION_INFO[k];
                const active = restr[k];
                return (
                  <motion.button
                    key={k} type="button"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: i * 0.06, type: "spring", bounce: 0.5 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggle(k)}
                    aria-pressed={active} aria-label={info.label}
                    className={`flex min-h-24 items-center gap-3 rounded-2xl p-4 kids-shadow ${
                      active ? "bg-accent ring-4 ring-primary" : "bg-card"
                    }`}
                  >
                    <span className="text-4xl">{info.emoji}</span>
                    <span className={`text-left text-base font-extrabold leading-tight ${active ? "text-accent-foreground" : "text-foreground"}`}>
                      {info.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              type="button" whileTap={{ scale: 0.92 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              onClick={() => setStep(3)}
              className="mt-8 min-h-16 rounded-full bg-primary px-8 py-4 text-2xl font-extrabold text-primary-foreground kids-shadow-lg"
              aria-label="Siguiente"
            >➡️</motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="goal"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="mx-auto flex w-full max-w-md flex-col items-center"
          >
            <h1 className="mb-2 text-center text-2xl font-extrabold text-foreground">¿Qué buscáis en familia?</h1>
            <p className="mb-6 text-center text-sm font-bold text-muted-foreground">Elige uno (opcional)</p>
            <div className="grid w-full grid-cols-2 gap-3">
              {GOALS.map((g, i) => {
                const info = GOAL_INFO[g];
                const active = goal === g;
                return (
                  <motion.button
                    key={g} type="button"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: i * 0.06, type: "spring", bounce: 0.5 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setGoal(active ? null : g)}
                    aria-pressed={active} aria-label={info.label}
                    className={`flex min-h-28 flex-col items-center justify-center gap-1 rounded-2xl p-3 kids-shadow ${
                      active ? "bg-accent ring-4 ring-primary" : "bg-card"
                    }`}
                  >
                    <span className="text-4xl">{info.emoji}</span>
                    <span className={`text-center text-sm font-extrabold leading-tight ${active ? "text-accent-foreground" : "text-foreground"}`}>
                      {info.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              type="button" whileTap={{ scale: 0.92 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              onClick={() => (showName ? setStep(4) : setStep(5))}
              className="mt-8 min-h-16 rounded-full bg-accent px-8 py-4 text-2xl font-extrabold text-accent-foreground kids-shadow-lg"
              aria-label="Siguiente"
            >➡️</motion.button>
          </motion.div>
        )}

        {step === 4 && showName && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="mx-auto flex w-full max-w-md flex-col items-center"
          >
            <h1 className="mb-2 text-center text-2xl font-extrabold text-foreground">¿Cómo te llamas?</h1>
            <p className="mb-6 text-center text-sm font-bold text-muted-foreground">Opcional</p>
            <input
              type="text" value={name} maxLength={20}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chef"
              aria-label="Nombre"
              className="mb-8 w-full max-w-xs min-h-16 rounded-2xl bg-card px-6 py-4 text-center text-2xl font-extrabold text-foreground kids-shadow placeholder:text-muted-foreground/60"
            />
            <motion.button
              type="button" whileTap={{ scale: 0.92 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              onClick={() => setStep(5)}
              className="min-h-16 rounded-full bg-primary px-8 py-4 text-2xl font-extrabold text-primary-foreground kids-shadow-lg"
              aria-label="Siguiente"
            >➡️</motion.button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="trust"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="mx-auto flex w-full max-w-md flex-col items-center"
          >
            <h1 className="mb-4 text-center text-2xl font-extrabold text-foreground">Antes de empezar 👨‍👩‍👧</h1>
            <ul className="mb-6 w-full space-y-2 rounded-2xl bg-kids-yellow/40 p-4 text-left text-sm font-bold text-foreground kids-shadow">
              <li>👀 Supervisión adulta siempre.</li>
              <li>⚠️ Revisad alergias antes de cada receta.</li>
              <li>🔪 Cuchillos, horno y calor solo con un adulto.</li>
              <li>🩺 Las recetas son orientativas. Ante dudas médicas o alimentarias, consulta a un profesional.</li>
            </ul>
            <motion.button
              type="button" whileTap={{ scale: 0.92 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              onClick={finish}
              className="min-h-16 rounded-full bg-accent px-8 py-4 text-2xl font-extrabold text-accent-foreground kids-shadow-lg"
              aria-label="Empezar"
            >✅ Listo</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
