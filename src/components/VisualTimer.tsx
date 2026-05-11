import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  seconds: number;
  onDone: () => void;
  emoji?: string;
  soundOn?: boolean;
  autoStart?: boolean;
}

function beep(enabled: boolean) {
  if (!enabled) return;
  try {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AC();
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine"; o.frequency.value = freq;
      g.gain.value = 0.12;
      o.start(ctx.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      o.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
    setTimeout(() => ctx.close(), 700);
  } catch { /* ignore */ }
}

export default function VisualTimer({ seconds, onDone, emoji = "⏱️", soundOn = true, autoStart = true }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(autoStart);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        beep(soundOn);
        onDone();
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, running, onDone, soundOn]);

  const pct = Math.max(0, Math.min(1, remaining / seconds));
  const circumference = 2 * Math.PI * 70;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r="70" stroke="hsl(var(--muted))" strokeWidth="14" fill="none" />
          <motion.circle
            cx="80" cy="80" r="70"
            stroke="hsl(var(--accent))" strokeWidth="14" fill="none" strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-6xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >{emoji}</motion.span>
          <span className="mt-1 text-2xl font-extrabold text-foreground">{remaining}s</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className="min-h-16 rounded-full bg-card px-6 py-3 text-2xl font-extrabold kids-shadow"
        aria-label={running ? "Pausar" : "Reanudar"}
      >
        {running ? "⏸️" : "▶️"}
      </button>
    </div>
  );
}
