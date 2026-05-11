// Short Spanish phrases per action. Used by the optional voice feature.
export const VOICE_LINES: Record<string, string> = {
  cut: "Corta con un adulto",
  mix: "Mezcla con cuidado",
  pour: "Vierte poco a poco",
  spread: "Esparce con la cuchara",
  place: "Coloca encima",
  shake: "¡A agitar!",
  scoop: "Coge una cucharada",
  peel: "Pela con los dedos",
  wash: "Lava muy bien",
};

export function lineForAction(action: string): string {
  return VOICE_LINES[action] ?? "¡Vamos!";
}
