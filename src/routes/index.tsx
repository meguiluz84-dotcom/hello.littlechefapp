import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Recipe } from "@/data/recipes";
import RecipeHome from "@/components/RecipeHome";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeStepper from "@/components/RecipeStepper";
import HomeButton from "@/components/HomeButton";
import SplashScreen from "@/components/SplashScreen";
import AvatarPicker from "@/components/AvatarPicker";
import { useCompletedRecipes } from "@/hooks/use-completed-recipes";
import { useAvatar } from "@/hooks/use-avatar";
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
  const { markCompleted, isCompleted } = useCompletedRecipes();
  const { avatarId, setAvatarId, hydrated } = useAvatar();

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setScreen("ingredients");
  };

  const handleBack = () => {
    if (screen === "cooking") setScreen("ingredients");
    else setScreen("home");
  };

  const handleStart = () => setScreen("cooking");
  const handleFinish = () => {
    if (selectedRecipe) markCompleted(selectedRecipe.id);
    setScreen("home");
    setSelectedRecipe(null);
  };

  const handleSplashStart = () => {
    setScreen("home");
    if (!avatarId) setPickerOpen(true);
  };

  const nameFor = (r: Recipe) => getRecipeName(avatarId, r.id, r.name);

  if (screen === "splash") {
    return <SplashScreen onStart={handleSplashStart} />;
  }

  // Wait for hydration before rendering name-dependent UI to avoid flash
  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  // First-time avatar selection (no close button)
  if (pickerOpen && !avatarId) {
    return (
      <AvatarPicker
        onSelect={(id) => {
          setAvatarId(id);
          setPickerOpen(false);
        }}
        currentId={avatarId}
      />
    );
  }

  // Re-pick avatar from home (with close button)
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

  const handleHome = () => {
    setSelectedRecipe(null);
    setScreen("home");
  };

  let content;
  if (screen === "ingredients" && selectedRecipe) {
    content = (
      <RecipeIngredients
        recipe={selectedRecipe}
        onStart={handleStart}
        onBack={handleBack}
        displayName={nameFor(selectedRecipe)}
      />
    );
  } else if (screen === "cooking" && selectedRecipe) {
    content = <RecipeStepper recipe={selectedRecipe} onFinish={handleFinish} onBack={handleBack} />;
  } else {
    content = (
      <RecipeHome
        onSelectRecipe={handleSelectRecipe}
        isCompleted={isCompleted}
        avatarId={avatarId ?? "dino"}
        onChangeAvatar={() => setPickerOpen(true)}
        getRecipeName={nameFor}
      />
    );
  }

  return (
    <>
      {content}
      <HomeButton onClick={handleHome} />
    </>
  );
}
