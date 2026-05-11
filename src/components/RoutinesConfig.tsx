import { useState } from "react";
import { useRoutines, type RoutineDay } from "@/hooks/use-routines";

const PRESETS: { emoji: string; label: string }[] = [
  { emoji: "🥞", label: "Desayuno juntos" },
  { emoji: "🍪", label: "Tarde de horno" },
  { emoji: "🥗", label: "Ensalada en familia" },
  { emoji: "🍕", label: "Pizza del finde" },
  { emoji: "🥤", label: "Smoothie post-cole" },
];

export default function RoutinesConfig() {
  const r = useRoutines();
  const [day, setDay] = useState<RoutineDay>("sab");
  const [time, setTime] = useState("11:00");
  const [preset, setPreset] = useState(PRESETS[0]);

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-kids-yellow/40 p-4 text-sm font-bold text-foreground kids-shadow">
        <p className="text-base font-extrabold">🏡 Rutinas familiares</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          Pequeños rituales de cocina que repetís cada semana. La app los recordará.
        </p>
      </section>

      <section className="rounded-2xl bg-card p-3 kids-shadow space-y-3">
        <div>
          <label className="mb-1 block text-xs font-extrabold text-muted-foreground">Tipo</label>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label} type="button"
                onClick={() => setPreset(p)}
                aria-pressed={preset.label === p.label}
                className={`flex min-h-10 items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                  preset.label === p.label ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
                }`}
              >
                <span aria-hidden>{p.emoji}</span> {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-extrabold text-muted-foreground">Día</label>
            <div className="flex flex-wrap gap-1">
              {r.days.map((d) => (
                <button
                  key={d.id} type="button" onClick={() => setDay(d.id)}
                  aria-pressed={day === d.id}
                  className={`min-h-9 rounded-full px-2 py-1 text-xs font-extrabold ${
                    day === d.id ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
                  }`}
                >{d.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-extrabold text-muted-foreground">Hora</label>
            <input
              type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="min-h-10 rounded-xl border border-muted bg-background px-2 text-sm font-extrabold text-foreground"
            />
          </div>
          <button
            type="button"
            onClick={() => r.add({ ...preset, day, time })}
            className="min-h-10 rounded-xl bg-accent px-3 text-sm font-extrabold text-accent-foreground kids-shadow"
          >➕ Añadir</button>
        </div>
      </section>

      {r.items.length === 0 ? (
        <p className="rounded-2xl bg-card p-4 text-center text-sm font-bold text-muted-foreground kids-shadow">
          Aún no hay rutinas. Configura la primera arriba.
        </p>
      ) : (
        <ul className="space-y-2">
          {r.items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 kids-shadow">
              <span className="text-3xl" aria-hidden>{it.emoji}</span>
              <div className="flex-1">
                <div className="text-sm font-extrabold text-foreground">{it.label}</div>
                <div className="text-xs font-bold text-muted-foreground">
                  {r.days.find((d) => d.id === it.day)?.label} · {it.time}
                </div>
              </div>
              <button
                type="button" onClick={() => r.remove(it.id)} aria-label="Borrar rutina"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-lg kids-shadow"
              >🗑️</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
