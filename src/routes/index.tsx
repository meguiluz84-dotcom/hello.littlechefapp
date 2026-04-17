import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Recipe } from "@/data/recipes";
import RecipeHome from "@/components/RecipeHome";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeStepper from "@/components/RecipeStepper";
import { useCompletedRecipes } from "@/hooks/use-completed-recipes";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Little Chef - Recetas Visuales para Niños" },
      { name: "description", content: "App de recetas completamente visual para niños pequeños. Sin texto, solo imágenes, iconos y animaciones." },
    ],
  }),
});

type Screen = "home" | "ingredients" | "cooking";

function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { markCompleted, isCompleted } = useCompletedRecipes();

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

  if (screen === "ingredients" && selectedRecipe) {
    return <RecipeIngredients recipe={selectedRecipe} onStart={handleStart} onBack={handleBack} />;
  }

  if (screen === "cooking" && selectedRecipe) {
    return <RecipeStepper recipe={selectedRecipe} onFinish={handleFinish} onBack={handleBack} />;
  }

  return <RecipeHome onSelectRecipe={handleSelectRecipe} isCompleted={isCompleted} />;
}
