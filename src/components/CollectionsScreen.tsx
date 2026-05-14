import { useState } from "react";
import type { Recipe } from "@/data/recipes";
import { useCollections, type FamilyCollection } from "@/hooks/use-collections";

interface Props {
  recipes: Recipe[];
  getName: (r: Recipe) => string;
  onPick: (r: Recipe) => void;
  onClose: () => void;
}

export default function CollectionsScreen({ recipes, getName, onPick, onClose }: Props) {
  const { items, create, update, remove, toggleRecipe } = useCollections();
  const [openId, setOpenId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [newName, setNewName] = useState("");
  const open = items.find((c) => c.id === openId) ?? null;

  if (open) {
    const inCol = recipes.filter((r) => open.recipeIds.includes(r.id));
    return (
      <div className="min-h-screen bg-background px-4 pb-10 pt-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => { setOpenId(null); setPicking(false); }} className="rounded-full bg-card px-3 py-2 text-sm font-extrabold kids-shadow">← Volver</button>
            <button type="button" onClick={() => { if (confirm("¿Borrar colección?")) { remove(open.id); setOpenId(null); } }} className="rounded-full bg-kids-red px-3 py-2 text-sm font-extrabold kids-shadow">🗑️</button>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <input value={open.emoji} onChange={(e) => update(open.id, { emoji: e.target.value.slice(0, 4) })} className="w-16 rounded-xl bg-card px-2 py-2 text-center text-3xl kids-shadow" />
            <input value={open.name} onChange={(e) => update(open.id, { name: e.target.value })} className="flex-1 rounded-xl bg-card px-3 py-2 text-base font-extrabold kids-shadow" />
          </div>
          <button type="button" onClick={() => setPicking((v) => !v)} className="mb-3 w-full rounded-2xl bg-kids-green px-4 py-2 text-sm font-extrabold kids-shadow">{picking ? "✖ Terminar de añadir" : "➕ Añadir/quitar recetas"}</button>

          {picking ? (
            <div className="grid grid-cols-3 gap-2">
              {recipes.map((r) => {
                const sel = open.recipeIds.includes(r.id);
                return (
                  <button key={r.id} type="button" onClick={() => toggleRecipe(open.id, r.id)}
                    className={`flex flex-col items-center gap-1 rounded-2xl p-2 kids-shadow ${sel ? "bg-kids-yellow ring-2 ring-foreground" : "bg-card"}`}>
                    <img src={r.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <span className="line-clamp-2 text-center text-[10px] font-extrabold text-foreground">{getName(r)}</span>
                  </button>
                );
              })}
            </div>
          ) : inCol.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Vacía. Toca «Añadir/quitar recetas».</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {inCol.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => onPick(r)} className="flex w-full flex-col items-center gap-1 rounded-2xl bg-card p-2 kids-shadow">
                    <img src={r.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                    <span className="line-clamp-2 text-center text-xs font-extrabold text-foreground">{getName(r)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">📚 Colecciones</h1>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow">✖️</button>
        </div>

        <div className="mb-4 flex gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre de la colección…" className="flex-1 rounded-xl bg-card px-3 py-2 text-sm font-bold kids-shadow" />
          <button type="button" onClick={() => { if (newName.trim()) { create(newName.trim()); setNewName(""); } }} className="rounded-xl bg-kids-green px-4 text-sm font-extrabold kids-shadow">+ Crear</button>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Crea tu primera colección (p. ej. «Fines de semana», «Cumpleaños»).</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {items.map((c: FamilyCollection) => (
              <li key={c.id}>
                <button type="button" onClick={() => setOpenId(c.id)} className="flex w-full flex-col items-center gap-1 rounded-2xl bg-card p-3 kids-shadow">
                  <span className="text-4xl">{c.emoji}</span>
                  <span className="text-balance text-center text-sm font-extrabold text-foreground">{c.name}</span>
                  <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-extrabold text-foreground">{c.recipeIds.length} ⭐</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
