import { useState } from "react";
import { motion } from "framer-motion";
import { RESTRICTION_INFO, type Restrictions } from "@/data/recipeMeta";
import type { OnboardingPrefs, AgeBucket } from "@/hooks/use-preferences";

interface Props {
  onClose: () => void;
  onChangeAvatar: () => void;
  onResetProgress: () => void;
  onResetOnboarding: () => void;
  prefs: OnboardingPrefs | null;
  onSavePrefs: (p: OnboardingPrefs) => void;
  soundOn: boolean;
  onToggleSound: (v: boolean) => void;
}

const AGE_OPTIONS: { id: AgeBucket; emoji: string; label: string }[] = [
  { id: "2-3", emoji: "🍼", label: "2-3" },
  { id: "4-5", emoji: "🧒", label: "4-5" },
  { id: "6+",  emoji: "🧑", label: "6+" },
];

export default function AdultMode({
  onClose, onChangeAvatar, onResetProgress, onResetOnboarding,
  prefs, onSavePrefs, soundOn, onToggleSound,
}: Props) {
  const [age, setAge] = useState<AgeBucket>(prefs?.age ?? "4-5");
  const [restr, setRestr] = useState<Restrictions>(
    prefs?.restrictions ?? { nuts: false, dairy: false, gluten: false, vegetarian: false }
  );

  const save = () => {
    onSavePrefs({ age, restrictions: restr });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">
            👨‍👩‍👧 Modo adulto
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >
            ✖️
          </button>
        </div>

        {/* Safety notice */}
        <section className="mb-6 rounded-2xl bg-kids-yellow/40 p-4 text-sm font-bold text-foreground kids-shadow">
          <p className="mb-2 text-base font-extrabold">⚠️ Supervisión necesaria</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Cuchillos, horno y calor solo con un adulto.</li>
            <li>Revisa siempre los alérgenos antes de empezar.</li>
            <li>Acompaña al niño durante toda la receta.</li>
          </ul>
        </section>

        {/* Sound toggle */}
        <section className="mb-6 flex items-center justify-between rounded-2xl bg-card p-4 kids-shadow">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{soundOn ? "🔊" : "🔇"}</span>
            <span className="text-base font-extrabold text-foreground">Sonidos</span>
          </div>
          <button
            type="button"
            onClick={() => onToggleSound(!soundOn)}
            aria-pressed={soundOn}
            aria-label="Activar o desactivar sonidos"
            className={`relative h-10 w-20 rounded-full transition-colors ${soundOn ? "bg-accent" : "bg-muted"}`}
          >
            <motion.span
              animate={{ x: soundOn ? 40 : 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="absolute left-1 top-1 h-8 w-8 rounded-full bg-card kids-shadow"
            />
          </button>
        </section>

        {/* Age */}
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-extrabold text-foreground">Edad</h2>
          <div className="grid grid-cols-3 gap-3">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAge(opt.id)}
                aria-label={`Edad ${opt.label}`}
                className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl p-3 kids-shadow ${
                  age === opt.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm font-extrabold">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Restrictions */}
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-extrabold text-foreground">Restricciones</h2>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(RESTRICTION_INFO) as (keyof Restrictions)[]).map((k) => {
              const info = RESTRICTION_INFO[k];
              const active = restr[k];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setRestr((r) => ({ ...r, [k]: !r[k] }))}
                  aria-pressed={active}
                  aria-label={info.label}
                  className={`flex min-h-20 items-center gap-2 rounded-2xl p-3 kids-shadow ${
                    active ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
                  }`}
                >
                  <span className="text-3xl">{info.emoji}</span>
                  <span className="text-left text-sm font-extrabold leading-tight">
                    {info.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Account actions */}
        <section className="mb-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onChangeAvatar}
            className="min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
          >
            🦄 Cambiar personaje
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Borrar todas las recetas completadas?")) onResetProgress();
            }}
            className="min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
          >
            🧹 Borrar progreso
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Reiniciar configuración inicial?")) onResetOnboarding();
            }}
            className="min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
          >
            🔁 Reiniciar configuración
          </button>
        </section>

        {/* Save */}
        <button
          type="button"
          onClick={save}
          className="mx-auto block min-h-16 rounded-full bg-primary px-10 py-4 text-xl font-extrabold text-primary-foreground kids-shadow-lg"
        >
          ✅ Guardar
        </button>
      </div>
    </div>
  );
}
