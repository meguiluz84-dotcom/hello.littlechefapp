import { motion } from "framer-motion";
import splashCover from "@/assets/splash-cover.png";

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-4 py-6">
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        src={splashCover}
        alt="Little Chef"
        className="max-h-[80vh] w-full max-w-md object-contain"
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        onClick={onStart}
        className="mb-4 w-full max-w-xs rounded-full bg-kids-yellow px-8 py-5 text-2xl font-extrabold text-foreground kids-shadow-lg"
      >
        Empezar ✨
      </motion.button>
    </div>
  );
}
