#!/bin/bash

# Space Defender - Script de inicio rápido
# Para sistemas Linux y macOS

echo "🚀 Space Defender - Iniciando..."
echo "================================"

# Verificar si Python 3 está instalado
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 encontrado"
    python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python encontrado"
    python server.py
else
    echo "❌ Python no está instalado"
    echo "📥 Instala Python 3 desde: https://python.org"
    echo ""
    echo "🌐 Alternativa: Abre index.html directamente en tu navegador"
    exit 1
fi