# 🎨 Galer.IA - Álbum de Prompts

Una aplicación web moderna y progresiva (PWA/Nativa) para organizar, buscar y gestionar tu colección personal de prompts de IA. Diseñada con un enfoque visual atractivo usando tarjetas con efecto flip y una interfaz intuitiva con "Glassmorphism".

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Local-FEAD2A?logo=firebase)

## ✨ Características

### 💾 Persistencia Local (IndexedDB)
- Tus prompts y categorías se guardan en el dispositivo de forma segura.
- No pierdes datos al recargar o cerrar la app.
- Migración automática de esquema de base de datos.

### ⚙️ Gestión de Ajustes (Nuevo)
- **Categorías**: Panel para añadir y eliminar categorías personalizadas.
- **Apariencia**: Elige el tamaño de la rejilla (Grande, Media o Compacta) para adaptar la vista.
- **Datos**: Herramientas para **Exportar** (Backup JSON), **Importar** y **Resetear** la aplicación.

### 📇 Tarjetas Interactivas
- **Frente**: Vista previa visual con título e imagen.
- **Atrás**: Prompt completo.
- **Herramientas**:
    - **Copiar**: Botón optimizado para portapapeles.
    - **Compartir**: Botón nativo (Web Share API) para enviar prompts a otras apps (WhatsApp, Telegram, etc.).
    - **Favoritos**: Marca tus prompts esenciales.

### 🔍 Búsqueda Avanzada
- Búsqueda en tiempo real (título, contenido, categoría).
- Panel flotante con acceso rápido.
- Filtrado por categorías dinámicas.

### 📱 Diseño Adaptable
- **Responsive**: Se ve genial en móviles y escritorio.
- **Modo Oscuro**: Tema visual por defecto.

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 18** | UI con hooks modernos |
| **TypeScript** | Tipado estático robusto |
| **Tailwind CSS** | Estilos utility-first |
| **shadcn/ui** | Componentes base accesibles y elegantes |
| **IndexedDB (idb)** | Base de datos local asíncrona |
| **Capacitor** | (En proceso) Wrapper para App Nativa Android |

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Generar build de producción
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── SettingsModal.tsx   # Panel de control (Categorías, Grid, Datos)
│   ├── PromptCard.tsx      # Tarjeta con Flip, Copy & Share
│   ├── AddPromptModal.tsx  # Crear prompts
│   └── ...
├── lib/
│   └── db.ts               # Capa de abstracción para IndexedDB
├── pages/
│   └── Index.tsx           # Lógica principal y orquestación
└── assets/
    └── header_logo.png     # Branding Galer.IA
```

## 🗺️ Roadmap Completado

- [x] Persistencia local total (Prompts + Imágenes + Config)
- [x] Gestión dinámica de categorías
- [x] Sistema de Backup (Exportar/Importar JSON)
- [x] Control de visualización (Rejilla variable)
- [x] Copiado y Compartido nativo
- [x] Rebranding a Galer.IA

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir lo que te gustaría cambiar.

## 📄 Licencia

MIT © 2025 Galer.IA
