import { useEffect } from "react";
import { motion } from "framer-motion";
import { MEDALS } from "@/data/medals";
import { SKILLS } from "@/data/skills";
import { useMedals } from "@/hooks/use-medals";
import { useSkills } from "@/hooks/use-skills";
import { useHats } from "@/hooks/use-hats";
import { useDailyReward } from "@/hooks/use-daily-reward";
import DinoBubble from "./DinoBubble";

interface Props { onClose: () => void }

export default function MedalsScreen({ onClose }: Props) {
  const { earned, challengesDone } = useMedals();
  const { counters, earned: earnedSkills } = useSkills();
  const { all: allHats, unlocked, next, equipped, equip, freshHats, markSeen } = useHats();
  const { stickers, streak } = useDailyReward();

  // Mark new hats as seen so the "¡Gorro nuevo!" badge disappears.
  useEffect(() => {
    if (freshHats.length > 0) markSeen(freshHats.map((h) => h.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshHats.length]);

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">⭐ Mis premios</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        <div className="mb-5 flex flex-wrap justify-center gap-2 text-sm font-extrabold text-foreground">
          <span className="rounded-full bg-kids-yellow px-3 py-1 kids-shadow">🏅 {earned.length}/{MEDALS.length}</span>
          <span className="rounded-full bg-kids-blue px-3 py-1 kids-shadow">🎯 {challengesDone}</span>
          <span className="rounded-full bg-kids-purple px-3 py-1 text-primary-foreground kids-shadow">{equipped.emoji} {unlocked.length}/{allHats.length}</span>
          {streak > 1 && (
            <span className="rounded-full bg-kids-orange px-3 py-1 kids-shadow">🔥 {streak}</span>
          )}
        </div>

        {/* GORROS DE CHEF */}
        <h2 className="mb-3 px-1 text-xl font-extrabold text-foreground">🎩 Mis gorros</h2>
        <div className="mb-2 grid grid-cols-4 gap-3">
          {allHats.map((h, i) => {
            const got = unlocked.some((u) => u.id === h.id);
            const isEquipped = equipped.id === h.id;
            return (
              <motion.button
                key={h.id}
                type="button"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", bounce: 0.5 }}
                whileTap={got ? { scale: 0.9 } : undefined}
                onClick={() => got && equip(h.id)}
                disabled={!got}
                aria-label={got ? `Ponerse ${h.label}` : `${h.label} bloqueado`}
                aria-pressed={isEquipped}
                className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl p-2 kids-shadow transition ${
                  got ? `${h.color} ${isEquipped ? "ring-4 ring-foreground/40" : ""}` : "bg-card opacity-50"
                }`}
              >
                <span className={`text-3xl ${got ? "" : "grayscale"}`}>{got ? h.emoji : "🔒"}</span>
                {!got && (
                  <span className="text-[10px] font-extrabold text-muted-foreground">{h.unlockAt}⭐</span>
                )}
                {isEquipped && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-kids-green px-1.5 text-[9px] font-extrabold text-primary-foreground">✓</span>
                )}
              </motion.button>
            );
          })}
        </div>
        {next && (
          <p className="mb-5 text-center text-xs font-bold text-muted-foreground">
            Siguiente: {next.emoji} {next.label} con {next.unlockAt}⭐
          </p>
        )}

        {/* STICKERS DIARIOS */}
        <h2 className="mb-3 mt-6 px-1 text-xl font-extrabold text-foreground">✨ Mis stickers</h2>
        {stickers.length === 0 ? (
          <div className="mb-5 rounded-3xl bg-card p-4 text-center kids-shadow">
            <span className="text-3xl">🎁</span>
            <p className="mt-1 text-sm font-extrabold text-foreground">¡Vuelve cada día para un sticker nuevo!</p>
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-6 gap-2 rounded-3xl bg-card p-3 kids-shadow">
            {stickers.map((s, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.03, type: "spring", bounce: 0.6 }}
                className="flex aspect-square items-center justify-center rounded-xl bg-kids-yellow/40 text-2xl"
              >
                {s}
              </motion.span>
            ))}
          </div>
        )}

        <h2 className="mb-3 mt-2 px-1 text-xl font-extrabold text-foreground">🏅 Medallas</h2>

        {earned.length === 0 && (
          <div className="mb-5 flex justify-center">
            <DinoBubble
              emojis="🏅✨"
              message="¡Tu primera medalla está cerquita! Termina una receta."
              tone="yellow"
              size="md"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {MEDALS.map((m, i) => {
            const got = earned.includes(m.id);
            return (
              <motion.div
                key={m.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
                className={`flex min-h-40 flex-col items-center justify-center gap-2 rounded-3xl p-3 kids-shadow ${
                  got ? "bg-kids-yellow" : "bg-card opacity-60"
                }`}
              >
                <span className={`text-6xl ${got ? "" : "grayscale"}`}>{m.emoji}</span>
                <span className="text-balance text-center text-sm font-extrabold text-foreground">{m.label}</span>
                <span className="text-balance text-center text-xs font-bold text-muted-foreground line-clamp-2">
                  {m.description}
                </span>
              </motion.div>
            );
          })}
        </div>

        <h2 className="mb-3 mt-8 text-xl font-extrabold text-foreground">🌟 Logros por habilidad</h2>
        <div className="grid grid-cols-2 gap-4">
          {SKILLS.map((sk, i) => {
            const got = earnedSkills.includes(sk.id);
            const n = sk.count(counters);
            return (
              <motion.div
                key={sk.id}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", bounce: 0.4 }}
                className={`flex min-h-32 flex-col items-center justify-center gap-1 rounded-3xl p-3 kids-shadow ${got ? "bg-kids-green" : "bg-card opacity-70"}`}
              >
                <span className={`text-5xl ${got ? "" : "grayscale"}`}>{sk.emoji}</span>
                <span className="text-center text-sm font-extrabold text-foreground">{sk.label}</span>
                <span className="text-[10px] font-bold text-muted-foreground">{Math.min(n, sk.threshold)}/{sk.threshold}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
