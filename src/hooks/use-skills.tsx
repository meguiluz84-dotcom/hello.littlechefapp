import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";
import { EMPTY_SKILLS, type SkillCounters, recipeContributes, earnedSkillIds } from "@/data/skills";
import type { Recipe } from "@/data/recipes";

const KEY = (pid: string) => `lc:p:${pid}:skills`;

function read(pid: string | null): SkillCounters {
  if (!pid) return EMPTY_SKILLS;
  try {
    const raw = localStorage.getItem(KEY(pid));
    if (!raw) return EMPTY_SKILLS;
    return { ...EMPTY_SKILLS, ...JSON.parse(raw) };
  } catch { return EMPTY_SKILLS; }
}

export function useSkills() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [counters, setCounters] = useState<SkillCounters>(() => read(pid));

  useEffect(() => { setCounters(read(pid)); }, [pid]);

  const addRecipe = useCallback((recipe: Recipe, asChallenge: boolean) => {
    if (!pid) return;
    const delta = recipeContributes(recipe);
    setCounters((prev) => {
      const next: SkillCounters = { ...prev };
      (Object.keys(delta) as (keyof SkillCounters)[]).forEach((k) => {
        next[k] = (next[k] ?? 0) + (delta[k] ?? 0);
      });
      if (asChallenge) next.challenge += 1;
      try { localStorage.setItem(KEY(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  const earned = earnedSkillIds(counters);
  return { counters, earned, addRecipe };
}
