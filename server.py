#!/usr/bin/env python3
"""
Servidor HTTP simple para Space Defender
Ejecuta este archivo para iniciar un servidor local y probar el juego
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

# Configuración del servidor
PORT = 8000
DIRECTORY = Path(__file__).parent

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Agregar headers para evitar problemas de CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    """Función principal para iniciar el servidor"""
    print("🚀 Iniciando Space Defender...")
    print(f"📁 Directorio: {DIRECTORY}")
    print(f"🌐 Puerto: {PORT}")
    
    # Cambiar al directorio del script
    os.chdir(DIRECTORY)
    
    # Crear el servidor
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"✅ Servidor iniciado en http://localhost:{PORT}")
        print("🌍 Abriendo navegador automáticamente...")
        print("⏹️  Presiona Ctrl+C para detener el servidor")
        print("-" * 50)
        
        # Abrir el navegador automáticamente
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            print("⚠️  No se pudo abrir el navegador automáticamente")
            print(f"🌐 Abre manualmente: http://localhost:{PORT}")
        
        # Mantener el servidor corriendo
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor detenido")
            print("👋 ¡Gracias por jugar Space Defender!")

if __name__ == "__main__":
    main()