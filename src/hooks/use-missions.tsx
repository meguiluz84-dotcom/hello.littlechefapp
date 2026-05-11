import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlayers } from "./use-players";
import { isoWeekKey, weeksMissions, rewardSticker, type MissionState } from "@/data/missions";

const stateKey = (pid: string, week: string) => `lc:p:${pid}:missions:${week}`;
const rewardsKey = (pid: string) => `lc:p:${pid}:rewards`;

const EMPTY: MissionState = { completed: 0, tastings: 0, challenges: 0, claimed: false };

export function useMissions() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const week = isoWeekKey();
  const [state, setState] = useState<MissionState>(EMPTY);
  const [rewards, setRewards] = useState<string[]>([]);

  useEffect(() => {
    if (!pid) { setState(EMPTY); setRewards([]); return; }
    try {
      const raw = localStorage.getItem(stateKey(pid, week));
      setState(raw ? JSON.parse(raw) : EMPTY);
    } catch { setState(EMPTY); }
    try {
      const raw = localStorage.getItem(rewardsKey(pid));
      setRewards(raw ? JSON.parse(raw) : []);
    } catch { setRewards([]); }
  }, [pid, week]);

  const persist = (next: MissionState) => {
    setState(next);
    if (pid) try { localStorage.setItem(stateKey(pid, week), JSON.stringify(next)); } catch { /* ignore */ }
  };

  const bump = useCallback((field: keyof Omit<MissionState, "claimed">) => {
    if (!pid) return;
    setState((prev) => {
      const next = { ...prev, [field]: (prev[field] ?? 0) + 1 };
      try { localStorage.setItem(stateKey(pid, week), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid, week]);

  const missions = useMemo(() => weeksMissions(), []);
  const allDone = missions.every((m) => m.read(state) >= m.target);

  const claimReward = useCallback(() => {
    if (!pid || !allDone || state.claimed) return null;
    const sticker = rewardSticker(week);
    setRewards((prev) => {
      const next = prev.includes(sticker) ? prev : [...prev, sticker];
      try { localStorage.setItem(rewardsKey(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    persist({ ...state, claimed: true });
    return sticker;
  }, [pid, allDone, state, week]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    week, state, missions, rewards, allDone,
    claimed: !!state.claimed,
    onCompleteRecipe: () => bump("completed"),
    onTaste: () => bump("tastings"),
    onChallenge: () => bump("challenges"),
    claimReward,
  };
}
