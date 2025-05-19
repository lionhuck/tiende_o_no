🌦️ Tiende o No - ¿Puedes colgar tu ropa hoy?
License: MIT
Next.js
TypeScript

Tiende o No es tu asistente meteorológico personal que te indica si las condiciones son ideales para tender la ropa al aire libre. ¡Nunca más te sorprenderá la lluvia con tu ropa colgada!

✨ Características principales
🌍 Detección automática de ubicación - O ingreso manual si prefieres

☀️ Respuesta clara - "Puedes tender" o "Mejor no arriesgues"

📊 Pronóstico extendido - Visualización del clima para los próximos 7 días

📱 Totalmente responsive - Funciona perfecto en móviles, tablets y desktop

⚡ Rendimiento optimizado - Gracias a Next.js

🛠️ Stack tecnológico
Categoría	Tecnología
Framework	Next.js 13 (App Router)
Lenguaje	TypeScript 4.9+
Estilos	Tailwind CSS + CSS Modules
API Clima	OpenWeatherMap API
Geolocalización	Navigator Geolocation API
Hosting	Vercel (recomendado)
🚀 Instalación local
Sigue estos pasos para correr el proyecto en tu máquina:

bash
# 1. Clona el repositorio
git clone https://github.com/lionhuck/tiende_o_no.git

# 2. Entra al directorio
cd tiende_o_no

# 3. Instala dependencias
npm install
# o
yarn install

# 4. Configura las variables de entorno
cp .env.example .env.local
# Luego edita .env.local con tu API key de OpenWeather

# 5. Inicia el servidor de desarrollo
npm run dev
# o
yarn dev
Abre http://localhost:3000 en tu navegador.

🔧 Configuración
Variables de entorno
Crea un archivo .env.local con:

env
OPENWEATHER_API_KEY=tu_api_key_aqui
🤝 ¿Quieres contribuir?
¡Me encantaría recibir tus aportes! Por favor:

Haz fork del proyecto

Crea una branch (git checkout -b feature/amazing-feature)

Haz commit de tus cambios (git commit -m 'Add some amazing feature')

Haz push a la branch (git push origin feature/amazing-feature)

Abre un Pull Request

O si prefieres, abre un issue para reportar bugs o sugerir mejoras.

📄 Licencia
Este proyecto está bajo la licencia MIT - mira el archivo LICENSE para más detalles.

👨‍💻 Desarrollado con ❤️ por Leon Federico Huck
📧 Contacto: leonhuck007@email.com

¿Tiendes o no tiendes? ¡Deja que la app decida por ti! ☀️👚🌧️
