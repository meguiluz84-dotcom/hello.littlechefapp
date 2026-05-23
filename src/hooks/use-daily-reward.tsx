import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const lastKey = (pid: string) => `lc:p:${pid}:daily-last`;
const stickersKey = (pid: string) => `lc:p:${pid}:daily-stickers`;
const streakKey = (pid: string) => `lc:p:${pid}:daily-streak`;

// Stickers amables, sin presión. Cada día sale uno aleatorio.
const REWARD_POOL = ["🌈", "🦄", "🐙", "🐳", "🦋", "🐝", "🌟", "🍩", "🍭", "🪐", "🐸", "🦊", "🐼", "🦖", "🌻"];
const PRAISE = ["¡Buen trabajo!", "¡Chef increíble!", "¡Qué rico día!", "¡Eres genial!", "¡Hoy brillas!"];

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export function useDailyReward() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [available, setAvailable] = useState(false);
  const [stickers, setStickers] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayReward, setTodayReward] = useState<{ sticker: string; praise: string } | null>(null);

  useEffect(() => {
    if (!pid) { setAvailable(false); return; }
    try {
      const last = localStorage.getItem(lastKey(pid));
      setAvailable(last !== dayKey());
      const raw = localStorage.getItem(stickersKey(pid));
      setStickers(raw ? JSON.parse(raw) : []);
      const s = localStorage.getItem(streakKey(pid));
      setStreak(s ? Number(s) : 0);
    } catch { /* ignore */ }
  }, [pid]);

  const claim = useCallback(() => {
    if (!pid || !available) return null;
    const reward = { sticker: pick(REWARD_POOL), praise: pick(PRAISE) };
    const today = dayKey();
    try {
      const prevLast = localStorage.getItem(lastKey(pid));
      // Compute streak: +1 if yesterday, else reset to 1.
      let newStreak = 1;
      if (prevLast) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        const yKey = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
        if (prevLast === yKey) newStreak = (streak || 0) + 1;
      }
      localStorage.setItem(lastKey(pid), today);
      localStorage.setItem(streakKey(pid), String(newStreak));
      setStreak(newStreak);
      setStickers((prev) => {
        const next = [...prev, reward.sticker];
        localStorage.setItem(stickersKey(pid), JSON.stringify(next));
        return next;
      });
    } catch { /* ignore */ }
    setAvailable(false);
    setTodayReward(reward);
    return reward;
  }, [pid, available, streak]);

  const closeReward = useCallback(() => setTodayReward(null), []);

  return { available, claim, stickers, streak, todayReward, closeReward };
}
