## Documentacion tecnica

### App shell
- `app/layout.tsx` define el layout global y los metadatos SEO.
- Incluye JSON-LD principal con datos de perfil.
- `app/header.tsx` y `app/footer.tsx` son globales.

### Contenido y datos base
- `app/data.ts` centraliza:
  - `WORK_EXPERIENCE`
  - `EDUCATION`
  - `PROJECTS`
  - `BLOG_POSTS`
  - `SOCIAL_LINKS`
  - `SIDE_PROJECTS`
- Estos datos se consumen en `app/page.tsx` y otras secciones.

### Home
- `app/page.tsx`: landing principal.
- Renderiza secciones basadas en `app/data.ts`.
- Evitar duplicar texto que ya existe en `app/data.ts`.

### Structured data
- `app/layout.tsx` contiene JSON-LD de tipo `ProfilePage` + `Person`.
- `app/components/StructuredData.tsx` es fallback o para posts.
- Mantener la descripcion y ocupaciones consistentes con el perfil real.

### Playground
- `app/playground/` contiene herramientas experimentales.
- Cada herramienta tiene su pagina y componentes propios.
- Algunos playgrounds usan prompts y datos en `app/playground/*`.

### API routes
- `app/api/` contiene endpoints de soporte para tools internas.
- Mantener rutas y payloads simples y documentados en este archivo si se tocan.

### Blog
- `app/blog/*`: posts en MDX.
- `mdx-components.tsx` define componentes MDX compartidos.

### Config y estilos
- `app/config.ts`: flags (ej. maintenance mode).
- `app/globals.css`: estilos base.

### Deploy
- Vercel despliega con push a `main`.
- `heroku-deploy/` existe para servicios Python legacy.

### Seguridad basica
- No hardcodear secretos ni tokens.
- Validar inputs en `app/api/*` antes de procesar.
- No confiar en datos del cliente sin validar.
- Limitar la superficie de API a lo necesario.

### Testing y calidad
- No hay suite formal; si agregas logica critica, incluye tests si aplica.
- Preferir funciones pequenas y con una sola responsabilidad.
- Evitar duplicar logica: reutiliza helpers en `lib/`.

### Flujo de trabajo
- Cambios pequenos, con commit claro.
- Si tocas SEO, revisa `metadata` y JSON-LD.
- Si cambias datos base, actualiza este documento.

### Notas para agentes
- Antes de tocar SEO, revisar `metadata` + JSON-LD.
- Si se cambia estructura de datos, actualizar este doc.
