# 🎨 GallerIA - Álbum de Prompts

Una aplicación web moderna para organizar, buscar y gestionar tu colección personal de prompts de IA. Diseñada con un enfoque visual atractivo usando tarjetas con efecto flip y una interfaz intuitiva.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)

## ✨ Características

### 📇 Tarjetas con Flip Animation
- **Frente**: Vista previa con título, categoría e imagen
- **Atrás**: Prompt completo con botón de copiado rápido

### 🔍 Búsqueda y Filtros
- Búsqueda en tiempo real mientras escribes
- Filtro por categorías con chips interactivos
- Panel de búsqueda flotante estilo chat

### ⭐ Sistema de Favoritos
- Marca prompts como favoritos con un corazón
- Los favoritos aparecen "pinneados" en la parte superior
- Acceso rápido a tus prompts más usados

### ✏️ Gestión Completa
- Crear nuevos prompts con imagen opcional
- Editar prompts existentes
- Eliminar con confirmación
- Copiar prompt al portapapeles con un click

### 📱 Diseño Responsive
- Grid adaptable (1-4 columnas según pantalla)
- Optimizado para móvil, tablet y desktop
- Dark mode con colores vibrantes

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 18** | UI con hooks modernos |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos utility-first |
| **shadcn/ui** | Componentes accesibles |
| **Vite** | Build tool ultra-rápido |
| **Lucide React** | Iconografía consistente |

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/imLeGEnDco55/GallerIA.git

# Entrar al directorio
cd GallerIA

# Instalar dependencias
npm install
# o con bun
bun install

# Iniciar servidor de desarrollo
npm run dev
# o
bun dev
```

La app estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── PromptCard.tsx   # Tarjeta con flip animation
│   ├── AddPromptModal.tsx
│   ├── EditPromptModal.tsx
│   └── NavLink.tsx
├── data/
│   └── samplePrompts.ts # Prompts de ejemplo
├── pages/
│   ├── Index.tsx        # Página principal
│   └── NotFound.tsx
├── types/
│   └── prompt.ts        # Tipos TypeScript
├── hooks/               # Custom hooks
├── lib/
│   └── utils.ts         # Utilidades
└── index.css            # Estilos globales
```

## 🎯 Uso

1. **Agregar Prompt**: Click en el botón `+` para crear un nuevo prompt
2. **Ver Prompt**: Click en una tarjeta para voltearla y ver el contenido completo
3. **Copiar**: Click en el ícono de copiar en la parte trasera de la tarjeta
4. **Favoritos**: Click en el corazón para marcar/desmarcar
5. **Buscar**: Click en la lupa flotante para abrir el panel de búsqueda
6. **Filtrar**: Selecciona una categoría en el panel de búsqueda
7. **Editar**: Click en el ícono de lápiz al hacer hover sobre una tarjeta

## 🗺️ Roadmap

- [ ] Persistencia con GitHub API (almacenar en repo)
- [ ] Mejorador de prompts con IA
- [ ] Exportar/Importar colección
- [ ] Compartir prompts individuales
- [ ] Temas personalizables
- [ ] Sincronización entre dispositivos
- [ ] Historial de versiones de prompts
- [ ] Etiquetas personalizadas

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT © 2024

## 🙏 Agradecimientos

- Construido con [Lovable](https://lovable.dev)
- Componentes UI de [shadcn/ui](https://ui.shadcn.com/)
- Iconos de [Lucide](https://lucide.dev/)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
