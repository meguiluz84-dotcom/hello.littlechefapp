// Sistema de colección simple para niños pequeños.
// Todo se desbloquea con ⭐ = número de recetas completadas.
// Sin monedas, sin estadísticas: solo "tienes" o "no tienes".

export type CollectibleCategory =
  | "recipes"      // recetas nuevas
  | "ingredients"  // ingredientes mágicos
  | "kitchens"     // cocinas temáticas
  | "hats"         // gorros de chef
  | "tools"        // utensilios
  | "stickers";    // stickers

export interface Collectible {
  id: string;
  emoji: string;
  label: string;
  unlockAt: number; // ⭐ necesarias
  bg: string;       // clase de fondo
}

export interface CategoryDef {
  id: CollectibleCategory;
  emoji: string;
  label: string;
  unlockMessage: (label: string) => string;
  bg: string;
  items: Collectible[];
}

export const COLLECTION: CategoryDef[] = [
  {
    id: "kitchens",
    emoji: "🏠",
    label: "Cocinas",
    bg: "bg-kids-blue",
    unlockMessage: (l) => `¡Nueva cocina ${l} desbloqueada!`,
    items: [
      { id: "k-home",    emoji: "🏠", label: "casita",    unlockAt: 0,  bg: "bg-kids-yellow" },
      { id: "k-forest",  emoji: "🌳", label: "del bosque", unlockAt: 2,  bg: "bg-kids-green"  },
      { id: "k-beach",   emoji: "🏖️", label: "de la playa", unlockAt: 4,  bg: "bg-kids-teal"   },
      { id: "k-space",   emoji: "🚀", label: "espacial",   unlockAt: 7,  bg: "bg-kids-purple" },
      { id: "k-castle",  emoji: "🏰", label: "del castillo", unlockAt: 10, bg: "bg-kids-pink"   },
      { id: "k-dino",    emoji: "🦖", label: "dinosaurio", unlockAt: 15, bg: "bg-kids-orange" },
    ],
  },
  {
    id: "hats",
    emoji: "🎩",
    label: "Gorros",
    bg: "bg-kids-purple",
    unlockMessage: (l) => `¡Has desbloqueado gorro ${l}!`,
    items: [
      { id: "h-classic",   emoji: "👨‍🍳", label: "clásico",     unlockAt: 0,  bg: "bg-kids-yellow" },
      { id: "h-party",     emoji: "🥳", label: "de fiesta",    unlockAt: 1,  bg: "bg-kids-pink"   },
      { id: "h-wizard",    emoji: "🧙", label: "mágico",       unlockAt: 3,  bg: "bg-kids-purple" },
      { id: "h-astro",     emoji: "🧑‍🚀", label: "de astronauta", unlockAt: 5,  bg: "bg-kids-blue"   },
      { id: "h-cowboy",    emoji: "🤠", label: "explorador",   unlockAt: 8,  bg: "bg-kids-orange" },
      { id: "h-superhero", emoji: "🦸", label: "súper chef",   unlockAt: 12, bg: "bg-kids-green"  },
      { id: "h-king",      emoji: "👑", label: "real",         unlockAt: 18, bg: "bg-kids-yellow" },
      { id: "h-dragon",    emoji: "🐲", label: "dragón",       unlockAt: 25, bg: "bg-kids-teal"   },
    ],
  },
  {
    id: "tools",
    emoji: "🥄",
    label: "Utensilios",
    bg: "bg-kids-orange",
    unlockMessage: (l) => `¡Nuevo utensilio: ${l}!`,
    items: [
      { id: "t-spoon",   emoji: "🥄", label: "cuchara",   unlockAt: 0,  bg: "bg-kids-yellow" },
      { id: "t-fork",    emoji: "🍴", label: "tenedor",   unlockAt: 1,  bg: "bg-kids-green"  },
      { id: "t-knife",   emoji: "🔪", label: "cuchillo",  unlockAt: 3,  bg: "bg-kids-pink"   },
      { id: "t-pot",     emoji: "🍲", label: "olla",      unlockAt: 5,  bg: "bg-kids-orange" },
      { id: "t-pan",     emoji: "🍳", label: "sartén",    unlockAt: 7,  bg: "bg-kids-blue"   },
      { id: "t-mixer",   emoji: "🧁", label: "batidora",  unlockAt: 10, bg: "bg-kids-purple" },
      { id: "t-magic",   emoji: "✨", label: "varita mágica", unlockAt: 15, bg: "bg-kids-yellow" },
    ],
  },
  {
    id: "ingredients",
    emoji: "🥕",
    label: "Ingredientes",
    bg: "bg-kids-green",
    unlockMessage: (l) => `¡Ingrediente nuevo: ${l}!`,
    items: [
      { id: "i-tomato", emoji: "🍅", label: "tomate",     unlockAt: 0,  bg: "bg-kids-pink"   },
      { id: "i-carrot", emoji: "🥕", label: "zanahoria",  unlockAt: 1,  bg: "bg-kids-orange" },
      { id: "i-egg",    emoji: "🥚", label: "huevo",      unlockAt: 2,  bg: "bg-kids-yellow" },
      { id: "i-cheese", emoji: "🧀", label: "queso",      unlockAt: 4,  bg: "bg-kids-yellow" },
      { id: "i-bread",  emoji: "🍞", label: "pan",        unlockAt: 6,  bg: "bg-kids-orange" },
      { id: "i-choco",  emoji: "🍫", label: "chocolate",  unlockAt: 9,  bg: "bg-kids-pink"   },
      { id: "i-honey",  emoji: "🍯", label: "miel",       unlockAt: 12, bg: "bg-kids-yellow" },
      { id: "i-rainbow",emoji: "🌈", label: "arcoíris",   unlockAt: 20, bg: "bg-kids-purple" },
    ],
  },
  {
    id: "recipes",
    emoji: "📖",
    label: "Recetas",
    bg: "bg-kids-pink",
    unlockMessage: (l) => `¡Receta nueva: ${l}!`,
    items: [
      { id: "r-pizza",   emoji: "🍕", label: "pizza",      unlockAt: 0,  bg: "bg-kids-orange" },
      { id: "r-pasta",   emoji: "🍝", label: "pasta",      unlockAt: 2,  bg: "bg-kids-yellow" },
      { id: "r-cookie",  emoji: "🍪", label: "galletas",   unlockAt: 4,  bg: "bg-kids-orange" },
      { id: "r-cake",    emoji: "🎂", label: "tarta",      unlockAt: 6,  bg: "bg-kids-pink"   },
      { id: "r-sushi",   emoji: "🍣", label: "sushi",      unlockAt: 9,  bg: "bg-kids-teal"   },
      { id: "r-taco",    emoji: "🌮", label: "tacos",      unlockAt: 13, bg: "bg-kids-orange" },
      { id: "r-secret",  emoji: "🍩", label: "secreta",    unlockAt: 20, bg: "bg-kids-purple" },
    ],
  },
  {
    id: "stickers",
    emoji: "✨",
    label: "Stickers",
    bg: "bg-kids-yellow",
    unlockMessage: (l) => `¡Sticker ${l}!`,
    items: [
      { id: "s-star",    emoji: "⭐", label: "estrella",  unlockAt: 0,  bg: "bg-kids-yellow" },
      { id: "s-heart",   emoji: "❤️", label: "corazón",   unlockAt: 1,  bg: "bg-kids-pink"   },
      { id: "s-trophy",  emoji: "🏆", label: "trofeo",    unlockAt: 3,  bg: "bg-kids-yellow" },
      { id: "s-fire",    emoji: "🔥", label: "fuego",     unlockAt: 5,  bg: "bg-kids-orange" },
      { id: "s-unicorn", emoji: "🦄", label: "unicornio", unlockAt: 8,  bg: "bg-kids-purple" },
      { id: "s-crown",   emoji: "👑", label: "corona",    unlockAt: 12, bg: "bg-kids-yellow" },
      { id: "s-rocket",  emoji: "🚀", label: "cohete",    unlockAt: 17, bg: "bg-kids-blue"   },
      { id: "s-rainbow", emoji: "🌈", label: "arcoíris",  unlockAt: 22, bg: "bg-kids-pink"   },
    ],
  },
];

export interface UnlockEvent {
  category: CategoryDef;
  item: Collectible;
  message: string;
}

/** Items unlocked when stars goes from `from` to `to` (exclusive of `from`). */
export function newlyUnlocked(from: number, to: number): UnlockEvent[] {
  if (to <= from) return [];
  const events: UnlockEvent[] = [];
  for (const cat of COLLECTION) {
    for (const it of cat.items) {
      if (it.unlockAt > from && it.unlockAt <= to) {
        events.push({ category: cat, item: it, message: cat.unlockMessage(it.label) });
      }
    }
  }
  return events;
}

export function totalCollectibles(): number {
  return COLLECTION.reduce((n, c) => n + c.items.length, 0);
}

export function unlockedCount(stars: number): number {
  let n = 0;
  for (const c of COLLECTION) for (const it of c.items) if (stars >= it.unlockAt) n++;
  return n;
}
