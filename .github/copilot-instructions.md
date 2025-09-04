## Instrucciones para asistentes automáticos (Copilot / GitHub AI)

Objetivo: ayudar a un agente a entender, modificar y extender este proyecto Angular mínimamente invasivo, respetando convenciones existentes.

Resumen rápido

- Framework: Angular 20 (se usan Signals, @if/@else y patterns modernos).
- Estilos: Tailwind CSS (clases utility en `src/styles.css` y componentes).
- Estado/HTTP: `ApiService` centraliza llamadas. `accessToken` se guarda en `localStorage`. `refreshToken` es cookie HttpOnly; existe `refresh.interceptor.ts` que renueva token en 403.
- Arquitectura: feature-based / por contexto. Carpetas principales: `src/app/landing`, `src/app/admin`, `src/app/shared`.

Convenciones importantes

- Usar señales (Signals) en componentes cuando sea posible para estado local y `toSignal` para convertir `paramMap`/observables.
- Formularios: usar ReactiveForms con `FormBuilder`; para evitar errores de tipado, crear controles explícitos con `this.fb.control(...)` en vez de usar `fb.group<T>()` genérico.
- HTTP: usar `ApiService` (`src/app/shared/api/api.service.ts`) para componer endpoints (`${apiUrl}/${endpoint}`) y para tipado request/response separados (TRequest/TResponse).
- Interceptors: hay dos interceptors clave en `src/app/shared/interceptors/`:
  - `bearer.interceptor.ts` añade `Authorization: Bearer <accessToken>` desde `localStorage`.
  - `refresh.interceptor.ts` detecta 403, llama al endpoint `/auth/refresh` (cookie enviada automáticamente), guarda nuevo accessToken en `localStorage` y reintenta la petición. Si falla, redirige al login.
- Registro de interceptors: se pueden registrar globalmente en `AppModule` o en `main.ts` usando `provideHttpClient` con `withInterceptors` (buscar en `main.ts` o `app.module.ts`).

Dónde mirar (archivos clave)

- API y auth

  - `src/app/shared/api/api.service.ts` — wrapper HTTP central.
  - `src/app/shared/interceptors/bearer.interceptor.ts`
  - `src/app/shared/interceptors/refresh.interceptor.ts`
  - `src/app/services/auth.service.ts` (o similar) — lógica de login/logout.

- Landing (UI público)

  - `src/app/landing/pages/landing-page/*` — `hero`, `features`, `contact-form`, `testimonials`, `process`, `details`.

- Admin (panel)
  - `src/app/admin/pages/login/*` — login y redirecciones.
  - `src/app/admin/layout/*` — layout de dashboard (aside + content).
  - `src/app/admin/pages/dashboard/pages/institutions/*` — CRUD instituciones.
  - `src/app/admin/pages/dashboard/pages/users-clients/*` — CRUD usuarios.

Buenas prácticas al editar

- Evitar reformateos masivos: mantener estilo y estructura existente.
- Al cambiar formularios, crear tests mínimos o al menos validar que `ng serve` arranca sin errores de TypeScript.
- Para endpoints paginados, verificar el contrato: el front espera (por convención) una forma parecida a `{ items: T[], totalPages: number }` — adaptar mapper si la API devuelve otra forma.

Qué hacer cuando toques auth/refresh

- No eliminar la lógica del `refresh.interceptor`. Si cambias storage (por ejemplo a IndexedDB o a un servicio), mantener la capacidad de relanzar la petición original.
- Si añades un nuevo endpoint de refresh, mantener `withCredentials: true` en la llamada para enviar la cookie.

Ejecutar localmente

- Comandos npm disponibles (Windows PowerShell):
  - `npm install` para instalar dependencias.
  - `npm start` para ejecutar `ng serve` (dev server).
  - `npm test` ejecuta tests (si existen).

Notas sobre Tailwind

- Las utilidades Tailwind están en `src/styles.css`. Mantener utilidades en los templates (clases) en lugar de CSS globales salvo cuando sea reusable.

Edge cases comunes

- FormBuilder typing: al usar `fb.group<T>()` el compilador puede fallar; preferir `fb.control(...)` o definir explícitamente la estructura del `FormGroup`.
- Mailto en `contact-form` es un fallback: no garantiza entrega. Para envío fiable, integrar un endpoint backend o un servicio externo.
- Conversión de `institutionId` entre `string` (select HTML) y `number`: normalizar en el borde del formulario.

Checklist de la petición original

- [x] Generar/actualizar `.github/copilot-instructions.md` con guía específica del repo.

Si necesitas más precisión

- Puedo añadir ejemplos concretos (snippets) de cómo reintentar una petición HTTP en el `refresh.interceptor`, o incluir comandos de debug específicos. Indica qué prefieres.

Fin del archivo.
