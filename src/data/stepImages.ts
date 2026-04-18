// Auto-collected step infographics. Missing entries fall back to emoji card.
const modules = import.meta.glob("../assets/steps/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const map: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
  const name = path.split("/").pop()!.replace(/\.png$/, "");
  map[name] = url;
}

export function getStepImage(recipeId: string, stepIndex: number): string | undefined {
  return map[`${recipeId}-${stepIndex + 1}`];
}
