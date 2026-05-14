import { useEffect, useMemo, useState } from "react";
import type { Recipe } from "@/data/recipes";
import { getRecipeMeta } from "@/data/recipeMeta";
import { recipeIsNoCook } from "@/hooks/use-no-cook";

type GroupSize = 5 | 10 | 15 | 20;
const SIZES: GroupSize[] = [5, 10, 15, 20];
const KEY = "lc:school";

interface Stored {
  size: GroupSize;
  noNuts: boolean;
  onlyNoCook: boolean;
  maxIngredients: number;
  className: string;
}
const DEFAULT: Stored = { size: 10, noNuts: true, onlyNoCook: false, maxIngredients: 8, className: "Aula 1" };

interface Props {
  recipes: Recipe[];
  getName: (r: Recipe) => string;
  onClose: () => void;
}

export default function SchoolMode({ recipes, getName, onClose }: Props) {
  const [cfg, setCfg] = useState<Stored>(DEFAULT);
  const [picked, setPicked] = useState<Recipe | null>(null);
  const [projecting, setProjecting] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setCfg({ ...DEFAULT, ...JSON.parse(r) }); } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch { /* ignore */ } }, [cfg]);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const m = getRecipeMeta(r.id);
      if (cfg.noNuts && (m.restrictions.nuts || m.restrictions.peanuts)) return false;
      if (cfg.onlyNoCook && !recipeIsNoCook(r)) return false;
      if (r.ingredients.length > cfg.maxIngredients) return false;
      return true;
    });
  }, [recipes, cfg]);

  // Scaling: assume base recipe = 1 child portion. Scale by group size.
  const factor = cfg.size;

  if (projecting && picked) {
    const step = picked.steps[stepIdx];
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6">
        <div className="absolute right-4 top-4 flex gap-2">
          <span className="rounded-full bg-card px-3 py-1 text-sm font-extrabold kids-shadow">👥 {cfg.size}</span>
          <button type="button" onClick={() => setProjecting(false)} className="rounded-full bg-card px-3 py-1 text-sm font-extrabold kids-shadow">✖ Salir</button>
        </div>
        <div className="text-[18vw] leading-none">{step?.emoji ?? "🎉"}</div>
        <div className="mt-4 text-center text-3xl font-extrabold text-foreground">
          Paso {stepIdx + 1} / {picked.steps.length}
        </div>
        <div className="mt-2 text-center text-2xl font-bold text-muted-foreground">
          {step?.ingredientEmojis.join(" ")}
        </div>
        <div className="mt-8 flex gap-4">
          <button type="button" onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} className="min-h-16 min-w-24 rounded-full bg-card px-6 text-2xl font-extrabold kids-shadow-lg">←</button>
          <button type="button" onClick={() => setStepIdx(Math.min(picked.steps.length - 1, stepIdx + 1))} className="min-h-16 min-w-24 rounded-full bg-kids-green px-6 text-2xl font-extrabold kids-shadow-lg">→</button>
        </div>
      </div>
    );
  }

  if (picked) {
    return (
      <div className="min-h-screen bg-background px-4 pb-10 pt-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => setPicked(null)} className="rounded-full bg-card px-3 py-2 text-sm font-extrabold kids-shadow">← Recetas</button>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow">✖️</button>
          </div>
          <div className="rounded-2xl bg-card p-3 kids-shadow">
            <div className="flex items-center gap-3">
              <img src={picked.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <div>
                <div className="text-lg font-extrabold text-foreground">{getName(picked)}</div>
                <div className="text-xs font-bold text-muted-foreground">Para {cfg.size} niños · ×{factor}</div>
              </div>
            </div>
          </div>

          <h3 className="mt-4 text-sm font-extrabold text-foreground">🛒 Lista escalada</h3>
          <ul className="mt-2 space-y-1 rounded-2xl bg-card p-3 kids-shadow">
            {picked.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center justify-between text-sm font-bold">
                <span><span className="text-2xl">{ing.emoji}</span> {ing.quantityLabel ?? ""}</span>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-extrabold">×{factor}{ing.grams ? ` (${ing.grams * factor} g)` : ""}{ing.quantity ? ` (${ing.quantity * factor} ud)` : ""}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-4 text-sm font-extrabold text-foreground">👥 Roles del grupo</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              { e: "🥄", n: "Mezclador" }, { e: "🎨", n: "Decorador" },
              { e: "🧽", n: "Limpiador" }, { e: "🤝", n: "Ayudante" },
            ].map((r) => (
              <div key={r.n} className="rounded-xl bg-card p-2 text-center text-xs font-extrabold kids-shadow">{r.e} {r.n}</div>
            ))}
          </div>

          <button type="button" onClick={() => { setStepIdx(0); setProjecting(true); }}
            className="mt-4 w-full rounded-2xl bg-kids-orange px-4 py-3 text-base font-extrabold kids-shadow">
            📽️ Vista proyectable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">🏫 Modo Escuela</h1>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow">✖️</button>
        </div>

        <section className="mb-3 space-y-2 rounded-2xl bg-card p-3 kids-shadow">
          <input value={cfg.className} onChange={(e) => setCfg({ ...cfg, className: e.target.value })} className="w-full rounded-xl bg-background px-3 py-2 text-base font-extrabold" />
          <div>
            <label className="block text-xs font-extrabold text-muted-foreground">Tamaño del grupo</label>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setCfg({ ...cfg, size: s })}
                  className={`flex-1 rounded-xl px-2 py-2 text-base font-extrabold kids-shadow ${cfg.size === s ? "bg-kids-yellow" : "bg-background"}`}>👥 {s}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={cfg.noNuts} onChange={(e) => setCfg({ ...cfg, noNuts: e.target.checked })} /> 🥜 Sin frutos secos</label>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={cfg.onlyNoCook} onChange={(e) => setCfg({ ...cfg, onlyNoCook: e.target.checked })} /> ❄️ Solo sin cocción</label>
          <label className="flex items-center gap-2 text-sm font-bold">
            🥕 Máx. ingredientes
            <input type="number" min={3} max={20} value={cfg.maxIngredients} onChange={(e) => setCfg({ ...cfg, maxIngredients: Number(e.target.value) || 8 })} className="w-16 rounded-lg bg-background px-2 py-1" />
          </label>
        </section>

        <h3 className="mb-2 text-sm font-extrabold text-foreground">Recetas para tu aula ({filtered.length})</h3>
        <ul className="grid grid-cols-2 gap-3">
          {filtered.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => setPicked(r)} className="flex w-full flex-col items-center gap-1 rounded-2xl bg-card p-2 kids-shadow">
                <img src={r.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <span className="line-clamp-2 text-center text-xs font-extrabold text-foreground">{getName(r)}</span>
                <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-extrabold">{r.ingredients.length} ing</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
