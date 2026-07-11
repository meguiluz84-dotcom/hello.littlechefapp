import AmbientBackground from "./AmbientBackground";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/data/recipes";
import {
  getRecipeMeta,
  recipeMatchesRestrictions,
  recipeAllowedForAge,
  type Restrictions,
} from "@/data/recipeMeta";
import { recipeIsNoCook } from "@/hooks/use-no-cook";
import { useShoppingList } from "@/hooks/use-shopping-list";
import { usePlayers } from "@/hooks/use-players";
import { getIngredientName } from "@/data/ingredientNames";
import DinoBubble from "./DinoBubble";
import EmptyState from "./EmptyState";

interface Props {
  recipes: Recipe[];
  restrictions: Restrictions;
  getName: (r: Recipe) => string;
  isFavorite?: (id: string) => boolean;
  onPick: (r: Recipe) => void;
  onClose: () => void;
}

interface ChipDef {
  emoji: string;
  label: string;
  group: "fruta" | "lacteo" | "panaderia" | "cereal" | "verdura" | "proteina" | "legumbre";
}

// Selector visual de ingredientes "tipo casa".
const CHIPS: ChipDef[] = [
  { emoji: "🍌", label: "Plátano",    group: "fruta" },
  { emoji: "🍎", label: "Manzana",    group: "fruta" },
  { emoji: "🍓", label: "Fresas",     group: "fruta" },
  { emoji: "🥛", label: "Yogur",      group: "lacteo" },
  { emoji: "🧀", label: "Queso",      group: "lacteo" },
  { emoji: "🥚", label: "Huevo",      group: "proteina" },
  { emoji: "🍞", label: "Pan",        group: "panaderia" },
  { emoji: "🫓", label: "Tortilla",   group: "panaderia" },
  { emoji: "🍚", label: "Arroz",      group: "cereal" },
  { emoji: "🌾", label: "Avena",      group: "cereal" },
  { emoji: "🥒", label: "Pepino",     group: "verdura" },
  { emoji: "🥕", label: "Zanahoria",  group: "verdura" },
  { emoji: "🍅", label: "Tomate",     group: "verdura" },
  { emoji: "🌽", label: "Maíz",       group: "verdura" },
  { emoji: "🫘", label: "Garbanzos",  group: "legumbre" },
  { emoji: "🟠", label: "Lentejas",   group: "legumbre" },
  { emoji: "🥣", label: "Hummus",     group: "legumbre" },
];

// Sustituciones simples mostradas al adulto.
const SWAPS: { from: string; label: string; to: string[] }[] = [
  { from: "🥛", label: "Yogur",  to: ["Yogur vegetal", "Queso crema"] },
  { from: "🍞", label: "Pan",    to: ["Tortilla 🫓", "Pita"] },
  { from: "🥚", label: "Huevo",  to: ["Plátano 🍌", "Lino hidratado 🌱"] },
  { from: "🧀", label: "Queso",  to: ["Queso vegetal", "Hummus 🥣"] },
  { from: "🥜", label: "Frutos secos", to: ["Tahini ⚪", "Semillas 🌻"] },
];

const RECENT_KEY = (pid: string) => `lc:p:${pid}:cook-recent`;

export default function CookWhatIHave({
  recipes, restrictions, getName, isFavorite, onPick, onClose,
}: Props) {
  const { active } = usePlayers();
  const pid = active?.id ?? "anon";
  const ageBucket = active?.age ?? "4-5";
  const shopping = useShoppingList();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [recent, setRecent] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const [showSwaps, setShowSwaps] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Carga ingredientes recientes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY(pid));
      setRecent(raw ? JSON.parse(raw) : []);
    } catch { setRecent([]); }
  }, [pid]);

  const toggle = (e: string) => {
    setSearched(false);
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(e) ? next.delete(e) : next.add(e);
      return next;
    });
  };

  const persistRecent = (emojis: string[]) => {
    const merged = Array.from(new Set([...emojis, ...recent])).slice(0, 12);
    setRecent(merged);
    try { localStorage.setItem(RECENT_KEY(pid), JSON.stringify(merged)); } catch { /* ignore */ }
  };

  const handleSearch = () => {
    if (selected.size === 0) return;
    persistRecent(Array.from(selected));
    setSearched(true);
  };

  // Filtra por alergias + edad
  const safeRecipes = useMemo(
    () => recipes.filter((r) => {
      const m = getRecipeMeta(r.id);
      return recipeMatchesRestrictions(m, restrictions) && recipeAllowedForAge(m, ageBucket);
    }),
    [recipes, restrictions, ageBucket]
  );

  const results = useMemo(() => {
    if (!searched || selected.size === 0) return null;
    const scored = safeRecipes.map((r) => {
      const emojis = Array.from(new Set(r.ingredients.map((i) => i.emoji)));
      const have = emojis.filter((e) => selected.has(e));
      const missing = emojis.filter((e) => !selected.has(e));
      const m = getRecipeMeta(r.id);
      // Prioriza nivel recomendado del niño
      const levelMatch =
        (ageBucket === "2-3" && m.level === 1) ||
        (ageBucket === "4-5" && m.level <= 2) ||
        (ageBucket === "6+"  && m.level <= 4);
      return {
        recipe: r,
        have: have.length,
        total: emojis.length,
        missing,
        meta: m,
        levelBoost: levelMatch ? 1 : 0,
      };
    }).filter((x) => x.have > 0);

    const sortFn = (a: typeof scored[number], b: typeof scored[number]) =>
      (b.have / Math.max(b.total, 1)) - (a.have / Math.max(a.total, 1))
      || b.levelBoost - a.levelBoost
      || a.missing.length - b.missing.length;

    const now = scored.filter((x) => x.missing.length === 0).sort(sortFn);
    const oneMissing = scored.filter((x) => x.missing.length === 1).sort(sortFn);
    const several = scored.filter((x) => x.missing.length >= 2).sort(sortFn).slice(0, 8);

    return { now, oneMissing, several };
  }, [safeRecipes, selected, searched, ageBucket]);

  const addToShopping = (emojis: string[]) => {
    if (emojis.length === 0) return;
    shopping.addEmojis(emojis);
    setToast(`Añadido a la lista de compra (${emojis.length})`);
    window.setTimeout(() => setToast(null), 1800);
  };

  const renderBadges = (r: Recipe) => {
    const m = getRecipeMeta(r.id);
    const noCook = recipeIsNoCook(r);
    const fav = isFavorite?.(r.id) ?? false;
    const adult = m.adultHelp === "high";
    const quick = m.level <= 2;
    const badges: { emoji: string; label: string; cls: string }[] = [];
    if (noCook)  badges.push({ emoji: "❄️", label: "Sin cocción", cls: "bg-kids-blue/60" });
    if (fav)     badges.push({ emoji: "❤️", label: "Favorita",   cls: "bg-kids-pink/60" });
    if (adult)   badges.push({ emoji: "👩‍🍳", label: "Adulto",     cls: "bg-kids-orange/60" });
    if (quick)   badges.push({ emoji: "⚡", label: "Rápida",     cls: "bg-kids-yellow/70" });
    return (
      <div className="mt-1 flex flex-wrap gap-1">
        {badges.map((b) => (
          <span key={b.label}
            className={`inline-flex items-center gap-0.5 rounded-full ${b.cls} px-2 py-0.5 text-[10px] font-extrabold text-foreground`}>
            <span>{b.emoji}</span><span>{b.label}</span>
          </span>
        ))}
      </div>
    );
  };

  const renderRecipeCard = (
    item: { recipe: Recipe; have: number; total: number; missing: string[] },
    tone: "green" | "yellow" | "orange",
  ) => {
    const toneRing = tone === "green" ? "ring-kids-green" : tone === "yellow" ? "ring-kids-yellow" : "ring-kids-orange";
    return (
      <li key={item.recipe.id}>
        <div className={`flex w-full items-stretch gap-3 rounded-2xl bg-card p-3 kids-shadow ring-2 ${toneRing}`}>
          <button
            type="button" onClick={() => onPick(item.recipe)}
            className="flex flex-1 items-center gap-3 text-left"
            aria-label={`Abrir ${getName(item.recipe)}`}
          >
            <img src={item.recipe.image} alt="" loading="lazy"
              className="h-20 w-20 shrink-0 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="text-sm font-extrabold text-foreground line-clamp-2">{getName(item.recipe)}</div>
              <div className="mt-0.5 text-[11px] font-bold text-muted-foreground">
                Tienes {item.have}/{item.total} ingredientes
              </div>
              {item.missing.length > 0 && (
                <div className="mt-1 text-lg leading-tight">
                  Te falta: {item.missing.slice(0, 6).join(" ")}
                </div>
              )}
              {renderBadges(item.recipe)}
            </div>
          </button>
          {item.missing.length > 0 && (
            <button
              type="button" onClick={() => addToShopping(item.missing)}
              aria-label="Añadir a la lista de compra"
              className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full bg-kids-green text-2xl kids-shadow"
              title="Añadir a la lista de compra"
            >🛒</button>
          )}
        </div>
      </li>
    );
  };

  const totalResults =
    (results?.now.length ?? 0) + (results?.oneMissing.length ?? 0) + (results?.several.length ?? 0);

  return (
    <div className="relative overflow-hidden min-h-screen bg-background px-4 pb-28 pt-6">
      <AmbientBackground />
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold text-foreground">🧑‍🍳 Cocinar con lo que tengo</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        <p className="mb-3 text-sm font-bold text-muted-foreground">
          Marca los ingredientes que tienes en casa y te sugerimos recetas seguras para tu peque.
        </p>

        {/* Recientes */}
        {recent.length > 0 && (
          <div className="mb-3 rounded-2xl bg-kids-yellow/30 p-2 kids-shadow">
            <div className="mb-1 text-[11px] font-extrabold text-foreground">⏱️ Usados hace poco</div>
            <div className="flex flex-wrap gap-1.5">
              {recent.map((e) => {
                const on = selected.has(e);
                return (
                  <button
                    key={`r-${e}`} type="button" onClick={() => toggle(e)} aria-pressed={on}
                    className={`flex min-h-10 items-center gap-1 rounded-full px-2 py-1 text-base kids-shadow ${
                      on ? "bg-accent/40 ring-2 ring-accent" : "bg-card"
                    }`}
                  >
                    <span>{e}</span>
                    <span className="text-[11px] font-extrabold text-foreground">
                      {getIngredientName(e) ?? ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selector visual */}
        <div className="mb-3 grid grid-cols-4 gap-2 rounded-2xl bg-card p-3 kids-shadow">
          {CHIPS.map((c) => {
            const on = selected.has(c.emoji);
            return (
              <motion.button
                key={c.emoji} type="button" whileTap={{ scale: 0.9 }}
                onClick={() => toggle(c.emoji)}
                aria-pressed={on} aria-label={`${c.label}${on ? " marcado" : ""}`}
                className={`flex min-h-20 flex-col items-center justify-center gap-0.5 rounded-2xl p-1 kids-shadow ${
                  on ? "bg-kids-green/50 ring-4 ring-kids-green" : "bg-background"
                }`}
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="text-[10px] font-extrabold leading-tight text-foreground line-clamp-1">{c.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Botón buscar */}
        <div className="sticky bottom-20 z-10 mb-3 flex justify-center">
          <button
            type="button" onClick={handleSearch} disabled={selected.size === 0}
            className={`flex min-h-14 items-center gap-2 rounded-full px-6 py-3 text-base font-extrabold kids-shadow-lg transition-transform active:scale-95 ${
              selected.size === 0
                ? "bg-card text-muted-foreground opacity-60"
                : "bg-kids-green text-foreground ring-4 ring-kids-yellow"
            }`}
            aria-label="Buscar recetas"
          >
            🔎 Buscar recetas {selected.size > 0 && <span className="rounded-full bg-card px-2 py-0.5 text-xs">{selected.size}</span>}
          </button>
        </div>

        {/* Sustituciones */}
        <button
          type="button" onClick={() => setShowSwaps((v) => !v)}
          className="mb-3 flex w-full items-center justify-between rounded-2xl bg-kids-purple/30 px-3 py-2 text-sm font-extrabold text-foreground kids-shadow"
          aria-expanded={showSwaps}
        >
          <span>🔄 Sustituciones rápidas</span>
          <span>{showSwaps ? "▲" : "▼"}</span>
        </button>
        <AnimatePresence initial={false}>
          {showSwaps && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mb-3 space-y-1 overflow-hidden"
            >
              {SWAPS.map((s) => (
                <li key={s.from} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-xs font-bold kids-shadow">
                  <span className="text-xl">{s.from}</span>
                  <span className="font-extrabold text-foreground">{s.label}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-foreground">{s.to.join(" · ")}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Resultados */}
        {searched && results && (
          <div className="space-y-5">
            {totalResults === 0 ? (
              <EmptyState
                emoji="🦕"
                tone="purple"
                message="¡Ups! No encuentro recetas"
                hint="Prueba a marcar más ingredientes o mira las sustituciones."
                cta={{ label: "Ver sustituciones", onClick: () => setShowSwaps(true) }}
                secondaryCta={{ label: "Cambiar ingredientes", onClick: () => setSearched(false) }}
              />
            ) : (
              <>
                {results.now.length > 0 && (
                  <section>
                    <h2 className="mb-2 text-base font-extrabold text-foreground">✅ Puedes hacerla ahora</h2>
                    <ul className="space-y-2">{results.now.map((it) => renderRecipeCard(it, "green"))}</ul>
                  </section>
                )}
                {results.oneMissing.length > 0 && (
                  <section>
                    <h2 className="mb-2 text-base font-extrabold text-foreground">🟡 Te falta 1 ingrediente</h2>
                    <ul className="space-y-2">{results.oneMissing.map((it) => renderRecipeCard(it, "yellow"))}</ul>
                  </section>
                )}
                {results.several.length > 0 && (
                  <section>
                    <h2 className="mb-2 text-base font-extrabold text-foreground">🟠 Te faltan varios</h2>
                    <ul className="space-y-2">{results.several.map((it) => renderRecipeCard(it, "orange"))}</ul>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* Estado vacío inicial con dino */}
        {!searched && selected.size === 0 && (
          <div className="mt-4 flex justify-center">
            <DinoBubble
              emojis="🥕🍓"
              message="¡Hola! Marca lo que tengas en casa y te buscaré recetas."
              tone="green"
              size="md"
            />
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="fixed inset-x-0 bottom-6 z-30 mx-auto w-fit max-w-[90%] rounded-full bg-kids-green px-5 py-3 text-sm font-extrabold text-foreground kids-shadow-lg"
          >🛒 {toast}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
