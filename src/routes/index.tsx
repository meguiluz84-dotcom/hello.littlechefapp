import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Recipe } from "@/data/recipes";
import RecipeHome from "@/components/RecipeHome";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeStepper from "@/components/RecipeStepper";
import HomeButton from "@/components/HomeButton";
import SplashScreen from "@/components/SplashScreen";
import AvatarPicker from "@/components/AvatarPicker";
import Onboarding from "@/components/Onboarding";
import AdultMode from "@/components/AdultMode";
import { useCompletedRecipes } from "@/hooks/use-completed-recipes";
import { useAvatar } from "@/hooks/use-avatar";
import { usePreferences } from "@/hooks/use-preferences";
import { getRecipeName } from "@/data/recipeNames";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Little Chef - Recetas Visuales para Niños" },
      { name: "description", content: "App de recetas completamente visual para niños pequeños. Sin texto, solo imágenes, iconos y animaciones." },
    ],
  }),
});

type Screen = "splash" | "home" | "ingredients" | "cooking";

function Index() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [adultOpen, setAdultOpen] = useState(false);
  const [resumeFrom, setResumeFrom] = useState(0);
  const { markCompleted, isCompleted, completed } = useCompletedRecipes();
  const { avatarId, setAvatarId, hydrated } = useAvatar();
  const prefs = usePreferences();

  const needsOnboarding = prefs.hydrated && (!avatarId || !prefs.onboarding);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    prefs.setLastRecipe(recipe.id);
    setResumeFrom(0);
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

  const handleFinish = () => {
    if (selectedRecipe) {
      markCompleted(selectedRecipe.id);
      prefs.clearResume(selectedRecipe.id);
    }
    setScreen("home");
    setSelectedRecipe(null);
  };

  const handleSplashStart = () => {
    setScreen("home");
  };

  const nameFor = (r: Recipe) => getRecipeName(avatarId, r.id, r.name);

  if (screen === "splash") {
    return <SplashScreen onStart={handleSplashStart} />;
  }

  if (!hydrated || !prefs.hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  // First-time onboarding
  if (needsOnboarding) {
    return (
      <Onboarding
        initialAvatar={avatarId}
        onComplete={(av, p) => {
          setAvatarId(av);
          prefs.setOnboarding(p);
        }}
      />
    );
  }

  // Re-pick avatar (from adult mode)
  if (pickerOpen && avatarId) {
    return (
      <AvatarPicker
        currentId={avatarId}
        onSelect={(id) => {
          setAvatarId(id);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
        title="Cambia tu personaje"
      />
    );
  }

  // Adult mode panel
  if (adultOpen) {
    return (
      <AdultMode
        onClose={() => setAdultOpen(false)}
        onChangeAvatar={() => { setAdultOpen(false); setPickerOpen(true); }}
        onResetProgress={() => {
          try { localStorage.removeItem("little-chef-completed"); } catch { /* ignore */ }
          completed.forEach(() => { /* visual state will reload on refresh */ });
          window.location.reload();
        }}
        onResetOnboarding={() => {
          prefs.resetOnboarding();
          setAdultOpen(false);
        }}
        prefs={prefs.onboarding}
        onSavePrefs={prefs.setOnboarding}
        soundOn={prefs.soundOn}
        onToggleSound={prefs.setSoundOn}
      />
    );
  }

  const handleHome = () => {
    setSelectedRecipe(null);
    setScreen("home");
  };

  const restrictions = prefs.onboarding?.restrictions ?? prefs.DEFAULT_RESTR;

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
        onResumeClear={() => {
          prefs.clearResume(selectedRecipe.id);
          handleStart(0);
        }}
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
      />
    );
  } else {
    content = (
      <RecipeHome
        onSelectRecipe={handleSelectRecipe}
        isCompleted={isCompleted}
        avatarId={avatarId ?? "dino"}
        onChangeAvatar={() => setPickerOpen(true)}
        getRecipeName={nameFor}
        restrictions={restrictions}
        lastRecipeId={prefs.lastRecipe}
        onOpenAdult={() => setAdultOpen(true)}
        isFavorite={prefs.isFavorite}
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
