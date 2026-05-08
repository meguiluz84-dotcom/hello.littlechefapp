
# Little Chef v2.0 — Plan de mejoras

Mantener el ADN: app visual, casi sin texto para niños, imágenes grandes, sonidos suaves, navegación simple. Las mejoras añaden capas (modo adulto, preferencias, accesibilidad) sin contaminar la vista infantil.

## 1. Onboarding (post-splash, una sola vez)

Nuevo flujo de 3 pantallas tras pulsar "Empezar":
- **Personaje** — reusar `AvatarPicker` existente
- **Edad aproximada** — 3 botones grandes: 🍼 2-3, 🧒 4-5, 🧑 6+ (afecta dificultad sugerida)
- **Restricciones alimentarias** — chips visuales toggleables: 🥜 sin frutos secos, 🥛 sin lácteos, 🌾 sin gluten, 🥬 vegetariano

Persistido en localStorage (`lc:onboarding-v2`). Si ya existe, saltar directo a home.

## 2. Home mejorada

Reorganizar `RecipeHome.tsx` en secciones:
- **Cabecera**: avatar + contador estrellas (existente)
- **Receta del día**: tarjeta destacada grande (rotación pseudoaleatoria por fecha + filtrada por restricciones)
- **Continuar**: tarjeta de "última receta abierta" si existe (`lc:last-recipe`)
- **Filtros visuales**: chips horizontales scrollables (todas, 🥣 desayuno, 🍎 merienda, 🍓 fruta, 🥪 salado, ❄️ sin cocción) — derivados de `tags`
- **Categorías existentes** (mantener grid)
- **Botón discreto modo adulto** abajo (long-press 800ms o icono engranaje pequeño)

## 3. Modo adulto

Pantalla `AdultMode` accesible vía:
- Long-press (800ms) sobre el contador de estrellas, O
- Botón ⚙️ pequeño abajo

Muestra:
- Toggle sonido 🔊
- Reset progreso
- Editar restricciones / edad / personaje
- Lista de alérgenos detectados por receta
- Texto de seguridad (supervisión, calor, cuchillos)

Sin PIN (no es banca, evitar fricción) — la fricción del long-press es suficiente para niños pequeños.

## 4. Recetas: datos extendidos

Ampliar `Recipe` en `src/data/recipes.ts`:
```ts
type Recipe = {
  ...existing,
  tags: ('desayuno'|'merienda'|'fruta'|'salado'|'sin-coccion')[],
  restrictions: { nuts: boolean, dairy: boolean, gluten: boolean, vegetarian: boolean },
  adultHelp: 'low'|'medium'|'high',
  ageMin: 2|4|6,
}
type Step = {
  ...existing,
  needsAdult?: boolean,
}
```

Añadir 6 recetas nuevas (brochetas fruta sin palillos, yogur+granola, pinchos queso+fruta, tortitas plátano, pizza vegetal fría, bolitas arroz). Algunas ya existen como assets en `src/assets/steps/` — reusar.

Marcar pasos con `needsAdult: true` cuando impliquen cuchillo/calor; en `RecipeStepper` overlay icono 🧑 grande arriba a la izquierda.

## 5. Flujo de receta

`RecipeIngredients`: convertir a checklist visual (tap para marcar tick verde) antes de "Empezar".

`RecipeStepper`:
- Botones atrás/siguiente: ya grandes, asegurar min 64px en todos los breakpoints
- Botón **🔁 repetir** que reproduce el sonido del paso y reanima el icono
- Botón **⏸️ pausa/salir** que guarda `lc:resume-{recipeId}` con índice de paso
- Al volver a abrir esa receta → diálogo visual "Continuar ▶️ / Empezar 🔄"
- Badge 🧑 cuando `step.needsAdult`

## 6. Pulido visual

- `min-h-16 min-w-16` (64px) en todos los botones interactivos
- Tokens en `src/styles.css`: sombra suave única `--shadow-soft` reemplaza variantes
- Tarjetas: padding uniforme `p-4`, gap `gap-4`
- `text-balance` y `line-clamp-2` para nombres largos de receta
- Estados vacíos con mascota dino + emoji grande:
  - "Aún no hay recetas completadas, ¡empieza una! 🍳"
  - "Elige tu personaje" (si falta)

## 7. Accesibilidad

- Hook `usePrefersReducedMotion` que retorna boolean → variantes de framer-motion sin movimiento
- `aria-label` en todos los botones icónicos (avatar, atrás, home, next, prev, modo adulto)
- Toggle sonido global (`lc:sound`) → `playActionSound`/`playDoneSound` no-op si false
- Verificar contraste en chips/badges (usar foreground sobre primary)
- En modo adulto, alérgenos también con texto (no solo emoji)

## 8. Persistencia (localStorage)

Claves nuevas/existentes:
- `lc:avatar` (existente)
- `lc:completed` (existente)
- `lc:onboarding-v2` → `{ age, restrictions }`
- `lc:last-recipe` → `recipeId`
- `lc:resume-{recipeId}` → `{ step, ts }`
- `lc:favorites` → `string[]`
- `lc:sound` → boolean

Hook unificado `usePreferences` que expone get/set tipados.

## Detalles técnicos

### Archivos nuevos
- `src/components/Onboarding.tsx` — wizard 3 pasos
- `src/components/AdultMode.tsx` — pantalla ajustes/seguridad
- `src/components/RecipeOfTheDay.tsx`
- `src/components/CategoryFilters.tsx`
- `src/components/EmptyState.tsx`
- `src/hooks/use-preferences.tsx` — onboarding + sound + favorites + resume
- `src/hooks/use-prefers-reduced-motion.tsx`
- `src/hooks/use-long-press.tsx`

### Archivos editados
- `src/data/recipes.ts` — schema extendido, +6 recetas, tags/restrictions en existentes
- `src/components/RecipeHome.tsx` — secciones nuevas + filtros
- `src/components/RecipeIngredients.tsx` — checklist tap-to-tick
- `src/components/RecipeStepper.tsx` — repetir, pausa, badge adulto, sound toggle, reduced-motion
- `src/routes/index.tsx` — orquestar onboarding/adult mode states
- `src/styles.css` — token shadow-soft, ajustes de contraste

### Sin cambios
- Lovable Cloud, queue de generación de imágenes, `/admin/steps`, splash, celebration, dino bubble (solo se reusan)

## Fuera de alcance (para no inflar el cambio)
- Login / cuentas — mantener todo localStorage
- Backend para favoritos compartidos
- Generar nuevas imágenes para las 6 recetas (se usan emojis grandes y los assets ya existentes; lo cubre la queue ya implementada)
- i18n adicional
