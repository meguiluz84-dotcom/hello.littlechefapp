import { motion } from "framer-motion";
import splashCover from "@/assets/splash-cover.png";

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-6">
      <div className="relative w-full max-w-md">
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          src={splashCover}
          alt="Little Chef"
          className="w-full object-contain"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          onClick={onStart}
          aria-label="Empezar"
          className="absolute bottom-[6%] left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-full bg-kids-yellow px-10 py-4 text-2xl font-extrabold text-foreground kids-shadow-lg"
        >
          Empezar
        </motion.button>
      </div>
    </div>
  );
}
