// Generate an inline SVG data URL "image" for custom recipes that don't have a real photo.
// Renders a colored circle with the recipe emoji centered.

const PALETTE = [
  "#FCD34D", "#FCA5A5", "#86EFAC", "#93C5FD",
  "#C4B5FD", "#FDBA74", "#5EEAD4", "#F9A8D4",
];

function pickColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function emojiImage(emoji: string, seed = emoji): string {
  const bg = pickColor(seed);
  const safe = emoji.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<rect width="200" height="200" rx="32" fill="${bg}"/>` +
    `<text x="100" y="135" font-size="120" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">${safe}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
