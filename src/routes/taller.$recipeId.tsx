import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useReducer, useState, useCallback } from "react";
import { recipes } from "@/data/recipes";
import { getStepImage, subscribeStepImages } from "@/data/stepImages";
import { getIngredientName } from "@/data/ingredientNames";

export const Route = createFileRoute("/taller/$recipeId")({
  component: WorkshopMode,
  head: () => ({
    meta: [
      { title: "Modo taller — Little Chef" },
      { name: "description", content: "Cantidades por grupo y pasos proyectables para clases y talleres." },
    ],
  }),
});

function WorkshopMode() {
  const { recipeId } = useParams({ from: "/taller/$recipeId" });
  const recipe = recipes.find((r) => r.id === recipeId);
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => { const u = subscribeStepImages(force); return () => { u(); }; }, []);

  const [groupSize, setGroupSize] = useState(8);
  const [view, setView] = useState<"setup" | "project">("setup");
  const [step, setStep] = useState(0);

  const next = useCallback(() => setStep((s) => Math.min((recipe?.steps.length ?? 1) - 1, s + 1)), [recipe]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    if (view !== "project") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setView("setup");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, next, prev]);

  if (!recipe) {
    return (
      <main className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Receta no encontrada</h1>
        <Link to="/" className="text-primary underline">Volver al inicio</Link>
      </main>
    );
  }

  const baseChildren = 1;
  const factor = Math.max(1, groupSize) / baseChildren;

  if (view === "project") {
    const s = recipe.steps[step];
    const img = getStepImage(recipe.id, step);
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="flex items-center justify-between border-b border-muted px-6 py-3">
          <div className="text-sm font-extrabold text-muted-foreground">
            Paso {step + 1} / {recipe.steps.length} · {recipe.name}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView("setup")} className="min-h-10 rounded-full bg-card px-4 text-sm font-extrabold text-foreground kids-shadow">⬅️ Salir</button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {img ? (
              <img src={img} alt="" className="aspect-square w-full rounded-3xl object-cover kids-shadow-lg" />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-card text-[20vw] kids-shadow-lg">
                {s.emoji}
              </div>
            )}
            <div className="space-y-6 text-center">
              <div className="text-[10vw] font-extrabold leading-none text-foreground lg:text-[8rem]">
                {step + 1}
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-[5vw] lg:text-7xl">
                <span>{s.emoji}</span>
                {s.ingredientEmojis.map((e, i) => <span key={i}>{e}</span>)}
              </div>
              <div className="text-2xl font-extrabold uppercase tracking-widest text-muted-foreground">
                {s.actionIcon}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-muted px-8 py-4">
          <button onClick={prev} disabled={step === 0}
            className="flex h-16 min-h-12 items-center gap-2 rounded-full bg-card px-6 text-2xl font-extrabold text-foreground kids-shadow disabled:opacity-40">
            ⬅️ Anterior
          </button>
          <div className="text-xs font-bold text-muted-foreground">
            ← / → / Espacio para navegar · Esc para salir
          </div>
          <button onClick={next} disabled={step >= recipe.steps.length - 1}
            className="flex h-16 min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-2xl font-extrabold text-accent-foreground kids-shadow disabled:opacity-40">
            Siguiente ➡️
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="min-h-12 rounded-full bg-card px-4 py-2 text-sm font-extrabold text-foreground kids-shadow">⬅️ Inicio</Link>
        <h1 className="text-xl font-extrabold text-foreground">🏫 Modo taller</h1>
        <div className="w-12" />
      </div>

      <header className="mb-4 flex items-center gap-3 rounded-3xl bg-card p-4 kids-shadow">
        <img src={recipe.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-foreground">{recipe.name}</h2>
          <p className="text-xs font-bold text-muted-foreground">{recipe.steps.length} pasos · {recipe.ingredients.length} ingredientes</p>
        </div>
      </header>

      <section className="mb-4 rounded-3xl bg-card p-4 kids-shadow">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-extrabold text-foreground">👥 Tamaño del grupo</div>
          <div className="text-2xl font-extrabold text-foreground">{groupSize}</div>
        </div>
        <input
          type="range" min={1} max={30} value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
          className="w-full"
          aria-label="Número de niños"
        />
        <div className="mt-1 flex justify-between text-[11px] font-bold text-muted-foreground">
          <span>1</span><span>30</span>
        </div>
      </section>

      <section className="mb-4 rounded-3xl bg-card p-4 kids-shadow">
        <h3 className="mb-3 text-sm font-extrabold text-foreground">🧺 Cantidades para {groupSize} niños</h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {recipe.ingredients.map((ing, i) => {
            const qty = ing.quantity ? Math.ceil(ing.quantity * factor) : null;
            const grams = ing.grams ? Math.ceil(ing.grams * factor) : null;
            return (
              <li key={i} className="flex items-center gap-2 rounded-2xl bg-background p-2">
                <span className="text-3xl" aria-hidden>{ing.emoji}</span>
                <div className="flex-1">
                  <div className="text-xs font-extrabold leading-tight text-foreground">
                    {getIngredientName(ing.emoji) ?? ""}
                  </div>
                  <div className="text-[11px] font-bold text-muted-foreground">
                    {qty ? `×${qty}` : ""}{qty && grams ? " · " : ""}{grams ? `${grams} g` : ""}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button" onClick={() => { setStep(0); setView("project"); }}
          className="min-h-16 rounded-3xl bg-accent px-4 text-base font-extrabold text-accent-foreground kids-shadow"
        >📽️ Pasos proyectables</button>
        <Link
          to="/imprimir/$recipeId" params={{ recipeId: recipe.id }}
          className="flex min-h-16 items-center justify-center rounded-3xl bg-card px-4 text-base font-extrabold text-foreground kids-shadow"
        >🖨️ Ficha PDF</Link>
      </div>
    </main>
  );
}
