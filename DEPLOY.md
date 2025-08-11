# 🚀 Space Defender - Instrucciones de Despliegue

## Despliegue en Netlify (GRATIS)

### Opción 1: Despliegue Automático desde GitHub
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up" y conéctate con tu cuenta de GitHub
3. Haz clic en "New site from Git"
4. Selecciona tu repositorio de Space Defender
5. Configuración automática:
   - Build command: (dejar vacío)
   - Publish directory: `.`
6. Haz clic en "Deploy site"

### Opción 2: Despliegue Manual
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra y suelta la carpeta del proyecto
3. ¡Listo! Tu sitio estará en línea

### Opción 3: Despliegue desde línea de comandos
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Desplegar
netlify deploy --prod
```

## 🌐 URL del Juego
Una vez desplegado, tu juego estará disponible en:
`https://[nombre-aleatorio].netlify.app`

## ✅ Características del Despliegue
- ✅ Hosting gratuito
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Actualizaciones automáticas desde GitHub
- ✅ Sin configuración de servidor

## 🎮 Jugar
1. Abre la URL del juego
2. Haz clic en "JUGAR"
3. Usa WASD o flechas para moverte
4. Haz clic para disparar
5. ¡Disfruta del juego!