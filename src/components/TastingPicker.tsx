import { motion } from "framer-motion";
import type { Reaction } from "@/hooks/use-tastings";

interface Props {
  current: Reaction | null;
  onPick: (r: Reaction) => void;
}

const FACES: { id: Reaction; label: string }[] = [
  { id: "😍", label: "¡Me encantó!" },
  { id: "🙂", label: "Estuvo bien" },
  { id: "😖", label: "No me gustó" },
  { id: "🔁", label: "Quiero repetir" },
];

export default function TastingPicker({ current, onPick }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs font-extrabold text-foreground">¿Te gustó?</div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FACES.map((f, i) => {
          const on = current === f.id;
          return (
            <motion.button
              key={f.id} type="button"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.1 + i * 0.07, type: "spring", bounce: 0.5 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => onPick(f.id)}
              aria-label={f.label} aria-pressed={on}
              title={f.label}
              className={`flex h-14 w-14 min-h-14 min-w-14 items-center justify-center rounded-full text-3xl kids-shadow transition-all ${
                on ? "bg-kids-yellow ring-4 ring-foreground/20 scale-110" : "bg-card"
              }`}
            >{f.id}</motion.button>
          );
        })}
      </div>
    </div>
  );
}
