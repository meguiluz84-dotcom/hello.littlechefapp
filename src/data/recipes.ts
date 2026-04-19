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
import imgGranolaYogur from "@/assets/recipe-granola-yogur.jpg";
import imgPinchos from "@/assets/recipe-pinchos.jpg";
import imgPancakesBrocoli from "@/assets/recipe-pancakes-brocoli.jpg";
import imgArepas from "@/assets/recipe-arepas.jpg";
import imgEmpanadas from "@/assets/recipe-empanadas.jpg";
import imgPizzaVegetal from "@/assets/recipe-pizza-vegetal.jpg";
import imgGalletasCacao from "@/assets/recipe-galletas-cacao.jpg";
import imgRosquitas from "@/assets/recipe-rosquitas.jpg";

export interface Ingredient {
  emoji: string;
  quantity?: number;
  grams?: number;
}

export interface RecipeStep {
  emoji: string; // main action emoji
  ingredientEmojis: string[]; // ingredients used in this step
  actionIcon: "cut" | "mix" | "pour" | "spread" | "place" | "shake" | "scoop" | "peel" | "wash";
}

export type RecipeCategory = "fruits" | "snacks" | "drinks" | "meals" | "desserts";

export const categories: { id: RecipeCategory; emoji: string }[] = [
  { id: "fruits", emoji: "🍎" },
  { id: "snacks", emoji: "🥪" },
  { id: "drinks", emoji: "🥤" },
  { id: "meals", emoji: "🍳" },
  { id: "desserts", emoji: "🍪" },
];

export interface Recipe {
  id: string;
  name: string;
  image: string;
  emoji: string;
  color: string;
  category: RecipeCategory;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  difficulty: 1 | 2 | 3;
}

export const recipes: Recipe[] = [
  {
    id: "fruit-salad",
    image: imgFruitSalad,
    emoji: "🥗",
    color: "kids-green",
    category: "fruits",
    difficulty: 1,
    ingredients: [
      { emoji: "🍓", quantity: 3, grams: 45 },
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🫐", quantity: 5, grams: 5 },
      { emoji: "🍇", quantity: 5, grams: 25 },
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
    category: "snacks",
    difficulty: 1,
    ingredients: [
      { emoji: "🍞", quantity: 2, grams: 60 },
      { emoji: "🥜", quantity: 1, grams: 15 },
      { emoji: "🍓", quantity: 1, grams: 15 },
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
    category: "drinks",
    difficulty: 1,
    ingredients: [
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🍓", quantity: 3, grams: 45 },
      { emoji: "🥛", quantity: 1, grams: 240 },
      { emoji: "🍯", quantity: 1, grams: 20 },
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
    category: "desserts",
    difficulty: 2,
    ingredients: [
      { emoji: "🥣", quantity: 2, grams: 100 },
      { emoji: "🥜", quantity: 1, grams: 15 },
      { emoji: "🍯", quantity: 1, grams: 20 },
      { emoji: "🍫", quantity: 1, grams: 30 },
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
    category: "snacks",
    difficulty: 1,
    ingredients: [
      { emoji: "🥬", quantity: 3, grams: 60 },
      { emoji: "🥜", quantity: 1, grams: 15 },
      { emoji: "🫐", quantity: 6, grams: 6 },
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
    category: "desserts",
    difficulty: 1,
    ingredients: [
      { emoji: "🥛", quantity: 1, grams: 240 },
      { emoji: "🍓", quantity: 3, grams: 45 },
      { emoji: "🫐", quantity: 5, grams: 5 },
      { emoji: "🥣", quantity: 1, grams: 50 },
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
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🍘", quantity: 4, grams: 200 },
      { emoji: "🍅", quantity: 1, grams: 80 },
      { emoji: "🧀", quantity: 1, grams: 25 },
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
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🫓", quantity: 1, grams: 60 },
      { emoji: "🥬", quantity: 2, grams: 40 },
      { emoji: "🍅", quantity: 1, grams: 80 },
      { emoji: "🧀", quantity: 1, grams: 25 },
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
    category: "desserts",
    difficulty: 2,
    ingredients: [
      { emoji: "🍌", quantity: 2, grams: 240 },
      { emoji: "🍫", quantity: 1, grams: 30 },
      { emoji: "🍬", quantity: 1, grams: 5 },
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
    category: "snacks",
    difficulty: 1,
    ingredients: [
      { emoji: "🥜", quantity: 1, grams: 15 },
      { emoji: "🍫", quantity: 1, grams: 30 },
      { emoji: "🥣", quantity: 1, grams: 50 },
      { emoji: "🍇", quantity: 5, grams: 25 },
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
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🍚", quantity: 1, grams: 80 },
      { emoji: "🧂", quantity: 1, grams: 2 },
      { emoji: "🥬", quantity: 1, grams: 20 },
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
    category: "fruits",
    difficulty: 1,
    ingredients: [
      { emoji: "🍓", quantity: 3, grams: 45 },
      { emoji: "🍇", quantity: 3, grams: 15 },
      { emoji: "🍈", quantity: 2, grams: 200 },
      { emoji: "🫐", quantity: 3, grams: 3 },
    ],
    steps: [
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "wash" },
      { emoji: "🍈", ingredientEmojis: ["🍈"], actionIcon: "cut" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "place" },
      { emoji: "🍇", ingredientEmojis: ["🍇", "🍈", "🫐"], actionIcon: "place" },
    ],
  },
  {
    id: "granola-yogur",
    image: imgGranolaYogur,
    emoji: "🥣",
    color: "kids-yellow",
    category: "snacks",
    difficulty: 2,
    ingredients: [
      { emoji: "🥣", quantity: 1, grams: 50 },
      { emoji: "🥛", quantity: 1, grams: 240 },
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🥝", quantity: 1, grams: 70 },
      { emoji: "🥜", quantity: 1, grams: 15 },
    ],
    steps: [
      { emoji: "🥣", ingredientEmojis: ["🥣", "🥜"], actionIcon: "mix" },
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "peel" },
      { emoji: "🍌", ingredientEmojis: ["🍌", "🥛"], actionIcon: "mix" },
      { emoji: "🥝", ingredientEmojis: ["🥝"], actionIcon: "cut" },
      { emoji: "🥣", ingredientEmojis: ["🥣", "🥝"], actionIcon: "place" },
    ],
  },
  {
    id: "pinchos-queso",
    image: imgPinchos,
    emoji: "🍢",
    color: "kids-red",
    category: "snacks",
    difficulty: 1,
    ingredients: [
      { emoji: "🧀", quantity: 2, grams: 50 },
      { emoji: "🍅", quantity: 5, grams: 400 },
      { emoji: "🍓", quantity: 3, grams: 45 },
    ],
    steps: [
      { emoji: "🧀", ingredientEmojis: ["🧀"], actionIcon: "cut" },
      { emoji: "🍅", ingredientEmojis: ["🍅"], actionIcon: "cut" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "cut" },
      { emoji: "🍢", ingredientEmojis: ["🧀", "🍅", "🍓"], actionIcon: "place" },
    ],
  },
  {
    id: "pancakes-brocoli",
    image: imgPancakesBrocoli,
    emoji: "🥞",
    color: "kids-green",
    category: "meals",
    difficulty: 3,
    ingredients: [
      { emoji: "🥦", quantity: 1, grams: 80 },
      { emoji: "🥚", quantity: 1, grams: 55 },
      { emoji: "🥣", quantity: 1, grams: 50 },
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🥛", quantity: 1, grams: 240 },
    ],
    steps: [
      { emoji: "🥦", ingredientEmojis: ["🥦"], actionIcon: "wash" },
      { emoji: "🥦", ingredientEmojis: ["🥦"], actionIcon: "cut" },
      { emoji: "🥚", ingredientEmojis: ["🥚", "🥣", "🍌", "🥛"], actionIcon: "mix" },
      { emoji: "🥦", ingredientEmojis: ["🥦"], actionIcon: "mix" },
      { emoji: "🥞", ingredientEmojis: [], actionIcon: "scoop" },
    ],
  },
  {
    id: "arepas-chia",
    image: imgArepas,
    emoji: "🫓",
    color: "kids-orange",
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🌾", quantity: 1, grams: 50 },
      { emoji: "🌱", quantity: 1, grams: 5 },
      { emoji: "🥚", quantity: 1, grams: 55 },
      { emoji: "🍐", quantity: 1, grams: 150 },
    ],
    steps: [
      { emoji: "🌾", ingredientEmojis: ["🌾", "🌱"], actionIcon: "mix" },
      { emoji: "💧", ingredientEmojis: [], actionIcon: "pour" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "mix" },
      { emoji: "🫓", ingredientEmojis: [], actionIcon: "place" },
      { emoji: "🥚", ingredientEmojis: ["🥚"], actionIcon: "place" },
    ],
  },
  {
    id: "empanadas",
    image: imgEmpanadas,
    emoji: "🥟",
    color: "kids-purple",
    category: "meals",
    difficulty: 3,
    ingredients: [
      { emoji: "🌾", quantity: 1, grams: 50 },
      { emoji: "🥩", quantity: 1, grams: 80 },
      { emoji: "🥔", quantity: 1, grams: 150 },
      { emoji: "🍅", quantity: 1, grams: 80 },
    ],
    steps: [
      { emoji: "🥩", ingredientEmojis: ["🥩"], actionIcon: "cut" },
      { emoji: "🥔", ingredientEmojis: ["🥔", "🍅"], actionIcon: "mix" },
      { emoji: "🌾", ingredientEmojis: ["🌾"], actionIcon: "mix" },
      { emoji: "🥟", ingredientEmojis: ["🥩", "🥔"], actionIcon: "scoop" },
      { emoji: "🔥", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "pizza-vegetal",
    image: imgPizzaVegetal,
    emoji: "🍕",
    color: "kids-red",
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🫓", quantity: 1, grams: 60 },
      { emoji: "🧀", quantity: 1, grams: 25 },
      { emoji: "🍅", quantity: 4, grams: 320 },
      { emoji: "🥬", quantity: 2, grams: 40 },
      { emoji: "🍄", quantity: 4, grams: 60 },
    ],
    steps: [
      { emoji: "🫓", ingredientEmojis: ["🫓"], actionIcon: "place" },
      { emoji: "🧀", ingredientEmojis: ["🧀"], actionIcon: "place" },
      { emoji: "🥬", ingredientEmojis: ["🥬"], actionIcon: "wash" },
      { emoji: "🍅", ingredientEmojis: ["🍅", "🥬", "🍄"], actionIcon: "place" },
      { emoji: "🔥", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "galletas-cacao",
    image: imgGalletasCacao,
    emoji: "🍪",
    color: "kids-teal",
    category: "desserts",
    difficulty: 2,
    ingredients: [
      { emoji: "🥣", quantity: 1, grams: 50 },
      { emoji: "🍫", quantity: 1, grams: 30 },
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🥚", quantity: 1, grams: 55 },
    ],
    steps: [
      { emoji: "🥣", ingredientEmojis: ["🥣", "🥚"], actionIcon: "mix" },
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "peel" },
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "mix" },
      { emoji: "🍫", ingredientEmojis: ["🍫"], actionIcon: "mix" },
      { emoji: "🍪", ingredientEmojis: [], actionIcon: "scoop" },
    ],
  },
  {
    id: "rosquitas",
    image: imgRosquitas,
    emoji: "🍩",
    color: "kids-pink",
    category: "desserts",
    difficulty: 2,
    ingredients: [
      { emoji: "🌾", quantity: 1, grams: 50 },
      { emoji: "🧂", quantity: 1, grams: 2 },
      { emoji: "🌱", quantity: 1, grams: 5 },
    ],
    steps: [
      { emoji: "🌾", ingredientEmojis: ["🌾", "🧂"], actionIcon: "mix" },
      { emoji: "💧", ingredientEmojis: [], actionIcon: "pour" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "mix" },
      { emoji: "🍩", ingredientEmojis: [], actionIcon: "scoop" },
      { emoji: "🔥", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
];
