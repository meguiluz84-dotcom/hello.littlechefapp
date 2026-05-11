import { useRef } from "react";
import { motion } from "framer-motion";
import { usePhotos } from "@/hooks/use-photos";

interface Props {
  recipeId: string;
}

export default function PhotoCapture({ recipeId }: Props) {
  const { get, save, remove } = usePhotos();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const photo = get(recipeId);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await save(recipeId, file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={inputRef}
        type="file" accept="image/*" capture="environment"
        onChange={onChange} className="hidden"
        aria-hidden="true"
      />
      {photo ? (
        <div className="relative">
          <img
            src={photo} alt="Tu plato"
            className="h-20 w-20 rounded-2xl object-cover kids-shadow-lg ring-4 ring-kids-yellow/60"
          />
          <button
            type="button" onClick={() => remove(recipeId)} aria-label="Borrar foto"
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-card text-base kids-shadow"
          >🗑️</button>
        </div>
      ) : (
        <motion.button
          type="button" whileTap={{ scale: 0.85 }}
          onClick={() => inputRef.current?.click()}
          aria-label="Hacer foto del plato"
          className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-card text-3xl kids-shadow"
        >📸</motion.button>
      )}
    </div>
  );
}
