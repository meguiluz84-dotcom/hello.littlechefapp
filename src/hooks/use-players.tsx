import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { AvatarId } from "@/data/avatars";
import type { Restrictions } from "@/data/recipeMeta";

export type AgeBucket = "2-3" | "4-5" | "6+";

export interface Player {
  id: string;
  name: string;
  avatarId: AvatarId;
  age: AgeBucket;
  restrictions: Restrictions;
  createdAt: number;
}

const PLAYERS_KEY = "lc:players-v3";
const ACTIVE_KEY = "lc:active-player-v3";

const DEFAULT_RESTR: Restrictions = { nuts: false, dairy: false, gluten: false, vegetarian: false };

interface Ctx {
  players: Player[];
  active: Player | null;
  activeId: string | null;
  hydrated: boolean;
  add: (p: Omit<Player, "id" | "createdAt">) => string;
  update: (id: string, patch: Partial<Omit<Player, "id" | "createdAt">>) => void;
  remove: (id: string) => void;
  setActive: (id: string) => void;
  resetAll: () => void;
}

const PlayersContext = createContext<Ctx | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

function uid() {
  return `p_${Math.random().toString(36).slice(2, 9)}`;
}

// Migration: read legacy single-player keys and create initial player if needed.
function migrateLegacy(): { players: Player[]; activeId: string | null } {
  const players = readJSON<Player[]>(PLAYERS_KEY, []);
  if (players.length > 0) {
    const activeId = localStorage.getItem(ACTIVE_KEY) ?? players[0].id;
    return { players, activeId };
  }
  // Try legacy
  const legacyAvatar = localStorage.getItem("little-chef-avatar") as AvatarId | null;
  const legacyPrefs = readJSON<{ age: AgeBucket; restrictions: Restrictions } | null>(
    "lc:onboarding-v2", null
  );
  if (legacyAvatar && legacyPrefs) {
    const id = uid();
    const p: Player = {
      id, name: "Chef", avatarId: legacyAvatar,
      age: legacyPrefs.age, restrictions: legacyPrefs.restrictions, createdAt: Date.now(),
    };
    writeJSON(PLAYERS_KEY, [p]);
    localStorage.setItem(ACTIVE_KEY, id);
    // Copy legacy completed/favorites into the new player namespace
    const legacyCompleted = readJSON<string[]>("little-chef-completed", []);
    if (legacyCompleted.length) writeJSON(`lc:p:${id}:completed`, legacyCompleted);
    const legacyFav = readJSON<string[]>("lc:favorites", []);
    if (legacyFav.length) writeJSON(`lc:p:${id}:favorites`, legacyFav);
    return { players: [p], activeId: id };
  }
  return { players: [], activeId: null };
}

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const { players: ps, activeId: aid } = migrateLegacy();
    setPlayers(ps);
    setActiveId(aid);
    setHydrated(true);
  }, []);

  const persist = (next: Player[], aid: string | null) => {
    writeJSON(PLAYERS_KEY, next);
    if (aid) localStorage.setItem(ACTIVE_KEY, aid);
    else try { localStorage.removeItem(ACTIVE_KEY); } catch { /* ignore */ }
  };

  const add: Ctx["add"] = useCallback((p) => {
    const id = uid();
    const player: Player = { ...p, id, createdAt: Date.now() };
    setPlayers((prev) => {
      const next = [...prev, player];
      persist(next, activeId ?? id);
      return next;
    });
    if (!activeId) setActiveId(id);
    return id;
  }, [activeId]);

  const update: Ctx["update"] = useCallback((id, patch) => {
    setPlayers((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      persist(next, activeId);
      return next;
    });
  }, [activeId]);

  const remove: Ctx["remove"] = useCallback((id) => {
    setPlayers((prev) => {
      const next = prev.filter((p) => p.id !== id);
      const newActive = activeId === id ? (next[0]?.id ?? null) : activeId;
      persist(next, newActive);
      if (newActive !== activeId) setActiveId(newActive);
      // Clean up per-player keys
      ["completed", "favorites", "medals", "week-plan", "challenges"].forEach((suffix) => {
        try { localStorage.removeItem(`lc:p:${id}:${suffix}`); } catch { /* ignore */ }
      });
      return next;
    });
  }, [activeId]);

  const setActive: Ctx["setActive"] = useCallback((id) => {
    setActiveId(id);
    localStorage.setItem(ACTIVE_KEY, id);
  }, []);

  const resetAll: Ctx["resetAll"] = useCallback(() => {
    try {
      localStorage.removeItem(PLAYERS_KEY);
      localStorage.removeItem(ACTIVE_KEY);
    } catch { /* ignore */ }
    setPlayers([]);
    setActiveId(null);
  }, []);

  const active = players.find((p) => p.id === activeId) ?? null;

  return (
    <PlayersContext.Provider value={{
      players, active, activeId, hydrated, add, update, remove, setActive, resetAll,
    }}>
      {children}
    </PlayersContext.Provider>
  );
}

export function usePlayers(): Ctx {
  const ctx = useContext(PlayersContext);
  if (!ctx) throw new Error("usePlayers must be used inside PlayersProvider");
  return ctx;
}

export { DEFAULT_RESTR };
