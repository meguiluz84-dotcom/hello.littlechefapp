import { motion } from "framer-motion";
import diplomaBg from "@/assets/diploma-template.png";
import { categories, type RecipeCategory } from "@/data/recipes";

interface Props {
  category: RecipeCategory;
  playerName: string;
  onClose: () => void;
}

const confetti = ["🎉", "⭐", "🌟", "✨", "🎊", "🏆", "💛"];

export default function CategoryDiploma({ category, playerName, onClose }: Props) {
  const cat = categories.find((c) => c.id === category);
  const today = new Date().toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const handlePrint = () => {
    try { window.print(); } catch { /* ignore */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-kids-yellow/40 via-background to-kids-orange/30 px-4 pb-6 pt-4">
      {/* Confetti */}
      {confetti.map((c, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, x: Math.random() * 320 - 160, opacity: 0 }}
          animate={{ y: [0, 700], opacity: [1, 0], rotate: [0, 360] }}
          transition={{ duration: 2.5 + Math.random() * 1.5, delay: i * 0.18, repeat: Infinity, repeatDelay: 0.8 }}
          className="pointer-events-none absolute top-0 text-4xl"
        >
          {c}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 mt-2 text-center text-2xl font-extrabold text-foreground"
      >
        🏅 ¡Diploma desbloqueado!
      </motion.div>

      {/* Diploma card */}
      <motion.div
        initial={{ scale: 0.6, rotate: -4, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.45, duration: 0.8 }}
        className="diploma-print relative z-10 flex w-full max-w-sm flex-1 items-center justify-center"
      >
        <div className="relative w-full max-h-full overflow-hidden rounded-3xl bg-white kids-shadow-lg ring-4 ring-kids-yellow/70">
          <img
            src={diplomaBg}
            alt="Diploma Little Chef"
            className="block h-auto w-full select-none"
            draggable={false}
          />
          {/* Overlay player name + date + category */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-[18%]">
            <div className="w-[78%] -translate-y-[32%]">
              <div className="font-extrabold text-[clamp(1.1rem,5vw,1.6rem)] leading-tight text-[#7a3a14] text-center truncate">
                {playerName}
              </div>
            </div>
            <div className="w-[78%] -translate-y-[14%] text-center text-[clamp(0.7rem,3vw,0.95rem)] font-bold text-[#7a3a14]">
              {today}
            </div>
            <div className="w-[78%] mt-1 text-center text-[clamp(0.85rem,4vw,1.15rem)] font-extrabold text-kids-orange">
              {cat?.emoji} {cat?.label}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="z-10 mt-3 flex w-full max-w-sm items-center justify-center gap-3 print:hidden">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handlePrint}
          aria-label="Imprimir diploma"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-3xl kids-shadow"
        >
          🖨️
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          onClick={onClose}
          aria-label="Continuar"
          className="flex h-20 min-h-16 items-center gap-2 rounded-full bg-primary px-8 text-2xl font-extrabold text-primary-foreground kids-shadow-lg"
        >
          ¡Genial! 🎉
        </motion.button>
      </div>
    </div>
  );
}
