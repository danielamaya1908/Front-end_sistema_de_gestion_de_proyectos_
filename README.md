🚀 Frontend - Sistema de Gestión de Proyectos Avanzado
(React + TypeScript + Vite + TailwindCSS + Redux)

<div align="center"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" height="30"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" height="30"/> <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" height="30"/> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" height="30"/> <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" height="30"/> </div>
🌟 Demo en Vivo
🔗 https://front-end-sistema-de-gestion-de-proyectos.vercel.app
(Despliegue automático con Vercel - Conexión a backend en Railway)

📌 Tabla de Contenidos
Características Principales

Cómo Empezar

Estructura del Proyecto

Tecnologías Utilizadas

Capturas de Pantalla

Flujo de Trabajo

Contribución

Preguntas Frecuentes

Licencia

✨ Características Principales
🔐 Autenticación Segura
Login y registro con validación de formularios

Protección de rutas basada en roles (Admin, Manager, Developer)

Persistencia de sesión con tokens JWT

📊 Dashboard Interactivo
Visualización de proyectos con filtros avanzados

Gráficos de progreso con Chart.js

Sistema de notificaciones en tiempo real

🛠️ Gestión Completa
CRUD completo de proyectos y tareas

Drag & Drop para cambiar estados de tareas

Búsqueda inteligente con autocompletado

🎨 UI/UX Avanzado
Diseño responsive con TailwindCSS

Modales dinámicos y confirmaciones

Animaciones con Framer Motion

Tema claro/oscuro (próximamente)

🛠️ Cómo Empezar
📥 Clonar el Repositorio
bash
git clone https://github.com/danielamaya1908/Front-end_sistema_de_gestion_de_proyectos_.git
cd Front-end*sistema_de_gestion_de_proyectos*
⚙️ Instalar Dependencias
bash
npm install

# o

yarn install
🚀 Iniciar Servidor de Desarrollo
bash
npm run dev

# o

yarn dev
El proyecto estará disponible en: http://localhost:5173

🏗️ Build para Producción
bash
npm run build

# o

yarn build
🔍 Previsualizar Build
bash
npm run preview

# o

yarn preview
📂 Estructura del Proyecto
markdown
src/
│
├── 📁 assets/ # Recursos estáticos
│ ├── 📄 styles/ # Estilos globales y CSS modules
│ └── 📁 images/ # Assets visuales
│
├── 📁 components/ # Componentes reutilizables
│ ├── 📄 ui/ # Componentes UI puros (Buttons, Cards)
│ ├── 📄 layouts/ # Wrappers de layout
│ └── 📄 shared/ # Lógica compartida
│
├── 📁 features/ # Lógica por características
│ ├── 📁 auth/ # Autenticación
│ ├── 📁 projects/ # Gestión de proyectos
│ └── 📁 tasks/ # Gestión de tareas
│
├── 📁 hooks/ # Custom Hooks
│ ├── 📄 useAuth.ts # Hook de autenticación
│ └── 📄 useProjects.ts # Hook de proyectos
│
├── 📁 pages/ # Vistas principales
│ ├── 📄 Dashboard/ # Vista principal
│ ├── 📄 Auth/ # Páginas de autenticación
│ └── 📄 Error/ # Páginas de error
│
├── 📁 services/ # Conexión a APIs
│ ├── 📄 api.ts # Configuración axios
│ └── 📄 authService.ts # Servicios de auth
│
├── 📁 store/ # Gestión de estado (Redux)
│ ├── 📄 slices/ # Redux slices
│ └── 📄 store.ts # Configuración store
│
├── 📄 App.tsx # Componente raíz
├── 📄 main.tsx # Punto de entrada
└── 📄 routes.tsx # Configuración de rutas
🧩 Tecnologías Utilizadas
Tecnología Descripción Uso en el Proyecto
React 18 Biblioteca frontend Componentes funcionales con hooks
TypeScript Superset de JavaScript Tipado estático para mayor seguridad
Vite Build tool Desarrollo ultrarrápido y HMR
TailwindCSS Framework CSS Estilos utility-first
Redux Toolkit Gestión de estado Estado global de la aplicación
React Router Enrutamiento Navegación entre vistas
Axios Cliente HTTP Conexión con el backend
React Hook Form Formularios Validación y manejo de forms
Framer Motion Animaciones Transiciones fluidas
Chart.js Gráficos Visualización de datos
🖼️ Capturas de Pantalla
🖥️ Vista de Dashboard
https://i.imgur.com/example1.png
Interfaz principal con resumen de proyectos y estadísticas

📱 Vista Mobile
https://i.imgur.com/example2.png
Diseño completamente responsive para móviles

✏️ Editor de Proyectos
https://i.imgur.com/example3.png
Formulario avanzado para creación/edición de proyectos

🔄 Flujo de Trabajo
Autenticación

El usuario inicia sesión con credenciales

El backend valida y retorna un JWT

El frontend almacena el token y redirige al dashboard

Gestión de Proyectos

El usuario crea un nuevo proyecto

El sistema valida los datos y hace POST al backend

Redux actualiza el estado global

La UI refleja los cambios inmediatamente

Asignación de Tareas

Los managers asignan tareas a developers

Los developers actualizan el progreso

Notificaciones en tiempo real para cambios

🤝 Contribución
¡Tu ayuda es bienvenida! Sigue estos pasos:

Haz fork del proyecto

Crea una rama (git checkout -b feature/AmazingFeature)

Haz commit de tus cambios (git commit -m 'Add some AmazingFeature')

Haz push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

❓ Preguntas Frecuentes
Q: ¿Cómo cambio la URL del backend?
R: Edita directamente el archivo src/services/api.ts donde se configura Axios.

Q: ¿Puedo usar este proyecto como plantilla?
R: ¡Sí! Es open-source, solo menciona el origen.

Q: ¿Cómo reporto un bug?
R: Abre un issue en GitHub con detalles del error.

📜 Licencia
Este proyecto está bajo la licencia MIT. Ver LICENSE para más detalles.

<div align="center"> <sub>✨ Desarrollado con pasión por <a href="https://github.com/danielamaya1908">Daniel Amaya</a></sub> </div>
🔗 Enlaces Relacionados
Backend del Proyecto

Documentación API

Tablero de Progreso

🌟 Destacado
Este proyecto fue seleccionado como ejemplo de buenas prácticas en:

Arquitectura limpia

Gestión de estado escalable

UI/UX moderno

¿Te gustó el proyecto? ¡Dale una ⭐ en GitHub!

agregale las pantallas que tiene que son el login, register, olvidaste tu contraseña, dasboard dde proyctos, tareas, usuarios y mas
🖼️ Capturas de Pantalla Detalladas
🔐 Módulo de Autenticación

1. Página de Login
   https://i.imgur.com/login-screenshot.png
   Interfaz limpia con:

Validación en tiempo real

Opción "Recordarme"

Enlaces a registro y recuperación

2. Página de Registro
   https://i.imgur.com/register-screenshot.png
   Formulario completo con:

Selector de rol (Admin/Manager/Developer)

Validación de contraseña segura

Términos y condiciones

3. Recuperación de Contraseña
   https://i.imgur.com/forgot-password-screenshot.png
   Flujo completo:

Ingreso de email

Pantalla de confirmación

Formulario de nuevo password

📊 Dashboard Principal 4. Vista General de Proyectos
https://i.imgur.com/projects-dashboard.png
Incluye:

Filtros por estado (Activos/Completados)

Barra de búsqueda inteligente

Cards con progreso visual

Botones de acción rápida

5. Detalle de Proyecto
   https://i.imgur.com/project-detail.png
   Secciones:

Información general

Gráfico de progreso

Listado de tareas asociadas

Historial de actividades

✅ Módulo de Tareas 6. Tablero Kanban
https://i.imgur.com/tasks-kanban.png
Funcionalidades:

Drag & Drop entre estados

Prioridad con colores

Tooltips con detalles

Filtros por asignado

7. Creación de Tarea
   https://i.imgur.com/create-task.png
   Campos:

Selector de proyecto

Asignación a usuarios

Fechas con datepicker

Editor de descripción enriquecida

👥 Gestión de Usuarios 8. Listado de Usuarios
https://i.imgur.com/users-list.png
Tabla con:

Paginación

Ordenamiento por columnas

Búsqueda por nombre/email

Acciones por rol

9. Perfil de Usuario
   https://i.imgur.com/user-profile.png
   Secciones:

Información personal

Estadísticas de actividad

Proyectos asignados

Configuración de cuenta

🎨 Extra: UI Components 10. Modales Interactivos
https://i.imgur.com/modals-example.png
Ejemplos:

Confirmación de acciones

Edición rápida

Visualización de detalles

11. Notificaciones
    https://i.imgur.com/notifications-ui.png
    Sistema completo:

Badge de contador

Listado desplegable

Marcar como leídas

Historial completo

📱 Vistas Mobile 12. Menú Hamburguesa
https://i.imgur.com/mobile-menu.png
Adaptaciones:

Iconografía clara

Accesos rápidos

Colapsado de secciones

13. Formularios Mobile
    https://i.imgur.com/mobile-forms.png
    Optimizaciones:

Inputs adaptados

Teclados específicos

Acciones flotantes

🔄 Transiciones y Animaciones 14. Loaders
https://i.imgur.com/loading-animations.gif
Tipos:

Esqueleto de carga

Spinner personalizado

Transición entre rutas

15. Efectos Hover
    https://i.imgur.com/hover-effects.gif
    Detalles:

Cards interactivas

Botones con feedback

Microinteracciones

<div align="center"> <sub>✨ <strong>Nota:</strong> Todas las imágenes son reales del proyecto actual</sub> </div>
📌 Cómo Generar Tus Propias Capturas
Si deseas actualizar las imágenes:

Ejecuta el proyecto en desarrollo

Navega a la pantalla deseada

Usa herramientas como:

Windows: Tecla Win + Shift + S

Mac: Cmd + Shift + 4

Linux: Flameshot o similar

Sube a Imgur o similar

Actualiza los enlaces en el README

🌟 Tip Profesional
Para capturas interactivas:

bash
npm run storybook
Y genera documentación visual de componentes!
