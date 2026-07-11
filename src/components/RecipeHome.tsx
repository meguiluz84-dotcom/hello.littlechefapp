import AmbientBackground from "./AmbientBackground";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recipes, categories, type Recipe, type RecipeCategory } from "@/data/recipes";
import { avatarById, type AvatarId } from "@/data/avatars";
import {
  getRecipeMeta,
  recipeAllowedForAge,
  recipeMatchesRestrictions,
  type Restrictions,
} from "@/data/recipeMeta";
import EmptyState from "./EmptyState";
import ChefMascot from "./ChefMascot";
import LivelyFood, { effectForEmoji } from "./LivelyFood";
import { useLongPress } from "@/hooks/use-long-press";
import type { AgeBucket } from "@/hooks/use-players";
import type { RecipePack } from "@/data/recipePacks";

const colorMap: Record<string, string> = {
  "kids-pink": "bg-kids-pink",
  "kids-blue": "bg-kids-blue",
  "kids-green": "bg-kids-green",
  "kids-orange": "bg-kids-orange",
  "kids-purple": "bg-kids-purple",
  "kids-yellow": "bg-kids-yellow",
  "kids-red": "bg-kids-red",
  "kids-teal": "bg-kids-teal",
};

interface RecipeHomeProps {
  onSelectRecipe: (recipe: Recipe) => void;
  isCompleted?: (id: string) => boolean;
  avatarId: AvatarId;
  onChangeAvatar: () => void;
  getRecipeName: (recipe: Recipe) => string;
  restrictions: Restrictions;
  lastRecipeId: string | null;
  onOpenAdult: () => void;
  isFavorite: (id: string) => boolean;
  ageBucket: AgeBucket;
  // Props mantenidas por compatibilidad con index.tsx (no se usan en la home simplificada).
  challengeRecipe?: Recipe | null;
  onPickChallenge?: (r: Recipe) => void;
  onOpenMedals?: () => void;
  onOpenFavorites?: () => void;
  onOpenWeekPlan?: () => void;
  onOpenShopping?: () => void;
  onOpenPantry?: () => void;
  onOpenCookWhat?: () => void;
  onOpenMissions?: () => void;
  onOpenPack?: (pack: RecipePack) => void;
  extraRecipes?: Recipe[];
  playerName: string;
}

export default function RecipeHome({
  onSelectRecipe, isCompleted, avatarId, onChangeAvatar, getRecipeName,
  restrictions, lastRecipeId, onOpenAdult, isFavorite,
  ageBucket, extraRecipes,
}: RecipeHomeProps) {
  const avatar = avatarById(avatarId);
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(null);
  const longPress = useLongPress(onOpenAdult, 800);

  const allowed = useMemo(
    () => [...recipes, ...(extraRecipes ?? [])].filter((r) => {
      const m = getRecipeMeta(r.id);
      return recipeAllowedForAge(m, ageBucket) && recipeMatchesRestrictions(m, restrictions);
    }),
    [restrictions, ageBucket, extraRecipes]
  );

  const lastRecipe = useMemo(
    () => (lastRecipeId ? allowed.find((r) => r.id === lastRecipeId) ?? null : null),
    [lastRecipeId, allowed]
  );

  const visibleCategories = categories.filter(
    (cat) => allowed.some((r) => r.category === cat.id),
  );

  const recipesInCategory = activeCategory
    ? allowed.filter((r) => r.category === activeCategory)
    : [];

  const activeCat = activeCategory ? categories.find((c) => c.id === activeCategory) : null;

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-warm px-5 pb-28 pt-6">
      <AmbientBackground />
      {/* Encabezado mínimo: mascota + avatar */}
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <ChefMascot mood="greet" size={104} />
        <motion.button
          type="button"
          {...longPress}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onChangeAvatar}
          aria-label="Mi chef (mantén pulsado para padres)"
          className={`mt-1 flex h-16 w-16 items-center justify-center rounded-full ${avatar.color} kids-shadow-lg ring-4 ring-background`}
        >
          <img src={avatar.image} alt="" width={64} height={64} className="h-12 w-12 object-contain" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {!activeCategory ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mx-auto mt-6 w-full max-w-md"
          >
            {allowed.length === 0 ? (
              <EmptyState
                emoji="🍳"
                tone="orange"
                message="Hoy no hay recetas"
                hint="Pide a un adulto que revise los filtros."
                cta={{ label: "Ajustes", onClick: onOpenAdult }}
              />
            ) : (
              <>
                {lastRecipe && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelectRecipe(lastRecipe)}
                    className="kids-press mb-5 flex w-full items-center gap-4 rounded-[2rem] bg-card p-3 kids-shadow-lg"
                    aria-label={`Seguir con ${getRecipeName(lastRecipe)}`}
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl">
                      <img src={lastRecipe.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="flex-1 text-left text-2xl font-extrabold text-foreground">
                      ▶️ Seguir
                    </span>
                    <span className="pr-2 text-4xl">➡️</span>
                  </motion.button>
                )}

                {/* Una sola palabra por categoría: icono enorme + 1 palabra */}
                <div className="grid grid-cols-2 gap-5">
                  {visibleCategories.map((cat, i) => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.85, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.06, type: "spring", bounce: 0.45 }}
                      whileTap={{ scale: 0.94 }}
                      whileHover={{ y: -4 }}
                      onClick={() => setActiveCategory(cat.id)}
                      aria-label={cat.label}
                      className={`kids-press relative flex min-h-[160px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[2.25rem] ${colorMap[cat.color] ?? "bg-primary"} p-4 ring-4 ring-background`}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-4 top-2 h-6 rounded-full bg-white/35 blur-md"
                      />
                      <LivelyFood
                        effect={effectForEmoji(cat.emoji)}
                        size={88}
                        className="relative z-10"
                        ariaLabel={cat.label}
                      >
                        {cat.emoji}
                      </LivelyFood>
                      <span className="relative z-10 text-2xl font-extrabold text-foreground">
                        {cat.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="filtered"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="mx-auto mt-6 w-full max-w-md"
          >
            <div className="mb-5 flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveCategory(null)}
                aria-label="Volver"
                className="kids-press flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-3xl bg-card text-3xl kids-shadow-lg"
              >⬅️</motion.button>
              <div className={`flex flex-1 items-center justify-center gap-3 rounded-3xl ${activeCat ? colorMap[activeCat.color] ?? "bg-primary" : "bg-primary"} px-4 py-4 kids-shadow-lg`}>
                <span className="text-4xl">{activeCat?.emoji}</span>
                <span className="text-2xl font-extrabold text-foreground">{activeCat?.label}</span>
              </div>
            </div>

            {recipesInCategory.length === 0 ? (
              <EmptyState
                emoji="🔍"
                tone="blue"
                message="Sin recetas aquí"
                cta={{ label: "Volver", onClick: () => setActiveCategory(null) }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-5">
                {recipesInCategory.map((recipe, i) => (
                  <motion.button
                    key={recipe.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onSelectRecipe(recipe)}
                    aria-label={getRecipeName(recipe)}
                    className="kids-press group flex flex-col items-center overflow-hidden rounded-[2rem] bg-card kids-shadow-lg ring-4 ring-background"
                  >
                    <div className={`relative w-full overflow-hidden ${colorMap[recipe.color] ?? "bg-primary"} p-2`}>
                      <motion.img
                        src={recipe.image}
                        alt=""
                        className="aspect-square w-full rounded-3xl object-cover"
                        loading="lazy" width={256} height={256}
                        animate={{ y: [0, -3, 0], rotate: [0, -1.2, 1.2, 0], scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 3 + (i % 4) * 0.3, ease: "easeInOut" }}
                        whileTap={{ scale: 0.92, rotate: -4 }}
                      />
                      {/* Brillos flotando sobre la comida */}
                      <span aria-hidden className="pointer-events-none absolute inset-0">
                        {["✨", "⭐", "💫"].map((s, idx) => (
                          <motion.span
                            key={idx}
                            className="absolute text-lg"
                            style={{ top: `${15 + idx * 25}%`, left: `${20 + idx * 22}%` }}
                            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6], y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 + idx * 0.4, delay: idx * 0.5 + (i % 3) * 0.3 }}
                          >
                            {s}
                          </motion.span>
                        ))}
                      </span>
                      {isCompleted?.(recipe.id) && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: -15 }}
                          transition={{ type: "spring", bounce: 0.6 }}
                          className="absolute -right-1 -top-1 flex h-12 w-12 items-center justify-center rounded-full bg-kids-yellow text-3xl kids-shadow-lg ring-4 ring-background"
                          aria-hidden
                        >⭐</motion.div>
                      )}
                      {isFavorite(recipe.id) && (
                        <div className="absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-card text-xl kids-shadow" aria-hidden>❤️</div>
                      )}
                    </div>
                    <div className="flex flex-col items-center px-2 py-3">
                      <div className="text-balance text-center text-base font-extrabold leading-tight text-foreground line-clamp-2">
                        {getRecipeName(recipe)}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
