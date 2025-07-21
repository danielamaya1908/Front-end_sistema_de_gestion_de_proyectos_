🗂️ Frontend - Sistema de Gestión de Proyectos
Aplicación web moderna construida con React, TypeScript, Vite y TailwindCSS
🔗 Demo en Producción

<div align="center"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/> </div>
🎯 Descripción del Proyecto
Este frontend forma parte de un sistema de gestión de proyectos que permite a Administradores, Managers y Desarrolladores visualizar, crear y actualizar proyectos y tareas según su rol. Implementa autenticación, control de rutas protegidas y una interfaz moderna y responsive.

🧪 Credenciales de Prueba
Rol Email Contraseña
Admin admin@test.com admin123
Manager manager@test.com manager123
Developer dev@test.com dev123

🚀 Instalación Rápida
bash
Copiar
Editar

# 1. Clona el repositorio

git clone https://github.com/danielamaya1908/Front-end_sistema_de_gestion_de_proyectos_.git
cd Front-end*sistema_de_gestion_de_proyectos*

# 2. Instala dependencias

npm install # o yarn

# 3. Inicia el servidor de desarrollo

npm run dev

# 4. Abre en tu navegador

http://localhost:5173
📜 Scripts Disponibles
Comando Descripción
npm run dev Inicia el servidor de desarrollo local
npm run build Compila la app para producción
npm run preview Visualiza el build de producción localmente
npm run lint Ejecuta ESLint para validar el código fuente

🏗️ Estructura del Proyecto
bash
Copiar
Editar
src/
├── assets/ # Recursos estáticos (CSS, imágenes)
│ ├── modal.css
│ └── react.svg
│
├── components/ # Componentes reutilizables
│ ├── btnSubmitDashboard.tsx
│ ├── cardView.tsx
│ └── PrivateRoute.tsx
│
├── pages/ # Páginas y vistas del sistema
│ ├── projects/
│ │ ├── create.tsx
│ │ └── update.tsx
│ ├── task/
│ │ ├── Task.tsx
│ │ └── update.tsx
│ └── auth/
│ ├── LoginPage.tsx
│ └── RegisterPage.tsx
│
├── services/ # Servicios de conexión a APIs
│ └── authService.ts
│
├── App.tsx # Componente principal
├── main.tsx # Punto de entrada de la app
└── routes.tsx # Configuración de rutas
🧩 Tecnologías Utilizadas
⚛️ React 18 – Componentes funcionales + Hooks

⚡ Vite – Desarrollo ultrarrápido

🔷 TypeScript – Tipado estático y mantenimiento robusto

🎨 TailwindCSS – Estilos con enfoque utility-first

🔐 React Router DOM – Rutas públicas y protegidas

🔒 Autenticación
La app cuenta con un sistema de login basado en roles. Cada usuario tiene acceso a distintas funcionalidades según su rol (admin, manager o developer).

⚠️ Las URL del backend están incluidas directamente en los servicios, por lo que no se requiere archivo .env.

🌄 Capturas de Pantalla
Login Dashboard
<img src="public/images/login-screenshot.png" width="300"> <img src="public/images/dashboard-screenshot.png" width="300">

🛰️ Despliegue
Este frontend está listo para ser desplegado en plataformas como Railway, Vercel o Netlify. El archivo railway.toml ya está configurado para producción en Railway.

🧰 Personalización
Puedes modificar estilos personalizados en src/assets/modal.css

También puedes extender utilidades desde tailwind.config.js

Para agregar nuevas rutas o vistas, edita routes.tsx y la carpeta pages/

❓ Soporte
¿Tienes dudas, sugerencias o errores que reportar?

📧 Contacto: danijcdm.com@gmail.com
🐙 GitHub: @danielamaya1908

<div align="center"> <sub>✨ Desarrollado con pasión por <strong>Daniel Amaya</strong> — 2025</sub> </div>
