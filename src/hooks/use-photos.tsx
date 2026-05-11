import { useCallback, useEffect, useState } from "react";
import { usePlayers } from "./use-players";

const indexKey = (pid: string) => `lc:p:${pid}:photos-index`;
const photoKey = (pid: string, recipeId: string) => `lc:p:${pid}:photo:${recipeId}`;

// Resize to max ~600px and return a JPEG dataURL.
function fileToResizedDataURL(file: File, maxSize = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function usePhotos() {
  const { active } = usePlayers();
  const pid = active?.id ?? null;
  const [recipeIds, setRecipeIds] = useState<string[]>([]);

  useEffect(() => {
    if (!pid) { setRecipeIds([]); return; }
    try {
      const raw = localStorage.getItem(indexKey(pid));
      setRecipeIds(raw ? JSON.parse(raw) : []);
    } catch { setRecipeIds([]); }
  }, [pid]);

  const get = useCallback((recipeId: string): string | null => {
    if (!pid) return null;
    try { return localStorage.getItem(photoKey(pid, recipeId)); } catch { return null; }
  }, [pid]);

  const save = useCallback(async (recipeId: string, file: File) => {
    if (!pid) return;
    const dataUrl = await fileToResizedDataURL(file);
    try {
      localStorage.setItem(photoKey(pid, recipeId), dataUrl);
      setRecipeIds((prev) => {
        const next = prev.includes(recipeId) ? prev : [...prev, recipeId];
        try { localStorage.setItem(indexKey(pid), JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    } catch (e) {
      console.warn("photo save failed", e);
    }
  }, [pid]);

  const remove = useCallback((recipeId: string) => {
    if (!pid) return;
    try { localStorage.removeItem(photoKey(pid, recipeId)); } catch { /* ignore */ }
    setRecipeIds((prev) => {
      const next = prev.filter((id) => id !== recipeId);
      try { localStorage.setItem(indexKey(pid), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [pid]);

  return { recipeIds, get, save, remove };
}
