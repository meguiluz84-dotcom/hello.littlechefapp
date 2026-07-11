import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function generateImage(prompt: string): Promise<Uint8Array> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (resp.status === 402)
    throw Object.assign(new Error("credits_exhausted"), { code: 402 });
  if (resp.status === 429)
    throw Object.assign(new Error("rate_limited"), { code: 429 });
  if (!resp.ok) throw new Error(`AI error ${resp.status}: ${await resp.text()}`);

  const data = await resp.json();
  const url: string | undefined =
    data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url || !url.startsWith("data:")) throw new Error("No image returned");
  const base64 = url.split(",")[1];
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export const getQueueStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("step_jobs")
      .select("recipe_id, step_index, status, image_url, error, attempts")
      .order("recipe_id")
      .order("step_index");
    if (error) throw error;
    const counts = { pending: 0, processing: 0, done: 0, failed: 0 };
    for (const j of data ?? []) counts[j.status as keyof typeof counts]++;
    return { jobs: data ?? [], counts };
  },
);

export const processQueue = createServerFn({ method: "POST" })
  .inputValidator((d: { batch?: number } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const batch = Math.min(Math.max(data.batch ?? 3, 1), 6);
    const { data: jobs, error } = await supabaseAdmin
      .from("step_jobs")
      .select("*")
      .in("status", ["pending", "failed"])
      .lt("attempts", 5)
      .order("attempts")
      .order("created_at")
      .limit(batch);
    if (error) throw error;

    const results: Array<{
      recipe_id: string;
      step_index: number;
      ok: boolean;
      error?: string;
    }> = [];
    let stop = false;

    for (const job of jobs ?? []) {
      if (stop) break;
      await supabaseAdmin
        .from("step_jobs")
        .update({ status: "processing", updated_at: new Date().toISOString() })
        .eq("id", job.id);

      try {
        const bytes = await generateImage(job.prompt);
        const path = `${job.recipe_id}-${job.step_index}.png`;
        const up = await supabaseAdmin.storage
          .from("recipe-steps")
          .upload(path, bytes, { contentType: "image/png", upsert: true });
        if (up.error) throw up.error;
        const { data: pub } = supabaseAdmin.storage
          .from("recipe-steps")
          .getPublicUrl(path);
        await supabaseAdmin
          .from("step_jobs")
          .update({
            status: "done",
            image_url: pub.publicUrl,
            error: null,
            attempts: job.attempts + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
        results.push({
          recipe_id: job.recipe_id,
          step_index: job.step_index,
          ok: true,
        });
      } catch (e: unknown) {
        const err = e as { code?: number; message?: string };
        const msg = err.message ?? String(e);
        const transient = err.code === 402 || err.code === 429;
        await supabaseAdmin
          .from("step_jobs")
          .update({
            status: transient ? "pending" : "failed",
            error: msg,
            attempts: job.attempts + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
        results.push({
          recipe_id: job.recipe_id,
          step_index: job.step_index,
          ok: false,
          error: msg,
        });
        if (transient) stop = true; // pause batch on credits/rate limits
      }
    }

    return { processed: results.length, results, stopped: stop };
  });
