import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { Recipe } from "@/data/recipes";
import { recipes as ALL_RECIPES } from "@/data/recipes";
import RecipeHome from "@/components/RecipeHome";
import KidsHome from "@/components/KidsHome";
import PlayScreen from "@/components/PlayScreen";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeStepper from "@/components/RecipeStepper";
import HomeButton from "@/components/HomeButton";
import SplashScreen from "@/components/SplashScreen";
import AvatarPicker from "@/components/AvatarPicker";
import Onboarding from "@/components/Onboarding";
import ParentDashboard from "@/components/ParentDashboard";
import PlayerPicker from "@/components/PlayerPicker";
import MedalsScreen from "@/components/MedalsScreen";
import FavoritesScreen from "@/components/FavoritesScreen";
import WeekPlanScreen from "@/components/WeekPlanScreen";
import ShoppingListScreen from "@/components/ShoppingListScreen";
import PantryScreen from "@/components/PantryScreen";
import MissionsScreen from "@/components/MissionsScreen";
import PackScreen from "@/components/PackScreen";
import BottomNav, { type NavTab } from "@/components/BottomNav";
import CustomRecipesScreen from "@/components/CustomRecipesScreen";
import CollectionsScreen from "@/components/CollectionsScreen";
import CollectionScreen from "@/components/CollectionScreen";
import SurpriseChest from "@/components/SurpriseChest";
import { newlyUnlocked, type UnlockEvent } from "@/data/collectibles";
import CookWhatIHave from "@/components/CookWhatIHave";
import FreeKitchen from "@/components/FreeKitchen";
import SchoolMode from "@/components/SchoolMode";
import DailyRewardModal from "@/components/DailyRewardModal";
import { useDailyReward } from "@/hooks/use-daily-reward";
import { PACKS, type RecipePack } from "@/data/recipePacks";
import { useCustomRecipes, customToRecipe } from "@/hooks/use-custom-recipes";
import { useCompletedRecipes } from "@/hooks/use-completed-recipes";
import { useDiplomas } from "@/hooks/use-diplomas";
import CategoryDiploma from "@/components/CategoryDiploma";
import type { RecipeCategory } from "@/data/recipes";
import { usePreferences } from "@/hooks/use-preferences";
import { usePlayers } from "@/hooks/use-players";
import { useMedals } from "@/hooks/use-medals";
import { useMissions } from "@/hooks/use-missions";
import { useNoCook, recipeIsNoCook } from "@/hooks/use-no-cook";
import { useSkills } from "@/hooks/use-skills";
import { getRecipeName } from "@/data/recipeNames";
import { getRecipeMeta, recipeAllowedForAge, recipeMatchesRestrictions } from "@/data/recipeMeta";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Little Chef - Recetas Visuales para Niños" },
      { name: "description", content: "App de recetas visual para niños pequeños." },
    ],
  }),
});

type Screen =
  | "splash" | "kidshome" | "home" | "ingredients" | "cooking"
  | "play" | "medals" | "favorites" | "weekplan" | "shopping" | "pantry" | "missions" | "pack"
  | "custom" | "collections" | "collection" | "generator" | "school" | "free";

function Index() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedPack, setSelectedPack] = useState<RecipePack | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [adultOpen, setAdultOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [resumeFrom, setResumeFrom] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);
  const [newMedalId, setNewMedalId] = useState<string | null>(null);
  const [pendingDiploma, setPendingDiploma] = useState<RecipeCategory | null>(null);
  const [chestEvents, setChestEvents] = useState<UnlockEvent[]>([]);

  const players = usePlayers();
  const { markCompleted, isCompleted, completed, reset: resetCompleted } = useCompletedRecipes();
  const diplomas = useDiplomas();
  const prefs = usePreferences();
  const medals = useMedals();
  const missions = useMissions();
  const noCook = useNoCook();
  const skills = useSkills();
  const customRecipes = useCustomRecipes();
  const daily = useDailyReward();
  const earnedBeforeRef = medals.earned;

  const active = players.active;
  const needsOnboarding = players.hydrated && !active && !addingPlayer;

  // Combine built-in recipes with the family's custom ones.
  const allRecipes = useMemo<Recipe[]>(
    () => [...ALL_RECIPES, ...customRecipes.items.map(customToRecipe)],
    [customRecipes.items]
  );

  // Filter recipes for the active player (age + allergens + optional no-cook).
  const allowedRecipes = useMemo(() => {
    if (!active) return allRecipes;
    return allRecipes.filter((r) => {
      const m = getRecipeMeta(r.id);
      if (!recipeAllowedForAge(m, active.age)) return false;
      if (!recipeMatchesRestrictions(m, active.restrictions)) return false;
      if (noCook.enabled && !recipeIsNoCook(r)) return false;
      return true;
    });
  }, [active, noCook.enabled, allRecipes]);

  const challengeRecipe = useMemo(() => {
    if (!active || allowedRecipes.length === 0) return null;
    const day = Math.floor(Date.now() / 86400000);
    const seed = day + active.id.charCodeAt(2 % active.id.length);
    return allowedRecipes[seed % allowedRecipes.length];
  }, [active, allowedRecipes]);

  const handleSelectRecipe = (recipe: Recipe, asChallenge = false) => {
    setSelectedRecipe(recipe);
    setIsChallenge(asChallenge);
    prefs.setLastRecipe(recipe.id);
    setResumeFrom(0);
    setNewMedalId(null);
    setScreen("ingredients");
  };

  const handleBack = () => {
    if (screen === "cooking") setScreen("ingredients");
    else setScreen("home");
  };

  const handleStart = (fromStep = 0) => {
    setResumeFrom(fromStep);
    setScreen("cooking");
  };

  // Called the moment the recipe is finished — before navigating away.
  // Marks completion and figures out which medal (if any) was newly earned.
  const handleRecipeFinished = (recipe: Recipe, asChallenge: boolean) => {
    const alreadyDone = completed.includes(recipe.id);
    const prevStars = completed.length;
    const nextStars = alreadyDone ? prevStars : prevStars + 1;
    markCompleted(recipe.id);
    prefs.clearResume(recipe.id);
    missions.onCompleteRecipe();
    // Surprise chest: collectibles unlocked by the new ⭐ total.
    const unlocks = newlyUnlocked(prevStars, nextStars);
    if (unlocks.length > 0) setChestEvents(unlocks);
    skills.addRecipe(recipe, asChallenge);
    if (asChallenge) { medals.completeChallenge(recipe.id); missions.onChallenge(); }
    // Detect newly earned medal by re-running the rule with the next state.
    const completedNext = completed.includes(recipe.id) ? completed : [...completed, recipe.id];
    // Diploma: all recipes of this sector completed (within allowed for player) and not yet awarded.
    const sectorRecipes = allowedRecipes.filter((r) => r.category === recipe.category);
    const sectorDone = sectorRecipes.every((r) => completedNext.includes(r.id));
    if (sectorDone && sectorRecipes.length > 0 && !diplomas.has(recipe.category)) {
      setPendingDiploma(recipe.category);
    }
    const challengesNext = asChallenge ? medals.challengesDone + 1 : medals.challengesDone;
    import("@/data/medals").then(({ earnedMedalIds }) => {
      const after = earnedMedalIds({ completed: completedNext, challengesDone: challengesNext, recipes: ALL_RECIPES });
      const fresh = after.find((id) => !earnedBeforeRef.includes(id)) ?? null;
      setNewMedalId(fresh);
    });
  };

  const handleFinish = () => {
    setScreen("home");
    setSelectedRecipe(null);
    setIsChallenge(false);
    setNewMedalId(null);
  };

  const handleAnother = () => {
    // Pick a different allowed recipe at random.
    const pool = allowedRecipes.filter((r) => r.id !== selectedRecipe?.id);
    const next = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    setNewMedalId(null);
    if (next) handleSelectRecipe(next, false);
    else handleFinish();
  };

  const handleSplashStart = () => setScreen("kidshome");
  const nameFor = (r: Recipe) =>
    getRecipeName(active?.avatarId ?? "dino", r.id, r.name);

  if (screen === "splash") return <SplashScreen onStart={handleSplashStart} />;
  if (!players.hydrated) return <div className="min-h-screen bg-background" />;

  // Onboarding (first time or adding new player)
  if (needsOnboarding || addingPlayer) {
    return (
      <Onboarding
        initialAvatar={null}
        onComplete={(av, p, name, goal) => {
          const id = players.add({
            name, avatarId: av, age: p.age, restrictions: p.restrictions,
            ...(goal ? { goal } : {}),
          });
          players.setActive(id);
          setAddingPlayer(false);
        }}
      />
    );
  }

  // Player picker
  if (playersOpen) {
    return (
      <PlayerPicker
        players={players.players}
        activeId={players.activeId}
        onPick={(id) => { players.setActive(id); setPlayersOpen(false); }}
        onAdd={() => { setPlayersOpen(false); setAddingPlayer(true); }}
        onClose={() => setPlayersOpen(false)}
      />
    );
  }

  // Avatar picker (re-pick)
  if (pickerOpen && active) {
    return (
      <AvatarPicker
        currentId={active.avatarId}
        onSelect={(id) => { players.update(active.id, { avatarId: id }); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
        title="Cambia tu personaje"
      />
    );
  }

  if (adultOpen) {
    return (
      <ParentDashboard
        onClose={() => setAdultOpen(false)}
        onChangeAvatar={() => { setAdultOpen(false); setPickerOpen(true); }}
        onAddPlayer={() => { setAdultOpen(false); setAddingPlayer(true); }}
        onResetProgress={() => { resetCompleted(); }}
        onOpenWeekPlan={() => { setAdultOpen(false); setScreen("weekplan"); }}
        onOpenShopping={() => { setAdultOpen(false); setScreen("shopping"); }}
        onOpenComingSoon={() => { window.location.assign("/proximamente"); }}
        onOpenCustom={() => { setAdultOpen(false); setScreen("custom"); }}
        onOpenCollections={() => { setAdultOpen(false); setScreen("collections"); }}
        onOpenGenerator={() => { setAdultOpen(false); setScreen("generator"); }}
        onOpenSchool={() => { setAdultOpen(false); setScreen("school"); }}
        soundOn={prefs.soundOn}
        onToggleSound={prefs.setSoundOn}
      />
    );
  }

  const handleHome = () => { setSelectedRecipe(null); setSelectedPack(null); setScreen("kidshome"); };
  const handleCook = () => { setSelectedRecipe(null); setSelectedPack(null); setScreen("home"); };

  const handleNavTab = (tab: NavTab) => {
    if (tab === "home") handleCook();
    else if (tab === "play") setScreen("play");
    else if (tab === "awards") setScreen("medals");
  };

  const currentTab: NavTab =
    screen === "play" ? "play"
    : screen === "medals" ? "awards"
    : "home";

  const showBottomNav =
    screen !== "ingredients" && screen !== "cooking" && screen !== "kidshome";

  let content;
  if (screen === "kidshome") {
    content = (
      <KidsHome
        playerName={active?.name ?? "Chef"}
        avatarId={active?.avatarId ?? "dino"}
        starsCount={completed.length}
        dailyAvailable={daily.available}
        onClaimDaily={() => daily.claim()}
        onChangeAvatar={() => setPlayersOpen(true)}
        onOpenAdult={() => setAdultOpen(true)}
        onCook={handleCook}
        onPlay={() => setScreen("play")}
        onAwards={() => setScreen("medals")}
        onFree={() => setScreen("free")}
      />
    );
  } else if (screen === "play") {
    content = (
      <PlayScreen
        challengeRecipe={challengeRecipe}
        challengeName={challengeRecipe ? nameFor(challengeRecipe) : ""}
        onPickChallenge={(r) => handleSelectRecipe(r, true)}
        onClose={() => setScreen("kidshome")}
      />
    );
  } else if (screen === "medals") {
    content = (
      <MedalsScreen
        onClose={() => setScreen("kidshome")}
        onOpenCollection={() => setScreen("collection")}
      />
    );
  } else if (screen === "collection") {
    content = (
      <CollectionScreen
        stars={completed.length}
        onClose={() => setScreen("medals")}
      />
    );
  } else if (screen === "favorites") {
    content = (
      <FavoritesScreen
        recipes={allowedRecipes}
        favorites={prefs.favorites}
        onPick={(r) => handleSelectRecipe(r)}
        onClose={() => setScreen("home")}
        getName={nameFor}
      />
    );
  } else if (screen === "weekplan") {
    content = (
      <WeekPlanScreen
        recipes={allowedRecipes}
        getName={nameFor}
        onClose={() => setScreen("home")}
      />
    );
  } else if (screen === "shopping") {
    content = (
      <ShoppingListScreen
        recipes={allRecipes}
        favorites={prefs.favorites}
        onClose={() => setScreen("home")}
      />
    );
  } else if (screen === "pantry") {
    content = (
      <PantryScreen
        recipes={allowedRecipes}
        getName={nameFor}
        onPick={(r) => handleSelectRecipe(r)}
        onClose={() => setScreen("home")}
      />
    );
  } else if (screen === "missions") {
    content = <MissionsScreen onClose={() => setScreen("home")} />;
  } else if (screen === "pack") {
    if (selectedPack) {
      content = (
        <PackScreen
          pack={selectedPack}
          allowed={allowedRecipes}
          isCompleted={isCompleted}
          isFavorite={prefs.isFavorite}
          onPick={(r) => handleSelectRecipe(r)}
          onClose={() => setSelectedPack(null)}
          getName={nameFor}
        />
      );
    } else {
      // Pack picker grid
      content = (
        <div className="min-h-screen bg-background px-4 pb-24 pt-6">
          <div className="mx-auto w-full max-w-xl">
            <h1 className="mb-4 text-center text-2xl font-extrabold text-foreground">📦 Packs de recetas</h1>
            <div className="grid grid-cols-2 gap-4">
              {PACKS.map((p: RecipePack) => {
                const list = allowedRecipes.filter(p.match);
                const done = list.filter((r) => isCompleted(r.id)).length;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPack(p)}
                    className={`flex min-h-32 flex-col items-center justify-center gap-1 rounded-3xl ${p.color} p-3 kids-shadow-lg`}
                  >
                    <span className="text-5xl">{p.emoji}</span>
                    <span className="text-balance text-center text-sm font-extrabold text-foreground">{p.label}</span>
                    <span className="rounded-full bg-card/80 px-2 py-0.5 text-[10px] font-extrabold text-foreground">{done}/{list.length} ⭐</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  } else if (screen === "custom") {
    content = <CustomRecipesScreen onClose={() => setScreen("home")} />;
  } else if (screen === "collections") {
    content = (
      <CollectionsScreen
        recipes={allowedRecipes}
        getName={nameFor}
        onPick={(r) => handleSelectRecipe(r)}
        onClose={() => setScreen("home")}
      />
    );
  } else if (screen === "generator") {
    content = (
      <CookWhatIHave
        recipes={allowedRecipes}
        restrictions={active?.restrictions ?? prefs.DEFAULT_RESTR}
        getName={nameFor}
        isFavorite={prefs.isFavorite}
        onPick={(r) => handleSelectRecipe(r)}
        onClose={() => setScreen("home")}
      />
    );
  } else if (screen === "school") {
    content = (
      <SchoolMode
        recipes={allRecipes}
        getName={nameFor}
        onClose={() => setScreen("home")}
      />
    );
  }

  if (!content) {
    if (screen === "ingredients" && selectedRecipe) {
      const resume = prefs.getResume(selectedRecipe.id);
      content = (
        <RecipeIngredients
          recipe={selectedRecipe}
          onStart={() => handleStart(0)}
          onBack={handleBack}
          displayName={nameFor(selectedRecipe)}
          hasResume={resume !== null && resume > 0}
          resumeStep={resume ?? undefined}
          onResume={() => handleStart(resume ?? 0)}
          onResumeClear={() => { prefs.clearResume(selectedRecipe.id); handleStart(0); }}
          isFavorite={prefs.isFavorite(selectedRecipe.id)}
          onToggleFavorite={() => prefs.toggleFavorite(selectedRecipe.id)}
        />
      );
    } else if (screen === "cooking" && selectedRecipe) {
      content = (
        <RecipeStepper
          recipe={selectedRecipe}
          onFinish={handleFinish}
          onBack={handleBack}
          onHome={handleHome}
          startAt={resumeFrom}
          soundOn={prefs.soundOn}
          onPause={(step) => prefs.saveResume(selectedRecipe.id, step)}
          onClearResume={() => prefs.clearResume(selectedRecipe.id)}
          displayName={nameFor(selectedRecipe)}
          isFavorite={prefs.isFavorite(selectedRecipe.id)}
          onToggleFavorite={() => prefs.toggleFavorite(selectedRecipe.id)}
          onAnother={handleAnother}
          newMedalId={newMedalId}
          onComplete={() => handleRecipeFinished(selectedRecipe, isChallenge)}
          onTaste={() => missions.onTaste()}
        />
      );
    } else {
      content = (
        <RecipeHome
          onSelectRecipe={handleSelectRecipe}
          isCompleted={isCompleted}
          avatarId={active?.avatarId ?? "dino"}
          onChangeAvatar={() => setPlayersOpen(true)}
          getRecipeName={nameFor}
          restrictions={active?.restrictions ?? prefs.DEFAULT_RESTR}
          lastRecipeId={prefs.lastRecipe}
          onOpenAdult={() => setAdultOpen(true)}
          isFavorite={prefs.isFavorite}
          ageBucket={active?.age ?? "4-5"}
          challengeRecipe={challengeRecipe}
          onPickChallenge={(r) => handleSelectRecipe(r, true)}
          onOpenMedals={() => setScreen("medals")}
          onOpenFavorites={() => setScreen("favorites")}
          onOpenWeekPlan={() => setScreen("weekplan")}
          onOpenShopping={() => setScreen("shopping")}
          onOpenPantry={() => setScreen("pantry")}
          onOpenCookWhat={() => setScreen("generator")}
          onOpenMissions={() => setScreen("missions")}
          onOpenPack={(p) => { setSelectedPack(p); setScreen("pack"); }}
          extraRecipes={customRecipes.items.map(customToRecipe)}
          playerName={active?.name ?? "Chef"}
        />
      );
    }
  }

  return (
    <>
      {content}
      {screen !== "cooking" && screen !== "ingredients" && screen !== "kidshome" && <HomeButton onClick={handleHome} />}
      {showBottomNav && <BottomNav active={currentTab} onChange={handleNavTab} />}
      {pendingDiploma && (
        <CategoryDiploma
          category={pendingDiploma}
          playerName={active?.name ?? "Chef"}
          onClose={() => {
            diplomas.award(pendingDiploma);
            setPendingDiploma(null);
          }}
        />
      )}
      <DailyRewardModal
        open={!!daily.todayReward}
        sticker={daily.todayReward?.sticker ?? "🌟"}
        praise={daily.todayReward?.praise ?? "¡Genial!"}
        streak={daily.streak}
        onClose={daily.closeReward}
      />
      {chestEvents.length > 0 && (
        <SurpriseChest events={chestEvents} onClose={() => setChestEvents([])} />
      )}
    </>
  );
}
