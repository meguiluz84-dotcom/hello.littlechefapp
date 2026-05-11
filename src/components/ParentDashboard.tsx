import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RESTRICTION_INFO, type Restrictions } from "@/data/recipeMeta";
import { usePlayers, type AgeBucket } from "@/hooks/use-players";
import { useCompletedRecipes } from "@/hooks/use-completed-recipes";
import { useMedals } from "@/hooks/use-medals";
import { MEDALS } from "@/data/medals";
import { avatarById } from "@/data/avatars";
import { recipes as ALL_RECIPES } from "@/data/recipes";
import { getRecipeName } from "@/data/recipeNames";
import { useVoice } from "@/hooks/use-voice";
import { usePhotos } from "@/hooks/use-photos";
import { useTastings } from "@/hooks/use-tastings";
import { activeSwaps } from "@/data/ingredientSwaps";
import ParentLibrary from "./ParentLibrary";
import StepTimersConfig from "./StepTimersConfig";

type Tab = "ajustes" | "perfiles" | "progreso" | "seguridad" | "guias" | "timers" | "extras" | "fotos" | "probados";

interface Props {
  onClose: () => void;
  onChangeAvatar: () => void;
  onAddPlayer: () => void;
  onResetProgress: () => void;
  onOpenWeekPlan: () => void;
  onOpenShopping: () => void;
  onOpenComingSoon: () => void;
  soundOn: boolean;
  onToggleSound: (v: boolean) => void;
}

const AGE_OPTIONS: { id: AgeBucket; emoji: string; label: string }[] = [
  { id: "2-3", emoji: "🍼", label: "2-3" },
  { id: "4-5", emoji: "🧒", label: "4-5" },
  { id: "6+",  emoji: "🧑", label: "6+" },
];

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: "ajustes",   emoji: "⚙️", label: "Ajustes" },
  { id: "perfiles",  emoji: "👥", label: "Perfiles" },
  { id: "progreso",  emoji: "📈", label: "Progreso" },
  { id: "seguridad", emoji: "🛡️", label: "Seguridad" },
  { id: "guias",     emoji: "📚", label: "Guías" },
  { id: "timers",    emoji: "⏱️", label: "Timers" },
  { id: "fotos",     emoji: "📸", label: "Fotos" },
  { id: "probados",  emoji: "🍽️", label: "Probados" },
  { id: "extras",    emoji: "✨", label: "Extras" },
];

export default function ParentDashboard({
  onClose, onChangeAvatar, onAddPlayer, onResetProgress,
  onOpenWeekPlan, onOpenShopping, onOpenComingSoon,
  soundOn, onToggleSound,
}: Props) {
  const { players, active, setActive, remove, update } = usePlayers();
  const { completed } = useCompletedRecipes();
  const { earned, challengesDone } = useMedals();
  const [tab, setTab] = useState<Tab>("ajustes");
  const voice = useVoice();
  const photos = usePhotos();
  const tastings = useTastings();

  // Per-player parent notes (private to parents).
  const notesKey = active ? `lc:p:${active.id}:parent-notes` : null;
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (!notesKey) { setNotes(""); return; }
    try { setNotes(localStorage.getItem(notesKey) ?? ""); } catch { setNotes(""); }
  }, [notesKey]);
  const saveNotes = (v: string) => {
    setNotes(v);
    if (notesKey) { try { localStorage.setItem(notesKey, v); } catch { /* ignore */ } }
  };

  const recipeNameFor = (id: string) => {
    const r = ALL_RECIPES.find((x) => x.id === id);
    if (!r) return id;
    return getRecipeName(active?.avatarId ?? "dino", r.id, r.name);
  };

  const restr: Restrictions = active?.restrictions ?? { nuts: false, dairy: false, gluten: false, vegetarian: false };
  const setRestr = (next: Restrictions) => active && update(active.id, { restrictions: next });
  const setAge = (a: AgeBucket) => active && update(active.id, { age: a });

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">👨‍👩‍👧 Padres</h1>
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl kids-shadow"
          >✖️</button>
        </div>

        {/* Active player chip */}
        {active && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-card p-3 kids-shadow">
            <img src={avatarById(active.avatarId).image} alt="" className="h-12 w-12 object-contain" />
            <div className="flex-1">
              <div className="text-base font-extrabold text-foreground">{active.name}</div>
              <div className="text-xs font-bold text-muted-foreground">Edad {active.age}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 grid grid-cols-3 gap-1">
          {TABS.map((t) => (
            <button
              key={t.id} type="button" onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`flex min-h-14 flex-col items-center justify-center rounded-xl text-[11px] font-extrabold kids-shadow ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="mt-0.5 leading-none">{t.label}</span>
            </button>
          ))}
        </div>

        {/* AJUSTES */}
        {tab === "ajustes" && (
          <div className="space-y-4">
            <section className="flex items-center justify-between rounded-2xl bg-card p-4 kids-shadow">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{soundOn ? "🔊" : "🔇"}</span>
                <span className="text-base font-extrabold text-foreground">Sonidos</span>
              </div>
              <button
                type="button" onClick={() => onToggleSound(!soundOn)}
                aria-pressed={soundOn} aria-label="Activar o desactivar sonidos"
                className={`relative h-10 w-20 rounded-full ${soundOn ? "bg-accent" : "bg-muted"}`}
              >
                <motion.span
                  animate={{ x: soundOn ? 40 : 0 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="absolute left-1 top-1 h-8 w-8 rounded-full bg-card kids-shadow"
                />
              </button>
            </section>

            {voice.supported && (
              <section className="flex items-center justify-between rounded-2xl bg-card p-4 kids-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{voice.enabled ? "🗣️" : "🤐"}</span>
                  <div>
                    <div className="text-base font-extrabold text-foreground">Voz por paso</div>
                    <div className="text-[11px] font-bold text-muted-foreground">Lee cada paso en voz alta.</div>
                  </div>
                </div>
                <button
                  type="button" onClick={() => voice.setEnabled(!voice.enabled)}
                  aria-pressed={voice.enabled} aria-label="Activar o desactivar voz"
                  className={`relative h-10 w-20 rounded-full ${voice.enabled ? "bg-accent" : "bg-muted"}`}
                >
                  <motion.span
                    animate={{ x: voice.enabled ? 40 : 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="absolute left-1 top-1 h-8 w-8 rounded-full bg-card kids-shadow"
                  />
                </button>
              </section>
            )}

            <section>
              <h2 className="mb-2 text-base font-extrabold text-foreground">Edad del niño</h2>
              <div className="grid grid-cols-3 gap-2">
                {AGE_OPTIONS.map((o) => (
                  <button
                    key={o.id} type="button" onClick={() => setAge(o.id)}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl p-2 kids-shadow ${
                      active?.age === o.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                    }`}
                  >
                    <span className="text-2xl">{o.emoji}</span>
                    <span className="text-xs font-extrabold">{o.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <button
              type="button" onClick={onChangeAvatar}
              className="w-full min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
            >🦄 Cambiar personaje</button>

            <button
              type="button"
              onClick={() => { if (confirm("¿Borrar progreso de este perfil?")) onResetProgress(); }}
              className="w-full min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
            >🧹 Borrar progreso</button>
          </div>
        )}

        {/* PERFILES */}
        {tab === "perfiles" && (
          <div className="space-y-3">
            {players.map((p) => (
              <div key={p.id} className={`flex items-center gap-3 rounded-2xl p-3 kids-shadow ${p.id === active?.id ? "bg-kids-yellow/40" : "bg-card"}`}>
                <img src={avatarById(p.avatarId).image} alt="" className="h-12 w-12 object-contain" />
                <div className="flex-1">
                  <div className="text-base font-extrabold text-foreground">{p.name}</div>
                  <div className="text-xs font-bold text-muted-foreground">{p.age}</div>
                </div>
                {p.id !== active?.id && (
                  <button
                    type="button" onClick={() => setActive(p.id)}
                    className="min-h-10 rounded-full bg-card px-3 py-1 text-xs font-extrabold text-foreground kids-shadow"
                  >Activar</button>
                )}
                {players.length > 1 && (
                  <button
                    type="button"
                    onClick={() => { if (confirm(`¿Borrar perfil de ${p.name}?`)) remove(p.id); }}
                    aria-label={`Borrar ${p.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-lg kids-shadow"
                  >🗑️</button>
                )}
              </div>
            ))}
            <button
              type="button" onClick={onAddPlayer}
              className="w-full min-h-16 rounded-2xl border-4 border-dashed border-muted bg-card px-4 py-3 text-base font-extrabold text-foreground"
            >➕ Añadir perfil</button>
          </div>
        )}

        {/* PROGRESO */}
        {tab === "progreso" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-card p-4 kids-shadow">
              <div className="text-sm font-bold text-muted-foreground">{active?.name}</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-background p-3">
                  <div className="text-2xl font-extrabold text-foreground">{completed.length}</div>
                  <div className="text-xs font-bold text-muted-foreground">Recetas</div>
                </div>
                <div className="rounded-xl bg-background p-3">
                  <div className="text-2xl font-extrabold text-foreground">{earned.length}/{MEDALS.length}</div>
                  <div className="text-xs font-bold text-muted-foreground">Medallas</div>
                </div>
                <div className="rounded-xl bg-background p-3">
                  <div className="text-2xl font-extrabold text-foreground">{challengesDone}</div>
                  <div className="text-xs font-bold text-muted-foreground">Retos</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-card p-4 kids-shadow">
              <div className="mb-2 text-sm font-extrabold text-foreground">Medallas obtenidas</div>
              <div className="flex flex-wrap gap-2">
                {MEDALS.filter((m) => earned.includes(m.id)).map((m) => (
                  <span key={m.id} title={m.label} className="text-3xl">{m.emoji}</span>
                ))}
                {earned.length === 0 && (
                  <span className="text-sm font-bold text-muted-foreground">Aún no hay medallas</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-card p-4 kids-shadow">
              <div className="mb-2 text-sm font-extrabold text-foreground">📜 Historial de recetas</div>
              {completed.length === 0 ? (
                <p className="text-sm font-bold text-muted-foreground">Aún no hay recetas completadas.</p>
              ) : (
                <ul className="max-h-48 space-y-1 overflow-y-auto pr-1">
                  {[...completed].reverse().map((id) => (
                    <li key={id} className="flex items-center gap-2 rounded-lg bg-background px-2 py-1.5 text-sm font-extrabold text-foreground">
                      <span>✅</span>
                      <span className="line-clamp-1">{recipeNameFor(id)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl bg-card p-4 kids-shadow">
              <label className="mb-2 block text-sm font-extrabold text-foreground" htmlFor="parent-notes">
                📝 Notas (privadas)
              </label>
              <textarea
                id="parent-notes"
                value={notes}
                onChange={(e) => saveNotes(e.target.value)}
                placeholder="Alergias, gustos, observaciones del peque…"
                className="min-h-28 w-full resize-y rounded-xl border border-muted bg-background p-3 text-sm font-medium text-foreground outline-none focus:border-primary"
              />
              <p className="mt-1 text-[11px] font-bold text-muted-foreground">Solo se guardan en este dispositivo.</p>
            </div>
          </div>
        )}

        {/* SEGURIDAD */}
        {tab === "seguridad" && (
          <div className="space-y-4">
            <section className="rounded-2xl bg-kids-yellow/40 p-4 text-sm font-bold text-foreground kids-shadow">
              <p className="mb-2 text-base font-extrabold">⚠️ Recordatorios</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Cuchillos, horno y calor solo con un adulto.</li>
                <li>Revisa los alérgenos antes de empezar.</li>
                <li>Acompaña al niño durante toda la receta.</li>
                <li>Lavado de manos automático antes de cada receta.</li>
              </ul>
            </section>
            <section>
              <h2 className="mb-2 text-base font-extrabold text-foreground">Alérgenos a evitar</h2>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(RESTRICTION_INFO) as (keyof Restrictions)[]).map((k) => {
                  const info = RESTRICTION_INFO[k];
                  const on = restr[k];
                  return (
                    <button
                      key={k} type="button"
                      onClick={() => setRestr({ ...restr, [k]: !on })}
                      aria-pressed={on}
                      className={`flex min-h-16 items-center gap-2 rounded-2xl p-3 kids-shadow ${
                        on ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
                      }`}
                    >
                      <span className="text-2xl">{info.emoji}</span>
                      <span className="text-left text-sm font-extrabold leading-tight">{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {(() => {
              const swaps = activeSwaps(restr);
              if (swaps.length === 0) return null;
              return (
                <section>
                  <h2 className="mb-2 text-base font-extrabold text-foreground">🔄 Sustituciones automáticas</h2>
                  <div className="rounded-2xl bg-card p-3 kids-shadow">
                    <p className="mb-2 text-[11px] font-bold text-muted-foreground">Se aplican en las recetas según los alérgenos activos.</p>
                    <ul className="space-y-1.5">
                      {swaps.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 rounded-lg bg-background px-2 py-1.5 text-sm font-extrabold text-foreground">
                          <span className="text-xl">{s.from}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-xl">{s.to}</span>
                          <span className="ml-1 text-xs font-bold text-muted-foreground">{s.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })()}
          </div>
        )}

        {/* GUIAS */}
        {tab === "guias" && <ParentLibrary />}

        {/* TIMERS */}
        {tab === "timers" && (
          <StepTimersConfig avatarId={active?.avatarId ?? "dino"} />
        )}

        {/* FOTOS */}
        {tab === "fotos" && (
          <div className="space-y-3">
            {photos.recipeIds.length === 0 ? (
              <div className="rounded-2xl bg-card p-6 text-center kids-shadow">
                <div className="mb-2 text-4xl">📸</div>
                <p className="text-sm font-bold text-muted-foreground">Aún no hay fotos guardadas. Al terminar una receta puedes guardar la foto del plato.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {photos.recipeIds.map((rid) => {
                  const src = photos.get(rid);
                  if (!src) return null;
                  return (
                    <div key={rid} className="overflow-hidden rounded-2xl bg-card kids-shadow">
                      <img src={src} alt={recipeNameFor(rid)} className="aspect-square w-full object-cover" />
                      <div className="flex items-center justify-between gap-1 p-2">
                        <span className="line-clamp-1 text-[11px] font-extrabold text-foreground">{recipeNameFor(rid)}</span>
                        <button
                          type="button"
                          onClick={() => { if (confirm("¿Borrar foto?")) photos.remove(rid); }}
                          aria-label="Borrar foto"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-base"
                        >🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROBADOS */}
        {tab === "probados" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-card p-4 kids-shadow">
              <div className="text-sm font-bold text-muted-foreground">Reacciones del peque</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {(["😋","🙂","😖"] as const).map((r) => {
                  const n = tastings.items.filter((t) => t.reaction === r).length;
                  return (
                    <div key={r} className="rounded-xl bg-background p-3">
                      <div className="text-3xl">{r}</div>
                      <div className="mt-1 text-base font-extrabold text-foreground">{n}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl bg-card p-4 kids-shadow">
              <div className="mb-2 text-sm font-extrabold text-foreground">🍽️ Historial probados</div>
              {tastings.items.length === 0 ? (
                <p className="text-sm font-bold text-muted-foreground">Aún no hay reacciones registradas.</p>
              ) : (
                <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
                  {[...tastings.items].sort((a,b) => b.date - a.date).map((t) => (
                    <li key={t.recipeId + t.date} className="flex items-center gap-2 rounded-lg bg-background px-2 py-1.5 text-sm font-extrabold text-foreground">
                      <span className="text-xl">{t.reaction}</span>
                      <span className="line-clamp-1 flex-1">{recipeNameFor(t.recipeId)}</span>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {new Date(t.date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* EXTRAS */}
        {tab === "extras" && (
          <div className="space-y-3">
            <button
              type="button" onClick={onOpenWeekPlan}
              className="w-full min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
            >📅 Plan semanal</button>
            <button
              type="button" onClick={onOpenShopping}
              className="w-full min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
            >🛒 Lista de compra</button>
            <button
              type="button" onClick={onOpenComingSoon}
              className="w-full min-h-16 rounded-2xl bg-card px-4 py-3 text-left text-base font-extrabold text-foreground kids-shadow"
            >🚀 Próximamente</button>
          </div>
        )}
      </div>
    </div>
  );
}
