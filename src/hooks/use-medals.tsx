import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlayers } from "./use-players";
import { useCompletedRecipes } from "./use-completed-recipes";
import { recipes } from "@/data/recipes";
import { earnedMedalIds } from "@/data/medals";

const challengesKey = (pid: string) => `lc:p:${pid}:challenges-done`;
const todayChallengeKey = (pid: string, day: string) => `lc:p:${pid}:challenge-${day}`;

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function useMedals() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const { completed } = useCompletedRecipes();
  const [challengesDone, setChallengesDone] = useState(0);

  useEffect(() => {
    if (!pid) { setChallengesDone(0); return; }
    try {
      const raw = localStorage.getItem(challengesKey(pid));
      setChallengesDone(raw ? Number(raw) : 0);
    } catch { setChallengesDone(0); }
  }, [pid]);

  const completeChallenge = useCallback((recipeId: string) => {
    if (!pid) return;
    const day = todayString();
    if (localStorage.getItem(todayChallengeKey(pid, day))) return;
    try {
      localStorage.setItem(todayChallengeKey(pid, day), recipeId);
      const n = challengesDone + 1;
      localStorage.setItem(challengesKey(pid), String(n));
      setChallengesDone(n);
    } catch { /* ignore */ }
  }, [pid, challengesDone]);

  const todaysChallengeRecipeId = useMemo(() => {
    if (!pid) return null;
    return localStorage.getItem(todayChallengeKey(pid, todayString()));
  }, [pid, challengesDone]);

  const earned = useMemo(
    () => earnedMedalIds({ completed, challengesDone, recipes }),
    [completed, challengesDone]
  );

  return { earned, challengesDone, completeChallenge, todaysChallengeRecipeId };
}
