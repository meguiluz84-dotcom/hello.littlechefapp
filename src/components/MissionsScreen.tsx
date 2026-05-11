import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissions } from "@/hooks/use-missions";

interface Props {
  onClose: () => void;
}

export default function MissionsScreen({ onClose }: Props) {
  const { missions, state, allDone, claimed, claimReward, rewards } = useMissions();
  const [justClaimed, setJustClaimed] = useState<string | null>(null);

  const handleClaim = () => {
    const sticker = claimReward();
    if (sticker) setJustClaimed(sticker);
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">🎯 Misiones</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        <p className="mb-4 text-center text-sm font-bold text-muted-foreground">
          Esta semana
        </p>

        <div className="space-y-3">
          {missions.map((m, i) => {
            const cur = Math.min(m.read(state), m.target);
            const pct = Math.round((cur / m.target) * 100);
            const done = cur >= m.target;
            return (
              <motion.div
                key={m.id}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-3 rounded-2xl p-3 kids-shadow ${
                  done ? "bg-kids-green/40" : "bg-card"
                }`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-foreground">{m.label}</div>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", bounce: 0.3 }}
                      className={`h-full ${done ? "bg-accent" : "bg-primary"}`}
                    />
                  </div>
                </div>
                <span className="min-w-12 text-right text-base font-extrabold text-foreground">
                  {cur}/{m.target}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Claim reward */}
        {allDone && !claimed && (
          <motion.button
            type="button" onClick={handleClaim}
            initial={{ scale: 0 }} animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="mt-6 flex w-full min-h-16 items-center justify-center gap-2 rounded-2xl bg-kids-yellow px-4 py-3 text-lg font-extrabold text-foreground kids-shadow-lg"
          >🎁 ¡Recoge tu premio!</motion.button>
        )}

        {/* Rewards collection */}
        {rewards.length > 0 && (
          <div className="mt-6 rounded-2xl bg-card p-4 kids-shadow">
            <div className="mb-2 text-sm font-extrabold text-foreground">🏆 Mis stickers</div>
            <div className="flex flex-wrap gap-2 text-3xl">
              {rewards.map((r, i) => (
                <motion.span
                  key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", bounce: 0.6 }}
                >{r}</motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Just-claimed celebration */}
        <AnimatePresence>
          {justClaimed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6"
              onClick={() => setJustClaimed(null)}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="flex flex-col items-center gap-4 rounded-3xl bg-card p-8 kids-shadow-lg"
              >
                <div className="text-sm font-extrabold text-foreground">¡Premio nuevo!</div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-9xl"
                >{justClaimed}</motion.div>
                <button
                  type="button" onClick={() => setJustClaimed(null)}
                  className="min-h-12 rounded-full bg-accent px-6 py-2 text-base font-extrabold text-accent-foreground kids-shadow"
                >¡Bien! 🎉</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
