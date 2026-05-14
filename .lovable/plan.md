## Plan: Capa "Chef Avanzado" en Little Chef

Voy a integrar la capa avanzada **encima** de lo que ya existe (no reemplazar). El proyecto ya tiene `RecipeLevel` 1/2/3, `VisualTimer`, `use-step-timers`, `HygieneStep`, `medals`, `Celebration` y `VisualQuantity` — los reutilizo y amplío.

### 1. Nivel "Chef avanzado"
- Reutilizo `RecipeLevel` añadiendo `4` como "Chef avanzado" en `LEVEL_INFO` con emoji 👨‍🍳⭐ y color especial (kids-yellow + borde dorado).
- Componente `<AdvancedBadge />` reutilizable que aparece en: tarjeta de receta (`RecipeHome`), pantalla de ingredientes (`RecipeIngredients`) y header del stepper (`RecipeStepper`).

### 2. Más pasos por receta
- `recipes.ts` ya soporta N pasos. Reviso `RecipeStepper` para barra de progreso con segmentos cuando hay >5 pasos (ya muestra `paso / total`, mejoro la barra para escalar bien).
- Añado 2-3 recetas avanzadas de ejemplo con 6-8 pasos completos.

### 3. Temporizadores visuales
- `VisualTimer` ya existe con círculo de progreso. Añado:
  - Botón "Saltar con adulto" (requiere `AdultGate`).
  - Persistencia del estado restante en `use-step-timers` (ya guarda en localStorage; verifico que sobrevive al volver atrás).
  - Botones más grandes para iniciar/pausar/reiniciar.

### 4. Medidor visual de cantidades
- Amplío `visualQty.ts` con tipos `cup-full`, `cup-half`, `spoon` y mapeo desde un nuevo campo `quantityLabel?: "1 taza" | "media taza" | "1 cuchara"` en `Ingredient`.
- `VisualQuantity` renderiza icono grande (🥛 lleno, 🥛 con ½ overlay, 🥄) cuando hay `quantityLabel`.

### 5. Iconos de higiene
- Nuevo módulo `src/data/hygieneActions.ts` con `washHands`, `cleanTable`, `washVeggies` (emoji + label).
- `HygieneStep` ahora acepta lista de acciones a mostrar; se invoca antes de recetas avanzadas y cuando los ingredientes incluyen frutas/verduras (detección por emoji).

### 6. Pasos de adulto
- Amplío `stepNeedsAdult` para detectar más casos (sartén 🍳, batidora, calor).
- En `RecipeStepper`: badge grande 👨‍🍳⚠️, borde rojo/naranja, `aria-label="Paso para adulto: ..."`, y tooltip explicativo en `AdultMode`.

### 7. Modo Reto
- Nuevo hook `use-challenge-mode.tsx` (localStorage `lc-challenge-mode`).
- Toggle visible en home y en `ParentDashboard`.
- En `RecipeStepper`, cuando está activo: oculta nombre del ingrediente, pista textual y descripciones; mantiene icono de acción, ingrediente emoji, badge de adulto y temporizador.

### 8. Medalla "Chef Avanzado"
- Añado medalla `chef-avanzado` en `medals.ts`.
- Al completar receta con `level: 4`, `Celebration` muestra variante especial (confeti + medalla animada) y guarda en `use-medals`.
- `MedalsScreen` ya muestra medallas ganadas — verifico la nueva.

### 9. Datos de recetas
- Extiendo tipos en `recipes.ts`:
  - `Step.adultRequired?: boolean`
  - `Step.timerSeconds?: number` (ya existe via `use-step-timers`, lo muevo al dato)
  - `Ingredient.quantityLabel?: string`
  - `Recipe.hygieneSteps?: HygieneAction[]`
  - `Recipe.challengeModeCompatible?: boolean`
  - `Recipe.medalId?: string`
- Compatibilidad: todos opcionales, recetas existentes sin tocar.

### 10. Diseño
- Mantengo `kids-shadow`, paleta actual, botones grandes (≥56px), tokens semánticos.
- Sin nuevas dependencias.

### Migración localStorage
- Claves nuevas: `lc-challenge-mode`, `lc-medals` (ya existe), `lc-timer-state-{recipeId}-{stepIdx}`.
- Sin romper claves existentes (favoritos, diplomas, players, preferencias).

### Archivos principales a crear/editar
- **Crear**: `src/components/AdvancedBadge.tsx`, `src/data/hygieneActions.ts`, `src/hooks/use-challenge-mode.tsx`, `src/components/AdultStepBadge.tsx`
- **Editar**: `src/data/recipeMeta.ts` (level 4 + LEVEL_INFO), `src/data/recipes.ts` (tipos + recetas nuevas), `src/data/medals.ts`, `src/data/visualQty.ts`, `src/components/VisualQuantity.tsx`, `src/components/VisualTimer.tsx`, `src/components/HygieneStep.tsx`, `src/components/RecipeStepper.tsx`, `src/components/RecipeIngredients.tsx`, `src/components/RecipeHome.tsx`, `src/components/Celebration.tsx`, `src/components/ParentDashboard.tsx`, `src/routes/index.tsx`

¿Procedo con la implementación completa, o prefieres que empiece por un subconjunto (p. ej. puntos 1, 8 y 9 primero)?
