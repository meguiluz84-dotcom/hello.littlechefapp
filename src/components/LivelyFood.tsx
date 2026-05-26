import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo, type CSSProperties } from "react";

export type FoodEffect =
  | "sparkle"   // brillos (cupcakes, dulces)
  | "steam"     // humo suave (pizza, sopa caliente)
  | "bubble"    // burbujas (sopa, bebidas)
  | "jump"      // saltos (frutas)
  | "melt"      // derretido (queso)
  | "grow"      // crecer (galletas en horno)
  | "confetti"  // celebración
  | "idle";     // movimiento ligero genérico

interface Props {
  children: React.ReactNode;
  effect?: FoodEffect;
  size?: number;
  /** Si true, reacciona al tap con un rebote y un estallido de partículas */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  onTap?: () => void;
}

const idleVariants: Record<FoodEffect, any> = {
  sparkle: { rotate: [0, -4, 4, 0], scale: [1, 1.04, 1] },
  steam:   { y: [0, -2, 0], rotate: [0, 1.5, -1.5, 0] },
  bubble:  { y: [0, -3, 0], scale: [1, 1.03, 1] },
  jump:    { y: [0, -10, 0, -4, 0], rotate: [0, -5, 5, 0] },
  melt:    { scaleY: [1, 0.96, 1.02, 1], y: [0, 2, 0] },
  grow:    { scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] },
  confetti:{ rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] },
  idle:    { y: [0, -4, 0], rotate: [0, -3, 3, 0] },
};

const durations: Record<FoodEffect, number> = {
  sparkle: 2.4, steam: 3, bubble: 2.6, jump: 1.6,
  melt: 3.2, grow: 2.4, confetti: 2.2, idle: 3,
};

function Particles({ effect }: { effect: FoodEffect }) {
  // Configuración por efecto: emoji, cantidad, dirección
  const cfg = useMemo(() => {
    switch (effect) {
      case "sparkle":  return { emojis: ["✨", "⭐", "💫"], count: 6, dy: -40 };
      case "steam":    return { emojis: ["💨", "☁️"],        count: 4, dy: -70 };
      case "bubble":   return { emojis: ["🫧", "○", "•"],    count: 6, dy: -55 };
      case "jump":     return { emojis: ["✨"],              count: 3, dy: -30 };
      case "melt":     return { emojis: ["💧"],              count: 3, dy: 30 };
      case "grow":     return { emojis: ["✨", "🔥"],        count: 4, dy: -25 };
      case "confetti": return { emojis: ["🎉", "⭐", "✨", "💖", "🌟"], count: 8, dy: -80 };
      default:         return { emojis: ["✨"],              count: 2, dy: -25 };
    }
  }, [effect]);

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: cfg.count }).map((_, i) => {
        const e = cfg.emojis[i % cfg.emojis.length];
        const delay = (i / cfg.count) * (effect === "steam" ? 1.4 : 1.2);
        const x = ((i * 37) % 80) - 40; // -40..40
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-base"
            initial={{ x, y: 0, opacity: 0, scale: 0.6 }}
            animate={{
              x: x + (Math.random() * 16 - 8),
              y: cfg.dy + (Math.random() * 20 - 10),
              opacity: [0, 1, 0],
              scale: [0.6, 1.1, 0.8],
              rotate: [0, 180],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8 + Math.random() * 1.2,
              delay,
              ease: "easeOut",
            }}
          >
            {e}
          </motion.span>
        );
      })}
    </span>
  );
}

export default function LivelyFood({
  children, effect = "idle", size, interactive = true,
  className = "", style, ariaLabel, onTap,
}: Props) {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      ...idleVariants[effect],
      transition: { repeat: Infinity, duration: durations[effect], ease: "easeInOut" },
    });
  }, [controls, effect]);

  const handleTap = () => {
    controls.start({
      scale: [1, 1.35, 0.92, 1.15, 1],
      rotate: [0, -12, 12, -6, 0],
      transition: { duration: 0.6, ease: "easeOut" },
    }).then(() => {
      controls.start({
        ...idleVariants[effect],
        transition: { repeat: Infinity, duration: durations[effect], ease: "easeInOut" },
      });
    });
    onTap?.();
  };

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={style}
      aria-label={ariaLabel}
    >
      <Particles effect={effect} />
      <motion.span
        animate={controls}
        whileTap={interactive ? { scale: 0.9 } : undefined}
        onTap={interactive ? handleTap : undefined}
        style={{
          fontSize: size ? `${size}px` : undefined,
          lineHeight: 1,
          display: "inline-flex",
          transformOrigin: "50% 80%",
          cursor: interactive ? "pointer" : "default",
        }}
        className="relative z-10 drop-shadow-md"
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Heurística: mapea una categoría/receta a un efecto divertido. */
export function effectForCategory(catId: string): FoodEffect {
  switch (catId) {
    case "pizza":
    case "calientes":
    case "horno":      return "steam";
    case "dulces":
    case "postres":
    case "cupcakes":   return "sparkle";
    case "frutas":
    case "snacks":     return "jump";
    case "sopas":
    case "bebidas":    return "bubble";
    case "galletas":   return "grow";
    case "queso":      return "melt";
    default:           return "idle";
  }
}

export function effectForEmoji(emoji: string): FoodEffect {
  if (/🍕|🍲|🍜|🥘|🍳|🥞|🌮|🌯|🥟/.test(emoji)) return "steam";
  if (/🧀/.test(emoji)) return "melt";
  if (/🍓|🍌|🍎|🍇|🥝|🍊|🍍|🥭|🍑|🍒/.test(emoji)) return "jump";
  if (/🍵|🥣|🧋|🥤|🧃/.test(emoji)) return "bubble";
  if (/🍪|🥐|🥖|🍞/.test(emoji)) return "grow";
  if (/🧁|🍰|🍩|🍭|🍬|🍫|🍦|🎂/.test(emoji)) return "sparkle";
  return "idle";
}
