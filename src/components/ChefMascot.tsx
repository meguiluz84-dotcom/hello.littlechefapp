import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import mascotImg from "@/assets/chef-mascot.png";
import { useVoice } from "@/hooks/use-voice";

export type MascotMood =
  | "greet"     // saluda con la mano
  | "jump"      // saltitos de emoción
  | "clap"      // aplaude
  | "smile"     // respiración tranquila
  | "celebrate" // celebración con confeti
  | "loading";  // balanceo suave de carga

interface Props {
  mood?: MascotMood;
  size?: number;
  message?: string;
  className?: string;
  /** Speak the message aloud whenever it changes. Default: true. */
  speakMessage?: boolean;
}

const variants: Record<MascotMood, Variants> = {
  greet: {
    animate: {
      rotate: [-3, 3, -3],
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
    },
  },
  jump: {
    animate: {
      y: [0, -22, 0, -10, 0],
      transition: { repeat: Infinity, duration: 1.4, ease: "easeOut" },
    },
  },
  clap: {
    animate: {
      scale: [1, 1.06, 1, 1.06, 1],
      rotate: [0, -2, 0, 2, 0],
      transition: { repeat: Infinity, duration: 0.9, ease: "easeInOut" },
    },
  },
  smile: {
    animate: {
      y: [0, -3, 0],
      transition: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
    },
  },
  celebrate: {
    animate: {
      rotate: [0, -8, 8, -8, 8, 0],
      scale: [1, 1.12, 1.06, 1.12, 1],
      y: [0, -16, 0, -8, 0],
      transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
    },
  },
  loading: {
    animate: {
      rotate: [-6, 6, -6],
      transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
    },
  },
};

const confetti = ["⭐", "🎉", "✨", "💖", "🌟"];

export default function ChefMascot({
  mood = "smile",
  size = 144,
  message,
  className = "",
}: Props) {
  const showHand = mood === "greet" || mood === "celebrate";
  const showConfetti = mood === "celebrate";
  const showClapHands = mood === "clap";

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Confeti de celebración */}
        {showConfetti && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {confetti.map((c, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                style={{
                  top: `${10 + (i * 17) % 70}%`,
                  left: `${5 + (i * 23) % 85}%`,
                }}
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-10, -40, -70],
                  rotate: [0, 180, 360],
                  scale: [0.6, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        )}

        <motion.img
          src={mascotImg}
          alt="Chef mascota"
          width={size}
          height={size}
          variants={variants[mood]}
          animate="animate"
          className="h-full w-full object-contain drop-shadow-md"
          style={{ transformOrigin: "50% 80%" }}
        />

        {/* Mano saludando */}
        {showHand && (
          <motion.span
            aria-hidden
            className="absolute text-3xl"
            style={{ right: -6, top: "28%" }}
            animate={{ rotate: [0, 30, -10, 30, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          >
            👋
          </motion.span>
        )}

        {/* Manitas aplaudiendo */}
        {showClapHands && (
          <>
            <motion.span
              aria-hidden
              className="absolute text-2xl"
              style={{ left: "8%", top: "55%" }}
              animate={{ x: [0, 8, 0], rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
            >
              👏
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute text-2xl"
              style={{ right: "8%", top: "55%" }}
              animate={{ x: [0, -8, 0], rotate: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
            >
              👏
            </motion.span>
          </>
        )}
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
          className="relative mt-2 max-w-[18rem] rounded-3xl bg-card px-5 py-3 text-center text-base font-extrabold text-foreground kids-shadow"
        >
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-card"
          />
          {message}
        </motion.div>
      )}
    </div>
  );
}
