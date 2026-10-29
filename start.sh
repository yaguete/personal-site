#!/bin/bash

# Script para arrancar Backend (Flask) + Frontend (Next.js)

echo "🚀 Arrancando ThinkMakeTest.ai..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Asegurar carpeta de logs
mkdir -p logs

# Arrancar Backend (Flask)
echo -e "${BLUE}📦 Arrancando Backend (Flask)...${NC}"
cd heroku-deploy
source venv/bin/activate
python3 main.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
cd ..

# Esperar un poco para que el backend arranque
sleep 2

# Arrancar Frontend (Next.js)
echo -e "${BLUE}⚛️  Arrancando Frontend (Next.js)...${NC}"
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > logs/frontend.pid

# Esperar a que arranquen
echo ""
echo "⏳ Esperando a que los servidores arranquen..."
sleep 8

echo ""
echo -e "${GREEN}✅ Servidores arrancados:${NC}"
echo ""
echo "   🔧 Backend:  http://localhost:5001"
echo "   🌐 Frontend: http://localhost:3000"
echo ""
echo "📝 Logs guardados en:"
echo "   - logs/backend.log"
echo "   - logs/frontend.log"
echo ""
echo "⛔ Para detener los servidores, ejecuta: ./stop.sh"
echo ""

