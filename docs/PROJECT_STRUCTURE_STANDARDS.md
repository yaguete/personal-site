## Project Structure Standards

Objetivo: que cualquier persona o agente entienda rapido la estructura y
mantenga orden al tocar el proyecto.

### 🎯 Core Philosophy
**"Build Right From Day One"**

- **Quality First**: Cambios pequenos y reversibles. Prueba antes de cambiar.
- **Security by Design**: Nunca hardcodear secrets, siempre validar input.
- **Performance by Default**: Optimizar durante desarrollo, no despues.
- **Maintainability Over Speed**: Codigo legible y simple. Se lee mas de lo que se escribe.
- **Documentation as Code**: Buen codigo se documenta solo, gran codigo tiene docs.

---

### 0) Estructura del proyecto

```
PersonalSite/
├── app/                       # Aplicacion Next.js (App Router)
│   ├── api/                   # Rutas API (server functions)
│   ├── blog/                  # Posts MDX
│   ├── components/            # Componentes compartidos de UI
│   │   └── ui/               # Componentes UI reutilizables
│   ├── hooks/                 # Hooks reutilizables de React
│   ├── playground/            # Demos y herramientas experimentales
│   ├── privacy/              # Paginas de privacidad (eng/es)
│   ├── layout.tsx            # Layout global y metadata
│   ├── page.tsx              # Homepage
│   └── data.ts               # Contenido estructurado
├── docs/                      # Documentacion del proyecto
├── lib/                       # Utilidades compartidas
├── public/                    # Assets publicos (imagenes, logos, audio)
├── heroku-deploy/             # Servicios Python (legacy / soporte)
├── logs/                      # Logs de desarrollo local
├── README.md                  # Overview del proyecto
├── START_HERE.md              # Guia de inicio rapido
├── start.sh                   # Script para arrancar backend + frontend
├── stop.sh                    # Script para detener servidores
├── mdx-components.tsx         # Componentes MDX compartidos
├── package.json               # Dependencias Node.js
└── tsconfig.json              # Configuracion TypeScript
```

---

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

#### Estructura de `app/playground/`
Cada tool experimental debe seguir esta estructura:

```
app/playground/my-tool/
├── page.tsx                  # Pagina principal de la tool
├── components/              # Componentes especificos de la tool
│   └── MyComponent.tsx
├── lib/                     # Utilidades especificas (opcional)
│   └── helpers.ts
├── api/                     # Rutas API Next.js (si necesita backend)
│   └── route.ts
├── backend/                 # Servicio Python (si necesita)
│   ├── app.py
│   ├── prompts/            # Prompts para LLMs (si aplica)
│   └── requirements.txt
└── README.md               # Documentacion de la tool
```

**Reglas:**
- Cada tool debe ser auto-contenida en su carpeta.
- Si necesita backend Python, mantenerlo en `backend/`.
- Si necesita API routes, usar `app/playground/my-tool/api/route.ts`.
- Documentar cada tool en su README.md.

### 4) Estandares para documentacion
- Documenta cada feature nuevo en `docs/TECHNICAL_DOCUMENTATION.md`.
- Si cambias estructura, actualiza este archivo.
- Mantener descripciones cortas y accionables.

### 5) Guardrails
- Evitar introducir dependencias sin necesidad.
- Mantener `metadata` y `structured data` alineados con el perfil real.

### 6) Path aliases y imports
- Usar `@/*` para imports absolutos (configurado en `tsconfig.json`).
- Ejemplo: `import { Spotlight } from '@/app/components/ui/spotlight'`.
- Evitar imports relativos profundos (`../../../`).
- Mantener imports organizados (externos → internos → relativos).

### 7) 🏷️ Convenciones de nombres

#### Frontend (TypeScript/React) - PascalCase para componentes

**Archivos de Componentes**
```
ContactSection.tsx            ✅ Correct
PlaygroundCard.tsx            ✅ Correct
AudioPlayer.tsx               ✅ Correct

contactSection.tsx            ❌ Wrong
contact-section.tsx           ❌ Wrong
contact_section.tsx           ❌ Wrong
```

**Hooks**
```
useClickOutside.tsx           ✅ Correct (camelCase con "use")

use_click_outside.tsx         ❌ Wrong
UseClickOutside.tsx           ❌ Wrong
```

**Componentes UI (app/components/ui/)**
```
Spotlight.tsx                 ✅ Correct
Magnetic.tsx                  ✅ Correct
MorphingDialog.tsx            ✅ Correct

spotlight.tsx                 ❌ Wrong
spotlight-component.tsx       ❌ Wrong
```

**Archivos de utilidades (lib/)**
```
utils.ts                      ✅ Correct (kebab-case si tuvieras utils-auth.ts)
constants.ts                  ✅ Correct

Utils.ts                      ❌ Wrong
UTILS.ts                      ❌ Wrong
```

**Funciones y variables - camelCase**
```typescript
const getUserById = () => {};           ✅ Correct
const get_user_by_id = () => {};        ❌ Wrong

const isHovered = useState(false);      ✅ Correct
const is_hovered = useState(false);     ❌ Wrong
```

**Constantes - UPPER_SNAKE_CASE**
```typescript
const MAX_FILE_SIZE = 50_000_000;       ✅ Correct
const maxFileSize = 50_000_000;         ❌ Wrong
```

**Types e Interfaces - PascalCase**
```typescript
interface UserData {}                   ✅ Correct
type SpotlightProps = {}                ✅ Correct

interface userData {}                   ❌ Wrong
type spotlightProps = {}                ❌ Wrong
```

#### Backend (Python) - snake_case

**Archivos**
```
linkedin_recommender_app.py   ✅ Correct
preprint_audit_app.py         ✅ Correct
main.py                        ✅ Correct (punto de entrada)

linkedinRecommenderApp.py     ❌ Wrong
linkedin-recommender-app.py   ❌ Wrong
```

**Directorios**
```
linkedin_recommender/         ✅ Correct
preprint_audit/              ✅ Correct
profile_analyzer/            ✅ Correct

linkedinRecommender/          ❌ Wrong
linkedin-recommender/         ❌ Wrong
```

**Clases - PascalCase**
```python
class UserService:            ✅ Correct
class LinkedInRecommender:    ✅ Correct

class user_service:           ❌ Wrong
class linkedInRecommender:    ❌ Wrong
```

**Funciones y variables - snake_case**
```python
def get_user_by_id():         ✅ Correct
def analyze_pdf():            ✅ Correct
user_email = "test@example.com"  ✅ Correct

def getUserById():            ❌ Wrong
def analyzePdf():             ❌ Wrong
userEmail = "test@example.com"   ❌ Wrong
```

**Constantes - UPPER_SNAKE_CASE**
```python
MAX_FILE_SIZE = 50_000_000    ✅ Correct
DEFAULT_TIMEOUT = 30          ✅ Correct

max_file_size = 50_000_000    ❌ Wrong
defaultTimeout = 30           ❌ Wrong
```

**Blueprint y rutas Flask**
```python
# ✅ Correct
app = Blueprint('preprint_audit', __name__)
@app.route('/analyze-pdf', methods=['POST'])

# ❌ Wrong
app = Blueprint('preprintAudit', __name__)
@app.route('/analyzePdf', methods=['POST'])
```

#### Evitar nombres genericos

```typescript
// ❌ Mal - demasiado generico
Component.tsx
Utils.tsx
Helpers.tsx
index.tsx

// ✅ Bien - descriptivo
PlaygroundCard.tsx
ContactSection.tsx
useClickOutside.tsx
Spotlight.tsx
```

### 8) 🔐 Security Standards

#### Autenticacion y autorizacion

```typescript
// ❌ NUNCA: Hardcodear secrets
const API_KEY = "hardcoded-secret";

// ✅ SIEMPRE: Usar variables de entorno
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || (() => {
  throw new Error('API_KEY is required');
})();
```

#### Validacion de input

```typescript
// ❌ NUNCA: Confiar en datos del cliente sin validar
const userInput = request.body;

// ✅ SIEMPRE: Validar input
const validatedData = UserSchema.parse(request.body);
```

#### Variables de entorno

```bash
# .env.example (documentar todas las variables)
NEXT_PUBLIC_API_URL=https://api.example.com
OPENAI_API_KEY=your_key_here

# .env.local (NUNCA commiteado, en .gitignore)
NEXT_PUBLIC_API_URL=http://localhost:5001
OPENAI_API_KEY=actual_secret_key
```

### 9) 📦 Dependency Management

#### package.json - Usar versiones exactas para seguridad

```json
{
  "dependencies": {
    "next": "^16.1.1",
    "react": "^19.0.0",
    "motion": "^11.15.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^9.0.0"
  }
}
```

#### requirements.txt (Python)

```python
# Version exacta para produccion
flask==3.0.0
flask-cors==4.0.0

# Rango para desarrollo
pytest>=8.0.0,<9.0.0
```

### 10) 💻 Code Quality Standards

#### Tamaño de funciones

```typescript
// ✅ Mantener funciones pequeñas y enfocadas (< 30 lineas)
const handleSubmit = async (data: FormData) => {
  validateFormData(data);
  const response = await submitToAPI(data);
  showSuccessMessage();
  return response;
};

// ❌ Evitar funciones grandes (150+ lineas)
// Dividir en funciones mas pequenas
```

#### Manejo de errores consistente

```typescript
// ✅ Manejo consistente de errores
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (error) {
  console.error('API call failed:', error);
  return { success: false, error: error.message };
}

// ❌ Inconsistente (a veces console.log, a veces nada)
```

#### Organizacion de imports

```typescript
// ✅ Imports organizados
// 1. Node modules
import React from 'react';
import { motion } from 'motion/react';

// 2. Imports internos (paths absolutos)
import { Spotlight } from '@/app/components/ui/spotlight';
import { cn } from '@/lib/utils';

// 3. Imports relativos
import './Component.styles.css';
```

### 11) 🔄 Git y cambios

#### Naming de branches

```bash
# ✅ Buenas
feature/add-spotlight-effect
bugfix/fix-privacy-import
refactor/reorganize-components
docs/update-project-structure

# ❌ Malas
fix                    # Demasiado vago
new-feature           # Que feature?
yago-branch           # Nombres personales
temp                  # Temporales se vuelven permanentes
```

#### Commit messages

```bash
# Formato: type(scope): description
# Types: feat, fix, docs, style, refactor, test, chore

# ✅ Buenos
feat(spotlight): add hover effect to work experience cards
fix(privacy): correct import path in es/page.tsx
docs(standards): add naming conventions section
refactor(components): move ui components to app/components/ui
chore(deps): update motion/react to latest version

# ❌ Malos
Update stuff            # Que stuff?
Fix bug                 # Que bug?
WIP                     # Work in progress - squash antes
asdf                    # Texto aleatorio
Updated files           # Obvio e inutil
```

#### Checklist antes de commit

- [ ] Tests pasan (si existen)
- [ ] Linter sin errores
- [ ] Commit message descriptivo
- [ ] Solo cambios relacionados en el commit
- [ ] Documentacion actualizada si es necesario

### 12) 🧪 Testing Standards (si se implementan)

**Nota**: El proyecto actualmente no tiene tests implementados. Si se añaden en el futuro:

#### Estructura recomendada

```
app/
├── components/
│   └── Spotlight.tsx
│   └── Spotlight.test.tsx          # Tests co-localizados
└── hooks/
    └── useClickOutside.tsx
    └── useClickOutside.test.tsx    # Tests co-localizados

app/playground/my-tool/
├── components/
│   └── MyComponent.tsx
│   └── MyComponent.test.tsx        # Tests de la tool
└── __tests__/                      # Tests de integracion (opcional)
    └── my-tool.integration.test.tsx
```

#### Naming de tests

```typescript
// ✅ Descriptive test names
describe('Spotlight', () => {
  describe('onMouseEnter', () => {
    it('should set isHovered to true when mouse enters', () => {});
    it('should show spotlight when hovered', () => {});
  });
  
  describe('onMouseMove', () => {
    it('should update spotlight position based on mouse coordinates', () => {});
  });
});

// ❌ Bad test names
describe('Spotlight', () => {
  it('works', () => {});                    ❌ Too vague
  it('test hover', () => {});               ❌ Not descriptive
  it('should work correctly', () => {});    ❌ What is "correctly"?
});
```

#### Prioridades de testing (si se implementan)

1. **Componentes UI críticos** (Spotlight, Magnetic, MorphingDialog) - 80%+
2. **Hooks reutilizables** (useClickOutside) - 90%+
3. **API routes** - 70%+
4. **Playground tools** - 60%+ (experimentales, menos crítico)

### 12) 🎯 Quick Reference Checklist

**Antes de crear un archivo nuevo:**
- [ ] El nombre sigue las convenciones?
- [ ] Esta en el directorio correcto?
- [ ] Tiene una responsabilidad clara?
- [ ] Necesitara tests?

**Antes de escribir una funcion:**
- [ ] El nombre es descriptivo?
- [ ] Es pequena y enfocada (< 30 lineas)?
- [ ] Tiene manejo de errores?
- [ ] Deberia tener documentacion?

**Antes de hacer commit:**
- [ ] Tests pasan?
- [ ] Linter sin errores?
- [ ] Mensaje de commit descriptivo?
- [ ] Solo cambios relacionados?

**Antes de hacer push:**
- [ ] Todos los cambios commiteados?
- [ ] Build local funciona?
- [ ] Documentacion actualizada si aplica?
