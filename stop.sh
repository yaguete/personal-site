#!/bin/bash

# Script para detener Backend (Flask) + Frontend (Next.js)

echo "🛑 Deteniendo servidores..."
echo ""

# Leer PIDs de los archivos
if [ -f logs/backend.pid ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend detenido (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend ya estaba detenido"
    fi
    rm logs/backend.pid
else
    echo "⚠️  No se encontró PID del backend"
fi

if [ -f logs/frontend.pid ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend detenido (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend ya estaba detenido"
    fi
    rm logs/frontend.pid
else
    echo "⚠️  No se encontró PID del frontend"
fi

# Matar cualquier proceso que quede corriendo
pkill -f "python3 main.py" 2>/dev/null
pkill -f "next dev" 2>/dev/null

echo ""
echo "✅ Todos los servidores detenidos"

