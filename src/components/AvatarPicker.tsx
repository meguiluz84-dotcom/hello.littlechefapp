import { motion } from "framer-motion";
import { avatars, type AvatarId } from "@/data/avatars";

interface Props {
  onSelect: (id: AvatarId) => void;
  onClose?: () => void;
  currentId?: AvatarId | null;
  title?: string;
}

export default function AvatarPicker({ onSelect, onClose, currentId, title = "¿Quién cocina hoy?" }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background px-4 pb-6 pt-8 overflow-y-auto">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 text-center text-3xl font-extrabold text-foreground"
      >
        {title}
      </motion.h1>

      <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
        {avatars.map((a, i) => {
          const isCurrent = currentId === a.id;
          return (
            <motion.button
              key={a.id}
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -4 }}
              onClick={() => onSelect(a.id)}
              aria-label={a.label}
              className={`flex flex-col items-center gap-2 rounded-3xl ${a.color} p-3 kids-shadow-lg ${
                isCurrent ? "ring-4 ring-primary" : ""
              }`}
            >
              <img
                src={a.image}
                alt=""
                width={256}
                height={256}
                loading="lazy"
                className="aspect-square w-full rounded-2xl bg-card/60 object-contain p-2"
              />
              <div className="text-lg font-extrabold text-foreground">
                {a.emoji} {a.label}
              </div>
            </motion.button>
          );
        })}
      </div>

      {onClose && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onClose}
          className="mx-auto mt-6 rounded-full bg-card px-6 py-3 text-lg font-extrabold text-foreground kids-shadow"
        >
          ✖️ Cerrar
        </motion.button>
      )}
    </div>
  );
}
