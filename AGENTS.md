# 🤖 AGENTS.md - Guía para Despliegue y Mantenimiento

Este archivo proporciona contexto técnico actualizado sobre el proyecto **Galer.IA** para agentes y desarrolladores.

## 📋 Descripción Técnica
**Galer.IA** es una aplicación React + Vite diseñada para funcionar como una PWA offline-first y empaquetable como app nativa (Android/iOS) mediante **Capacitor**.

## 🏗️ Arquitectura Actualizada (v2)

### Stack Tecnológico
- **Frontend**: React 18.3, TypeScript 5.8
- **Estilos**: Tailwind CSS 3.4, shadcn/ui
- **Persistencia**: IndexedDB (wrapper `idb` v8)
- **Estado Global**: React Context / Hooks (`Index.tsx` actúa como controlador principal)
- **Empaquetado**: Vite 5.4
- **Nativo**: Capacitor 6 (Core, Android)

### Modelo de Datos (IndexedDB: `GallerIA-DB` v2)

#### Store: `prompts`
- `id` (string, UUID): Clave primaria.
- `title` (string): Título.
- `prompt` (string): Contenido.
- `imageUrl` (string): DataURL (base64) de la imagen.
- `category` (string): Categoría asignada.
- `isFavorite` (boolean): Flag de favorito.
- `createdAt` (ISO string): Fecha de creación (Indexada).

#### Store: `settings`
- `categories` (string[]): Lista de categorías personalizadas.
- `gridColumns` (number): Preferencia de visualización (2, 3, 4).

## 📂 Componentes Clave

### `src/components/SettingsModal.tsx`
Gestiona toda la configuración y mantenimiento de datos.
- **Tabs**:
  - `categories`: CRUD de categorías.
  - `appearance`: Selector de columnas (Grid).
  - `data`: Exportar/Importar (JSON handling) y Reset (Database wipe).

### `src/components/PromptCard.tsx`
Tarjeta interactiva con lógica de UI.
- **Front**: Imagen, título, favorito. 
- **Back**: Texto del prompt.
- **Actions**: 
  - `handleCopy`: `navigator.clipboard`.
  - `handleShare`: `navigator.share` (Web Share API).

### `src/lib/db.ts`
Capa de servicio para IndexedDB.
- Maneja actualizaciones de esquema (`upgrade`).
- Métodos tipados para CRUD de prompts y settings.
- Soporte para transacciones masivas (`resetAllData`).

## 🔄 Flujos de Usuario

1.  **Inicio**:
    - `useEffect` en `Index.tsx` carga prompts y settings de IndexedDB.
    - Si DB está vacía, carga `samplePrompts` y `DEFAULT_CATEGORIES`.

2.  **Gestión de Datos**:
    - **Backup**: Serializa prompts + categorias a JSON y descarga como Blob.
    - **Restore**: Lee JSON, valida estructura, limpia DB y repuebla.

3.  **Hacia Nativo (Capacitor)**:
    - El proyecto está preparado para:
      ```bash
      npm install @capacitor/core @capacitor/cli @capacitor/android
      npx cap init
      npx cap add android
      npx cap sync
      ```
    - `dist` folder es el web asset target.

## 🧪 Notas de Estilo
- **Tema Oscuro**: Hardcoded via Tailwind classes (`bg-background`, `text-foreground`).
- **Glassmorphism**: Uso extensivo de `backdrop-blur`, `bg-opacity`.
- **Responsive**: `grid-cols` dinámico basado en breakpoints (`sm`, `md`, `lg`, `xl`) y override del usuario.

## 🐛 Known Issues / To-Do
- La búsqueda de texto es case-insensitive pero simple (substring match).
- Las imágenes muy grandes en DataURL pueden impactar el rendimiento de carga inicial en dispositivos lentos (se recomienda lazy loading o redimensionado previo, *no implementado aún*).
- `navigator.share` solo funciona en contextos seguros (HTTPS/Localhost) y móviles soportados.

---
**Última actualización**: Diciembre 2025 - Renombramiento a Galer.IA e integración de Settings avanzados.
