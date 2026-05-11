import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { PANTRY, PANTRY_GROUPS } from "@/data/pantry";
import { usePantry, pantryMatch } from "@/hooks/use-pantry";

interface Props {
  recipes: Recipe[];
  getName: (r: Recipe) => string;
  onPick: (r: Recipe) => void;
  onClose: () => void;
}

export default function PantryScreen({ recipes, getName, onPick, onClose }: Props) {
  const { items, toggle, has, clear } = usePantry();
  const [group, setGroup] = useState<typeof PANTRY_GROUPS[number]["id"] | "all">("all");

  const list = useMemo(
    () => (group === "all" ? PANTRY : PANTRY.filter((p) => p.group === group)),
    [group],
  );

  const matches = useMemo(() => {
    if (items.length === 0) return [];
    return recipes
      .map((r) => {
        const emojis = r.ingredients.map((i) => i.emoji);
        const m = pantryMatch(emojis, items);
        return { recipe: r, ...m };
      })
      .filter((x) => x.have > 0)
      .sort((a, b) => b.ratio - a.ratio || b.have - a.have)
      .slice(0, 12);
  }, [items, recipes]);

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">🧺 Mi nevera</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        <p className="mb-3 text-center text-sm font-bold text-muted-foreground">
          Marca lo que tienes en casa.
        </p>

        {/* Group filter chips */}
        <div className="mb-3 flex flex-wrap justify-center gap-1.5">
          <button
            type="button" onClick={() => setGroup("all")}
            className={`min-h-10 rounded-full px-3 py-1 text-xs font-extrabold kids-shadow ${
              group === "all" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            }`}
          >Todo</button>
          {PANTRY_GROUPS.map((g) => (
            <button
              key={g.id} type="button" onClick={() => setGroup(g.id)}
              className={`flex min-h-10 items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold kids-shadow ${
                group === g.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              <span>{g.emoji}</span><span>{g.label}</span>
            </button>
          ))}
        </div>

        {/* Pantry chips */}
        <div className="mb-4 grid grid-cols-4 gap-2">
          {list.map((p) => {
            const on = has(p.emoji);
            return (
              <motion.button
                key={p.emoji} type="button" whileTap={{ scale: 0.9 }}
                onClick={() => toggle(p.emoji)}
                aria-pressed={on} aria-label={`${p.label}${on ? " marcado" : ""}`}
                className={`flex min-h-20 flex-col items-center justify-center gap-0.5 rounded-2xl p-2 kids-shadow ${
                  on ? "bg-accent/40 ring-4 ring-accent" : "bg-card"
                }`}
              >
                <span className="text-3xl">{p.emoji}</span>
                <span className="text-[10px] font-extrabold text-foreground line-clamp-1">{p.label}</span>
              </motion.button>
            );
          })}
        </div>

        {items.length > 0 && (
          <div className="mb-4 flex justify-center">
            <button
              type="button" onClick={() => { if (confirm("¿Limpiar nevera?")) clear(); }}
              className="min-h-10 rounded-full bg-card px-4 py-1.5 text-xs font-extrabold text-foreground kids-shadow"
            >🧹 Vaciar nevera</button>
          </div>
        )}

        {/* Matched recipes */}
        <h2 className="mb-2 text-base font-extrabold text-foreground">✨ Puedes hacer</h2>
        {matches.length === 0 ? (
          <p className="text-sm font-bold text-muted-foreground">
            Marca ingredientes y te sugerimos recetas.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {matches.map(({ recipe, have, total, ratio }) => (
              <motion.button
                key={recipe.id} type="button"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPick(recipe)}
                className="flex flex-col items-center overflow-hidden rounded-2xl bg-card kids-shadow-lg"
              >
                <div className="relative w-full">
                  <img src={recipe.image} alt="" className="aspect-square w-full object-cover" />
                  <div className={`absolute right-1 top-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold kids-shadow ${
                    ratio === 1 ? "bg-kids-green" : ratio >= 0.5 ? "bg-kids-yellow" : "bg-card"
                  }`}>
                    {have}/{total} {ratio === 1 ? "🟢" : ratio >= 0.5 ? "🟡" : "🟠"}
                  </div>
                </div>
                <div className="px-2 py-2 text-center text-xs font-extrabold text-foreground line-clamp-2">
                  {getName(recipe)}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
