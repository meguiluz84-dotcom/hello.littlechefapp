import { motion } from "framer-motion";
import { avatarById, type AvatarId } from "@/data/avatars";
import { useLongPress } from "@/hooks/use-long-press";

interface Props {
  playerName: string;
  avatarId: AvatarId;
  starsCount: number;
  onChangeAvatar: () => void;
  onOpenAdult: () => void;
  onCook: () => void;
  onPlay: () => void;
  onAwards: () => void;
}

type Action = {
  id: "cook" | "play" | "awards";
  emoji: string;
  label: string;
  bg: string;
  ring: string;
  floaters: string[];
  onClick: () => void;
};

export default function KidsHome({
  playerName, avatarId, starsCount,
  onChangeAvatar, onOpenAdult, onCook, onPlay, onAwards,
}: Props) {
  const avatar = avatarById(avatarId);
  const longPress = useLongPress(onOpenAdult, 800);

  const actions: Action[] = [
    { id: "cook",   emoji: "🍕", label: "Cocinar", bg: "bg-kids-green",  ring: "ring-kids-green",  floaters: ["🥕", "🍅", "🥚"], onClick: onCook },
    { id: "play",   emoji: "🎮", label: "Jugar",   bg: "bg-kids-blue",   ring: "ring-kids-blue",   floaters: ["🎯", "🎲", "✨"], onClick: onPlay },
    { id: "awards", emoji: "⭐", label: "Premios", bg: "bg-kids-yellow", ring: "ring-kids-yellow", floaters: ["🏆", "🎖️", "🥇"], onClick: onAwards },
  ];

  // Cap shown stars to avoid overflow on small screens.
  const shownStars = Math.min(starsCount, 5);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 pb-8 pt-4">
      {/* Fondo decorativo: comida flotando */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        {["🍓", "🥦", "🧀", "🍞", "🥑", "🍌"].map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-30"
            style={{
              top: `${10 + (i * 13) % 70}%`,
              left: `${(i * 37) % 90}%`,
            }}
            animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i * 0.3, ease: "easeInOut" }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col">
        {/* Chef saludando */}
        <div className="mb-2 flex flex-col items-center pt-2">
          <motion.button
            type="button"
            onClick={onChangeAvatar}
            aria-label="Cambiar chef"
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.55 }}
            whileTap={{ scale: 0.92 }}
            className={`relative flex h-36 w-36 items-center justify-center rounded-full ${avatar.color} kids-shadow-lg ring-4 ring-background`}
          >
            <motion.img
              src={avatar.image}
              alt={avatar.label}
              width={144}
              height={144}
              className="h-32 w-32 object-contain drop-shadow-md"
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            />
            {/* Mano saludando */}
            <motion.span
              className="absolute -right-2 -top-1 text-4xl"
              animate={{ rotate: [0, 25, -10, 25, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              👋
            </motion.span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 rounded-full bg-card px-5 py-2 kids-shadow"
          >
            <span className="text-xl font-extrabold text-foreground">
              ¡Hola, {playerName}! 🎉
            </span>
          </motion.div>
        </div>

        {/* 3 botones gigantes */}
        <div className="mt-6 flex flex-1 flex-col justify-center gap-5">
          {actions.map((a, i) => (
            <motion.button
              key={a.id}
              type="button"
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.1, type: "spring", bounce: 0.5 }}
              whileTap={{ scale: 0.94, rotate: -1 }}
              whileHover={{ y: -4 }}
              onClick={a.onClick}
              aria-label={a.label}
              className={`kids-press relative flex min-h-[120px] w-full items-center justify-between overflow-hidden rounded-[2.25rem] ${a.bg} px-6 ring-4 ${a.ring}/40`}
            >
              {/* Floaters decorativos */}
              <span aria-hidden className="pointer-events-none absolute inset-0">
                {a.floaters.map((f, idx) => (
                  <motion.span
                    key={idx}
                    className="absolute text-2xl opacity-70"
                    style={{
                      top: `${15 + idx * 25}%`,
                      right: `${10 + idx * 18}%`,
                    }}
                    animate={{ y: [0, -6, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 + idx * 0.4, ease: "easeInOut" }}
                  >
                    {f}
                  </motion.span>
                ))}
              </span>

              <motion.span
                className="relative z-10 text-7xl drop-shadow-md"
                animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.8 + i * 0.3, ease: "easeInOut" }}
              >
                {a.emoji}
              </motion.span>
              <span className="relative z-10 text-4xl font-extrabold uppercase tracking-tight text-foreground">
                {a.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Pie: estrellas + adultos */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <motion.div
            {...longPress}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.6 }}
            className="flex select-none items-center gap-1.5 rounded-full bg-card px-5 py-2.5 kids-shadow"
            aria-label={`${starsCount} estrellas`}
          >
            {Array.from({ length: 5 }).map((_, idx) => (
              <motion.span
                key={idx}
                className="text-2xl"
                animate={idx < shownStars ? { scale: [1, 1.2, 1] } : undefined}
                transition={{ repeat: Infinity, duration: 1.6, delay: idx * 0.15 }}
              >
                {idx < shownStars ? "⭐" : "☆"}
              </motion.span>
            ))}
            {starsCount > 5 && (
              <span className="ml-1 text-base font-extrabold text-foreground">×{starsCount}</span>
            )}
          </motion.div>

          <button
            type="button"
            onClick={onOpenAdult}
            aria-label="Modo adultos"
            className="flex h-11 items-center gap-2 rounded-full bg-card/90 px-4 text-xs font-extrabold text-muted-foreground kids-shadow"
          >
            <span className="text-base">👨‍👩‍👧</span>
            Modo adultos
          </button>
        </div>
      </div>
    </div>
  );
}
