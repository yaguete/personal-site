# 🚀 Cómo arrancar el proyecto

## Arrancar todo (Backend + Frontend)

```bash
./start.sh
```

Esto arrancará:
- **Backend (Flask)**: http://localhost:5001
- **Frontend (Next.js)**: http://localhost:3000

Los logs se guardan en `logs/backend.log` y `logs/frontend.log`

## Detener todo

```bash
./stop.sh
```

## Arrancar manualmente (si prefieres)

### Backend (Terminal 1)
```bash
cd heroku-deploy
source venv/bin/activate
python3 main.py
```

### Frontend (Terminal 2)
```bash
npm run dev
```

## Ver logs en tiempo real

```bash
tail -f logs/backend.log
tail -f logs/frontend.log
```

---

**Nota**: Si tienes problemas, asegúrate de que:
1. El archivo `.env` existe en la raíz del proyecto
2. Las dependencias están instaladas (`npm install`)
3. El venv de Python existe (`heroku-deploy/venv/`)

