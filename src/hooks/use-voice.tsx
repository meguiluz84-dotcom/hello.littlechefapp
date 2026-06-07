import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Voice & sound system for Little Chef.
 * - Web Speech API for spoken narration (free, no API key, multilingual).
 * - Web Audio API for cartoonish SFX synthesized on the fly.
 * - Auto-enabled by default; persisted to localStorage.
 * - All audio is unlocked on the first user gesture.
 */

const KEY = "lc:voice";

type SfxKind =
  | "tap"        // soft pop for button taps
  | "pop"        // higher pop for ingredient pickups
  | "success"    // short happy chime
  | "whoosh"     // swoosh for transitions / mixing
  | "sparkle"    // shimmer for unlocks
  | "jingle"     // little 4-note celebration jingle
  | "yum";       // playful "mmm" two-note

interface VoiceCtx {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  toggle: () => void;
  speak: (text: string, opts?: { interrupt?: boolean; rate?: number; pitch?: number }) => void;
  praise: () => void;
  sfx: (kind: SfxKind) => void;
  supported: boolean;
}

const Ctx = createContext<VoiceCtx | null>(null);

const PRAISES = [
  "¡Buen trabajo, chef!",
  "¡Genial!",
  "¡Wow, qué rico!",
  "¡Excelente!",
  "¡Eres un chef!",
  "¡Súper!",
  "¡Mmm delicioso!",
  "¡Increíble!",
  "¡Lo estás haciendo genial!",
];

function ttsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickSpanishVoice(): SpeechSynthesisVoice | null {
  if (!ttsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer es-ES > es-MX > any es-*
  const byLang = (pred: (v: SpeechSynthesisVoice) => boolean) => voices.find(pred) ?? null;
  return (
    byLang((v) => /es[-_]ES/i.test(v.lang)) ||
    byLang((v) => /es[-_]MX/i.test(v.lang)) ||
    byLang((v) => /^es/i.test(v.lang)) ||
    null
  );
}

export function VoiceProvider({ children }: { children: ReactNode }) {
  // Default ON — audio is the point.
  const [enabled, setEnabledState] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Load persisted preference
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "0") setEnabledState(false);
    } catch { /* ignore */ }
  }, []);

  // Warm up TTS voices.
  useEffect(() => {
    if (!ttsSupported()) return;
    const load = () => {
      voiceRef.current = pickSpanishVoice();
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Unlock AudioContext on first interaction.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlock = () => {
      if (!ctxRef.current) {
        try {
          const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
          const ctx = new AC();
          const master = ctx.createGain();
          master.gain.value = 0.5;
          master.connect(ctx.destination);
          ctxRef.current = ctx;
          masterRef.current = master;
        } catch { /* ignore */ }
      } else if (ctxRef.current.state === "suspended") {
        ctxRef.current.resume().catch(() => { /* ignore */ });
      }
    };
    const evts: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    evts.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    return () => evts.forEach((e) => window.removeEventListener(e, unlock));
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* ignore */ }
    if (!v && ttsSupported()) window.speechSynthesis.cancel();
  }, []);

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  const speak = useCallback(
    (text: string, opts?: { interrupt?: boolean; rate?: number; pitch?: number }) => {
      if (!enabled || !ttsSupported() || !text) return;
      try {
        if (opts?.interrupt !== false) window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const v = voiceRef.current || pickSpanishVoice();
        if (v) u.voice = v;
        u.lang = v?.lang || "es-ES";
        u.rate = opts?.rate ?? 0.98;
        u.pitch = opts?.pitch ?? 1.25; // warmer, kid-friendly
        u.volume = 1;
        window.speechSynthesis.speak(u);
      } catch { /* ignore */ }
    },
    [enabled],
  );

  // ---------- SFX synth ----------
  const playTone = useCallback(
    (
      freq: number,
      duration: number,
      opts: { type?: OscillatorType; gain?: number; delay?: number; sweepTo?: number } = {},
    ) => {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!enabled || !ctx || !master) return;
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = opts.type ?? "sine";
      osc.frequency.setValueAtTime(freq, t0);
      if (opts.sweepTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.sweepTo), t0 + duration);
      }
      const peak = opts.gain ?? 0.18;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(g);
      g.connect(master);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    },
    [enabled],
  );

  const sfx = useCallback(
    (kind: SfxKind) => {
      if (!enabled) return;
      switch (kind) {
        case "tap":
          playTone(520, 0.08, { type: "triangle", gain: 0.14, sweepTo: 700 });
          break;
        case "pop":
          playTone(700, 0.09, { type: "sine", gain: 0.18, sweepTo: 1100 });
          break;
        case "success":
          playTone(660, 0.12, { type: "triangle", gain: 0.16 });
          playTone(880, 0.16, { type: "triangle", gain: 0.16, delay: 0.08 });
          break;
        case "whoosh":
          playTone(220, 0.35, { type: "sawtooth", gain: 0.08, sweepTo: 60 });
          break;
        case "sparkle":
          [1320, 1760, 2200].forEach((f, i) =>
            playTone(f, 0.18, { type: "triangle", gain: 0.1, delay: i * 0.06 }),
          );
          break;
        case "jingle": {
          // C E G C (major arpeggio) — happy & quick
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((f, i) =>
            playTone(f, 0.22, { type: "triangle", gain: 0.18, delay: i * 0.11 }),
          );
          // sparkle tail
          [1568, 2093].forEach((f, i) =>
            playTone(f, 0.2, { type: "sine", gain: 0.1, delay: 0.44 + i * 0.08 }),
          );
          break;
        }
        case "yum":
          playTone(440, 0.18, { type: "sine", gain: 0.16, sweepTo: 620 });
          playTone(620, 0.22, { type: "sine", gain: 0.16, delay: 0.15, sweepTo: 520 });
          break;
      }
    },
    [enabled, playTone],
  );

  const praise = useCallback(() => {
    if (!enabled) return;
    sfx("success");
    const phrase = PRAISES[Math.floor(Math.random() * PRAISES.length)];
    speak(phrase, { pitch: 1.35, rate: 1.0 });
  }, [enabled, sfx, speak]);

  const value = useMemo<VoiceCtx>(
    () => ({ enabled, setEnabled, toggle, speak, praise, sfx, supported: ttsSupported() }),
    [enabled, setEnabled, toggle, speak, praise, sfx],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVoice(): VoiceCtx {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  // Fallback no-op so components used outside the provider don't crash (e.g. SSR).
  return {
    enabled: false,
    setEnabled: () => {},
    toggle: () => {},
    speak: () => {},
    praise: () => {},
    sfx: () => {},
    supported: false,
  };
}
