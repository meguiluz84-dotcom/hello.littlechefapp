import { motion } from "framer-motion";
import dinoChef from "@/assets/dino-chef.png";
import type { Recipe } from "@/data/recipes";
import { MEDALS } from "@/data/medals";
import TastingPicker from "./TastingPicker";
import PhotoCapture from "./PhotoCapture";
import { useTastings, type Reaction } from "@/hooks/use-tastings";
import { useWeekPlan, todayKey } from "@/hooks/use-week-plan";
import { useEffect, useState } from "react";

interface Props {
  recipe?: Recipe;
  displayName?: string;
  onHome?: () => void;
  onAnother?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  newMedalId?: string | null;
  onTaste?: () => void;
  onDone?: () => void;
  recipeEmoji?: string;
}

const confetti = ["🎉", "⭐", "🌟", "✨", "🎈", "🎊", "💖", "🥳"];

export default function Celebration({
  recipe, displayName, onHome, onAnother, isFavorite, onToggleFavorite,
  newMedalId, onTaste, onDone, recipeEmoji,
}: Props) {
  const finishHome = onHome ?? onDone ?? (() => {});
  const dishEmoji = recipe?.emoji ?? recipeEmoji ?? "🍽️";
  const newMedal = newMedalId ? MEDALS.find((m) => m.id === newMedalId) ?? null : null;

  const { reactionFor, log, items, setNote } = useTastings();
  const recipeId = recipe?.id ?? "";
  const currentReaction = recipeId ? reactionFor(recipeId) : null;
  const existingNote = recipeId
    ? items.find((t) => t.recipeId === recipeId)?.note ?? ""
    : "";

  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(existingNote);
  const [noteSaved, setNoteSaved] = useState(false);
  useEffect(() => { setNoteDraft(existingNote); }, [existingNote]);

  const saveAdultNote = () => {
    if (!recipe) return;
    const trimmed = noteDraft.trim().slice(0, 280);
    // Ensure a tasting row exists so the note has somewhere to live.
    if (!currentReaction) log(recipe.id, "🙂" as Reaction, trimmed || undefined);
    else if (trimmed) setNote(recipe.id, trimmed);
    setNoteSaved(true);
    window.setTimeout(() => setNoteSaved(false), 1500);
  };

  const week = useWeekPlan();
  const [planAdded, setPlanAdded] = useState(false);
  const addToPlan = () => {
    if (!recipe) return;
    week.setSlot(todayKey(), "merienda", recipe.id);
    setPlanAdded(true);
  };

  const dinoMessage = newMedal
    ? `¡Medalla nueva! ${newMedal.emoji}`
    : currentReaction === "🔁"
    ? "¡A repetir pronto!"
    : currentReaction === "😍"
    ? "¡Qué chef!"
    : "¡Lo hiciste! 🎉";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-background px-4 pb-8 pt-8">
      {confetti.map((c, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, x: Math.random() * 300 - 150, opacity: 0 }}
          animate={{ y: [0, 600], opacity: [1, 0], rotate: [0, 360] }}
          transition={{ duration: 2 + Math.random() * 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }}
          className="pointer-events-none absolute top-0 text-4xl"
        >
          {c}
        </motion.span>
      ))}

      {/* Dino chef + dish */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="relative"
        >
          <motion.img
            src={dinoChef} alt="" width={144} height={144}
            animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="h-32 w-32 object-contain drop-shadow-2xl"
          />
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="absolute -right-2 top-0 max-w-[10rem] rounded-3xl rounded-bl-sm bg-card px-3 py-1.5 text-sm font-extrabold text-foreground kids-shadow"
          >
            {dinoMessage}
          </motion.div>
        </motion.div>

        {/* Finished dish plate */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
          className="relative mt-3 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-card kids-shadow-lg ring-8 ring-kids-yellow/60"
          aria-label={displayName ?? "Plato terminado"}
        >
          {recipe ? (
            <img src={recipe.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-7xl">{dishEmoji}</span>
          )}
        </motion.div>

        {displayName && (
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-balance text-center text-xl font-extrabold text-foreground"
          >
            ¡{displayName} listo!
          </motion.h1>
        )}
      </div>

      {/* Tasting + photo + adult note */}
      {recipe && (
        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <TastingPicker
            current={currentReaction}
            onPick={(r) => { log(recipe.id, r); onTaste?.(); }}
          />
          <PhotoCapture recipeId={recipe.id} />

          {/* Adult-only private note */}
          {!noteOpen ? (
            <button
              type="button"
              onClick={() => setNoteOpen(true)}
              className="flex min-h-12 items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-extrabold text-muted-foreground kids-shadow"
              aria-label="Añadir nota privada para adultos"
            >
              <span aria-hidden>📝</span>
              <span>{existingNote ? "Editar nota (adulto)" : "Añadir nota (adulto)"}</span>
            </button>
          ) : (
            <div className="flex w-full flex-col gap-2 rounded-2xl bg-card p-3 kids-shadow">
              <label htmlFor="adult-note" className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
                📝 Nota privada (solo adultos)
              </label>
              <textarea
                id="adult-note"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value.slice(0, 280))}
                maxLength={280}
                rows={2}
                placeholder="Ej: poner menos azúcar, salió muy líquido…"
                className="w-full resize-none rounded-xl bg-background p-2 text-sm font-medium text-foreground outline-none ring-2 ring-transparent focus:ring-primary"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setNoteOpen(false); setNoteDraft(existingNote); }}
                  className="min-h-10 rounded-full bg-muted px-3 py-1.5 text-xs font-extrabold text-foreground"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={saveAdultNote}
                  className="min-h-10 rounded-full bg-primary px-4 py-1.5 text-xs font-extrabold text-primary-foreground kids-shadow"
                >
                  {noteSaved ? "✅ Guardada" : "Guardar"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medal */}
      {newMedal && (
        <motion.div
          initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", bounce: 0.6 }}
          className="flex flex-col items-center gap-1 rounded-3xl bg-kids-yellow/70 px-5 py-2 kids-shadow-lg"
          aria-label={`Nueva medalla: ${newMedal.label}`}
        >
          <div className="text-xs font-extrabold text-foreground">¡Nueva medalla!</div>
          <div className="flex items-center gap-2">
            <span className="text-4xl">{newMedal.emoji}</span>
            <span className="text-base font-extrabold text-foreground">{newMedal.label}</span>
          </div>
        </motion.div>
      )}

      {/* Action grid */}
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        {/* Secondary chips */}
        <div className="flex w-full items-center justify-center gap-2">
          {onToggleFavorite && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onToggleFavorite}
              aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              aria-pressed={!!isFavorite}
              className="flex min-h-14 items-center gap-2 rounded-full bg-card px-4 text-base font-extrabold text-foreground kids-shadow"
            >
              <span className="text-2xl">{isFavorite ? "❤️" : "🤍"}</span>
              <span className="hidden sm:inline">Favorita</span>
            </motion.button>
          )}
          {recipe && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
              onClick={addToPlan}
              disabled={planAdded}
              aria-label="Añadir al plan de hoy"
              className={`flex min-h-14 items-center gap-2 rounded-full px-4 text-base font-extrabold kids-shadow ${
                planAdded ? "bg-kids-green text-foreground" : "bg-card text-foreground"
              }`}
            >
              <span className="text-2xl">{planAdded ? "✅" : "📅"}</span>
              <span className="hidden sm:inline">{planAdded ? "En el plan" : "Al plan"}</span>
            </motion.button>
          )}
        </div>

        {/* Primary actions */}
        <div className="flex w-full items-center justify-center gap-3">
          {onAnother && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              onClick={onAnother}
              aria-label="Hacer otra receta parecida"
              className="flex h-20 min-h-16 items-center gap-2 rounded-full bg-accent px-6 text-2xl font-extrabold text-accent-foreground kids-shadow-lg"
            >
              🍳 ➕
            </motion.button>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.95 }}
            onClick={finishHome}
            aria-label="Inicio"
            className="flex h-16 w-16 min-h-16 min-w-16 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground kids-shadow-lg"
          >
            🏠
          </motion.button>
        </div>
      </div>
    </div>
  );
}
