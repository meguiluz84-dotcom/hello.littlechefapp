import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { Recipe } from "@/data/recipes";
import { recipes as ALL_RECIPES } from "@/data/recipes";
import RecipeHome from "@/components/RecipeHome";
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
import { useCompletedRecipes } from "@/hooks/use-completed-recipes";
import { usePreferences } from "@/hooks/use-preferences";
import { usePlayers } from "@/hooks/use-players";
import { useMedals } from "@/hooks/use-medals";
import { useMissions } from "@/hooks/use-missions";
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
  | "splash" | "home" | "ingredients" | "cooking"
  | "medals" | "favorites" | "weekplan" | "shopping" | "pantry" | "missions";

function Index() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [adultOpen, setAdultOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [resumeFrom, setResumeFrom] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);
  const [newMedalId, setNewMedalId] = useState<string | null>(null);

  const players = usePlayers();
  const { markCompleted, isCompleted, completed, reset: resetCompleted } = useCompletedRecipes();
  const prefs = usePreferences();
  const medals = useMedals();
  const missions = useMissions();
  const earnedBeforeRef = medals.earned;

  const active = players.active;
  const needsOnboarding = players.hydrated && !active && !addingPlayer;

  // Filter recipes for the active player
  const allowedRecipes = useMemo(() => {
    if (!active) return ALL_RECIPES;
    return ALL_RECIPES.filter((r) => {
      const m = getRecipeMeta(r.id);
      return recipeAllowedForAge(m, active.age) && recipeMatchesRestrictions(m, active.restrictions);
    });
  }, [active]);

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
    markCompleted(recipe.id);
    prefs.clearResume(recipe.id);
    missions.onCompleteRecipe();
    if (asChallenge) { medals.completeChallenge(recipe.id); missions.onChallenge(); }
    // Detect newly earned medal by re-running the rule with the next state.
    const completedNext = completed.includes(recipe.id) ? completed : [...completed, recipe.id];
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

  const handleSplashStart = () => setScreen("home");
  const nameFor = (r: Recipe) =>
    getRecipeName(active?.avatarId ?? "dino", r.id, r.name);

  if (screen === "splash") return <SplashScreen onStart={handleSplashStart} />;
  if (!players.hydrated) return <div className="min-h-screen bg-background" />;

  // Onboarding (first time or adding new player)
  if (needsOnboarding || addingPlayer) {
    return (
      <Onboarding
        initialAvatar={null}
        onComplete={(av, p, name) => {
          const id = players.add({
            name, avatarId: av, age: p.age, restrictions: p.restrictions,
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
        soundOn={prefs.soundOn}
        onToggleSound={prefs.setSoundOn}
      />
    );
  }

  if (screen === "medals") return <MedalsScreen onClose={() => setScreen("home")} />;
  if (screen === "favorites") {
    return (
      <FavoritesScreen
        recipes={allowedRecipes}
        favorites={prefs.favorites}
        onPick={(r) => handleSelectRecipe(r)}
        onClose={() => setScreen("home")}
        getName={nameFor}
      />
    );
  }
  if (screen === "weekplan") {
    return (
      <WeekPlanScreen
        recipes={allowedRecipes}
        getName={nameFor}
        onClose={() => setScreen("home")}
      />
    );
  }
  if (screen === "shopping") {
    return (
      <ShoppingListScreen
        recipes={ALL_RECIPES}
        favorites={prefs.favorites}
        onClose={() => setScreen("home")}
      />
    );
  }
  if (screen === "pantry") {
    return (
      <PantryScreen
        recipes={allowedRecipes}
        getName={nameFor}
        onPick={(r) => handleSelectRecipe(r)}
        onClose={() => setScreen("home")}
      />
    );
  }
  if (screen === "missions") {
    return <MissionsScreen onClose={() => setScreen("home")} />;
  }

  const handleHome = () => { setSelectedRecipe(null); setScreen("home"); };

  let content;
  if (screen === "ingredients" && selectedRecipe) {
    const resume = prefs.getResume(selectedRecipe.id);
    content = (
      <RecipeIngredients
        recipe={selectedRecipe}
        onStart={() => handleStart(0)}
        onBack={handleBack}
        displayName={nameFor(selectedRecipe)}
        hasResume={resume !== null && resume > 0}
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
        onOpenMissions={() => setScreen("missions")}
        playerName={active?.name ?? "Chef"}
      />
    );
  }

  return (
    <>
      {content}
      {screen !== "cooking" && <HomeButton onClick={handleHome} />}
    </>
  );
}
