import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AdultGate from "./AdultGate";

interface Props {
  seconds: number;
  onDone: () => void;
  emoji?: string;
  soundOn?: boolean;
  autoStart?: boolean;
  /** Persist remaining state across mount/unmount (key includes recipe + step). */
  storageKey?: string;
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

function readStored(key?: string): number | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const v = Number(raw);
    return Number.isFinite(v) ? v : null;
  } catch { return null; }
}
function writeStored(key: string | undefined, v: number) {
  if (!key) return;
  try { localStorage.setItem(key, String(v)); } catch { /* ignore */ }
}
function clearStored(key?: string) {
  if (!key) return;
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

export default function VisualTimer({
  seconds, onDone, emoji = "⏱️", soundOn = true, autoStart = true, storageKey,
}: Props) {
  const [remaining, setRemaining] = useState(() => {
    const stored = readStored(storageKey);
    if (stored !== null && stored > 0 && stored <= seconds) return stored;
    return seconds;
  });
  const [running, setRunning] = useState(autoStart);
  const [askAdult, setAskAdult] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        clearStored(storageKey);
        beep(soundOn);
        onDone();
      }
      return;
    }
    const t = setTimeout(() => {
      setRemaining((r) => {
        const next = r - 1;
        writeStored(storageKey, next);
        return next;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [remaining, running, onDone, soundOn, storageKey]);

  const pct = Math.max(0, Math.min(1, remaining / seconds));
  const circumference = 2 * Math.PI * 70;
  const offset = circumference * (1 - pct);

  const reset = () => {
    doneRef.current = false;
    setRemaining(seconds);
    writeStored(storageKey, seconds);
    setRunning(true);
  };

  const skip = () => {
    doneRef.current = true;
    clearStored(storageKey);
    setRemaining(0);
    setRunning(false);
    onDone();
  };

  // Format mm:ss for >60s
  const fmt = remaining >= 60
    ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
    : `${remaining}s`;

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
          <span className="mt-1 text-2xl font-extrabold text-foreground">{fmt}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-card text-3xl kids-shadow"
          aria-label={running ? "Pausar temporizador" : "Iniciar temporizador"}
        >
          {running ? "⏸️" : "▶️"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-card text-3xl kids-shadow"
          aria-label="Reiniciar temporizador"
        >
          🔄
        </button>
        <button
          type="button"
          onClick={() => setAskAdult(true)}
          className="flex min-h-16 items-center gap-2 rounded-full bg-kids-yellow px-4 text-base font-extrabold text-foreground kids-shadow"
          aria-label="Saltar con ayuda de un adulto"
        >
          🧑 Saltar
        </button>
      </div>

      {askAdult && (
        <AdultGate
          onConfirm={() => { setAskAdult(false); skip(); }}
          onCancel={() => setAskAdult(false)}
        />
      )}
    </div>
  );
}
