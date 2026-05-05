import { motion } from "framer-motion";

interface Props {
  onClick: () => void;
}

export default function HomeButton({ onClick }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="fixed right-3 top-3 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-card text-3xl kids-shadow md:h-20 md:w-20 md:text-5xl"
      aria-label="Inicio"
    >
      🏠
    </motion.button>
  );
}
