// Gorros de chef desbloqueables por número de recetas completadas.
// Sin presión: el siguiente siempre se ve, nunca se pierden los anteriores.

export interface ChefHat {
  id: string;
  emoji: string;
  label: string;
  unlockAt: number; // recetas necesarias
  color: string;    // clase bg-* para la tarjeta
}

export const HATS: ChefHat[] = [
  { id: "starter",   emoji: "👶", label: "Mini chef",       unlockAt: 0,  color: "bg-kids-yellow" },
  { id: "classic",   emoji: "👨‍🍳", label: "Gorro clásico",  unlockAt: 1,  color: "bg-kids-green"  },
  { id: "party",     emoji: "🥳", label: "Gorro fiesta",     unlockAt: 3,  color: "bg-kids-pink"   },
  { id: "wizard",    emoji: "🧙", label: "Chef mágico",      unlockAt: 5,  color: "bg-kids-purple" },
  { id: "explorer",  emoji: "🤠", label: "Chef explorador",  unlockAt: 8,  color: "bg-kids-orange" },
  { id: "superhero", emoji: "🦸", label: "Súper chef",       unlockAt: 12, color: "bg-kids-blue"   },
  { id: "royal",     emoji: "👑", label: "Chef real",        unlockAt: 18, color: "bg-kids-yellow" },
  { id: "dragon",    emoji: "🐲", label: "Chef dragón",      unlockAt: 25, color: "bg-kids-teal"   },
];

export function hatsUnlocked(completedCount: number): ChefHat[] {
  return HATS.filter((h) => completedCount >= h.unlockAt);
}

export function nextHat(completedCount: number): ChefHat | null {
  return HATS.find((h) => completedCount < h.unlockAt) ?? null;
}
