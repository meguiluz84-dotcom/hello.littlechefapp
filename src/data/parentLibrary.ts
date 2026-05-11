// Short, practical guides for parents/caregivers.
// Kept intentionally concise: each card opens to a short article with
// emoji-led bullet points so adults can scan in seconds.

export type GuideCategory = "seguridad" | "cortes" | "higiene" | "autonomia";

export interface Guide {
  id: string;
  category: GuideCategory;
  emoji: string;
  title: string;
  summary: string;
  body: { heading?: string; bullets: string[] }[];
  ageHint?: "2-3" | "4-5" | "6+" | "todas";
}

export const GUIDE_CATEGORIES: { id: GuideCategory; emoji: string; label: string; description: string }[] = [
  { id: "seguridad", emoji: "🛡️", label: "Seguridad",  description: "Calor, cuchillos y supervisión." },
  { id: "cortes",    emoji: "🔪", label: "Cortes por edad", description: "Qué corte puede hacer cada niño." },
  { id: "higiene",   emoji: "🧼", label: "Higiene",    description: "Manos, alimentos y superficies." },
  { id: "autonomia", emoji: "🌱", label: "Autonomía",  description: "Cómo dar más libertad sin riesgo." },
];

export const GUIDES: Guide[] = [
  {
    id: "calor",
    category: "seguridad",
    emoji: "🔥",
    title: "Calor: horno, fogón y plancha",
    summary: "Reglas claras para evitar quemaduras.",
    ageHint: "todas",
    body: [
      { heading: "Antes de empezar", bullets: [
        "Recógete el pelo y usa mangas cortas o ajustadas.",
        "Coloca al niño a tu lado, no frente al fuego.",
        "Manijas de sartenes hacia adentro de la encimera.",
      ]},
      { heading: "Durante", bullets: [
        "Niño nunca acerca las manos al horno o sartén caliente.",
        "Usa siempre manopla; los trapos finos no aíslan bien.",
        "Avisa en voz alta: 'caliente, paso por detrás'.",
      ]},
      { heading: "Después", bullets: [
        "La placa sigue caliente 15-20 min: avisa al niño.",
        "Apaga gas y desconecta antes de salir de la cocina.",
      ]},
    ],
  },
  {
    id: "cuchillos-supervision",
    category: "seguridad",
    emoji: "🔪",
    title: "Cuchillos: cuándo y cómo",
    summary: "Supervisión activa, no solo presencia.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Sentado, tabla estable (paño debajo si resbala).",
        "Mano 'garra': dedos doblados, nudillos guían la hoja.",
        "Cuchillo afilado y del tamaño correcto: el desafilado resbala.",
        "Nunca cortar sostenido en la mano; siempre sobre tabla.",
      ]},
    ],
  },
  {
    id: "alergenos",
    category: "seguridad",
    emoji: "⚠️",
    title: "Alérgenos comunes",
    summary: "Qué revisar antes de cocinar.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Frutos secos: cuidado con barritas, granolas y aceites.",
        "Lácteos: revisa galletas, pan de molde y embutidos.",
        "Gluten: harinas, salsas, sopas en sobre y rebozados.",
        "Huevo: presente en pasta fresca, mayonesas y bollería.",
      ]},
      { bullets: [
        "Marca los alérgenos del peque en Padres → Seguridad para que la app filtre recetas.",
      ]},
    ],
  },
  {
    id: "cortes-2-3",
    category: "cortes",
    emoji: "🍌",
    title: "2-3 años: sin cuchillo",
    summary: "Manos, cortador romo y ayudantes.",
    ageHint: "2-3",
    body: [
      { bullets: [
        "Romper con las manos: hojas, pan, queso fresco.",
        "Cortador de plástico para plátano, fresa o aguacate maduro.",
        "Tijeras de cocina romas para hierbas (con tu mano guía).",
      ]},
    ],
  },
  {
    id: "cortes-4-5",
    category: "cortes",
    emoji: "🥒",
    title: "4-5 años: cuchillo de mesa",
    summary: "Alimentos blandos, supervisión cercana.",
    ageHint: "4-5",
    body: [
      { bullets: [
        "Cuchillo de mesa sin sierra para pepino, fresa, queso.",
        "Enseña la 'mano garra' con un trozo grande primero.",
        "Cortes en rodajas, no en dados (más controlable).",
      ]},
    ],
  },
  {
    id: "cortes-6",
    category: "cortes",
    emoji: "🥕",
    title: "6+ años: cuchillo de oficio",
    summary: "Vegetales firmes con técnica.",
    ageHint: "6+",
    body: [
      { bullets: [
        "Cuchillo pequeño afilado, supervisión a brazo de distancia.",
        "Zanahoria, manzana, calabacín: corta primero una base plana.",
        "Introduce el corte 'media luna' antes que el dado.",
      ]},
    ],
  },
  {
    id: "manos",
    category: "higiene",
    emoji: "🧼",
    title: "Lavado de manos",
    summary: "20 segundos, antes y después.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Mojar, jabón, frotar palmas, dorso, entre dedos y uñas.",
        "Cuenta una canción corta (≈20s) para no abreviar.",
        "Repetir tras tocar carne cruda, huevo o basura.",
      ]},
    ],
  },
  {
    id: "alimentos",
    category: "higiene",
    emoji: "🥚",
    title: "Alimentos crudos",
    summary: "Evitar contaminación cruzada.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Tabla y cuchillo distintos para carne/pescado y vegetales.",
        "Huevo: cáscara fuera de la masa; lava manos al terminar.",
        "Lava frutas y hojas aunque vengan 'lavadas' del súper.",
      ]},
    ],
  },
  {
    id: "superficies",
    category: "higiene",
    emoji: "🧴",
    title: "Limpieza al terminar",
    summary: "El peque también ordena.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Bayeta limpia + agua tibia con jabón sobre la encimera.",
        "Tabla de madera: secar de pie, nunca en remojo.",
        "Convierte el orden en parte de la receta, no en un castigo.",
      ]},
    ],
  },
  {
    id: "auto-pasos",
    category: "autonomia",
    emoji: "🌱",
    title: "Suelta el control poco a poco",
    summary: "Una nueva tarea por receta.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Elige UN paso nuevo cada semana (verter, mezclar, pelar…).",
        "Acepta el desorden: aprender ensucia.",
        "Evita rehacer su trabajo delante de él/ella.",
      ]},
    ],
  },
  {
    id: "auto-elegir",
    category: "autonomia",
    emoji: "🗳️",
    title: "Dejarles elegir",
    summary: "Decisiones acotadas funcionan mejor.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Ofrece 2-3 opciones de receta, no 'qué quieres comer'.",
        "Que elijan topping, fruta o forma del corte.",
        "Anótalo en favoritos para reforzar la decisión.",
      ]},
    ],
  },
  {
    id: "auto-errores",
    category: "autonomia",
    emoji: "💧",
    title: "Errores y derrames",
    summary: "Forman parte del aprendizaje.",
    ageHint: "todas",
    body: [
      { bullets: [
        "Reacciona en calma: 'pasa, lo limpiamos juntos'.",
        "Tener una bayeta a su alcance da autonomía real.",
        "Celebra el intento, no solo el resultado.",
      ]},
    ],
  },
];

export function guidesByCategory(c: GuideCategory): Guide[] {
  return GUIDES.filter((g) => g.category === c);
}
