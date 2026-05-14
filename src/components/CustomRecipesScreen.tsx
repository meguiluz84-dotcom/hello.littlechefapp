import { useState } from "react";
import { useCustomRecipes, type CustomRecipe } from "@/hooks/use-custom-recipes";
import { emojiImage } from "@/lib/recipeImage";
import { LEVEL_INFO } from "@/data/recipeMeta";
import CustomRecipeEditor from "./CustomRecipeEditor";

interface Props { onClose: () => void; }

export default function CustomRecipesScreen({ onClose }: Props) {
  const { items, upsert, remove } = useCustomRecipes();
  const [editing, setEditing] = useState<CustomRecipe | "new" | null>(null);

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">📓 Mis recetas</h1>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow">✖️</button>
        </div>

        <button type="button" onClick={() => setEditing("new")}
          className="mb-4 w-full rounded-2xl bg-kids-green px-4 py-3 text-base font-extrabold kids-shadow">
          ➕ Nueva receta familiar
        </button>

        {items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Aún no hay recetas creadas. Toca «Nueva receta» para empezar.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 kids-shadow">
                <img src={emojiImage(c.emoji, c.id)} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {LEVEL_INFO[c.meta.level].emoji} {LEVEL_INFO[c.meta.level].label} · {c.ingredients.length} ing · {c.steps.length} pasos
                  </div>
                </div>
                <button type="button" onClick={() => setEditing(c)} className="rounded-full bg-background px-3 py-1 text-xs font-extrabold">✏️</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <CustomRecipeEditor
          initial={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSave={(r) => { upsert(r); setEditing(null); }}
          onDelete={editing !== "new" ? () => { remove(editing.id); setEditing(null); } : undefined}
        />
      )}
    </div>
  );
}
