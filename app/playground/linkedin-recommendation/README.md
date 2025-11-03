# LinkedIn Recommendation Generator

Generador de recomendaciones personalizadas de LinkedIn utilizando IA.

## Características

- ✅ Generación de recomendaciones con IA (GPT-4)
- ✅ Múltiples tonos: Profesional, Equilibrado, Humorístico
- ✅ Soporte para español e inglés
- ✅ UI moderna y responsive
- ✅ Integración con backend Flask

## Estructura del Proyecto

```
app/playground/linkedin-recommendation/
├── page.tsx                    # Página principal
├── components/                 # Componentes específicos
├── lib/
│   └── config.ts              # Configuración
├── api/
│   └── generate/
│       └── route.ts           # API route
└── README.md                  # Documentación
```

## Configuración

### Variables de Entorno

```env
FLASK_API_URL=http://localhost:5000
```

### Backend Flask

El proyecto requiere que el backend Flask esté ejecutándose en el puerto 5000 (por defecto).

## Uso

1. Asegúrate de que el backend Flask esté ejecutándose
2. Configura la variable de entorno `FLASK_API_URL` si es necesario
3. Navega a `/playground/linkedin-recommendation`
4. Completa el formulario y genera tu recomendación

## Tecnologías

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Flask, Python
- **IA**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion 