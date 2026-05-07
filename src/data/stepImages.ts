import { supabase } from "@/integrations/supabase/client";

// Locally bundled step images (generated previously)
const localModules = import.meta.glob("../assets/steps/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const localMap: Record<string, string> = {};
for (const [path, url] of Object.entries(localModules)) {
  const name = path.split("/").pop()!.replace(/\.png$/, "");
  localMap[name] = url;
}

// Remote map (filled from step_jobs table)
const remoteMap: Record<string, string> = {};
let loaded = false;
let loadingPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

async function loadRemote() {
  const { data } = await supabase
    .from("step_jobs")
    .select("recipe_id, step_index, image_url")
    .eq("status", "done")
    .not("image_url", "is", null);
  for (const r of data ?? []) {
    if (r.image_url) remoteMap[`${r.recipe_id}-${r.step_index}`] = r.image_url;
  }
  loaded = true;
  listeners.forEach((cb) => cb());
}

export function ensureRemoteStepsLoaded() {
  if (loaded) return Promise.resolve();
  if (!loadingPromise) loadingPromise = loadRemote();
  return loadingPromise;
}

export function subscribeStepImages(cb: () => void) {
  listeners.add(cb);
  ensureRemoteStepsLoaded();
  return () => listeners.delete(cb);
}

export function getStepImage(
  recipeId: string,
  stepIndex: number,
): string | undefined {
  const key = `${recipeId}-${stepIndex + 1}`;
  return remoteMap[key] ?? localMap[key];
}
