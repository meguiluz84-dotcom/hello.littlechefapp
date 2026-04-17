import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "little-chef-completed";

export function useCompletedRecipes() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const markCompleted = useCallback((recipeId: string) => {
    setCompleted((prev) => {
      if (prev.includes(recipeId)) return prev;
      const next = [...prev, recipeId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (recipeId: string) => completed.includes(recipeId),
    [completed],
  );

  return { completed, markCompleted, isCompleted };
}
