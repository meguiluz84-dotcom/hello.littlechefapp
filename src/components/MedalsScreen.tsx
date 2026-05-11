import { motion } from "framer-motion";
import { MEDALS } from "@/data/medals";
import { useMedals } from "@/hooks/use-medals";

interface Props { onClose: () => void }

export default function MedalsScreen({ onClose }: Props) {
  const { earned, challengesDone } = useMedals();

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">🏅 Mis medallas</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        <div className="mb-4 flex justify-center gap-3 text-sm font-extrabold text-foreground">
          <span className="rounded-full bg-kids-yellow px-3 py-1 kids-shadow">⭐ {earned.length}/{MEDALS.length}</span>
          <span className="rounded-full bg-kids-blue px-3 py-1 kids-shadow">🎯 {challengesDone}</span>
        </div>

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
      </div>
    </div>
  );
}
