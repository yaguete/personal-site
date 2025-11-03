# Configuración del LinkedIn Recommendation Generator

## Estructura del Proyecto

```
app/playground/linkedin-recommendation/
├── page.tsx                    # Frontend principal
├── api/generate/route.ts       # API de Next.js (proxy al Flask)
├── backend/
│   ├── app.py                 # Backend Flask
│   ├── requirements.txt       # Dependencias Python
│   └── README.md             # Instrucciones del backend
├── prompts/
│   ├── flores.txt            # Prompt para recomendaciones positivas
│   ├── medio.txt             # Prompt para recomendaciones equilibradas
│   └── chili.txt             # Prompt para roasts humorísticos
└── lib/
    └── config.ts             # Configuración del frontend
```

## Configuración del Backend Flask

### 1. Instalar dependencias Python
```bash
cd app/playground/linkedin-recommendation/backend
pip install -r requirements.txt
```

### 2. Configurar variables de entorno
Crear archivo `.env` en `backend/`:
```
OPENAI_API_KEY=tu_api_key_de_openai_aqui
```

### 3. Ejecutar el servidor Flask
```bash
cd app/playground/linkedin-recommendation/backend
python app.py
```

El servidor estará disponible en `http://127.0.0.1:5000`

## Configuración del Frontend

### 1. Variables de entorno
Crear archivo `.env.local` en la raíz del proyecto:
```
FLASK_API_URL_DEV=http://127.0.0.1:5000
FLASK_API_URL_PROD=https://linkedinrecommendations-9915dcfe56d6.herokuapp.com/
```

### 2. Ejecutar el frontend
```bash
npm run dev
```

## Funcionalidades Implementadas

### ✅ Completado:
- [x] Frontend con la misma lógica que el App.js original
- [x] Contador de recomendaciones con mensajes dinámicos
- [x] Tres tonos de recomendación (flores, medio, chili)
- [x] Soporte para español e inglés
- [x] Copiar al portapapeles
- [x] Botón para ir a LinkedIn
- [x] Backend Flask con OpenAI
- [x] Prompts personalizados por tono
- [x] Manejo de errores
- [x] Loading states

### 🔧 Características:
- **Contador inteligente**: Muestra mensajes diferentes según el número de recomendaciones generadas
- **Fallback**: Si el backend no está disponible, usa recomendaciones predefinidas
- **Responsive**: Funciona en móvil y desktop
- **Dark mode**: Soporte para tema oscuro
- **Animaciones**: Interfaz con animaciones suaves

## URLs de Desarrollo vs Producción

El frontend detecta automáticamente el entorno:
- **Desarrollo**: `http://127.0.0.1:5000`
- **Producción**: `https://linkedinrecommendations-9915dcfe56d6.herokuapp.com/`

## Despliegue

### Backend (Heroku):
1. Subir el código del backend a Heroku
2. Configurar `OPENAI_API_KEY` en las variables de entorno de Heroku
3. Asegurarse de que `requirements.txt` esté en la raíz

### Frontend (Vercel/Netlify):
1. El frontend se despliega automáticamente con el resto del sitio
2. Las variables de entorno se configuran en la plataforma de despliegue

## Troubleshooting

### Error de CORS:
- Asegúrate de que el backend Flask tenga CORS habilitado
- Verifica que las URLs estén correctamente configuradas

### Error de OpenAI:
- Verifica que la API key esté correctamente configurada
- Revisa los logs del backend para más detalles

### Error de conexión:
- Verifica que el backend Flask esté ejecutándose
- Comprueba que las URLs estén correctas para cada entorno 