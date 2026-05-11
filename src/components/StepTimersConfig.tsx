import { useState } from "react";
import { recipes as ALL_RECIPES } from "@/data/recipes";
import { useStepTimers } from "@/hooks/use-step-timers";
import { getRecipeName } from "@/data/recipeNames";
import type { AvatarId } from "@/data/avatars";

const PRESETS = [0, 10, 30, 60, 120, 300]; // seconds

interface Props { avatarId: AvatarId }

export default function StepTimersConfig({ avatarId }: Props) {
  const timers = useStepTimers();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-kids-yellow/40 p-4 text-sm font-bold text-foreground kids-shadow">
        <p className="text-base font-extrabold">⏱️ Tiempos de espera</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          Configura cuánto debe esperar el peque en pasos como hornear, enfriar o reposar. Aparecerá un temporizador visual.
        </p>
      </section>

      <ul className="space-y-2">
        {ALL_RECIPES.map((r) => {
          const isOpen = openId === r.id;
          return (
            <li key={r.id} className="overflow-hidden rounded-2xl bg-card kids-shadow">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : r.id)}
                className="flex w-full items-center gap-3 p-3 text-left"
                aria-expanded={isOpen}
              >
                <img src={r.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <span className="flex-1 text-sm font-extrabold text-foreground">
                  {getRecipeName(avatarId, r.id, r.name)}
                </span>
                <span aria-hidden>{isOpen ? "▾" : "▸"}</span>
              </button>
              {isOpen && (
                <ul className="border-t border-muted/40 bg-background/40 p-3 space-y-3">
                  {r.steps.map((s, i) => {
                    const cur = timers.get(r.id, i);
                    return (
                      <li key={i} className="rounded-xl bg-card p-3 kids-shadow">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                            {i + 1}
                          </span>
                          <span className="text-2xl" aria-hidden>{s.emoji}</span>
                          <span className="text-xs font-bold text-muted-foreground">
                            {cur > 0 ? formatSec(cur) : "Sin espera"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESETS.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => timers.set(r.id, i, p)}
                              aria-pressed={cur === p}
                              className={`min-h-9 rounded-full px-3 py-1 text-xs font-extrabold ${
                                cur === p ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
                              }`}
                            >
                              {p === 0 ? "—" : formatSec(p)}
                            </button>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function formatSec(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r === 0 ? `${m} min` : `${m}m ${r}s`;
}
