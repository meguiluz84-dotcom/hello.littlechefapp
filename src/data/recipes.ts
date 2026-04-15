import imgFruitSalad from "@/assets/recipe-fruit-salad.jpg";
import imgSandwich from "@/assets/recipe-sandwich.jpg";
import imgSmoothie from "@/assets/recipe-smoothie.jpg";
import imgCookies from "@/assets/recipe-cookies.jpg";
import imgAntsOnLog from "@/assets/recipe-ants-on-log.jpg";
import imgParfait from "@/assets/recipe-parfait.jpg";
import imgMiniPizza from "@/assets/recipe-mini-pizza.jpg";
import imgVeggieWrap from "@/assets/recipe-veggie-wrap.jpg";
import imgBananaPops from "@/assets/recipe-banana-pops.jpg";
import imgTrailMix from "@/assets/recipe-trail-mix.jpg";
import imgRiceBalls from "@/assets/recipe-rice-balls.jpg";
import imgFruitKabobs from "@/assets/recipe-fruit-kabobs.jpg";

export interface Ingredient {
  emoji: string;
  quantity?: number;
}

export interface RecipeStep {
  emoji: string; // main action emoji
  ingredientEmojis: string[]; // ingredients used in this step
  actionIcon: "cut" | "mix" | "pour" | "spread" | "place" | "shake" | "scoop" | "peel" | "wash";
}

export interface Recipe {
  id: string;
  image: string;
  emoji: string;
  color: string; // tailwind token
  ingredients: Ingredient[];
  steps: RecipeStep[];
  difficulty: 1 | 2 | 3; // shown as stars
}

export const recipes: Recipe[] = [
  {
    id: "fruit-salad",
    image: imgFruitSalad,
    emoji: "🥗",
    color: "kids-green",
    difficulty: 1,
    ingredients: [
      { emoji: "🍓", quantity: 3 },
      { emoji: "🍌", quantity: 1 },
      { emoji: "🫐", quantity: 5 },
      { emoji: "🍇", quantity: 5 },
    ],
    steps: [
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "wash" },
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "peel" },
      { emoji: "🔪", ingredientEmojis: ["🍓", "🍌"], actionIcon: "cut" },
      { emoji: "🥣", ingredientEmojis: ["🍓", "🍌", "🫐", "🍇"], actionIcon: "mix" },
    ],
  },
  {
    id: "sandwich",
    image: imgSandwich,
    emoji: "🥪",
    color: "kids-orange",
    difficulty: 1,
    ingredients: [
      { emoji: "🍞", quantity: 2 },
      { emoji: "🥜", quantity: 1 },
      { emoji: "🍓", quantity: 1 },
    ],
    steps: [
      { emoji: "🍞", ingredientEmojis: ["🍞"], actionIcon: "place" },
      { emoji: "🥜", ingredientEmojis: ["🥜"], actionIcon: "spread" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "spread" },
      { emoji: "🍞", ingredientEmojis: ["🍞"], actionIcon: "place" },
    ],
  },
  {
    id: "smoothie",
    image: imgSmoothie,
    emoji: "🥤",
    color: "kids-pink",
    difficulty: 1,
    ingredients: [
      { emoji: "🍌", quantity: 1 },
      { emoji: "🍓", quantity: 3 },
      { emoji: "🥛", quantity: 1 },
      { emoji: "🍯", quantity: 1 },
    ],
    steps: [
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "peel" },
      { emoji: "🍓", ingredientEmojis: ["🍌", "🍓"], actionIcon: "place" },
      { emoji: "🥛", ingredientEmojis: ["🥛"], actionIcon: "pour" },
      { emoji: "🍯", ingredientEmojis: ["🍯"], actionIcon: "pour" },
      { emoji: "🌀", ingredientEmojis: [], actionIcon: "mix" },
    ],
  },
  {
    id: "cookies",
    image: imgCookies,
    emoji: "🍪",
    color: "kids-purple",
    difficulty: 2,
    ingredients: [
      { emoji: "🥣", quantity: 2 },
      { emoji: "🥜", quantity: 1 },
      { emoji: "🍯", quantity: 1 },
      { emoji: "🍫", quantity: 1 },
    ],
    steps: [
      { emoji: "🥜", ingredientEmojis: ["🥜", "🍯"], actionIcon: "mix" },
      { emoji: "🥣", ingredientEmojis: ["🥣"], actionIcon: "pour" },
      { emoji: "🍫", ingredientEmojis: ["🍫"], actionIcon: "mix" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "scoop" },
      { emoji: "❄️", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "ants-on-log",
    image: imgAntsOnLog,
    emoji: "🐜",
    color: "kids-teal",
    difficulty: 1,
    ingredients: [
      { emoji: "🥬", quantity: 3 },
      { emoji: "🥜", quantity: 1 },
      { emoji: "🫐", quantity: 6 },
    ],
    steps: [
      { emoji: "🥬", ingredientEmojis: ["🥬"], actionIcon: "wash" },
      { emoji: "🥜", ingredientEmojis: ["🥜"], actionIcon: "spread" },
      { emoji: "🫐", ingredientEmojis: ["🫐"], actionIcon: "place" },
    ],
  },
  {
    id: "parfait",
    image: imgParfait,
    emoji: "🍨",
    color: "kids-blue",
    difficulty: 1,
    ingredients: [
      { emoji: "🥛", quantity: 1 },
      { emoji: "🍓", quantity: 3 },
      { emoji: "🫐", quantity: 5 },
      { emoji: "🥣", quantity: 1 },
    ],
    steps: [
      { emoji: "🥛", ingredientEmojis: ["🥛"], actionIcon: "scoop" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "place" },
      { emoji: "🥣", ingredientEmojis: ["🥣"], actionIcon: "scoop" },
      { emoji: "🫐", ingredientEmojis: ["🫐"], actionIcon: "place" },
      { emoji: "🥛", ingredientEmojis: ["🥛"], actionIcon: "scoop" },
    ],
  },
  {
    id: "mini-pizza",
    image: imgMiniPizza,
    emoji: "🍕",
    color: "kids-red",
    difficulty: 2,
    ingredients: [
      { emoji: "🍘", quantity: 4 },
      { emoji: "🍅", quantity: 1 },
      { emoji: "🧀", quantity: 1 },
    ],
    steps: [
      { emoji: "🍘", ingredientEmojis: ["🍘"], actionIcon: "place" },
      { emoji: "🍅", ingredientEmojis: ["🍅"], actionIcon: "spread" },
      { emoji: "🧀", ingredientEmojis: ["🧀"], actionIcon: "place" },
    ],
  },
  {
    id: "veggie-wrap",
    image: imgVeggieWrap,
    emoji: "🌯",
    color: "kids-green",
    difficulty: 2,
    ingredients: [
      { emoji: "🫓", quantity: 1 },
      { emoji: "🥬", quantity: 2 },
      { emoji: "🍅", quantity: 1 },
      { emoji: "🧀", quantity: 1 },
    ],
    steps: [
      { emoji: "🥬", ingredientEmojis: ["🥬"], actionIcon: "wash" },
      { emoji: "🍅", ingredientEmojis: ["🍅"], actionIcon: "cut" },
      { emoji: "🫓", ingredientEmojis: ["🫓"], actionIcon: "place" },
      { emoji: "🧀", ingredientEmojis: ["🥬", "🍅", "🧀"], actionIcon: "place" },
      { emoji: "🌯", ingredientEmojis: [], actionIcon: "mix" },
    ],
  },
  {
    id: "banana-pops",
    image: imgBananaPops,
    emoji: "🍫",
    color: "kids-purple",
    difficulty: 2,
    ingredients: [
      { emoji: "🍌", quantity: 2 },
      { emoji: "🍫", quantity: 1 },
      { emoji: "🍬", quantity: 1 },
    ],
    steps: [
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "peel" },
      { emoji: "🔪", ingredientEmojis: ["🍌"], actionIcon: "cut" },
      { emoji: "🍫", ingredientEmojis: ["🍫"], actionIcon: "pour" },
      { emoji: "🍬", ingredientEmojis: ["🍬"], actionIcon: "shake" },
      { emoji: "❄️", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "trail-mix",
    image: imgTrailMix,
    emoji: "🥜",
    color: "kids-orange",
    difficulty: 1,
    ingredients: [
      { emoji: "🥜", quantity: 1 },
      { emoji: "🍫", quantity: 1 },
      { emoji: "🥣", quantity: 1 },
      { emoji: "🍇", quantity: 5 },
    ],
    steps: [
      { emoji: "🥣", ingredientEmojis: ["🥣"], actionIcon: "scoop" },
      { emoji: "🥜", ingredientEmojis: ["🥜"], actionIcon: "pour" },
      { emoji: "🍫", ingredientEmojis: ["🍫"], actionIcon: "pour" },
      { emoji: "🍇", ingredientEmojis: ["🍇"], actionIcon: "place" },
      { emoji: "🥄", ingredientEmojis: [], actionIcon: "shake" },
    ],
  },
  {
    id: "rice-balls",
    image: imgRiceBalls,
    emoji: "🍙",
    color: "kids-teal",
    difficulty: 2,
    ingredients: [
      { emoji: "🍚", quantity: 1 },
      { emoji: "🧂", quantity: 1 },
      { emoji: "🥬", quantity: 1 },
    ],
    steps: [
      { emoji: "🍚", ingredientEmojis: ["🍚"], actionIcon: "scoop" },
      { emoji: "🧂", ingredientEmojis: ["🧂"], actionIcon: "shake" },
      { emoji: "🖐️", ingredientEmojis: ["🍚"], actionIcon: "mix" },
      { emoji: "🥬", ingredientEmojis: ["🥬"], actionIcon: "place" },
    ],
  },
  {
    id: "fruit-kabobs",
    image: imgFruitKabobs,
    emoji: "🍡",
    color: "kids-pink",
    difficulty: 1,
    ingredients: [
      { emoji: "🍓", quantity: 3 },
      { emoji: "🍇", quantity: 3 },
      { emoji: "🍈", quantity: 2 },
      { emoji: "🫐", quantity: 3 },
    ],
    steps: [
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "wash" },
      { emoji: "🍈", ingredientEmojis: ["🍈"], actionIcon: "cut" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "place" },
      { emoji: "🍇", ingredientEmojis: ["🍇", "🍈", "🫐"], actionIcon: "place" },
    ],
  },
];
