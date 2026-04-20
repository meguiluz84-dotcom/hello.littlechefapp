import imgDino from "@/assets/dino-chef.png";
import imgCat from "@/assets/avatar-cat.png";
import imgBunny from "@/assets/avatar-bunny.png";
import imgPrincess from "@/assets/avatar-princess.png";
import imgHero from "@/assets/avatar-hero.png";
import imgCar from "@/assets/avatar-car.png";
import imgRobot from "@/assets/avatar-robot.png";
import imgStar from "@/assets/avatar-star.png";

export type AvatarId =
  | "dino"
  | "cat"
  | "bunny"
  | "princess"
  | "hero"
  | "car"
  | "robot"
  | "star";

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
  { id: "princess", label: "Princesa", image: imgPrincess, emoji: "👑", color: "bg-kids-purple" },
  { id: "hero", label: "Súper", image: imgHero, emoji: "🦸", color: "bg-kids-red" },
  { id: "car", label: "Coche", image: imgCar, emoji: "🏎️", color: "bg-kids-yellow" },
  { id: "robot", label: "Robot", image: imgRobot, emoji: "🤖", color: "bg-kids-teal" },
  { id: "star", label: "Estrella", image: imgStar, emoji: "⭐", color: "bg-kids-yellow" },
];

export const avatarById = (id: AvatarId): Avatar =>
  avatars.find((a) => a.id === id) ?? avatars[0];
