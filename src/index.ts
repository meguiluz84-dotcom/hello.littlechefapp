// Little Chef App - Main Entry Point
// Aplicación educativa de recetas para niños no lectores

/**
 * Interface para definir una receta
 */
interface Recipe {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // en minutos
  ingredients: Ingredient[];
  steps: RecipeStep[];
  imageUrl: string;
  audioUrl?: string;
}

/**
 * Interface para ingredientes
 */
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  imageUrl: string;
}

/**
 * Interface para pasos de la receta
 */
interface RecipeStep {
  stepNumber: number;
  description: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // en segundos
}

/**
 * Clase principal de la aplicación Little Chef
 */
class LittleChefApp {
  private recipes: Recipe[] = [];
  private currentRecipe: Recipe | null = null;

  constructor() {
    this.initializeApp();
  }

  /**
   * Inicializa la aplicación
   */
  private initializeApp(): void {
    console.log('🍳 Little Chef App initialized!');
    this.loadRecipes();
  }

  /**
   * Carga las recetas disponibles
   */
  private loadRecipes(): void {
    // TODO: Cargar recetas desde una API o base de datos
    console.log('📚 Cargando recetas...');
  }

  /**
   * Selecciona una receta por ID
   */
  public selectRecipe(recipeId: string): Recipe | null {
    this.currentRecipe = this.recipes.find(r => r.id === recipeId) || null;
    return this.currentRecipe;
  }

  /**
   * Obtiene la receta actual
   */
  public getCurrentRecipe(): Recipe | null {
    return this.currentRecipe;
  }

  /**
   * Obtiene todas las recetas
   */
  public getRecipes(): Recipe[] {
    return this.recipes;
  }
}

// Exportar la aplicación
export default LittleChefApp;
export { Recipe, Ingredient, RecipeStep };
