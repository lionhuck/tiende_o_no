# 🌦️ Tiende o No - Tu pronóstico para tender ropa

[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-green.svg)](https://opensource.org/licenses/MIT)
![Next.js](https://img.shields.io/badge/Construido_con-Next.js-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)

¿Alguna vez has tendido la ropa y... ¡sorpresa! empezó a llover? Con **Tiende o No** eso será cosa del pasado. Esta aplicación te dice si es buen momento para colgar tu ropa al aire libre según el clima en tu ubicación.


## ✨ Lo que hace especial a Tiende o No

- **Decisión al instante**: Con solo abrir la app sabrás si es buen día para tender
- **Pronóstico semanal**: Planea tus lavados con anticipación
- **Para todos los dispositivos**: Funciona igual de bien en tu celular o computadora
- **Super rápida**: Gracias a Next.js, obtienes respuestas al instante

## 🛠️ Cómo está hecha

Como desarrollador, elegí tecnologías modernas y eficientes:

- **Next.js 13** con App Router para el rendimiento
- **TypeScript** para menos bugs y mejor mantenimiento
- **Tailwind CSS** para estilos rápidos y consistentes
- **OpenWeather API** para datos climáticos confiables

## 🚀 ¿Quieres probarla localmente?

Así puedes correrla en tu computadora:

```bash
# Clona el repositorio
git clone https://github.com/lionhuck/tiende_o_no.git

# Entra al directorio
cd tiende_o_no

# Instala lo necesario
npm install

# Configura tu API key (consíguela gratis en OpenWeather)
echo "OPENWEATHER_API_KEY=tu_clave_aquí" > .env.local

# ¡A correr!
npm run dev
