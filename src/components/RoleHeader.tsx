import { motion } from "framer-motion";

interface Props {
  needsAdult: boolean;
}

// Two big bubbles. The active one (kid or adult) is highlighted.
export default function RoleHeader({ needsAdult }: Props) {
  return (
    <div className="flex w-full max-w-xs items-center justify-center gap-2">
      <motion.div
        animate={{ scale: needsAdult ? 0.9 : 1.05, opacity: needsAdult ? 0.5 : 1 }}
        className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-xs font-extrabold kids-shadow ${
          needsAdult ? "bg-card text-muted-foreground" : "bg-kids-green text-foreground"
        }`}
      >
        <span className="text-base">🧒</span>
        <span>Niño</span>
      </motion.div>
      <motion.div
        animate={{ scale: needsAdult ? 1.05 : 0.9, opacity: needsAdult ? 1 : 0.5 }}
        className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-xs font-extrabold kids-shadow ${
          needsAdult ? "bg-kids-yellow text-foreground" : "bg-card text-muted-foreground"
        }`}
      >
        <span className="text-base">🧑</span>
        <span>Adulto</span>
      </motion.div>
    </div>
  );
}
