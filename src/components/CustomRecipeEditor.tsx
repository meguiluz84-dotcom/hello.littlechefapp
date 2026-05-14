import { useState } from "react";
import {
  type CustomRecipe, ACTION_ICONS, blankCustomRecipe,
} from "@/hooks/use-custom-recipes";
import type { RecipeCategory, ActionIcon } from "@/data/recipes";
import type { RecipeLevel } from "@/data/recipeMeta";
import { LEVEL_INFO, RESTRICTION_INFO } from "@/data/recipeMeta";

interface Props {
  initial?: CustomRecipe;
  onSave: (r: CustomRecipe) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const COLORS = ["kids-yellow", "kids-pink", "kids-blue", "kids-green", "kids-orange", "kids-purple", "kids-red", "kids-teal"];
const CATS: { id: RecipeCategory; emoji: string; label: string }[] = [
  { id: "fruits", emoji: "🍎", label: "Fruta" },
  { id: "snacks", emoji: "🥪", label: "Snack" },
  { id: "drinks", emoji: "🥤", label: "Bebida" },
  { id: "meals", emoji: "🍳", label: "Comida" },
  { id: "desserts", emoji: "🍪", label: "Postre" },
];
const ACTION_EMOJI: Record<ActionIcon, string> = {
  cut: "🔪", mix: "🥄", pour: "🫗", spread: "🥖", place: "📍", shake: "🤝",
  scoop: "🥄", peel: "🍌", wash: "💦", bake: "🔥", chill: "❄️", wait: "⏳",
};

export default function CustomRecipeEditor({ initial, onSave, onCancel, onDelete }: Props) {
  const [r, setR] = useState<CustomRecipe>(initial ?? blankCustomRecipe());

  const setMeta = (patch: Partial<CustomRecipe["meta"]>) => setR({ ...r, meta: { ...r.meta, ...patch } });

  const addIngredient = () => setR({ ...r, ingredients: [...r.ingredients, { emoji: "🍓", quantityLabel: "1 cuchara" }] });
  const updIngredient = (i: number, patch: Partial<typeof r.ingredients[number]>) =>
    setR({ ...r, ingredients: r.ingredients.map((x, idx) => idx === i ? { ...x, ...patch } : x) });
  const delIngredient = (i: number) => setR({ ...r, ingredients: r.ingredients.filter((_, idx) => idx !== i) });

  const addStep = () => setR({ ...r, steps: [...r.steps, { emoji: "🥄", ingredientEmojis: [], actionIcon: "mix" }] });
  const updStep = (i: number, patch: Partial<typeof r.steps[number]>) =>
    setR({ ...r, steps: r.steps.map((x, idx) => idx === i ? { ...x, ...patch } : x) });
  const delStep = (i: number) => setR({ ...r, steps: r.steps.filter((_, idx) => idx !== i) });

  const canSave = r.name.trim().length > 0 && r.ingredients.length > 0 && r.steps.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground">{initial ? "✏️ Editar receta" : "➕ Nueva receta"}</h2>
          <button type="button" onClick={onCancel} aria-label="Cerrar" className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow">✖️</button>
        </div>

        {/* Basic */}
        <section className="space-y-2 rounded-2xl bg-card p-3 kids-shadow">
          <label className="block text-xs font-extrabold text-muted-foreground">Nombre</label>
          <input value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} className="w-full rounded-xl bg-background px-3 py-2 text-base font-bold text-foreground" />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs font-extrabold text-muted-foreground">Emoji</label>
              <input value={r.emoji} onChange={(e) => setR({ ...r, emoji: e.target.value.slice(0, 4) })} className="w-full rounded-xl bg-background px-3 py-2 text-2xl" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-extrabold text-muted-foreground">Categoría</label>
              <select value={r.category} onChange={(e) => setR({ ...r, category: e.target.value as RecipeCategory })} className="w-full rounded-xl bg-background px-3 py-2 text-base font-bold">
                {CATS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-extrabold text-muted-foreground">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setR({ ...r, color: c })}
                  className={`h-8 w-8 rounded-full bg-${c} ${r.color === c ? "ring-4 ring-foreground" : ""}`} aria-label={c} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-extrabold text-muted-foreground">Nivel</label>
            <div className="flex gap-2">
              {([1, 2, 3, 4] as RecipeLevel[]).map((lv) => (
                <button key={lv} type="button" onClick={() => setMeta({ level: lv })}
                  className={`flex-1 rounded-xl px-2 py-2 text-xs font-extrabold kids-shadow ${r.meta.level === lv ? "bg-kids-yellow" : "bg-background"}`}>
                  {LEVEL_INFO[lv].emoji} {LEVEL_INFO[lv].label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section className="space-y-2 rounded-2xl bg-card p-3 kids-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-foreground">🥕 Ingredientes</h3>
            <button type="button" onClick={addIngredient} className="rounded-full bg-kids-green px-3 py-1 text-xs font-extrabold">+ Añadir</button>
          </div>
          {r.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl bg-background p-2">
              <input value={ing.emoji} onChange={(e) => updIngredient(i, { emoji: e.target.value.slice(0, 4) })} className="w-12 rounded-lg bg-card px-1 py-1 text-center text-2xl" />
              <select value={ing.quantityLabel ?? "1 cuchara"} onChange={(e) => updIngredient(i, { quantityLabel: e.target.value as "1 taza" | "media taza" | "1 cuchara" })} className="flex-1 rounded-lg bg-card px-2 py-1 text-xs font-bold">
                <option>1 cuchara</option><option>media taza</option><option>1 taza</option>
              </select>
              <button type="button" onClick={() => delIngredient(i)} aria-label="Quitar" className="text-lg">🗑️</button>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="space-y-2 rounded-2xl bg-card p-3 kids-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-foreground">👣 Pasos</h3>
            <button type="button" onClick={addStep} className="rounded-full bg-kids-green px-3 py-1 text-xs font-extrabold">+ Añadir</button>
          </div>
          {r.steps.map((s, i) => (
            <div key={i} className="space-y-1 rounded-xl bg-background p-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-muted-foreground">#{i + 1}</span>
                <input value={s.emoji} onChange={(e) => updStep(i, { emoji: e.target.value.slice(0, 4) })} className="w-14 rounded-lg bg-card px-1 py-1 text-center text-2xl" />
                <select value={s.actionIcon} onChange={(e) => updStep(i, { actionIcon: e.target.value as ActionIcon })} className="flex-1 rounded-lg bg-card px-2 py-1 text-xs font-bold">
                  {ACTION_ICONS.map((a) => <option key={a} value={a}>{ACTION_EMOJI[a]} {a}</option>)}
                </select>
                <button type="button" onClick={() => delStep(i)} aria-label="Quitar">🗑️</button>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <input type="checkbox" checked={!!s.adultRequired} onChange={(e) => updStep(i, { adultRequired: e.target.checked })} />
                👨‍🍳 Requiere adulto
              </label>
            </div>
          ))}
        </section>

        {/* Adult-only meta */}
        <section className="space-y-2 rounded-2xl bg-card p-3 kids-shadow">
          <h3 className="text-sm font-extrabold text-foreground">🛡️ Solo adulto</h3>
          <label className="flex items-center gap-2 text-xs font-bold">
            <input type="checkbox" checked={r.meta.privateToFamily} onChange={(e) => setMeta({ privateToFamily: e.target.checked })} />
            Privada para esta familia
          </label>
          <div>
            <label className="block text-xs font-extrabold text-muted-foreground">Alérgenos presentes</label>
            <div className="flex flex-wrap gap-1">
              {Object.entries(RESTRICTION_INFO).map(([k, info]) => {
                const key = k as keyof typeof r.meta.restrictions;
                const on = r.meta.restrictions[key];
                return (
                  <button key={k} type="button"
                    onClick={() => setMeta({ restrictions: { ...r.meta.restrictions, [key]: !on } })}
                    className={`rounded-full px-2 py-1 text-[10px] font-bold ${on ? "bg-kids-red" : "bg-background"}`}
                  >{info.emoji} {info.label}</button>
                );
              })}
            </div>
          </div>
          <textarea
            placeholder="Notas (sustituciones, seguridad)…"
            value={r.meta.notes ?? ""} onChange={(e) => setMeta({ notes: e.target.value })}
            className="w-full rounded-xl bg-background px-3 py-2 text-sm" rows={3}
          />
        </section>

        <div className="flex gap-2">
          <button type="button" onClick={() => canSave && onSave(r)} disabled={!canSave}
            className={`flex-1 rounded-full px-4 py-3 text-base font-extrabold kids-shadow ${canSave ? "bg-kids-green" : "bg-muted text-muted-foreground"}`}>
            💾 Guardar
          </button>
          {onDelete && (
            <button type="button" onClick={() => { if (confirm("¿Borrar receta?")) onDelete(); }}
              className="rounded-full bg-kids-red px-4 py-3 text-base font-extrabold kids-shadow">🗑️</button>
          )}
        </div>
      </div>
    </div>
  );
}
