import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GUIDE_CATEGORIES, GUIDES, guidesByCategory, type Guide, type GuideCategory } from "@/data/parentLibrary";

export default function ParentLibrary() {
  const [cat, setCat] = useState<GuideCategory | null>(null);
  const [open, setOpen] = useState<Guide | null>(null);

  if (open) {
    return (
      <motion.article
        key={open.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <button
          type="button"
          onClick={() => setOpen(null)}
          className="min-h-12 rounded-full bg-card px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
        >⬅️ Volver</button>
        <header className="rounded-2xl bg-card p-4 kids-shadow">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{open.emoji}</span>
            <div>
              <h3 className="text-lg font-extrabold leading-tight text-foreground">{open.title}</h3>
              <p className="text-xs font-bold text-muted-foreground">{open.summary}</p>
            </div>
          </div>
        </header>
        {open.body.map((s, i) => (
          <section key={i} className="rounded-2xl bg-card p-4 kids-shadow">
            {s.heading && (
              <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">{s.heading}</h4>
            )}
            <ul className="space-y-2">
              {s.bullets.map((b, j) => (
                <li key={j} className="flex gap-2 text-sm font-medium leading-snug text-foreground">
                  <span aria-hidden>•</span><span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </motion.article>
    );
  }

  const list = cat ? guidesByCategory(cat) : GUIDES.slice(0, 6);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-kids-yellow/40 p-4 text-sm font-bold text-foreground kids-shadow">
        <p className="text-base font-extrabold">📚 Biblioteca para padres</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          Guías cortas para cocinar con peques con cabeza y sin susto.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setCat(null)}
          aria-pressed={cat === null}
          className={`flex min-h-16 items-center gap-2 rounded-2xl p-3 text-left kids-shadow ${
            cat === null ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
          }`}
        >
          <span className="text-2xl" aria-hidden>✨</span>
          <span className="text-sm font-extrabold leading-tight">Destacadas</span>
        </button>
        {GUIDE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`flex min-h-16 items-center gap-2 rounded-2xl p-3 text-left kids-shadow ${
              cat === c.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            }`}
          >
            <span className="text-2xl" aria-hidden>{c.emoji}</span>
            <span className="text-sm font-extrabold leading-tight">{c.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.ul layout className="space-y-2">
          {list.map((g) => (
            <motion.li
              key={g.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                onClick={() => setOpen(g)}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left kids-shadow"
              >
                <span className="text-3xl" aria-hidden>{g.emoji}</span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold leading-tight text-foreground">{g.title}</span>
                  <span className="block text-[11px] font-bold text-muted-foreground">{g.summary}</span>
                </span>
                <span aria-hidden>›</span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
