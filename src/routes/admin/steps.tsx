import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  getQueueStatus,
  processQueue,
} from "@/server/stepQueue.functions";

export const Route = createFileRoute("/admin/steps")({
  component: AdminStepsPage,
});

type Job = {
  recipe_id: string;
  step_index: number;
  status: string;
  image_url: string | null;
  error: string | null;
  attempts: number;
};

function AdminStepsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [counts, setCounts] = useState({
    pending: 0,
    processing: 0,
    done: 0,
    failed: 0,
  });
  const [auto, setAuto] = useState(true);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    try {
      const r = await getQueueStatus();
      setJobs(r.jobs as Job[]);
      setCounts(r.counts);
    } catch (e) {
      console.error(e);
    }
  }

  async function runOnce() {
    if (running) return;
    setRunning(true);
    try {
      const r = await processQueue({ data: { batch: 3 } });
      setPaused(r.stopped);
      if (r.stopped) {
        toast.warning(
          "Generación pausada: créditos agotados o límite. Reintentaré pronto.",
        );
      } else if (r.processed > 0) {
        toast.success(`Generadas ${r.results.filter((x) => x.ok).length} fotos`);
      }
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al procesar la cola");
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!auto) return;
    intervalRef.current = setInterval(() => {
      if (counts.pending > 0 && !running) runOnce();
      else if (counts.pending === 0) refresh();
    }, paused ? 60_000 : 5_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, paused, counts.pending, running]);

  const total = jobs.length;
  const pct = total === 0 ? 0 : Math.round((counts.done / total) * 100);

  const grouped = jobs.reduce<Record<string, Job[]>>((acc, j) => {
    (acc[j.recipe_id] ??= []).push(j);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cola de fotos de pasos</h1>
        <p className="text-sm text-muted-foreground">
          La generación se reanuda automáticamente cuando vuelvan los créditos.
        </p>
      </div>

      <div className="space-y-2">
        <Progress value={pct} />
        <div className="flex flex-wrap gap-3 text-sm">
          <span>✅ Hechas: <b>{counts.done}</b></span>
          <span>⏳ Pendientes: <b>{counts.pending}</b></span>
          <span>🔄 En curso: <b>{counts.processing}</b></span>
          <span className="text-destructive">❌ Fallidas: <b>{counts.failed}</b></span>
          <span className="ml-auto">{pct}% · {total} totales</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={runOnce} disabled={running || counts.pending === 0}>
          {running ? "Procesando…" : "Procesar 3 ahora"}
        </Button>
        <Button variant="outline" onClick={() => setAuto((v) => !v)}>
          Auto: {auto ? "ON" : "OFF"}
        </Button>
        <Button variant="ghost" onClick={refresh}>Refrescar</Button>
        {paused && (
          <span className="text-sm text-amber-600 self-center">
            Esperando créditos…
          </span>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([rid, list]) => (
          <div key={rid} className="rounded-lg border p-3">
            <div className="font-semibold mb-2">{rid}</div>
            <div className="flex flex-wrap gap-2">
              {list.map((j) => (
                <div
                  key={j.step_index}
                  title={j.error ?? j.status}
                  className={
                    "size-10 rounded flex items-center justify-center text-xs font-bold " +
                    (j.status === "done"
                      ? "bg-green-500 text-white"
                      : j.status === "processing"
                        ? "bg-blue-400 text-white animate-pulse"
                        : j.status === "failed"
                          ? "bg-red-500 text-white"
                          : "bg-muted text-muted-foreground")
                  }
                >
                  {j.step_index}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
