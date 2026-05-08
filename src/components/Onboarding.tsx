import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarPicker from "./AvatarPicker";
import type { AvatarId } from "@/data/avatars";
import type { OnboardingPrefs, AgeBucket } from "@/hooks/use-preferences";
import { RESTRICTION_INFO, type Restrictions } from "@/data/recipeMeta";

interface Props {
  initialAvatar: AvatarId | null;
  onComplete: (avatar: AvatarId, prefs: OnboardingPrefs) => void;
}

const AGE_OPTIONS: { id: AgeBucket; emoji: string; label: string }[] = [
  { id: "2-3", emoji: "🍼", label: "2-3" },
  { id: "4-5", emoji: "🧒", label: "4-5" },
  { id: "6+",  emoji: "🧑", label: "6+" },
];

export default function Onboarding({ initialAvatar, onComplete }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(initialAvatar ? 1 : 0);
  const [avatar, setAvatar] = useState<AvatarId | null>(initialAvatar);
  const [age, setAge] = useState<AgeBucket | null>(null);
  const [restr, setRestr] = useState<Restrictions>({
    nuts: false, dairy: false, gluten: false, vegetarian: false,
  });

  const toggle = (k: keyof Restrictions) =>
    setRestr((r) => ({ ...r, [k]: !r[k] }));

  if (step === 0) {
    return (
      <AvatarPicker
        currentId={avatar}
        onSelect={(id) => {
          setAvatar(id);
          setStep(1);
        }}
        title="¿Quién cocina hoy?"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background px-4 pb-8 pt-8 overflow-y-auto">
      {/* Progress dots */}
      <div className="mx-auto mb-6 flex w-full max-w-xs items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="age"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="mx-auto flex w-full max-w-md flex-col items-center"
          >
            <h1 className="mb-6 text-center text-2xl font-extrabold text-foreground">
              ¿Qué edad tienes?
            </h1>
            <div className="grid w-full grid-cols-3 gap-3">
              {AGE_OPTIONS.map((opt, i) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
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

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              animate={age ? { scale: [1, 1.06, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.6 }}
              disabled={!age}
              onClick={() => setStep(2)}
              className="mt-10 min-h-16 rounded-full bg-accent px-8 py-4 text-2xl font-extrabold text-accent-foreground kids-shadow-lg disabled:opacity-40"
            >
              ➡️
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="restr"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="mx-auto flex w-full max-w-md flex-col items-center"
          >
            <h1 className="mb-2 text-center text-2xl font-extrabold text-foreground">
              ¿Algo que evitar?
            </h1>
            <p className="mb-6 text-center text-sm font-bold text-muted-foreground">
              Toca para activar (opcional)
            </p>
            <div className="grid w-full grid-cols-2 gap-3">
              {(Object.keys(RESTRICTION_INFO) as (keyof Restrictions)[]).map((k, i) => {
                const info = RESTRICTION_INFO[k];
                const active = restr[k];
                return (
                  <motion.button
                    key={k}
                    type="button"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.06, type: "spring", bounce: 0.5 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggle(k)}
                    aria-pressed={active}
                    aria-label={info.label}
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
              type="button"
              whileTap={{ scale: 0.92 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              onClick={() => avatar && age && onComplete(avatar, { age, restrictions: restr })}
              className="mt-10 min-h-16 rounded-full bg-primary px-8 py-4 text-2xl font-extrabold text-primary-foreground kids-shadow-lg"
              aria-label="Empezar"
            >
              ✅ Listo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
