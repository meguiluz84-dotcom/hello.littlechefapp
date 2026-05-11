// Common pantry ingredients shown as chips. Emoji must match what's used in
// recipes.ts ingredients so we can compute matches.
export interface PantryItem {
  emoji: string;
  label: string;
  group: "fruta" | "lacteo" | "panaderia" | "verdura" | "proteina" | "extra";
}

export const PANTRY: PantryItem[] = [
  { emoji: "🍌", label: "Plátano", group: "fruta" },
  { emoji: "🍓", label: "Fresa", group: "fruta" },
  { emoji: "🍎", label: "Manzana", group: "fruta" },
  { emoji: "🍇", label: "Uva", group: "fruta" },
  { emoji: "🍐", label: "Pera", group: "fruta" },
  { emoji: "🥝", label: "Kiwi", group: "fruta" },
  { emoji: "🫐", label: "Arándano", group: "fruta" },
  { emoji: "🍈", label: "Melón", group: "fruta" },
  { emoji: "🥛", label: "Leche", group: "lacteo" },
  { emoji: "🧀", label: "Queso", group: "lacteo" },
  { emoji: "🍯", label: "Miel", group: "extra" },
  { emoji: "🍞", label: "Pan", group: "panaderia" },
  { emoji: "🫓", label: "Tortilla", group: "panaderia" },
  { emoji: "🥚", label: "Huevo", group: "proteina" },
  { emoji: "🥜", label: "Frutos secos", group: "proteina" },
  { emoji: "🥦", label: "Brócoli", group: "verdura" },
  { emoji: "🥬", label: "Lechuga", group: "verdura" },
  { emoji: "🍅", label: "Tomate", group: "verdura" },
  { emoji: "🥔", label: "Patata", group: "verdura" },
  { emoji: "🌾", label: "Avena", group: "extra" },
  { emoji: "🥥", label: "Coco", group: "extra" },
  { emoji: "🍫", label: "Chocolate", group: "extra" },
];

export const PANTRY_GROUPS: { id: PantryItem["group"]; emoji: string; label: string }[] = [
  { id: "fruta", emoji: "🍓", label: "Fruta" },
  { id: "lacteo", emoji: "🥛", label: "Lácteos" },
  { id: "panaderia", emoji: "🍞", label: "Pan" },
  { id: "verdura", emoji: "🥬", label: "Verdura" },
  { id: "proteina", emoji: "🥚", label: "Proteína" },
  { id: "extra", emoji: "✨", label: "Extras" },
];
