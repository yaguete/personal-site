## Documentacion tecnica

**Objetivo**: Explicar **como funcionan** las partes tecnicas del proyecto, flujos de datos y funcionalidades especificas.

**Nota**: Para estandares de codigo, estructura y naming, ver `PROJECT_STRUCTURE_STANDARDS.md`.

---

### App shell y layout

#### `app/layout.tsx`
- Define el layout global de Next.js (App Router).
- Contiene metadatos SEO principales en `metadata`.
- Incluye JSON-LD estructurado de tipo `ProfilePage` + `Person` con datos de perfil completos.
- Maneja el `ThemeProvider` para dark/light mode.
- Inyecta fuentes (Geist, Geist Mono) como variables CSS.

#### Componentes globales
- `app/header.tsx`: Header fijo en todas las paginas.
- `app/footer.tsx`: Footer con enlaces y copyright.

---

### Flujo de datos: `app/data.ts` → `app/page.tsx`

#### `app/data.ts` - Fuente unica de verdad
Centraliza todo el contenido estructurado:

```typescript
export const WORK_EXPERIENCE: WorkExperience[] = [...]
export const EDUCATION: Education[] = [...]
export const PROJECTS: Project[] = [...]
export const BLOG_POSTS: BlogPost[] = [...]
export const SOCIAL_LINKS: SocialLink[] = [...]
export const SIDE_PROJECTS: SideProject[] = [...]
```

**Regla critica**: `app/page.tsx` NO debe duplicar texto de `app/data.ts`. 
- Importa datos de `app/data.ts`.
- Renderiza componentes pasando los datos.
- Si necesitas cambiar contenido, edita `app/data.ts`, no `app/page.tsx`.

#### `app/page.tsx` - Homepage
- Importa arrays de `app/data.ts`.
- Mapea datos a componentes React (ProjectCard, MorphingDialog, etc.).
- Usa `MorphingDialog` para mostrar detalles de trabajo/experiencia.
- Usa `Spotlight` para efectos hover en tarjetas.

**Flujo tipico**:
```typescript
import { WORK_EXPERIENCE } from './data';

WORK_EXPERIENCE.map((job) => (
  <MorphingDialog>
    <Spotlight />
    {/* Renderiza datos del job */}
  </MorphingDialog>
))
```

---

### Structured Data (JSON-LD) para SEO

#### Dos niveles de JSON-LD

**1. `app/layout.tsx` (principal)**
- JSON-LD de tipo `ProfilePage` + `Person`.
- Datos completos del perfil: nombre, educacion, experiencia, credenciales.
- Se inyecta en todas las paginas via `<script type="application/ld+json">`.
- **Importante**: Mantener `description` y `hasOccupation` consistentes con el perfil real.

**2. `app/components/StructuredData.tsx` (fallback)**
- Se usa en posts del blog cuando pasan su propio `data`.
- Si no hay `data` prop, genera JSON-LD basico desde `WORK_EXPERIENCE` y `EDUCATION`.

**Regla**: Si cambias tu descripcion profesional, actualizar AMBOS lugares:
- `app/layout.tsx` linea 82 (description en mainEntity)
- `app/layout.tsx` linea 25 (metadata.description)
- `app/components/StructuredData.tsx` linea 50 (description)

---

### Playground tools

Cada tool en `app/playground/` es auto-contenida. Ver `PROJECT_STRUCTURE_STANDARDS.md` seccion 3 para estructura.

#### Flujo tipico de una tool

**Frontend (Next.js)**
```
app/playground/my-tool/page.tsx
  ↓ (usuario sube archivo/hace request)
app/playground/my-tool/api/route.ts
  ↓ (llama a backend)
Backend Python (heroku-deploy/)
  ↓ (procesa con LLM/librerias)
Respuesta JSON
  ↓ (vuelve al frontend)
app/playground/my-tool/page.tsx (muestra resultados)
```

**Ejemplo real**: `preprint-audit`
1. Usuario sube PDF en `FileUploader.tsx`.
2. `app/api/preprint-audit/route.ts` recibe el archivo.
3. Envia a `heroku-deploy/preprint_audit/preprint_audit_app.py`.
4. Python analiza PDF, genera reporte.
5. Frontend muestra `Results.tsx` con analisis.

---

### API Routes (`app/api/`)

#### Chat personal (`/api/ask`)

- `lib/ai/persona.ts` define la voz en primera persona, las conversaciones profesionales y los límites de privacidad. Si se pregunta expresamente, aclara que es la versión conversacional de Yago; no revela el modelo ni el proveedor.
- La referencia general a Barcelona desde 2019 está autorizada en el perfil. No permite revelar barrio, dirección, ubicación en tiempo real ni otros detalles de residencia.
- `lib/ai/recruiter-profile.ts` genera el perfil desde `SITE_BIO`, `EMAIL`, `SOCIAL_LINKS`, `EDUCATION` y `WORK_EXPERIENCE` en `app/data.ts`. No mantiene otra copia del CV, las fechas, los contactos o las herramientas. Solo conserva contexto editorial adicional que no tiene otra fuente en la web.
- Cada empleo en `WORK_EXPERIENCE` declara en `chat.fields` qué campos puede recibir el chat. Los empleos nuevos incluyen por defecto únicamente empresa, cargo y fechas; el resto requiere selección explícita. `chat.summary` permite un resumen acotado cuando la descripción completa no es adecuada. HP solo incluye ese resumen y las herramientas publicadas, sin sus proyectos, responsabilidades detalladas ni logros. Editar el CV en `app/data.ts` actualiza tanto la web como el perfil del chat en el siguiente despliegue/reinicio.
- `lib/ai/knowledge.ts` añade el playground y los artículos del índice `BLOG_POSTS` en los idiomas publicados. No recorre borradores ni carga `SITE_ORIGIN`. Las notas personales se consultan únicamente durante la edición: el chat no tiene acceso al vault. No incluir hechos privados ni siquiera como ejemplos de lo que no debe contar.
- Los resultados se toman del CV publicado, conservando los enlaces, la atribución compartida y las estimaciones. Cualquier ampliación de campos permitidos o nuevo artículo requiere revisar qué información introduce en el chat.
- `lib/ai/page-context.ts` solo incorpora rutas conocidas al contexto del sistema para que una URL enviada por el visitante no inserte instrucciones.
- La búsqueda web se reserva para temas externos; las instrucciones prohíben usarla para completar datos personales, internos del trabajo o de la implementación del chat. Estas restricciones de lenguaje no garantizan resistencia absoluta a ataques: la protección principal es no dar al chat datos privados.
- Verificación local: `npm run test:ai`. Las pruebas comprueban la selección de fuentes y el tratamiento de rutas manipuladas; no sustituyen la evaluación de respuestas del modelo.

#### Rutas disponibles

**`/api/linkedin-recommendation`**
- Genera recomendaciones personalizadas para LinkedIn.
- Llama a backend Python en `heroku-deploy/linkedin_recommender/`.
- Recibe: contexto de trabajo, estilo (chili/flores/medio).
- Retorna: texto de recomendacion.

**`/api/preprint-audit`**
- Analiza PDFs de preprints academicos.
- Llama a backend Python en `heroku-deploy/preprint_audit/`.
- Endpoints: `/analyze-pdf` y `/expert-analysis`.

**`/api/profile-analyzer`**
- Analiza perfiles de candidatos desde multiples fuentes.
- Endpoints: `/analyze`, `/extract-candidate-name`, `/extract-role-categories`.

**`/api/printbuddy`**
- Busca en base de conocimientos de HP Support.

#### Reglas
- Todas las rutas validan input antes de procesar.
- Usan `process.env.NODE_ENV` para decidir URL de backend:
  - Desarrollo: `http://127.0.0.1:5001`
  - Produccion: URL de Heroku.
- Mantener payloads simples (JSON o FormData).

---

### Blog con MDX

#### Estructura
```
app/blog/
├── dead-internet-theory/
│   ├── eng/page.mdx         # Post en ingles
│   ├── es/page.mdx          # Post en espanol
│   └── page.tsx             # Wrapper con navegacion idioma
└── ai-end-of-work/
    ├── eng/page.mdx
    └── es/page.mdx
```

#### `mdx-components.tsx`
Define componentes personalizados para MDX:
- `<Cover>`: Imagen de portada con caption.
- `<AudioPlayer>`: Player de audio para posts.
- `<StructuredData>`: JSON-LD para cada post.

#### Metadata en posts
Cada `.mdx` exporta `metadata` con:
- `title`, `description`, `authors`.
- `openGraph`, `twitter` cards.
- `alternates.canonical` y `languages`.

---

### Configuracion y estilos

#### `app/config.ts`
Flags de configuracion:
- `MAINTENANCE_MODE`: Activa/desactiva modo mantenimiento.
- `SHOW_SELECTED_PROJECTS`: Muestra/oculta seccion de proyectos.

#### `app/globals.css`
- Estilos base con Tailwind CSS.
- Variables CSS para temas (dark/light).
- Estilos globales compartidos.

---

### Deploy y arquitectura

#### Frontend (Next.js)
- **Despliegue**: Vercel con push a `main`.
- **Build**: `npm run build --webpack` (usar webpack, no Turbopack).
- **Dev**: `npm run dev --webpack` (evita problemas con MDX).

#### Backend (Python/Flask)
- **Ubicacion**: `heroku-deploy/`.
- **Estado**: Legacy/soporte, no agregar nueva logica salvo mantenimiento.
- **Despliegue**: Heroku separado (no se despliega desde este repo).
- **Dev local**: `./start.sh` arranca backend en puerto 5001.

#### Flujo de desarrollo local
```
./start.sh
  ├── Backend: http://localhost:5001 (Flask)
  └── Frontend: http://localhost:3000 (Next.js)
```

---

### Notas para agentes

**Antes de tocar SEO:**
1. Revisar `app/layout.tsx` (metadata + JSON-LD).
2. Revisar `app/components/StructuredData.tsx` si afecta posts.
3. Mantener descripcion consistente en ambos lugares.

**Antes de cambiar estructura de datos:**
1. Actualizar `app/data.ts`.
2. Verificar que `app/page.tsx` usa los datos correctamente.
3. Actualizar este documento si cambia el flujo.

**Antes de tocar API routes:**
1. Verificar URL de backend (dev vs prod).
2. Validar input antes de procesar.
3. Manejar errores de forma consistente.
