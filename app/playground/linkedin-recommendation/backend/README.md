# Backend Flask para LinkedIn Recommendation Generator

Este es el backend Flask que maneja la generación de recomendaciones de LinkedIn usando OpenAI.

## Configuración

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` en la carpeta `backend` con:
   ```
   OPENAI_API_KEY=tu_api_key_de_openai
   ```

3. **Estructura de archivos:**
   ```
   backend/
   ├── app.py
   ├── requirements.txt
   ├── .env
   └── prompts/
       ├── flores.txt
       ├── medio.txt
       └── chili.txt
   ```

## Ejecutar el servidor

### Desarrollo local:
```bash
python app.py
```

### Producción (con gunicorn):
```bash
gunicorn app:app
```

## Endpoints

### POST /generate
Genera una recomendación de LinkedIn.

**Parámetros:**
- `relacion` (string, requerido): Tipo de relación con Yago
- `aspectos_destacados` (string, opcional): Aspectos específicos a destacar
- `idioma` (string, opcional): 'es' o 'en' (default: 'es')
- `tono` (string, opcional): 'flores', 'medio', o 'chili' (default: 'flores')

**Respuesta:**
```json
{
  "recommendation": "Texto de la recomendación generada..."
}
```

## Prompts

Los prompts están organizados por tono:
- **flores.txt**: Recomendaciones positivas y profesionales
- **medio.txt**: Recomendaciones equilibradas con áreas de mejora
- **chili.txt**: Roasts humorísticos y amistosos

## Despliegue

Para desplegar en Heroku:
1. Asegúrate de que el archivo `requirements.txt` esté en la raíz
2. Configura la variable de entorno `OPENAI_API_KEY` en Heroku
3. El archivo `app.py` debe estar en la raíz del repositorio 