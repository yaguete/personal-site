# Preprint Audit Backend

Backend Flask para análisis de PDFs para impresión.

## Instalación

```bash
pip install -r requirements.txt
```

## Configuración

1. Crear archivo `.env` con:
```
OPENAI_API_KEY=tu-api-key-aqui
OPENAI_MODEL=gpt-4o-mini
```

## Ejecutar

```bash
python app.py
```

El servidor se ejecutará en `http://localhost:5002`

## Endpoints

- `GET /` - Health check
- `POST /analyze-pdf` - Analizar PDF (multipart/form-data con archivo PDF) 