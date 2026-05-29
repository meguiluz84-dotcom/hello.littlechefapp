import { motion } from "framer-motion";
import { COLLECTION, totalCollectibles, unlockedCount, type CategoryDef } from "@/data/collectibles";

interface Props {
  stars: number;
  onClose: () => void;
}

/**
 * Pantalla de colección visual: una sección por categoría con grid de iconos
 * grandes. Bloqueados se ven en gris con candado y la cantidad de ⭐ que faltan.
 */
export default function CollectionScreen({ stars, onClose }: Props) {
  const total = totalCollectibles();
  const got = unlockedCount(stars);

  return (
    <div className="min-h-screen bg-gradient-warm px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-foreground">🎁 Colección</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="kids-press flex h-14 w-14 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >
            ✖️
          </button>
        </div>

        {/* Barra de progreso visual */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 rounded-3xl bg-card p-4 kids-shadow"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-lg font-extrabold text-foreground">⭐ {stars}</span>
            <span className="text-lg font-extrabold text-foreground">
              {got}/{total}
            </span>
          </div>
          <div className="relative h-5 overflow-hidden rounded-full bg-background">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(got / total) * 100}%` }}
              transition={{ type: "spring", bounce: 0.3, duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-kids-yellow via-kids-orange to-kids-pink"
            />
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {COLLECTION.map((cat, ci) => (
            <CategoryBlock key={cat.id} cat={cat} stars={stars} delay={ci * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryBlock({
  cat,
  stars,
  delay,
}: {
  cat: CategoryDef;
  stars: number;
  delay: number;
}) {
  const got = cat.items.filter((it) => stars >= it.unlockAt).length;
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: "spring", bounce: 0.4 }}
      className="rounded-[2rem] bg-card p-4 kids-shadow"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.bg} text-3xl kids-shadow`}>
          {cat.emoji}
        </span>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-foreground">{cat.label}</h2>
          <p className="text-xs font-bold text-muted-foreground">
            {got}/{cat.items.length} desbloqueados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cat.items.map((it, i) => {
          const got = stars >= it.unlockAt;
          const needed = it.unlockAt - stars;
          return (
            <motion.div
              key={it.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + i * 0.04, type: "spring", bounce: 0.55 }}
              className={`relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl p-1 kids-shadow ${
                got ? it.bg : "bg-background opacity-60"
              }`}
            >
              <motion.span
                className={`text-4xl ${got ? "" : "grayscale"}`}
                animate={got ? { rotate: [0, -6, 6, 0] } : undefined}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
              >
                {got ? it.emoji : "🔒"}
              </motion.span>
              {!got && (
                <span className="text-[10px] font-extrabold text-muted-foreground">
                  +{needed}⭐
                </span>
              )}
              {got && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-kids-green text-[10px] font-extrabold text-primary-foreground kids-shadow">
                  ✓
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
