import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { Recipe } from "@/data/recipes";
import {
  getRecipeMeta,
  stepNeedsAdult,
  adultReasonFor,
  RESTRICTION_INFO,
  LEVEL_INFO,
  type Restrictions,
} from "@/data/recipeMeta";
import RecipeShareButton from "./RecipeShareButton";
import dinoChef from "@/assets/dino-chef.png";

interface Props {
  recipe: Recipe;
  displayName?: string;
  onClose: () => void;
}

const ACTION_LABELS: Record<string, string> = {
  cut: "Cortar",
  mix: "Mezclar",
  pour: "Verter",
  spread: "Untar",
  place: "Colocar",
  shake: "Agitar",
  scoop: "Servir con cuchara",
  peel: "Pelar",
  wash: "Lavar",
  bake: "Hornear",
  chill: "Enfriar",
  wait: "Esperar",
};

const RISK_FROM_EMOJI: Record<string, { emoji: string; label: string }> = {
  "🔪": { emoji: "🔪", label: "Cuchillo" },
  "🔥": { emoji: "🔥", label: "Calor / fuego" },
  "🍳": { emoji: "🍳", label: "Sartén caliente" },
  "🫕": { emoji: "🫕", label: "Recipiente caliente" },
  "♨️": { emoji: "♨️", label: "Vapor caliente" },
};

// Naive utensil inference from action icons + emojis present in steps.
function inferUtensils(recipe: Recipe): string[] {
  const set = new Set<string>();
  for (const s of recipe.steps) {
    if (s.actionIcon === "cut") set.add("🔪 Cuchillo (adulto)");
    if (s.actionIcon === "mix" || s.actionIcon === "scoop") set.add("🥄 Cuchara");
    if (s.actionIcon === "pour") set.add("🥣 Bol");
    if (s.actionIcon === "bake" || s.emoji === "🔥") set.add("🔥 Horno o sartén (adulto)");
    if (s.actionIcon === "chill") set.add("❄️ Nevera o congelador");
    if (s.actionIcon === "spread") set.add("🔪 Cuchillo plano (untar)");
  }
  set.add("🧼 Agua y jabón");
  return Array.from(set);
}

export default function ParentRecipeSheet({ recipe, displayName, onClose }: Props) {
  const meta = getRecipeMeta(recipe.id);

  const adultSteps = useMemo(
    () => recipe.steps
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => stepNeedsAdult(s.actionIcon, s.emoji, s.adultRequired)),
    [recipe],
  );

  const kidActions = useMemo(() => {
    const set = new Set<string>();
    for (const s of recipe.steps) {
      if (!stepNeedsAdult(s.actionIcon, s.emoji, s.adultRequired)) {
        set.add(ACTION_LABELS[s.actionIcon] ?? s.actionIcon);
      }
    }
    return Array.from(set);
  }, [recipe]);

  const risks = useMemo(() => {
    const set = new Map<string, { emoji: string; label: string }>();
    for (const s of recipe.steps) {
      const r = RISK_FROM_EMOJI[s.emoji];
      if (r) set.set(r.label, r);
      if (s.actionIcon === "cut") set.set("Cuchillo", RISK_FROM_EMOJI["🔪"]);
      if (s.actionIcon === "bake") set.set("Calor / fuego", RISK_FROM_EMOJI["🔥"]);
    }
    return Array.from(set.values());
  }, [recipe]);

  const utensils = useMemo(() => inferUtensils(recipe), [recipe]);

  const allergens = (Object.keys(RESTRICTION_INFO) as (keyof Restrictions)[])
    .filter((k) => k !== "vegetarian" && meta.restrictions[k]);

  const totalMin = recipe.steps.reduce((acc, s) => {
    const t = s.timerSeconds ?? 0;
    return acc + Math.max(1, Math.round(t / 60) || 1);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-muted bg-card px-4 py-3 kids-shadow">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha para padres"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl"
        >
          ✕
        </button>
        <div className="flex flex-1 items-center gap-3">
          <img
            src={recipe.image}
            alt=""
            className="h-12 w-12 rounded-xl object-cover kids-shadow"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
              👨‍👩‍👧 Para adultos
            </span>
            <span className="text-base font-extrabold leading-tight text-foreground">
              {displayName ?? recipe.name}
            </span>
          </div>
        </div>
        <img src={dinoChef} alt="" className="h-12 w-12 object-contain" />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {/* Quick stats */}
          <section className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-2xl bg-card p-3 kids-shadow">
              <span className="text-2xl">⏱️</span>
              <span className="text-xs font-bold text-muted-foreground">Tiempo</span>
              <span className="text-sm font-extrabold text-foreground">~{totalMin} min</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-card p-3 kids-shadow">
              <span className="text-2xl">{LEVEL_INFO[meta.level].emoji}</span>
              <span className="text-xs font-bold text-muted-foreground">Nivel</span>
              <span className="text-center text-sm font-extrabold text-foreground">
                {LEVEL_INFO[meta.level].label}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-card p-3 kids-shadow">
              <span className="text-2xl">
                {meta.adultHelp === "high" ? "🧑‍🍳" : meta.adultHelp === "medium" ? "🤝" : "🧒"}
              </span>
              <span className="text-xs font-bold text-muted-foreground">Adulto</span>
              <span className="text-sm font-extrabold text-foreground capitalize">
                {meta.adultHelp === "high" ? "Mucho" : meta.adultHelp === "medium" ? "A ratos" : "Poco"}
              </span>
            </div>
          </section>

          {/* Allergens */}
          <section className="rounded-2xl bg-card p-4 kids-shadow">
            <h2 className="mb-2 text-sm font-extrabold text-foreground">⚠️ Posibles alérgenos</h2>
            {allergens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allergens.map((k) => (
                  <span
                    key={k}
                    className="flex items-center gap-1 rounded-full bg-kids-yellow/60 px-3 py-1 text-xs font-extrabold text-foreground kids-shadow"
                  >
                    <span>{RESTRICTION_INFO[k].emoji}</span>
                    <span>{RESTRICTION_INFO[k].label.replace("Sin ", "")}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-muted-foreground">
                No se detectan alérgenos comunes. Aun así, revisad las etiquetas reales.
              </p>
            )}
            <p className="mt-2 text-[11px] font-bold text-muted-foreground">
              Lista orientativa. Revisa siempre las etiquetas del producto que uses.
            </p>
          </section>

          {/* Risks */}
          <section className="rounded-2xl bg-card p-4 kids-shadow">
            <h2 className="mb-2 text-sm font-extrabold text-foreground">🛡️ Riesgos a vigilar</h2>
            {risks.length > 0 ? (
              <ul className="space-y-1">
                {risks.map((r) => (
                  <li key={r.label} className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <span className="text-xl">{r.emoji}</span>
                    <span>{r.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs font-bold text-muted-foreground">
                Sin riesgos térmicos ni de corte. Aun así, supervisión adulta recomendada.
              </p>
            )}
          </section>

          {/* Roles */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-kids-green/30 p-4 kids-shadow">
              <h3 className="mb-2 text-sm font-extrabold text-foreground">🧒 El niño puede</h3>
              {kidActions.length > 0 ? (
                <ul className="space-y-1 text-sm font-bold text-foreground">
                  {kidActions.map((a) => (
                    <li key={a}>· {a}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-bold text-muted-foreground">
                  Esta receta es casi toda de adulto. El niño puede observar y decorar.
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-kids-orange/30 p-4 kids-shadow">
              <h3 className="mb-2 text-sm font-extrabold text-foreground">🧑 El adulto debe</h3>
              {adultSteps.length > 0 ? (
                <ul className="space-y-1 text-sm font-bold text-foreground">
                  {adultSteps.map(({ s, i }) => (
                    <li key={i}>
                      · Paso {i + 1}: {adultReasonFor(s.actionIcon, s.emoji)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-bold text-muted-foreground">
                  Sin pasos críticos. Acompaña y revisa alérgenos.
                </p>
              )}
            </div>
          </section>

          {/* Utensils */}
          <section className="rounded-2xl bg-card p-4 kids-shadow">
            <h2 className="mb-2 text-sm font-extrabold text-foreground">🧺 Utensilios</h2>
            <ul className="grid grid-cols-2 gap-1 text-sm font-bold text-foreground">
              {utensils.map((u) => (
                <li key={u}>· {u}</li>
              ))}
            </ul>
          </section>

          {/* Cut size */}
          {risks.some((r) => r.label === "Cuchillo") && (
            <section className="rounded-2xl bg-kids-blue/30 p-4 kids-shadow">
              <h2 className="mb-1 text-sm font-extrabold text-foreground">📏 Tamaño de corte sugerido</h2>
              <p className="text-xs font-bold text-foreground">
                Trozos del tamaño de un dedo meñique del niño para evitar atragantamientos.
                Para menores de 4 años: nada redondo y entero (uvas, tomates cherry, salchichas) — siempre cortado por la mitad o en cuartos.
              </p>
            </section>
          )}

          {/* Compartir / Imprimir / Taller */}
          <section className="rounded-2xl bg-card p-4 kids-shadow">
            <h2 className="mb-3 text-sm font-extrabold text-foreground">📤 Compartir e imprimir</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/imprimir/$recipeId" params={{ recipeId: recipe.id }}
                target="_blank" rel="noopener"
                className="flex min-h-14 items-center gap-2 rounded-2xl bg-background px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
              >
                <span className="text-2xl" aria-hidden>🖨️</span>
                <span>Imprimir</span>
              </Link>
              <Link
                to="/taller/$recipeId" params={{ recipeId: recipe.id }}
                className="flex min-h-14 items-center gap-2 rounded-2xl bg-background px-4 py-2 text-sm font-extrabold text-foreground kids-shadow"
              >
                <span className="text-2xl" aria-hidden>🏫</span>
                <span>Taller</span>
              </Link>
              <RecipeShareButton recipe={recipe} displayName={displayName} />
            </div>
          </section>

          {/* Safety footer */}
          <section className="rounded-2xl bg-kids-yellow/40 p-4 kids-shadow">
            <p className="text-xs font-bold text-foreground">
              👀 Supervisión adulta necesaria.<br />
              ⚠️ Revisa alergias antes de cocinar.<br />
              🩺 Contenido orientativo. Ante dudas médicas o alimentarias, consulta a un profesional.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
