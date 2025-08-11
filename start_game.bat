@echo off
chcp 65001 >nul
title Space Defender - Servidor Local

echo 🚀 Space Defender - Iniciando...
echo ================================

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python encontrado
    python server.py
) else (
    python3 --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Python 3 encontrado
        python3 server.py
    ) else (
        echo ❌ Python no está instalado
        echo 📥 Instala Python desde: https://python.org
        echo.
        echo 🌐 Alternativa: Abre index.html directamente en tu navegador
        pause
        exit /b 1
    )
)

pause