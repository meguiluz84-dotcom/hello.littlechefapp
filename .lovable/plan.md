# Little Chef v3 — MVP familiar enfocado

Objetivo: convertir Little Chef en una app familiar completa pero enfocada, manteniendo la idea visual para niños. Todo se guarda en `localStorage` (sin login). La parte "no MVP" se agrupa en una pantalla **Próximamente** para que se vea la dirección sin construirlo aún.

## 1. Perfiles infantiles (multi-niño)

- Nuevo hook `usePlayers` con array de perfiles `{ id, name, avatarId, age, restrictions, completed[], favorites[], medals[], stars }`.
- Pantalla **Selector de perfil** al abrir la app (después del splash) con avatares grandes + botón "➕ Añadir".
- "Cambiar de perfil" desde el modo adulto.
- Migración: el perfil actual de `localStorage` se convierte en el primer player.

## 2. Onboarding por perfil

- El onboarding actual (avatar, edad, restricciones) se ejecuta al crear cada perfil nuevo.
- Añadir paso final: nombre del niño (texto corto, opcional, default "Chef").

## 3. Recetas por nivel

- Extender `RecipeMeta` con `level: 1 | 2 | 3` (1 = sin cuchillo/calor, 2 = con ayuda puntual, 3 = receta completa).
- Filtrar recetas según `age` del perfil:
  - 2–3 → solo nivel 1
  - 4–5 → nivel 1 y 2
  - 6+ → todos
- Badge visual de nivel en la tarjeta (1/2/3 estrellitas de chef 👶/🧒/🧑).

## 4. Higiene obligatoria

- Insertar paso 0 automático en `RecipeStepper`: "🧼 Lávate las manos" con timer visual de 20s antes del paso 1.
- No se puede saltar; botón grande "✅ Listo" al terminar el timer.

## 5. Cantidades visuales

- Añadir `visualQty` a cada ingrediente: `{ kind: "spoon"|"cup"|"piece"|"handful"|"slice", count: number }`.
- Renderizar en `RecipeIngredients` con iconos repetidos (ej: 🥄🥄🥄 para 3 cucharadas) en vez de "30g".
- Texto numérico solo visible en modo adulto.

## 6. Temporizadores visuales

- Componente `VisualTimer` (círculo que se vacía + emoji animado) usado en pasos con `seconds > 0`.
- Sonido suave al terminar (respeta toggle de sonido).
- Botón "⏸️ Pausar" / "▶️ Reanudar" gigante.

## 7. Modo reto

- Botón "🏆 Reto del día" en home: receta aleatoria del nivel del perfil; al completarla otorga medalla especial.
- Estado `lc:challenge-{date}-{playerId}` para no repetir.

## 8. Medallas y progreso

- Catálogo `medals.ts`: primera receta, 5 recetas, todas las frutas, 3 retos, semana completa, etc.
- Pantalla **Mis medallas** accesible desde el contador de estrellas (tap corto = medallas, long-press = adulto).
- Medallas otorgadas automáticamente al completar recetas / retos.

## 9. Plan semanal

- Pantalla **Plan** con grilla L–D × (desayuno/merienda).
- El adulto arrastra/asigna recetas a slots (en móvil: tap slot → elegir receta).
- Persistido en `lc:week-plan-{playerId}`.
- En el home aparece "Hoy toca: 🍳 …" si hay plan para hoy.

## 10. Lista de compra

- Botón "🛒 Lista" en home y en plan semanal.
- Auto-generada sumando ingredientes de:
  - recetas del plan semanal
  - recetas marcadas como favoritas con "añadir a lista"
- Cada item es tap-to-tick (tachado), persistido en `lc:shopping-list`.
- Botón "🧹 Vaciar".

## 11. Favoritos (mejora)

- Ya existe toggle. Añadir pantalla **Favoritos** desde home con grid filtrado.
- Botón ❤️ visible también dentro de la receta.

## 12. Panel de padres

- Acceso vía long-press en el contador (ya existe) → ahora abre tabs:
  - **Ajustes** (lo actual: edad, restricciones, sonido, reset)
  - **Perfiles** (gestionar niños: añadir/borrar/editar)
  - **Progreso** (por niño: recetas hechas, medallas, racha de días)
  - **Seguridad** (alérgenos, recordatorios, texto de supervisión)
  - **Plan & Compra** (acceso rápido)

## 13. Seguridad adulta

- Cada paso con `needsAdult` muestra overlay "🧑 Necesito a un adulto" + botón "Adulto presente ✅" antes de continuar.
- Configurable en panel de padres: "Pedir confirmación adulta siempre / solo en pasos críticos / nunca".

## 14. Próximamente (placeholder pantalla)

Pantalla `/proximamente` accesible desde el panel de padres. Cards no funcionales con:
- 👨‍👩‍👧 Comunidad familiar
- ⭐ Premium
- 🏫 Modo escuela
- 📸 Fotos de mis platos
- 📤 Exportar recetas
- 🌍 Multiidioma

Cada card: emoji grande + título + "Pronto 🚀". Sin lógica.

---

## Archivos

**Nuevos**
- `src/hooks/use-players.tsx`
- `src/hooks/use-week-plan.tsx`
- `src/hooks/use-shopping-list.tsx`
- `src/hooks/use-medals.tsx`
- `src/components/PlayerPicker.tsx`
- `src/components/VisualTimer.tsx`
- `src/components/VisualQuantity.tsx`
- `src/components/HygieneStep.tsx`
- `src/components/AdultGate.tsx`
- `src/components/MedalsScreen.tsx`
- `src/components/WeekPlanScreen.tsx`
- `src/components/ShoppingListScreen.tsx`
- `src/components/FavoritesScreen.tsx`
- `src/components/ChallengeBanner.tsx`
- `src/components/ParentDashboard.tsx` (reemplaza `AdultMode` con tabs)
- `src/data/medals.ts`
- `src/data/visualQty.ts` (mapea ingredientes existentes a visualQty)
- `src/routes/proximamente.tsx`

**Editados**
- `src/data/recipeMeta.ts` (añadir `level`)
- `src/data/recipes.ts` (no tocar contenido, solo asegurar tipos)
- `src/components/RecipeStepper.tsx` (higiene + timers + adult gate)
- `src/components/RecipeIngredients.tsx` (cantidades visuales)
- `src/components/RecipeHome.tsx` (filtrar por nivel/edad, banner reto, plan de hoy, accesos rápidos)
- `src/components/Onboarding.tsx` (paso de nombre)
- `src/hooks/use-preferences.tsx` (delegar a `use-players`)
- `src/routes/index.tsx` (selector de perfil + nuevas pantallas)

## Fuera de scope (van a Próximamente)
- Login real / sync nube
- Comunidad / compartir recetas
- Premium / pagos
- Modo escuela
- Subir fotos del plato terminado
- Exportar recetas a PDF
- i18n (la app sigue solo en español)

## Notas técnicas
- Todo en `localStorage` con prefijo `lc:`.
- Mantener tokens de diseño existentes (sin colores hardcoded).
- Animaciones con `framer-motion` ya instalado, respetando `usePrefersReducedMotion`.
- No se tocan: cola de imágenes, `/admin/steps`, splash, celebración, dino bubble, Lovable Cloud.
