import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Fondo animado suave y reutilizable.
 * - Blobs de color desenfocados que respiran lentamente.
 * - Emojis flotando muy despacio de abajo hacia arriba.
 * - Chispitas ✨ ocasionales.
 * Todo es puramente decorativo y no bloquea toques (pointer-events-none).
 */

interface Props {
  /** Emojis temáticos que flotarán. */
  emojis?: string[];
  /** Cantidad de emojis. Default 8. */
  density?: number;
  /** Mostrar chispitas. Default true. */
  sparkles?: boolean;
  /** Colores de los blobs (variables CSS o hex). */
  blobs?: string[];
  className?: string;
}

const DEFAULT_EMOJIS = ["🍓", "🥕", "🧁", "🍞", "🥛", "🍎", "🌽", "🍪"];

// PRNG determinista para que la distribución no salte en cada render.
function seeded(i: number) {
  const x = Math.sin(i * 9973.31) * 10000;
  return x - Math.floor(x);
}

export default function AmbientBackground({
  emojis = DEFAULT_EMOJIS,
  density = 8,
  sparkles = true,
  blobs = ["var(--kids-yellow)", "var(--kids-pink)", "var(--kids-blue)"],
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();

  const floaters = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        emoji: emojis[i % emojis.length],
        left: `${5 + seeded(i + 1) * 90}%`,
        size: 22 + Math.round(seeded(i + 7) * 22),
        delay: seeded(i + 13) * 8,
        duration: 18 + seeded(i + 21) * 14,
        sway: 8 + seeded(i + 33) * 18,
      })),
    [emojis, density],
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: sparkles ? 6 : 0 }, (_, i) => ({
        left: `${8 + seeded(i + 101) * 84}%`,
        top: `${10 + seeded(i + 202) * 80}%`,
        delay: seeded(i + 303) * 5,
      })),
    [sparkles],
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Blobs de color que respiran */}
      {blobs.map((color, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute rounded-full opacity-40 blur-3xl"
          style={{
            width: 260,
            height: 260,
            background: color,
            top: `${(i * 37) % 70}%`,
            left: `${(i * 53) % 70}%`,
          }}
          animate={
            reduced
              ? undefined
              : {
                  scale: [1, 1.15, 1],
                  x: [0, 20, -10, 0],
                  y: [0, -15, 10, 0],
                }
          }
          transition={{
            repeat: Infinity,
            duration: 14 + i * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Emojis flotando suavemente hacia arriba */}
      {!reduced &&
        floaters.map((f, i) => (
          <motion.span
            key={`f-${i}`}
            className="absolute select-none opacity-70"
            style={{ left: f.left, bottom: -40, fontSize: f.size }}
            initial={{ y: 0, x: 0, rotate: -8 }}
            animate={{
              y: [-40, -900],
              x: [0, f.sway, -f.sway, 0],
              rotate: [-8, 8, -6, 8],
            }}
            transition={{
              repeat: Infinity,
              duration: f.duration,
              delay: f.delay,
              ease: "linear",
              times: [0, 1],
            }}
          >
            {f.emoji}
          </motion.span>
        ))}

      {/* Chispitas suaves */}
      {!reduced &&
        sparks.map((s, i) => (
          <motion.span
            key={`s-${i}`}
            className="absolute text-lg"
            style={{ left: s.left, top: s.top }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.2, 0.6] }}
            transition={{
              repeat: Infinity,
              duration: 3.6,
              delay: s.delay,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.span>
        ))}
    </div>
  );
}
