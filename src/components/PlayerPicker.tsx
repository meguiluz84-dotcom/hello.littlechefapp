import { motion } from "framer-motion";
import { avatars, type AvatarId } from "@/data/avatars";
import { type Player } from "@/hooks/use-players";

interface Props {
  players: Player[];
  activeId: string | null;
  onPick: (id: string) => void;
  onAdd: () => void;
  onClose?: () => void;
}

export default function PlayerPicker({ players, activeId, onPick, onAdd, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-background px-4 pb-10 pt-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">👨‍👩‍👧 ¿Quién cocina?</h1>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
            >✖️</button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {players.map((p, i) => {
            const av = avatars.find((a) => a.id === p.avatarId) ?? avatars[0];
            const isActive = p.id === activeId;
            return (
              <motion.button
                key={p.id}
                type="button"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring", bounce: 0.5 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onPick(p.id)}
                className={`flex min-h-40 flex-col items-center justify-center gap-2 rounded-3xl p-4 kids-shadow-lg ${
                  isActive ? "ring-4 ring-accent" : ""
                } ${av.color}`}
                aria-label={`Cocinar como ${p.name}`}
              >
                <img src={av.image} alt="" className="h-20 w-20 object-contain" />
                <span className="text-lg font-extrabold text-foreground line-clamp-1">{p.name}</span>
                <span className="rounded-full bg-card/80 px-3 py-0.5 text-xs font-extrabold text-foreground">
                  {p.age}
                </span>
              </motion.button>
            );
          })}

          <motion.button
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: players.length * 0.05, type: "spring", bounce: 0.5 }}
            whileTap={{ scale: 0.92 }}
            onClick={onAdd}
            className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-3xl border-4 border-dashed border-muted bg-card p-4"
            aria-label="Añadir nuevo perfil"
          >
            <span className="text-6xl">➕</span>
            <span className="text-base font-extrabold text-foreground">Nuevo</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// helper export so other files don't need to import avatars directly
export type { AvatarId };
