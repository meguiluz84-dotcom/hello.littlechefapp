import { useState } from "react";
import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { useWeekPlan, DAYS, MEALS, todayKey, type DayKey, type MealKey } from "@/hooks/use-week-plan";
import { buildBalancedPlan } from "@/lib/planner";
import { usePreferences } from "@/hooks/use-preferences";
import { useCompletedRecipes } from "@/hooks/use-completed-recipes";
import DinoBubble from "./DinoBubble";

interface Props {
  recipes: Recipe[];
  getName: (r: Recipe) => string;
  onClose: () => void;
}

export default function WeekPlanScreen({ recipes, getName, onClose }: Props) {
  const { plan, setSlot, clear } = useWeekPlan();
  const [picking, setPicking] = useState<{ day: DayKey; meal: MealKey } | null>(null);
  const today = todayKey();
  const recipeById = (id: string | undefined) => recipes.find((r) => r.id === id);
  const prefs = usePreferences();
  const { isCompleted } = useCompletedRecipes();

  const fillBalanced = () => {
    const next = buildBalancedPlan(plan, {
      recipes,
      isFavorite: prefs.isFavorite,
      isCompleted,
    });
    // Apply diff via setSlot (single source of truth in hook).
    Object.entries(next).forEach(([k, rid]) => {
      if (plan[k as keyof typeof plan] !== rid && rid) {
        const [day, meal] = k.split("-") as [DayKey, MealKey];
        setSlot(day, meal, rid);
      }
    });
  };


  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">📅 Plan semanal</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        <div className="space-y-3">
          {DAYS.map((d) => (
            <div
              key={d.id}
              className={`rounded-2xl p-3 kids-shadow ${d.id === today ? "bg-kids-yellow/40 ring-2 ring-accent" : "bg-card"}`}
            >
              <div className="mb-2 text-base font-extrabold text-foreground">{d.label}{d.id === today && " · Hoy"}</div>
              <div className="grid grid-cols-2 gap-2">
                {MEALS.map((m) => {
                  const k = `${d.id}-${m.id}` as const;
                  const r = recipeById(plan[k]);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPicking({ day: d.id, meal: m.id })}
                      className="flex min-h-16 items-center gap-2 rounded-xl bg-background p-2 text-left kids-shadow"
                      aria-label={`${m.label} ${d.label}`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      {r ? (
                        <>
                          <img src={r.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <span className="flex-1 text-xs font-extrabold text-foreground line-clamp-2">{getName(r)}</span>
                        </>
                      ) : (
                        <span className="flex-1 text-xs font-bold text-muted-foreground">+ Añadir</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={fillBalanced}
            className="min-h-12 rounded-full bg-kids-green px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
          >✨ Llenar semana equilibrada</button>
          <button
            type="button"
            onClick={() => { if (confirm("¿Vaciar plan semanal?")) clear(); }}
            className="min-h-12 rounded-full bg-card px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
          >🧹 Vaciar plan</button>
        </div>
      </div>

      {picking && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex flex-col bg-background px-4 pb-10 pt-6"
        >
          <div className="mx-auto w-full max-w-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Elige receta</h2>
              <button
                type="button" onClick={() => setPicking(null)} aria-label="Cerrar"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
              >✖️</button>
            </div>
            {plan[`${picking.day}-${picking.meal}`] && (
              <button
                type="button"
                onClick={() => { setSlot(picking.day, picking.meal, null); setPicking(null); }}
                className="mb-3 w-full min-h-14 rounded-xl bg-kids-red px-4 py-3 text-center text-base font-extrabold text-foreground kids-shadow"
              >🗑️ Quitar de este hueco</button>
            )}
            <div className="grid grid-cols-3 gap-3 overflow-y-auto">
              {recipes.map((r) => (
                <button
                  key={r.id} type="button"
                  onClick={() => { setSlot(picking.day, picking.meal, r.id); setPicking(null); }}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-card p-2 kids-shadow"
                >
                  <img src={r.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <span className="text-balance text-center text-[10px] font-extrabold text-foreground line-clamp-2">{getName(r)}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
