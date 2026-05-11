import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { recipes } from "@/data/recipes";
import { getStepImage, subscribeStepImages } from "@/data/stepImages";
import { getIngredientName } from "@/data/ingredientNames";
import { getRecipeMeta, LEVEL_INFO } from "@/data/recipeMeta";
import { useEffect, useReducer } from "react";

export const Route = createFileRoute("/imprimir/$recipeId")({
  component: PrintRecipe,
  head: () => ({
    meta: [
      { title: "Imprimir receta — Little Chef" },
      { name: "description", content: "Ficha imprimible de la receta con imágenes grandes." },
    ],
  }),
});

function PrintRecipe() {
  const { recipeId } = useParams({ from: "/imprimir/$recipeId" });
  const recipe = recipes.find((r) => r.id === recipeId);
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => { const u = subscribeStepImages(force); return () => { u(); }; }, []);

  if (!recipe) {
    return (
      <main className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-extrabold">Receta no encontrada</h1>
        <Link to="/" className="text-primary underline">Volver al inicio</Link>
      </main>
    );
  }

  const meta = getRecipeMeta(recipe.id);
  const level = LEVEL_INFO[meta.level];

  return (
    <>
      <style>{`
        @page { size: A4; margin: 14mm; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-step { break-inside: avoid; page-break-inside: avoid; }
          .print-cover { page-break-after: always; }
        }
      `}</style>

      <div className="mx-auto max-w-3xl bg-white p-6 text-neutral-900 print:p-0">
        {/* Toolbar (screen only) */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 kids-shadow">
          <Link to="/" className="text-sm font-extrabold text-foreground">⬅️ Volver</Link>
          <div className="flex gap-2">
            <button
              type="button" onClick={() => window.print()}
              className="min-h-12 rounded-full bg-accent px-5 py-2 text-base font-extrabold text-accent-foreground kids-shadow"
            >🖨️ Imprimir / Guardar PDF</button>
          </div>
        </div>

        {/* Cover */}
        <header className="print-cover mb-8 text-center">
          <h1 className="mb-3 text-4xl font-extrabold leading-tight">{recipe.name}</h1>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold">
            <span>{level.emoji}</span><span>Autonomía: {level.label}</span>
          </div>
          <img
            src={recipe.image}
            alt=""
            className="mx-auto h-[260px] w-full max-w-md rounded-3xl object-cover shadow-lg print:shadow-none"
          />

          <section className="mt-8 text-left">
            <h2 className="mb-3 text-2xl font-extrabold">🧺 Ingredientes</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 rounded-2xl border-2 border-neutral-200 p-3">
                  <span className="text-4xl" aria-hidden>{ing.emoji}</span>
                  <div className="flex-1">
                    <div className="text-base font-extrabold leading-tight">
                      {getIngredientName(ing.emoji) ?? "Ingrediente"}
                    </div>
                    <div className="text-xs font-bold text-neutral-500">
                      {ing.quantity ? `×${ing.quantity}` : ""}{ing.quantity && ing.grams ? " · " : ""}{ing.grams ? `${ing.grams} g` : ""}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </header>

        {/* Steps */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold">👨‍🍳 Pasos</h2>
          <ol className="space-y-6">
            {recipe.steps.map((s, i) => {
              const img = getStepImage(recipe.id, i);
              return (
                <li key={i} className="print-step grid grid-cols-[80px_1fr] items-start gap-4 rounded-3xl border-2 border-neutral-200 p-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-3xl font-extrabold">
                    {i + 1}
                  </div>
                  <div>
                    {img ? (
                      <img src={img} alt="" className="mb-3 h-56 w-full rounded-2xl object-cover" />
                    ) : (
                      <div className="mb-3 flex h-56 w-full items-center justify-center rounded-2xl bg-neutral-100 text-7xl">
                        {s.emoji}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-2xl">
                      <span className="text-3xl">{s.emoji}</span>
                      {s.ingredientEmojis.map((e, j) => (
                        <span key={j} className="rounded-xl bg-neutral-100 px-2 py-1">{e}</span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="mt-10 text-center text-xs font-bold text-neutral-400">
          Little Chef · Receta visual para niños
        </footer>
      </div>
    </>
  );
}
