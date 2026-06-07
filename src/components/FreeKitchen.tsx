import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import ChefMascot from "./ChefMascot";
import { useVoice } from "@/hooks/use-voice";

interface Props {
  onClose: () => void;
}

type BaseId = "pizza" | "burger" | "soup" | "cupcake" | "plate";

const BASES: { id: BaseId; emoji: string; label: string; bg: string }[] = [
  { id: "pizza",   emoji: "🍕", label: "Pizza",    bg: "bg-kids-orange" },
  { id: "burger",  emoji: "🍔", label: "Burger",   bg: "bg-kids-yellow" },
  { id: "soup",    emoji: "🍲", label: "Sopa",     bg: "bg-kids-pink"   },
  { id: "cupcake", emoji: "🧁", label: "Cupcake",  bg: "bg-kids-purple" },
  { id: "plate",   emoji: "🍽️", label: "Plato",    bg: "bg-kids-teal"   },
];

const INGREDIENTS = [
  "🍓","🫐","🍌","🍒","🥑","🍅","🧀","🥚","🥓","🌽","🥦","🥕",
  "🍫","🍯","🍭","🍩","🌈","✨","⭐","🍰","🥒","🍋",
];

const SPLASH_COLORS = [
  { id: "rainbow", label: "🌈", style: "bg-[conic-gradient(at_50%_50%,#ff6b6b,#feca57,#48dbfb,#1dd1a1,#5f27cd,#ff6b6b)]" },
  { id: "pink",    label: "💖", style: "bg-kids-pink" },
  { id: "yellow",  label: "💛", style: "bg-kids-yellow" },
  { id: "blue",    label: "💙", style: "bg-kids-blue" },
  { id: "green",   label: "💚", style: "bg-kids-green" },
];

const PRAISES = [
  "¡Increíble! 🤩", "¡Genial! 🎉", "¡Está delicioso! 😋",
  "¡Wow! ✨", "¡Eres un chef! 👩‍🍳", "¡Súper original! 🌈",
  "¡Mmm qué rico! 🍴", "¡Obra maestra! 🏆", "¡Boom! 💥",
];

interface Placed {
  id: number;
  emoji: string;
  x: number; // 0..1
  y: number; // 0..1
  rot: number;
}

export default function FreeKitchen({ onClose }: Props) {
  const [base, setBase] = useState<BaseId>("pizza");
  const [splash, setSplash] = useState<string | null>(null);
  const [items, setItems] = useState<Placed[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const [praise, setPraise] = useState<string>("");
  const plateRef = useRef<HTMLDivElement>(null);
  const plateControls = useAnimationControls();
  const idRef = useRef(0);
  const voice = useVoice();

  const baseDef = BASES.find((b) => b.id === base)!;

  const addIngredient = (emoji: string) => {
    const id = ++idRef.current;
    const x = 0.2 + Math.random() * 0.6;
    const y = 0.2 + Math.random() * 0.6;
    const rot = (Math.random() - 0.5) * 40;
    setItems((it) => [...it, { id, emoji, x, y, rot }]);
    voice.sfx("pop");
    plateControls.start({
      scale: [1, 1.06, 1],
      rotate: [0, -2, 2, 0],
      transition: { duration: 0.4 },
    });
  };

  const clearAll = () => {
    voice.sfx("whoosh");
    setItems([]);
    setSplash(null);
  };

  const cook = () => {
    const p = PRAISES[Math.floor(Math.random() * PRAISES.length)];
    setPraise(p);
    setCelebrating(true);
    voice.sfx("jingle");
    window.setTimeout(() => voice.speak(p, { pitch: 1.35 }), 250);
    plateControls.start({
      scale: [1, 1.25, 0.95, 1.1, 1],
      rotate: [0, -8, 8, -4, 0],
      transition: { duration: 1 },
    });
    setTimeout(() => setCelebrating(false), 2400);
  };

  // Confetti particles
  const confetti = Array.from({ length: 26 });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-warm px-4 pb-28 pt-4">
      {/* Soft blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-kids-pink/40 blur-3xl" />
        <div className="absolute top-1/2 -right-16 h-64 w-64 rounded-full bg-kids-yellow/40 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Volver"
            className="kids-press flex h-14 w-14 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >
            ⬅️
          </button>
          <h1 className="text-2xl font-extrabold text-foreground">Cocina Loca 🌈</h1>
          <button
            type="button"
            onClick={clearAll}
            aria-label="Empezar de nuevo"
            className="kids-press flex h-14 w-14 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >
            🧹
          </button>
        </div>

        {/* Mascot */}
        <div className="mt-2 flex justify-center">
          <ChefMascot
            mood={celebrating ? "celebrate" : "greet"}
            size={96}
            message={celebrating ? praise : "¡Inventa lo que quieras!"}
          />
        </div>

        {/* Base picker */}
        <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1">
          {BASES.map((b) => (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => setBase(b.id)}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: base === b.id ? 1.1 : 1 }}
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-3xl kids-shadow ${b.bg} ${
                base === b.id ? "ring-4 ring-foreground/30" : "opacity-70"
              }`}
              aria-label={b.label}
            >
              {b.emoji}
            </motion.button>
          ))}
        </div>

        {/* Cooking plate */}
        <motion.div
          ref={plateRef}
          animate={plateControls}
          className={`relative mx-auto mt-4 flex aspect-square w-full max-w-[320px] items-center justify-center overflow-hidden rounded-[3rem] ${baseDef.bg} kids-shadow-lg ring-8 ring-card`}
        >
          {/* Color splash overlay */}
          {splash && (
            <motion.div
              key={splash}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.55 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className={`pointer-events-none absolute inset-4 rounded-full ${
                SPLASH_COLORS.find((s) => s.id === splash)?.style ?? ""
              } blur-sm`}
            />
          )}

          {/* Base emoji huge */}
          <motion.span
            key={base}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="absolute text-[10rem] leading-none drop-shadow-lg"
          >
            {baseDef.emoji}
          </motion.span>

          {/* Placed ingredients */}
          <AnimatePresence>
            {items.map((it) => (
              <motion.span
                key={it.id}
                initial={{ scale: 0, y: -60, opacity: 0, rotate: it.rot - 60 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotate: it.rot }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                drag
                dragConstraints={plateRef}
                whileTap={{ scale: 1.2 }}
                onDoubleClick={() => setItems((arr) => arr.filter((x) => x.id !== it.id))}
                className="absolute cursor-grab text-5xl drop-shadow-md active:cursor-grabbing"
                style={{
                  left: `${it.x * 100}%`,
                  top: `${it.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {it.emoji}
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Celebration confetti */}
          <AnimatePresence>
            {celebrating &&
              confetti.map((_, i) => {
                const angle = (i / confetti.length) * Math.PI * 2;
                const dist = 140 + Math.random() * 80;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist;
                const emoji = ["✨","🎉","⭐","💖","🌟","🍬"][i % 6];
                return (
                  <motion.span
                    key={`c-${i}`}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: dx, y: dy, scale: 1.2, opacity: 0, rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                    className="pointer-events-none absolute text-3xl"
                  >
                    {emoji}
                  </motion.span>
                );
              })}
          </AnimatePresence>

          {/* Sparkles always */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute right-4 top-4 text-2xl"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Splash colors */}
        <div className="mt-4 flex justify-center gap-2">
          {SPLASH_COLORS.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => setSplash(splash === s.id ? null : s.id)}
              whileTap={{ scale: 0.85 }}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-xl kids-shadow ${s.style} ${
                splash === s.id ? "ring-4 ring-foreground/40" : ""
              }`}
              aria-label={`Color ${s.id}`}
            >
              {s.label}
            </motion.button>
          ))}
        </div>

        {/* Ingredient palette */}
        <div className="mt-4 rounded-[2rem] bg-card/80 p-3 kids-shadow">
          <div className="grid grid-cols-6 gap-2">
            {INGREDIENTS.map((emoji) => (
              <motion.button
                key={emoji}
                type="button"
                whileTap={{ scale: 0.8, rotate: -10 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                onClick={() => addIngredient(emoji)}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-background text-2xl kids-shadow"
                aria-label={`Añadir ${emoji}`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cook button */}
        <motion.button
          type="button"
          onClick={cook}
          whileTap={{ scale: 0.94 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="kids-press mt-5 flex min-h-[72px] w-full items-center justify-center gap-3 rounded-[2rem] bg-gradient-to-r from-kids-pink via-kids-orange to-kids-yellow text-2xl font-extrabold text-foreground ring-4 ring-kids-orange/40"
          aria-label="¡Cocinar!"
        >
          <span className="text-3xl">🍳</span>
          ¡Cocinar!
          <span className="text-3xl">✨</span>
        </motion.button>
      </div>
    </div>
  );
}
