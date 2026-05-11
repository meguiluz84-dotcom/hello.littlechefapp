import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recipes, categories, type Recipe, type RecipeCategory } from "@/data/recipes";
import { avatarById, type AvatarId } from "@/data/avatars";
import {
  getRecipeMeta,
  recipeAllowedForAge,
  recipeMatchesRestrictions,
  type FoodTag,
  type Restrictions,
} from "@/data/recipeMeta";
import RecipeOfTheDay from "./RecipeOfTheDay";
import CategoryFilters from "./CategoryFilters";
import EmptyState from "./EmptyState";
import DifficultyBadges from "./DifficultyBadges";
import ChallengeBanner from "./ChallengeBanner";
import { useLongPress } from "@/hooks/use-long-press";
import { useWeekPlan, todayKey } from "@/hooks/use-week-plan";
import type { AgeBucket } from "@/hooks/use-players";

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
  challengeRecipe: Recipe | null;
  onPickChallenge: (r: Recipe) => void;
  onOpenMedals: () => void;
  onOpenFavorites: () => void;
  onOpenWeekPlan: () => void;
  onOpenShopping: () => void;
  playerName: string;
}

export default function RecipeHome({
  onSelectRecipe, isCompleted, avatarId, onChangeAvatar, getRecipeName,
  restrictions, lastRecipeId, onOpenAdult, isFavorite,
  ageBucket, challengeRecipe, onPickChallenge,
  onOpenMedals, onOpenFavorites, onOpenWeekPlan, onOpenShopping, playerName,
}: RecipeHomeProps) {
  const avatar = avatarById(avatarId);
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(null);
  const [tag, setTag] = useState<FoodTag | null>(null);
  const { plan } = useWeekPlan();

  const allowed = useMemo(
    () => recipes.filter((r) => {
      const m = getRecipeMeta(r.id);
      return recipeAllowedForAge(m, ageBucket) && recipeMatchesRestrictions(m, restrictions);
    }),
    [restrictions, ageBucket]
  );

  const recipeOfDay = useMemo(() => {
    if (allowed.length === 0) return null;
    const day = Math.floor(Date.now() / 86400000);
    return allowed[day % allowed.length];
  }, [allowed]);

  const lastRecipe = useMemo(
    () => (lastRecipeId ? recipes.find((r) => r.id === lastRecipeId) ?? null : null),
    [lastRecipeId]
  );

  const todayMorning = plan[`${todayKey()}-desayuno`];
  const todaySnack = plan[`${todayKey()}-merienda`];
  const todayMorningRecipe = todayMorning ? recipes.find((r) => r.id === todayMorning) : null;
  const todaySnackRecipe = todaySnack ? recipes.find((r) => r.id === todaySnack) : null;

  const filteredByTag = useMemo(() => {
    if (!tag) return null;
    return allowed.filter((r) => getRecipeMeta(r.id).tags.includes(tag));
  }, [allowed, tag]);

  const filteredByCategory = useMemo(() => {
    if (!activeCategory) return null;
    return allowed.filter((r) => r.category === activeCategory);
  }, [allowed, activeCategory]);

  const completedCount = isCompleted ? allowed.filter((r) => isCompleted(r.id)).length : 0;
  const countByCategory = (cat: RecipeCategory) => allowed.filter((r) => r.category === cat).length;
  const completedByCategory = (cat: RecipeCategory) =>
    isCompleted ? allowed.filter((r) => r.category === cat && isCompleted(r.id)).length : 0;

  const activeCat = activeCategory ? categories.find((c) => c.id === activeCategory) : null;
  const longPress = useLongPress(onOpenAdult, 800);

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-6">
      {/* Header - avatar + name */}
      <div className="mb-3 flex items-center justify-center gap-3">
        <motion.button
          type="button"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onChangeAvatar}
          aria-label="Cambiar perfil"
          className={`relative flex h-24 w-24 items-center justify-center rounded-full ${avatar.color} kids-shadow-lg`}
        >
          <img src={avatar.image} alt={avatar.label} width={96} height={96} className="h-20 w-20 object-contain" />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-card text-base kids-shadow ring-2 ring-background">👥</span>
        </motion.button>
      </div>
      <p className="mb-3 text-center text-base font-extrabold text-foreground">¡Hola, {playerName}! 👋</p>

      {/* Stars + medals trophy counter */}
      <div className="mx-auto mb-4 flex w-fit items-center gap-2">
        {completedCount > 0 && (
          <motion.div
            {...longPress}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex cursor-pointer select-none items-center gap-2 rounded-full bg-kids-yellow px-4 py-2 kids-shadow"
            aria-label={`${completedCount} estrellas (mantén pulsado para padres)`}
          >
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-extrabold text-foreground">×{completedCount}</span>
          </motion.div>
        )}
        <button
          type="button" onClick={onOpenMedals} aria-label="Mis medallas"
          className="flex h-12 min-h-12 items-center gap-1 rounded-full bg-card px-3 text-xl kids-shadow"
        >🏅</button>
        <button
          type="button" onClick={onOpenFavorites} aria-label="Favoritos"
          className="flex h-12 min-h-12 items-center gap-1 rounded-full bg-card px-3 text-xl kids-shadow"
        >❤️</button>
      </div>

      <AnimatePresence mode="wait">
        {!activeCategory && !tag ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mx-auto max-w-xl"
          >
            {allowed.length === 0 && (
              <EmptyState
                emoji="🍳"
                message="No hay recetas con esas restricciones."
                cta={{ label: "Ajustes", onClick: onOpenAdult }}
              />
            )}

            {/* Today's plan */}
            {(todayMorningRecipe || todaySnackRecipe) && (
              <div className="mb-4 rounded-2xl bg-kids-blue/30 p-3 kids-shadow">
                <div className="mb-2 text-xs font-extrabold text-foreground">📅 Hoy toca</div>
                <div className="flex gap-2">
                  {todayMorningRecipe && (
                    <button
                      type="button" onClick={() => onSelectRecipe(todayMorningRecipe)}
                      className="flex flex-1 items-center gap-2 rounded-xl bg-card p-2 kids-shadow"
                    >
                      <span className="text-2xl">🥣</span>
                      <img src={todayMorningRecipe.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="flex-1 text-left text-xs font-extrabold text-foreground line-clamp-2">{getRecipeName(todayMorningRecipe)}</span>
                    </button>
                  )}
                  {todaySnackRecipe && (
                    <button
                      type="button" onClick={() => onSelectRecipe(todaySnackRecipe)}
                      className="flex flex-1 items-center gap-2 rounded-xl bg-card p-2 kids-shadow"
                    >
                      <span className="text-2xl">🍎</span>
                      <img src={todaySnackRecipe.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="flex-1 text-left text-xs font-extrabold text-foreground line-clamp-2">{getRecipeName(todaySnackRecipe)}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <ChallengeBanner
              recipe={challengeRecipe}
              displayName={challengeRecipe ? getRecipeName(challengeRecipe) : ""}
              onPick={onPickChallenge}
            />

            {recipeOfDay && (
              <RecipeOfTheDay
                recipe={recipeOfDay}
                displayName={getRecipeName(recipeOfDay)}
                onOpen={onSelectRecipe}
              />
            )}

            {lastRecipe && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectRecipe(lastRecipe)}
                className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-card p-3 kids-shadow"
                aria-label={`Continuar ${getRecipeName(lastRecipe)}`}
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                  <img src={lastRecipe.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col items-start text-left">
                  <span className="text-xs font-extrabold text-muted-foreground">▶️ Continuar</span>
                  <span className="text-base font-extrabold text-foreground line-clamp-2">{getRecipeName(lastRecipe)}</span>
                </div>
                <span className="text-3xl">➡️</span>
              </motion.button>
            )}

            <CategoryFilters active={tag} onChange={setTag} />

            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => {
                const total = countByCategory(cat.id);
                if (total === 0) return null;
                const done = completedByCategory(cat.id);
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.06, type: "spring", bounce: 0.4 }}
                    whileTap={{ scale: 0.95 }} whileHover={{ y: -4 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl ${colorMap[cat.color] ?? "bg-primary"} p-4 kids-shadow-lg`}
                  >
                    <span className="text-6xl">{cat.emoji}</span>
                    <span className="text-xl font-extrabold text-foreground">{cat.label}</span>
                    <span className="rounded-full bg-card/80 px-3 py-1 text-sm font-extrabold text-foreground">{done}/{total} ⭐</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Quick access bar */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button type="button" onClick={onOpenWeekPlan}
                className="flex min-h-16 flex-col items-center justify-center rounded-2xl bg-card kids-shadow">
                <span className="text-2xl">📅</span>
                <span className="text-xs font-extrabold text-foreground">Plan</span>
              </button>
              <button type="button" onClick={onOpenShopping}
                className="flex min-h-16 flex-col items-center justify-center rounded-2xl bg-card kids-shadow">
                <span className="text-2xl">🛒</span>
                <span className="text-xs font-extrabold text-foreground">Lista</span>
              </button>
              <button type="button" onClick={onOpenAdult}
                className="flex min-h-16 flex-col items-center justify-center rounded-2xl bg-card kids-shadow">
                <span className="text-2xl">⚙️</span>
                <span className="text-xs font-extrabold text-foreground">Padres</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="filtered"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="mx-auto max-w-xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => { setActiveCategory(null); setTag(null); }}
                aria-label="Volver"
                className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-2xl bg-card text-2xl kids-shadow"
              >⬅️</motion.button>
              <div className={`flex flex-1 items-center gap-2 rounded-2xl ${activeCat ? colorMap[activeCat.color] ?? "bg-primary" : "bg-primary"} px-4 py-3 kids-shadow`}>
                <span className="text-3xl">{activeCat?.emoji ?? "🔍"}</span>
                <span className="text-xl font-extrabold text-foreground">{activeCat?.label ?? (tag ? tag : "")}</span>
              </div>
            </div>

            {((filteredByCategory ?? filteredByTag) ?? []).length === 0 ? (
              <EmptyState emoji="🍽️" message="No hay recetas aquí todavía." />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {((filteredByCategory ?? filteredByTag) ?? []).map((recipe, i) => {
                  return (
                    <motion.button
                      key={recipe.id}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, type: "spring", bounce: 0.3 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onSelectRecipe(recipe)}
                      className="group flex flex-col items-center overflow-hidden rounded-3xl bg-card kids-shadow-lg"
                    >
                      <div className={`relative w-full overflow-hidden ${colorMap[recipe.color] ?? "bg-primary"} p-2`}>
                        <img src={recipe.image} alt="" className="aspect-square w-full rounded-2xl object-cover" loading="lazy" width={256} height={256} />
                        {isCompleted?.(recipe.id) && (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: -15 }}
                            transition={{ type: "spring", bounce: 0.6 }}
                            className="absolute -right-1 -top-1 flex h-12 w-12 items-center justify-center rounded-full bg-kids-yellow text-3xl kids-shadow-lg ring-4 ring-background"
                          >⭐</motion.div>
                        )}
                        {isFavorite(recipe.id) && (
                          <div className="absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-card text-xl kids-shadow">❤️</div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2 px-2 py-3">
                        <div className="text-balance text-center text-sm font-extrabold leading-tight text-foreground line-clamp-2">{getRecipeName(recipe)}</div>
                        <DifficultyBadges recipe={recipe} size="sm" compact />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
