import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/proximamente")({
  component: ComingSoon,
  head: () => ({
    meta: [
      { title: "Próximamente · Little Chef" },
      { name: "description", content: "Funciones que vienen pronto a Little Chef." },
    ],
  }),
});

const ITEMS = [
  { emoji: "👨‍👩‍👧", label: "Comunidad familiar", desc: "Comparte recetas con otras familias" },
  { emoji: "⭐",     label: "Premium",             desc: "Recetas y avatares exclusivos" },
  { emoji: "🏫",     label: "Modo escuela",         desc: "Aulas y profes" },
  { emoji: "📸",     label: "Fotos del plato",      desc: "Sube tu creación final" },
  { emoji: "📤",     label: "Exportar recetas",     desc: "Descarga en PDF" },
  { emoji: "🌍",     label: "Multiidioma",          desc: "Inglés, francés y más" },
];

function ComingSoon() {
  return (
    <div className="min-h-screen bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">🚀 Próximamente</h1>
          <Link
            to="/"
            aria-label="Volver"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >🏠</Link>
        </div>
        <p className="mb-6 text-base font-bold text-muted-foreground">
          Estamos cocinando estas funciones para ti.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
              className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-3xl bg-card p-3 kids-shadow"
            >
              <span className="text-6xl">{it.emoji}</span>
              <span className="text-balance text-center text-sm font-extrabold text-foreground">{it.label}</span>
              <span className="text-balance text-center text-xs font-bold text-muted-foreground line-clamp-2">{it.desc}</span>
              <span className="rounded-full bg-kids-yellow px-2 py-0.5 text-[10px] font-extrabold text-foreground">Pronto 🚀</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
