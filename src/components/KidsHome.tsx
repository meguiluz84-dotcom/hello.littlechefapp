import { motion } from "framer-motion";
import { avatarById, type AvatarId } from "@/data/avatars";
import { useLongPress } from "@/hooks/use-long-press";
import DinoBubble from "./DinoBubble";

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
  sub: string;
  bg: string;
  ring: string;
  onClick: () => void;
};

export default function KidsHome({
  playerName, avatarId, starsCount,
  onChangeAvatar, onOpenAdult, onCook, onPlay, onAwards,
}: Props) {
  const avatar = avatarById(avatarId);
  const longPress = useLongPress(onOpenAdult, 800);

  const actions: Action[] = [
    { id: "cook",   emoji: "🍕", label: "Cocinar", sub: "¡Vamos a la cocina!", bg: "bg-kids-green",  ring: "ring-kids-green",  onClick: onCook },
    { id: "play",   emoji: "🎮", label: "Jugar",   sub: "Reto del día y misiones", bg: "bg-kids-blue", ring: "ring-kids-blue", onClick: onPlay },
    { id: "awards", emoji: "⭐", label: "Premios", sub: `Tienes ${starsCount} estrellas`, bg: "bg-kids-yellow", ring: "ring-kids-yellow", onClick: onAwards },
  ];

  return (
    <div className="min-h-screen bg-background px-5 pb-28 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col">
        {/* Header: avatar + nombre */}
        <div className="mb-3 flex items-center justify-center">
          <motion.button
            type="button"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            whileTap={{ scale: 0.92 }}
            onClick={onChangeAvatar}
            aria-label="Cambiar perfil"
            className={`relative flex h-28 w-28 items-center justify-center rounded-full ${avatar.color} kids-shadow-lg`}
          >
            <img src={avatar.image} alt={avatar.label} width={112} height={112} className="h-24 w-24 object-contain" />
            <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-card text-lg kids-shadow ring-2 ring-background">👥</span>
          </motion.button>
        </div>

        {/* Saludo con mascota */}
        <div className="mb-2 flex justify-center">
          <DinoBubble
            emojis="👋"
            message={`¡Hola, ${playerName}!`}
            tone="yellow"
            size="md"
            bubbleKey={playerName}
          />
        </div>

        {/* Contador de estrellas (long-press → adultos) */}
        <div className="mb-6 flex justify-center">
          <motion.div
            {...longPress}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
            className="flex select-none items-center gap-2 rounded-full bg-kids-yellow px-5 py-2 kids-shadow"
            aria-label={`${starsCount} estrellas (mantén pulsado para padres)`}
          >
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-extrabold text-foreground">×{starsCount}</span>
          </motion.div>
        </div>

        {/* 3 acciones gigantes */}
        <div className="flex flex-col gap-5">
          {actions.map((a, i) => (
            <motion.button
              key={a.id}
              type="button"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.1, type: "spring", bounce: 0.45 }}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -3 }}
              onClick={a.onClick}
              aria-label={a.label}
              className={`kids-press flex min-h-[112px] w-full items-center gap-4 rounded-[2rem] ${a.bg} px-6 py-5 ring-4 ${a.ring}/40`}
            >
              <motion.span
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ repeat: Infinity, duration: 3.2 + i * 0.4, ease: "easeInOut" }}
                className="text-6xl drop-shadow-sm"
              >
                {a.emoji}
              </motion.span>
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-3xl font-extrabold leading-none text-foreground">{a.label}</span>
                <span className="mt-1 text-sm font-bold text-foreground/80">{a.sub}</span>
              </div>
              <span className="text-4xl text-foreground/70">➜</span>
            </motion.button>
          ))}
        </div>

        {/* Acceso adultos sutil */}
        <button
          type="button"
          onClick={onOpenAdult}
          aria-label="Modo adultos"
          className="mx-auto mt-8 flex h-12 items-center gap-2 rounded-full bg-card/80 px-4 text-xs font-extrabold text-muted-foreground kids-shadow"
        >
          <span className="text-lg">👨‍👩‍👧</span>
          Modo adultos
        </button>
      </div>
    </div>
  );
}
