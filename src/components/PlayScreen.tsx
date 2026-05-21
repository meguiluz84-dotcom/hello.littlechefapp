import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { useMissions } from "@/hooks/use-missions";
import DinoBubble from "./DinoBubble";

interface Props {
  challengeRecipe: Recipe | null;
  challengeName: string;
  onPickChallenge: (r: Recipe) => void;
  onClose: () => void;
}

export default function PlayScreen({ challengeRecipe, challengeName, onPickChallenge, onClose }: Props) {
  const { missions, state, allDone, claimed, claimReward } = useMissions();

  return (
    <div className="min-h-screen bg-background px-5 pb-28 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-foreground">🎮 Jugar</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        <div className="mb-5 flex justify-center">
          <DinoBubble emojis="🦖" message="¿Te atreves con el reto?" tone="blue" size="md" />
        </div>

        {/* Reto del día */}
        {challengeRecipe ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onPickChallenge(challengeRecipe)}
            className="kids-press mb-6 flex w-full items-center gap-4 rounded-[2rem] bg-kids-orange p-4 ring-4 ring-kids-orange/40"
            aria-label={`Reto del día: ${challengeName}`}
          >
            <img
              src={challengeRecipe.image}
              alt=""
              className="h-24 w-24 shrink-0 rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="flex flex-1 flex-col items-start text-left">
              <span className="rounded-full bg-card/80 px-2 py-0.5 text-[11px] font-extrabold text-foreground">🎯 Reto del día</span>
              <span className="mt-1 text-xl font-extrabold text-foreground line-clamp-2">{challengeName}</span>
              <span className="mt-1 text-xs font-bold text-foreground/70">¡Cocínalo y gana una medalla!</span>
            </div>
            <span className="text-3xl">▶️</span>
          </motion.button>
        ) : (
          <div className="mb-6 rounded-[2rem] bg-card p-5 text-center kids-shadow">
            <span className="text-4xl">🌟</span>
            <p className="mt-2 text-sm font-extrabold text-foreground">Hoy no hay reto, ¡vuelve mañana!</p>
          </div>
        )}

        {/* Misiones */}
        <h2 className="mb-3 px-1 text-lg font-extrabold text-foreground">📋 Tus misiones</h2>
        <div className="space-y-3">
          {missions.map((m, i) => {
            const cur = Math.min(m.read(state), m.target);
            const pct = Math.round((cur / m.target) * 100);
            const done = cur >= m.target;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 rounded-3xl bg-card p-4 kids-shadow ${done ? "ring-4 ring-kids-green/60" : ""}`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="text-base font-extrabold text-foreground">{m.label}</div>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${done ? "bg-kids-green" : "bg-kids-blue"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-extrabold text-foreground">{cur}/{m.target}</span>
              </motion.div>
            );
          })}
        </div>

        {allDone && !claimed && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={claimReward}
            className="kids-press mt-6 flex w-full items-center justify-center gap-2 rounded-[2rem] bg-kids-yellow py-5 text-2xl font-extrabold text-foreground"
          >
            🎁 ¡Recoger premio!
          </motion.button>
        )}
      </div>
    </div>
  );
}
