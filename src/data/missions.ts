// Weekly missions. Three rotate per ISO week per player.
export interface MissionState {
  completed: number;     // recipes finished this week
  tastings: number;      // tasting reactions this week
  challenges: number;    // daily challenges this week
  claimed?: boolean;     // sticker claimed
}

export interface MissionDef {
  id: string;
  emoji: string;
  label: string;
  target: number;
  read: (s: MissionState) => number;
}

export const MISSIONS: MissionDef[] = [
  { id: "cook3",    emoji: "👩‍🍳", label: "Cocina 3 recetas",  target: 3, read: (s) => s.completed },
  { id: "taste2",   emoji: "👅",   label: "Prueba 2 cosas",     target: 2, read: (s) => s.tastings  },
  { id: "challenge1", emoji: "🎯", label: "Gana 1 reto",        target: 1, read: (s) => s.challenges },
  { id: "cook5",    emoji: "🌟",   label: "Cocina 5 recetas",   target: 5, read: (s) => s.completed },
  { id: "taste4",   emoji: "😋",   label: "Prueba 4 sabores",   target: 4, read: (s) => s.tastings  },
  { id: "challenge3", emoji: "🚀", label: "Gana 3 retos",       target: 3, read: (s) => s.challenges },
];

// Reward stickers shown when a week is fully completed.
export const REWARD_STICKERS = ["🦄", "🐉", "🦁", "🐙", "🐳", "🦋", "🌈", "🪐", "👑", "🍩"];

export function isoWeekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    (((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7
  );
  return `${date.getUTCFullYear()}W${String(weekNum).padStart(2, "0")}`;
}

export function weekIndex(): number {
  // Stable index for picking the rotating set of 3 missions.
  const w = isoWeekKey();
  const n = parseInt(w.slice(-2), 10) || 0;
  return n;
}

export function weeksMissions(): MissionDef[] {
  const idx = weekIndex();
  // Rotate 3 of MISSIONS deterministically.
  return [0, 1, 2].map((i) => MISSIONS[(idx + i) % MISSIONS.length]);
}

export function rewardSticker(weekKey: string): string {
  const n = parseInt(weekKey.slice(-2), 10) || 0;
  return REWARD_STICKERS[n % REWARD_STICKERS.length];
}
