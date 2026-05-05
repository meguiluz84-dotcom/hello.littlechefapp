import imgDino from "@/assets/dino-chef.png";
import imgCat from "@/assets/avatar-cat.png";
import imgBunny from "@/assets/avatar-bunny.png";
import imgUnicorn from "@/assets/avatar-unicorn.png";

export type AvatarId =
  | "dino"
  | "cat"
  | "bunny"
  | "unicorn";

export interface Avatar {
  id: AvatarId;
  label: string;
  image: string;
  emoji: string;
  color: string; // tailwind class for backdrop
}

export const avatars: Avatar[] = [
  { id: "dino", label: "Dino", image: imgDino, emoji: "🦖", color: "bg-kids-green" },
  { id: "cat", label: "Gatito", image: imgCat, emoji: "🐱", color: "bg-kids-orange" },
  { id: "bunny", label: "Conejito", image: imgBunny, emoji: "🐰", color: "bg-kids-pink" },
  { id: "unicorn", label: "Unicornio", image: imgUnicorn, emoji: "🦄", color: "bg-kids-pink" },
];

export const avatarById = (id: AvatarId): Avatar =>
  avatars.find((a) => a.id === id) ?? avatars[0];
