import imgDino from "@/assets/dino-chef.png";
import imgCat from "@/assets/avatar-cat.png";
import imgBunny from "@/assets/avatar-bunny.png";
import imgUnicorn from "@/assets/avatar-unicorn.png";
import imgDog from "@/assets/avatar-dog.png";
import imgLion from "@/assets/avatar-lion.png";

export type AvatarId =
  | "dino"
  | "cat"
  | "bunny"
  | "unicorn"
  | "dog"
  | "lion";

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
  { id: "dog", label: "Perrito", image: imgDog, emoji: "🐶", color: "bg-kids-orange" },
  { id: "lion", label: "León", image: imgLion, emoji: "🦁", color: "bg-kids-yellow" },
];

export const avatarById = (id: AvatarId): Avatar =>
  avatars.find((a) => a.id === id) ?? avatars[0];
