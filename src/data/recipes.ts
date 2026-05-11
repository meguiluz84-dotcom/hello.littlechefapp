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
import imgPolosFresa from "@/assets/recipe-polos-fresa.jpg";
import imgFruitFaces from "@/assets/recipe-fruit-faces.jpg";
import imgRainbowToast from "@/assets/recipe-rainbow-toast.jpg";
import imgCloudCup from "@/assets/recipe-cloud-cup.jpg";
import imgCucumberBoats from "@/assets/recipe-cucumber-boats.jpg";
import imgHappyPizza from "@/assets/recipe-happy-pizza.jpg";
import imgBananaPancakes from "@/assets/recipe-banana-pancakes.jpg";
import imgRiceEggs from "@/assets/recipe-rice-eggs.jpg";
import imgBananaIcecream from "@/assets/recipe-banana-icecream.jpg";
import imgOatBalls from "@/assets/recipe-oat-balls.jpg";
import imgSnakeWrap from "@/assets/recipe-snake-wrap.jpg";
import imgStarSandwich from "@/assets/recipe-star-sandwich.jpg";
import imgBananaRolls from "@/assets/recipe-banana-rolls.jpg";
import imgTomatoLadybugs from "@/assets/recipe-tomato-ladybugs.jpg";
import imgBroccoliForest from "@/assets/recipe-broccoli-forest.jpg";
import imgEggBoats from "@/assets/recipe-egg-boats.jpg";
import imgSnailRolls from "@/assets/recipe-snail-rolls.jpg";
import imgButterflyPizza from "@/assets/recipe-butterfly-pizza.jpg";
import imgFruitWorm from "@/assets/recipe-fruit-worm.jpg";
import imgRiceClouds from "@/assets/recipe-rice-clouds.jpg";
import imgGardenToast from "@/assets/recipe-garden-toast.jpg";
import imgBananaSushi from "@/assets/recipe-banana-sushi.jpg";
import imgChickpeaBurgers from "@/assets/recipe-chickpea-burgers.jpg";
import imgRainbowSticks from "@/assets/recipe-rainbow-sticks.jpg";
import imgGreenPancakes from "@/assets/recipe-green-pancakes.jpg";
import imgMoonBowl from "@/assets/recipe-moon-bowl.jpg";
import imgSmileEmpanadas from "@/assets/recipe-smile-empanadas.jpg";
import imgMiniTacos from "@/assets/recipe-mini-tacos.jpg";
import imgAppleDonut from "@/assets/recipe-apple-donut.jpg";
import imgWatermelonPops from "@/assets/recipe-watermelon-pops.jpg";
import imgVeggieTrain from "@/assets/recipe-veggie-train.jpg";

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

export const categories: { id: RecipeCategory; emoji: string; label: string; color: string }[] = [
  { id: "fruits", emoji: "🍎", label: "Frutas", color: "kids-red" },
  { id: "snacks", emoji: "🥪", label: "Snacks", color: "kids-orange" },
  { id: "drinks", emoji: "🥤", label: "Bebidas", color: "kids-blue" },
  { id: "meals", emoji: "🍳", label: "Comidas", color: "kids-green" },
  { id: "desserts", emoji: "🍪", label: "Postres", color: "kids-purple" },
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
    name: "🦕 Ensalada Dino-Rex",
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
    name: "🦖 Sandwichosaurio",
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
    name: "🦕 Batido Pterodáctilo",
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
    name: "🦴 Galletas Fósil",
    image: imgCookies,
    emoji: "🍪",
    color: "kids-purple",
    category: "desserts",
    difficulty: 2,
    ingredients: [
      { emoji: "🥣", quantity: 1, grams: 100 },
      { emoji: "🥜", quantity: 1, grams: 30 },
      { emoji: "🍯", quantity: 1, grams: 30 },
      { emoji: "🥚", quantity: 1 },
      { emoji: "🍫", quantity: 1, grams: 30 },
    ],
    steps: [
      { emoji: "🥜", ingredientEmojis: ["🥜", "🍯", "🥚"], actionIcon: "mix" },
      { emoji: "🥣", ingredientEmojis: ["🥣"], actionIcon: "pour" },
      { emoji: "🍫", ingredientEmojis: ["🍫"], actionIcon: "mix" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "scoop" },
      { emoji: "🔥", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "ants-on-log",
    name: "🦕 Troncos Jurásicos",
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
    name: "🥚 Huevo Dino Cremoso",
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
    name: "🌋 Pizzas Volcán Dino",
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
    name: "🦖 Cola de T-Rex Verde",
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
    name: "🦴 Huesitos de Plátano",
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
    name: "🦕 Snack del Explorador",
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
    name: "🥚 Huevitos de Dino",
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
    name: "🦴 Brochetas Jurásicas",
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
    name: "🦕 Bol del Dino Feliz",
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
    name: "🦖 Garras de Dino",
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
    name: "🦕 Tortitas Brontosaurio",
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
      { emoji: "🥛", quantity: 1, grams: 180 },
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
    name: "🥚 Arepitas Dino",
    image: imgArepas,
    emoji: "🫓",
    color: "kids-orange",
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🌾", quantity: 1, grams: 60 },
      { emoji: "🥚", quantity: 1, grams: 55 },
      { emoji: "🌱", quantity: 1, grams: 5 },
      { emoji: "🍐", quantity: 1, grams: 120 },
      { emoji: "🥛", quantity: 1, grams: 50 },
      { emoji: "🧂", quantity: 1, grams: 1 },
    ],
    steps: [
      { emoji: "🌾", ingredientEmojis: ["🌾", "🧂"], actionIcon: "mix" },
      { emoji: "🌱", ingredientEmojis: ["🌱"], actionIcon: "pour" },
      { emoji: "🍐", ingredientEmojis: ["🍐"], actionIcon: "cut" },
      { emoji: "🥛", ingredientEmojis: ["🥛"], actionIcon: "pour" },
      { emoji: "🥚", ingredientEmojis: ["🥚"], actionIcon: "mix" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "mix" },
      { emoji: "🫓", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "empanadas",
    name: "🦴 Empanadas Fósil",
    image: imgEmpanadas,
    emoji: "🥟",
    color: "kids-purple",
    category: "meals",
    difficulty: 3,
    ingredients: [
      { emoji: "🌾", quantity: 1, grams: 120 },
      { emoji: "💧", quantity: 1, grams: 60 },
      { emoji: "🫒", quantity: 1, grams: 10 },
      { emoji: "🧂", quantity: 1, grams: 1 },
      { emoji: "🥩", quantity: 1, grams: 80 },
      { emoji: "🥔", quantity: 1, grams: 100 },
      { emoji: "🍅", quantity: 1, grams: 60 },
    ],
    steps: [
      { emoji: "🌾", ingredientEmojis: ["🌾", "🧂"], actionIcon: "mix" },
      { emoji: "💧", ingredientEmojis: ["💧", "🫒"], actionIcon: "pour" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "mix" },
      { emoji: "🥩", ingredientEmojis: ["🥩"], actionIcon: "cut" },
      { emoji: "🥔", ingredientEmojis: ["🥔", "🍅"], actionIcon: "mix" },
      { emoji: "🥟", ingredientEmojis: ["🥩", "🥔"], actionIcon: "scoop" },
      { emoji: "🔥", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "pizza-vegetal",
    name: "🌿 Pizza Selva Jurásica",
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
    name: "🦕 Galletas Mini-Rex",
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
    name: "🦴 Rosquitas Dino",
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
  {
    id: "polos-fresa",
    name: "🍓 Polos de Fresa y Yogur",
    image: imgPolosFresa,
    emoji: "🍡",
    color: "kids-pink",
    category: "fruits",
    difficulty: 1,
    ingredients: [
      { emoji: "🍓", quantity: 1, grams: 150 },
      { emoji: "🥛", quantity: 1, grams: 200 },
    ],
    steps: [
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "wash" },
      { emoji: "🔪", ingredientEmojis: ["🍓"], actionIcon: "cut" },
      { emoji: "🌀", ingredientEmojis: ["🍓"], actionIcon: "mix" },
      { emoji: "🥛", ingredientEmojis: ["🥛", "🍓"], actionIcon: "mix" },
      { emoji: "🍡", ingredientEmojis: [], actionIcon: "pour" },
      { emoji: "❄️", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "fruit-faces",
    name: "🦕 Caritas de Fruta",
    image: imgFruitFaces,
    emoji: "😊",
    color: "kids-pink",
    category: "fruits",
    difficulty: 1,
    ingredients: [
      { emoji: "🥛", quantity: 1, grams: 120 },
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🫐", quantity: 6, grams: 6 },
      { emoji: "🍓", quantity: 3, grams: 45 },
    ],
    steps: [
      { emoji: "🥛", ingredientEmojis: ["🥛"], actionIcon: "scoop" },
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "place" },
      { emoji: "🫐", ingredientEmojis: ["🫐"], actionIcon: "place" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "place" },
      { emoji: "🎉", ingredientEmojis: [], actionIcon: "shake" },
    ],
  },
  {
    id: "rainbow-toast",
    name: "🌈 Tostada Arcoíris",
    image: imgRainbowToast,
    emoji: "🌈",
    color: "kids-yellow",
    category: "snacks",
    difficulty: 1,
    ingredients: [
      { emoji: "🍞", quantity: 1, grams: 30 },
      { emoji: "🧀", quantity: 1, grams: 25 },
      { emoji: "🍅", quantity: 1, grams: 40 },
      { emoji: "🥒", quantity: 1, grams: 30 },
      { emoji: "🥕", quantity: 1, grams: 20 },
      { emoji: "🌽", quantity: 1, grams: 20 },
    ],
    steps: [
      { emoji: "🧀", ingredientEmojis: ["🍞", "🧀"], actionIcon: "spread" },
      { emoji: "🍅", ingredientEmojis: ["🍅"], actionIcon: "place" },
      { emoji: "🥒", ingredientEmojis: ["🥒"], actionIcon: "place" },
      { emoji: "🥕", ingredientEmojis: ["🥕"], actionIcon: "place" },
      { emoji: "🌽", ingredientEmojis: ["🌽"], actionIcon: "place" },
      { emoji: "🔪", ingredientEmojis: [], actionIcon: "cut" },
    ],
  },
  {
    id: "cloud-cup",
    name: "☁️ Vasito Nube",
    image: imgCloudCup,
    emoji: "☁️",
    color: "kids-blue",
    category: "desserts",
    difficulty: 1,
    ingredients: [
      { emoji: "🥛", quantity: 1, grams: 150 },
      { emoji: "🍌", quantity: 1, grams: 100 },
      { emoji: "🥣", quantity: 1, grams: 30 },
      { emoji: "🍓", quantity: 2, grams: 30 },
    ],
    steps: [
      { emoji: "🥛", ingredientEmojis: ["🥛"], actionIcon: "scoop" },
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "mix" },
      { emoji: "🥣", ingredientEmojis: ["🥣"], actionIcon: "pour" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "place" },
    ],
  },
  {
    id: "cucumber-boats",
    name: "⛵ Barquitos de Pepino",
    image: imgCucumberBoats,
    emoji: "⛵",
    color: "kids-green",
    category: "snacks",
    difficulty: 2,
    ingredients: [
      { emoji: "🥒", quantity: 1, grams: 120 },
      { emoji: "🧀", quantity: 1, grams: 30 },
      { emoji: "🍅", quantity: 4, grams: 60 },
    ],
    steps: [
      { emoji: "🔪", ingredientEmojis: ["🥒"], actionIcon: "cut" },
      { emoji: "🧀", ingredientEmojis: ["🧀"], actionIcon: "spread" },
      { emoji: "🍅", ingredientEmojis: ["🍅"], actionIcon: "place" },
      { emoji: "⛵", ingredientEmojis: ["🧀"], actionIcon: "place" },
    ],
  },
  {
    id: "happy-pizza",
    name: "😀 Mini Pizzas Felices",
    image: imgHappyPizza,
    emoji: "🍕",
    color: "kids-red",
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🫓", quantity: 1, grams: 60 },
      { emoji: "🍅", quantity: 1, grams: 40 },
      { emoji: "🧀", quantity: 1, grams: 25 },
      { emoji: "🌽", quantity: 1, grams: 20 },
      { emoji: "🫒", quantity: 3, grams: 10 },
      { emoji: "🫑", quantity: 1, grams: 20 },
    ],
    steps: [
      { emoji: "🍅", ingredientEmojis: ["🫓", "🍅"], actionIcon: "spread" },
      { emoji: "🧀", ingredientEmojis: ["🧀"], actionIcon: "place" },
      { emoji: "😀", ingredientEmojis: ["🌽", "🫒", "🫑"], actionIcon: "place" },
      { emoji: "🔥", ingredientEmojis: [], actionIcon: "place" },
      { emoji: "❄️", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "banana-pancakes",
    name: "🥞 Tortitas de Plátano",
    image: imgBananaPancakes,
    emoji: "🥞",
    color: "kids-yellow",
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🥚", quantity: 1, grams: 55 },
      { emoji: "🥣", quantity: 1, grams: 40 },
    ],
    steps: [
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "mix" },
      { emoji: "🥚", ingredientEmojis: ["🥚"], actionIcon: "pour" },
      { emoji: "🥣", ingredientEmojis: ["🥣"], actionIcon: "pour" },
      { emoji: "🌀", ingredientEmojis: [], actionIcon: "mix" },
      { emoji: "🍳", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "rice-eggs",
    name: "🥚 Huevitos de Arroz",
    image: imgRiceEggs,
    emoji: "🍙",
    color: "kids-orange",
    category: "meals",
    difficulty: 1,
    ingredients: [
      { emoji: "🍚", quantity: 1, grams: 100 },
      { emoji: "🧀", quantity: 1, grams: 30 },
      { emoji: "🥕", quantity: 1, grams: 25 },
    ],
    steps: [
      { emoji: "🍚", ingredientEmojis: ["🍚"], actionIcon: "scoop" },
      { emoji: "🧀", ingredientEmojis: ["🧀"], actionIcon: "place" },
      { emoji: "🥕", ingredientEmojis: ["🥕"], actionIcon: "place" },
      { emoji: "🌀", ingredientEmojis: [], actionIcon: "mix" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "scoop" },
    ],
  },
  {
    id: "banana-icecream",
    name: "🍦 Helados de Plátano",
    image: imgBananaIcecream,
    emoji: "🍦",
    color: "kids-pink",
    category: "desserts",
    difficulty: 2,
    ingredients: [
      { emoji: "🍌", quantity: 2, grams: 240 },
      { emoji: "🥛", quantity: 1, grams: 120 },
      { emoji: "🍓", quantity: 3, grams: 45 },
    ],
    steps: [
      { emoji: "🔪", ingredientEmojis: ["🍌"], actionIcon: "cut" },
      { emoji: "🌀", ingredientEmojis: ["🍌", "🥛"], actionIcon: "mix" },
      { emoji: "🍓", ingredientEmojis: ["🍓"], actionIcon: "place" },
      { emoji: "🍡", ingredientEmojis: [], actionIcon: "pour" },
      { emoji: "❄️", ingredientEmojis: [], actionIcon: "place" },
    ],
  },
  {
    id: "oat-balls",
    name: "🟤 Bolitas de Avena",
    image: imgOatBalls,
    emoji: "🟤",
    color: "kids-orange",
    category: "snacks",
    difficulty: 1,
    ingredients: [
      { emoji: "🍌", quantity: 1, grams: 120 },
      { emoji: "🥣", quantity: 1, grams: 60 },
      { emoji: "🥜", quantity: 1, grams: 30 },
      { emoji: "🍫", quantity: 1, grams: 5 },
    ],
    steps: [
      { emoji: "🍌", ingredientEmojis: ["🍌"], actionIcon: "mix" },
      { emoji: "🥣", ingredientEmojis: ["🥣"], actionIcon: "pour" },
      { emoji: "🥜", ingredientEmojis: ["🥜"], actionIcon: "spread" },
      { emoji: "🌀", ingredientEmojis: ["🍫"], actionIcon: "mix" },
      { emoji: "🖐️", ingredientEmojis: [], actionIcon: "scoop" },
    ],
  },
  {
    id: "snake-wrap",
    name: "🐍 Wrap Serpiente",
    image: imgSnakeWrap,
    emoji: "🐍",
    color: "kids-green",
    category: "meals",
    difficulty: 2,
    ingredients: [
      { emoji: "🫓", quantity: 1, grams: 60 },
      { emoji: "🥣", quantity: 1, grams: 30 },
      { emoji: "🥬", quantity: 2, grams: 30 },
      { emoji: "🥕", quantity: 1, grams: 25 },
      { emoji: "🧀", quantity: 1, grams: 25 },
    ],
    steps: [
      { emoji: "🥣", ingredientEmojis: ["🫓", "🥣"], actionIcon: "spread" },
      { emoji: "🥬", ingredientEmojis: ["🥬"], actionIcon: "place" },
      { emoji: "🥕", ingredientEmojis: ["🥕", "🧀"], actionIcon: "place" },
      { emoji: "🌯", ingredientEmojis: [], actionIcon: "mix" },
      { emoji: "🔪", ingredientEmojis: [], actionIcon: "cut" },
    ],
  },
];
