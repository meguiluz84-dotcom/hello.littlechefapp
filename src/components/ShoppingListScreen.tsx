import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import { useShoppingList } from "@/hooks/use-shopping-list";
import { useWeekPlan } from "@/hooks/use-week-plan";
import { getIngredientName } from "@/data/ingredientNames";

interface Props {
  recipes: Recipe[];
  favorites?: string[];
  onClose: () => void;
}

export default function ShoppingListScreen({ recipes, favorites = [], onClose }: Props) {
  const { items, addEmojis, toggle, remove, clear } = useShoppingList();
  const { plan } = useWeekPlan();

  // Auto-add ingredients from week plan on open
  useEffect(() => {
    const planRecipeIds = Object.values(plan).filter(Boolean) as string[];
    const emojis = new Set<string>();
    planRecipeIds.forEach((id) => {
      const r = recipes.find((x) => x.id === id);
      r?.ingredients.forEach((i) => emojis.add(i.emoji));
    });
    if (emojis.size) addEmojis(Array.from(emojis));
  }, [plan, recipes, addEmojis]);

  const addFromFavorites = () => {
    const emojis = new Set<string>();
    favorites.forEach((id) => {
      const r = recipes.find((x) => x.id === id);
      r?.ingredients.forEach((i) => emojis.add(i.emoji));
    });
    if (emojis.size) addEmojis(Array.from(emojis));
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">🛒 Lista de compra</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        {items.length === 0 ? (
          <p className="mt-12 text-center text-base font-bold text-muted-foreground">
            Aún no hay ingredientes. Añade recetas a tu plan semanal o marca favoritas.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((it, i) => (
              <motion.li
                key={it.emoji}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 rounded-2xl p-3 kids-shadow ${it.checked ? "bg-card opacity-60" : "bg-card"}`}
              >
                <button
                  type="button" onClick={() => toggle(it.emoji)}
                  aria-pressed={it.checked} aria-label={`${getIngredientName(it.emoji) ?? "ingrediente"}${it.checked ? " comprado" : ""}`}
                  className={`flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-xl text-3xl kids-shadow ${
                    it.checked ? "bg-accent/30 ring-2 ring-accent" : "bg-background"
                  }`}
                >{it.emoji}</button>
                <span className={`flex-1 text-base font-extrabold text-foreground ${it.checked ? "line-through" : ""}`}>
                  {getIngredientName(it.emoji) ?? it.emoji}
                </span>
                <button
                  type="button" onClick={() => remove(it.emoji)} aria-label="Quitar"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-xl kids-shadow"
                >🗑️</button>
              </motion.li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {favorites.length > 0 && (
            <button
              type="button" onClick={addFromFavorites}
              className="min-h-12 rounded-full bg-kids-pink px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
            >❤️ Añadir favoritos</button>
          )}
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => { if (confirm("¿Vaciar lista?")) clear(); }}
              className="min-h-12 rounded-full bg-card px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
            >🧹 Vaciar</button>
          )}
        </div>
      </div>
    </div>
  );
}
