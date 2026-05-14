import { useMemo, useState } from "react";
import type { Recipe } from "@/data/recipes";
import { getRecipeMeta, recipeMatchesRestrictions, type Restrictions } from "@/data/recipeMeta";

interface Props {
  recipes: Recipe[];
  restrictions: Restrictions;
  getName: (r: Recipe) => string;
  onPick: (r: Recipe) => void;
  onClose: () => void;
}

export default function IngredientGenerator({ recipes, restrictions, getName, onPick, onClose }: Props) {
  // Collect unique ingredient emojis across recipes
  const allIngredients = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.ingredients.forEach((i) => set.add(i.emoji)));
    return Array.from(set);
  }, [recipes]);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (e: string) => {
    const next = new Set(selected);
    next.has(e) ? next.delete(e) : next.add(e);
    setSelected(next);
  };

  const matches = useMemo(() => {
    if (selected.size === 0) return [];
    return recipes
      .filter((r) => recipeMatchesRestrictions(getRecipeMeta(r.id), restrictions))
      .map((r) => {
        const recipeSet = new Set(r.ingredients.map((i) => i.emoji));
        const have = [...selected].filter((e) => recipeSet.has(e)).length;
        const need = r.ingredients.length;
        const missing = [...recipeSet].filter((e) => !selected.has(e));
        return { r, have, need, missing, score: have / Math.max(need, 1) };
      })
      .filter((m) => m.have > 0)
      .sort((a, b) => b.score - a.score || b.have - a.have)
      .slice(0, 12);
  }, [recipes, restrictions, selected]);

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">🧪 ¿Qué cocinamos?</h1>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow">✖️</button>
        </div>

        <p className="mb-2 text-sm font-bold text-foreground">Toca lo que tienes en casa:</p>
        <div className="mb-4 flex flex-wrap gap-2 rounded-2xl bg-card p-3 kids-shadow">
          {allIngredients.map((e) => {
            const on = selected.has(e);
            return (
              <button key={e} type="button" onClick={() => toggle(e)}
                className={`h-12 w-12 rounded-xl text-2xl kids-shadow ${on ? "bg-kids-yellow ring-2 ring-foreground" : "bg-background"}`}>
                {e}
              </button>
            );
          })}
        </div>

        {selected.size === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Elige al menos un ingrediente.</p>
        ) : matches.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No hay recetas con esos ingredientes. Prueba a añadir más.</p>
        ) : (
          <ul className="space-y-2">
            {matches.map(({ r, have, need, missing }) => (
              <li key={r.id}>
                <button type="button" onClick={() => onPick(r)} className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left kids-shadow">
                  <img src={r.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-foreground">{getName(r)}</div>
                    <div className="text-xs font-bold text-muted-foreground">Tienes {have}/{need} ingredientes</div>
                    {missing.length > 0 && (
                      <div className="mt-1 text-base">Te falta: {missing.join(" ")}</div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
