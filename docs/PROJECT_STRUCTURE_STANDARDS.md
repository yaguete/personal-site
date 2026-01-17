## Project Structure Standards

Objetivo: que cualquier persona o agente entienda rapido la estructura y
mantenga orden al tocar el proyecto.

### 1) Carpetas principales
- `app/`: aplicacion Next.js (App Router).
- `app/api/`: rutas de API (server functions).
- `app/playground/`: demos y herramientas experimentales.
- `app/blog/`: posts MDX.
- `public/`: assets publicos.
- `lib/`: utilidades compartidas.
- `heroku-deploy/`: servicios Python (legacy / soporte).

### 2) Convenciones generales
- Mantener los cambios de UI y data en `app/`.
- Si agregas un feature nuevo, ubicalo en `app/` con su pagina y componentes.
- Reutiliza componentes en `app/components/` cuando tengan uso general.
- Evita meter logica nueva en `heroku-deploy/` salvo mantenimiento puntual.

### 3) Estructura dentro de `app/`
- `app/layout.tsx`: layout global, metadata y JSON-LD principal.
- `app/page.tsx`: home.
- `app/data.ts`: contenido y data estructurada (experiencia, educacion, etc).
- `app/components/`: componentes compartidos de UI y layout.
- `app/hooks/`: hooks reutilizables de React.
- `app/components/StructuredData.tsx`: JSON-LD fallback para posts o pages.
- `app/playground/*`: cada tool con su propio folder y componentes.

### 4) Estandares para documentacion
- Documenta cada feature nuevo en `docs/TECHNICAL_DOCUMENTATION.md`.
- Si cambias estructura, actualiza este archivo.
- Mantener descripciones cortas y accionables.

### 5) Guardrails
- Evitar introducir dependencias sin necesidad.
- Mantener `metadata` y `structured data` alineados con el perfil real.

### 6) Filosofia de desarrollo
- Calidad primero: cambios pequenos y reversibles.
- Seguridad por defecto: nada de secretos en el repo.
- Performance desde el inicio: evita cargas innecesarias.
- Mantenibilidad > velocidad: codigo legible y simple.
- Documentacion como parte del cambio.

### 7) Convenciones de nombres
- Mantener el estilo existente en cada carpeta.
- Componentes React en `PascalCase` (ej: `Header.tsx`).
- Hooks como `useXxx` (ej: `useClickOutside.tsx`).
- Evitar nombres genericos (`Utils`, `Helpers`, `Component`).
- Si dudas, imita el archivo mas parecido ya existente.

### 8) Git y cambios
- Commits pequenos y con mensajes descriptivos.
- Un commit = un cambio coherente.
- Documenta en `docs/` cuando cambie estructura o flujos.
