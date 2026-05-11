# Little Chef v4 — funciones avanzadas

Mantenemos la regla de oro: niño = pantalla visual con poco texto; toda la lógica nueva (despensa, sustituciones, registro, ajustes de voz, misiones) vive en el panel de padres o como atajos visuales muy simples desde el home.

## 1. Generador de recetas desde ingredientes (pantry)

- Nueva pantalla "🧺 Mi nevera" accesible desde el panel de padres y desde un botón visual en el home.
- Cuadrícula de chips emoji con los ingredientes más usados (frutas, lácteos, pan, huevos, etc.). El padre/niño marca lo que tiene.
- Estado guardado en `localStorage` por perfil: `lc:p:{pid}:pantry`.
- Resultado: cards de recetas ordenadas por % de coincidencia con su despensa (con etiqueta visual "Tienes 4/5 🟢").

## 2. Sustituciones automáticas según restricciones

- Tabla `ingredientSwaps` (`leche → bebida de avena`, `gluten → maíz`, `frutos secos → semillas`, etc.).
- En `RecipeIngredients`, si la restricción del perfil activo coincide con un ingrediente de la receta, mostramos una pegatina con el emoji original tachado y el sustituto al lado.
- En el panel de padres, sección "🔄 Sustituciones" lista los swaps activos para el perfil.

## 3. Lista de compra desde favoritos

- En `ShoppingListScreen`, botón "❤️ Añadir favoritos" que vuelca los ingredientes de cada favorito (combinando duplicados con suma de cantidades visuales).
- Mantiene tachado/limpiar existentes.

## 4. Registro de alimentos probados (tasting log)

- Después de terminar una receta, en la pantalla final añadimos 3 caritas grandes: 😋 / 🙂 / 😖.
- Se guardan por perfil en `lc:p:{pid}:tastings` con `{ recipeId, ingredients[], reaction, date }`.
- El panel de padres tiene una pestaña "🍽️ Probados" con timeline (cara + nombre receta + fecha) y conteo de "favoritos del peque" (los 😋).

## 5. Modo "Cocina juntos"

- Reusamos la flag `stepNeedsAdult`. En `RecipeStepper` añadimos una franja superior con dos pestañas visuales: "🧒 Niño" y "🧑 Adulto".
- Solo cambia el color de fondo del paso y el badge grande, el flujo es lineal — no separa la receta. Cuando toca un paso de adulto, vibración suave + sonido distinto + AdultGate ya existente.
- Nuevo componente `RoleHeader` con dos burbujas grandes que se iluminan según el paso.

## 6. Guardar foto del resultado

- En `Celebration`, botón nuevo "📸 Foto" que abre `<input type="file" capture="environment" accept="image/*">`.
- La foto se guarda como dataURL en `lc:p:{pid}:photos:{recipeId}` (límite: una foto por receta, redimensionada a 600px en canvas para evitar saturar localStorage).
- En `FavoritesScreen` y en el panel de padres ("📸 Galería") se muestran las fotos guardadas como thumbnails.

## 7. Voz opcional por paso

- Usamos `window.speechSynthesis` (Web Speech API, sin backend, sin coste). Frases muy cortas en español: "¡Mezcla!", "¡A cortar con un adulto!", "¡Vierte poco a poco!".
- Mapeo `actionIcon → frase`. Diccionario en `src/data/voiceLines.ts`.
- Toggle "🗣️ Voz" en panel de padres → ajustes; preferencia compartida `lc:voice`.
- Botón nuevo en `RecipeStepper` (al lado del 🔁 repetir): 🗣️ habla la frase del paso actual.
- Si la API no está disponible, escondemos el botón.

## 8. Misiones semanales con recompensa visual

- Catálogo de 6 misiones rotando por semana ISO: "Haz 3 recetas", "Prueba 2 frutas nuevas", "Completa 1 receta sin cocción", "Gana 1 medalla", etc.
- Estado por perfil + semana en `lc:p:{pid}:missions:{isoWeek}`.
- Nueva pantalla `MissionsScreen` accesible desde el home (botón 🎯 cerca del 🏅) con barras de progreso visuales y una recompensa al completar todas (sticker grande animado guardado en `lc:p:{pid}:rewards`).
- Galería de stickers ganados en panel de padres → Progreso.

## 9. Cambios de UI compartidos

- Home: barra de accesos rápidos pasa de 3 a 4 botones: Plan / Lista / Misiones / Padres. El acceso a "Mi nevera" se añade como tarjeta visual sobre las categorías.
- Pantalla final (`Celebration`): añade caritas de tasting + botón foto, sin perder el botón "otra receta" ni "favorito".

## 10. Persistencia (todo localStorage por perfil, sin backend nuevo)

- Claves añadidas: `pantry`, `tastings`, `photos:{recipeId}`, `missions:{isoWeek}`, `rewards`.
- Compartidas: `lc:voice`.

## Detalles técnicos

- **Nuevos archivos**:
  - `src/data/pantry.ts`, `src/data/ingredientSwaps.ts`, `src/data/missions.ts`, `src/data/voiceLines.ts`
  - `src/hooks/use-pantry.tsx`, `src/hooks/use-tastings.tsx`, `src/hooks/use-photos.tsx`, `src/hooks/use-missions.tsx`, `src/hooks/use-voice.tsx`
  - `src/components/PantryScreen.tsx`, `src/components/MissionsScreen.tsx`, `src/components/RoleHeader.tsx`, `src/components/TastingPicker.tsx`, `src/components/PhotoCapture.tsx`, `src/components/IngredientSwap.tsx`
- **Editados**:
  - `src/components/RecipeStepper.tsx` (RoleHeader, botón voz, sonido distinto en pasos adulto)
  - `src/components/RecipeIngredients.tsx` (mostrar swaps)
  - `src/components/Celebration.tsx` (TastingPicker + PhotoCapture)
  - `src/components/RecipeHome.tsx` (botón nevera + misiones, badges de match con despensa)
  - `src/components/ParentDashboard.tsx` (pestañas: Probados, Galería, Voz, Sustituciones)
  - `src/components/ShoppingListScreen.tsx` (botón "Añadir favoritos")
  - `src/routes/index.tsx` (nuevas pantallas: pantry, missions)

## Fuera de alcance (siguen en "Próximamente")

- Compartir resultados, sincronización en la nube, fotos en backend, voces personalizadas con ElevenLabs, comunidad, premium.

¿Te parece bien o quieres ajustar prioridades antes de tocar código?
