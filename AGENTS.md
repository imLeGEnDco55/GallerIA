# 🤖 AGENTS.md - Guía para Agentes de IA

Este archivo proporciona contexto sobre el proyecto **GallerIA** para agentes de IA (como GitHub Copilot, Claude, GPT, etc.) que trabajen en el código.

## 📋 Descripción del Proyecto

**GallerIA** (Álbum de Prompts) es una aplicación web para gestionar una colección personal de prompts de IA. Permite crear, organizar, buscar y copiar prompts de manera visual usando tarjetas interactivas con efecto flip.

## 🎯 Propósito

Facilitar a desarrolladores, creadores de contenido y usuarios de IA el mantenimiento de una biblioteca organizada de prompts reutilizables con búsqueda eficiente y acceso rápido.

## 🏗️ Arquitectura

### Stack Principal
- **Frontend**: React 18.3 + TypeScript 5.8
- **Estilos**: Tailwind CSS 3.4 + shadcn/ui
- **Build Tool**: Vite 5.4
- **Estado**: React useState + useMemo (estado local en memoria)
- **Routing**: React Router v6

### Patrones de Diseño Utilizados
- **Componentes funcionales** con hooks
- **Props drilling** para comunicación padre-hijo
- **Controlled components** para formularios
- **CSS-in-Tailwind** para estilos consistentes
- **Composition pattern** para reutilización de UI

## 📂 Estructura de Componentes

```
Index.tsx (página principal)
├── AddPromptModal.tsx    # Modal para crear nuevos prompts
├── EditPromptModal.tsx   # Modal para editar/eliminar prompts
└── PromptCard.tsx        # Tarjeta individual con flip animation
    ├── Frente: imagen, título, categoría, ícono favorito
    └── Atrás: prompt completo, botón copiar, botón editar
```

### Flujo de Datos

```
Estado global (Index.tsx)
    ↓
[prompts, setPrompts] → useState
    ↓
PromptCard ← prompts filtrados (useMemo)
    ↓
    ├→ onToggleFavorite()
    ├→ onEdit()
    └→ onDelete()
```

## 🔧 Tipos Principales

```typescript
interface Prompt {
  id: string;           // UUID generado con crypto.randomUUID()
  title: string;        // Título descriptivo del prompt
  prompt: string;       // Contenido completo del prompt
  category: string;     // Categoría de clasificación
  imageUrl?: string;    // URL de imagen o base64
  isFavorite?: boolean; // Marcado como favorito
}
```

## 🎨 Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase (`PromptCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`usePrompts`)
- **Handlers**: camelCase con prefijo `handle` (`handleAddPrompt`)
- **Constantes**: UPPER_SNAKE_CASE (`DEFAULT_CATEGORIES`)

### Estilos
- Usar clases de Tailwind CSS exclusivamente
- Dark mode por defecto:
  - Fondo: `bg-gray-900`, `bg-gray-800`
  - Texto: `text-white`, `text-gray-300`
- Colores accent: `purple-500`, `pink-500`, `blue-500`
- Transiciones: `transition-all duration-300`
- Hover effects: `hover:scale-105`, `hover:shadow-xl`

### Estructura de Componentes
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export const Component = ({ title }: Props) => {
  // 4. Estado
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleAction = () => {};
  
  // 6. Effects (si aplica)
  useEffect(() => {}, []);
  
  // 7. Render
  return <div>{title}</div>;
};
```

### Estado y Manejo de Datos
- **useState** para estado local de componentes
- **useMemo** para computaciones derivadas (filtrado, ordenamiento)
- **useCallback** para handlers pasados como props (optimización)
- **No usar Redux/Zustand** - la app es suficientemente simple

## 🔍 Funcionalidades Clave

### Sistema de Favoritos
```typescript
// Los favoritos se ordenan al inicio del array
const sortedPrompts = useMemo(() => {
  return [...prompts].sort((a, b) => 
    (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
  );
}, [prompts]);
```

- Propiedad `isFavorite` booleana en cada prompt
- Favoritos se muestran primero (pinned)
- Toggle con ícono de corazón (Heart/HeartFilled de Lucide)
- Color: `text-pink-500` cuando está activo

### Búsqueda y Filtros
```typescript
// Búsqueda en múltiples campos
const filteredPrompts = useMemo(() => {
  return prompts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [prompts, searchTerm]);
```

- Búsqueda en tiempo real (sin debounce intencional)
- Busca en: título, contenido del prompt, categoría
- Filtro por categoría con chips interactivos
- Panel flotante tipo "chat" con backdrop blur

### Animación Flip de Tarjetas
```css
/* Técnica CSS 3D Transform */
.card-front, .card-back {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.card.flipped .card-front {
  transform: rotateY(180deg);
}

.card.flipped .card-back {
  transform: rotateY(0deg);
}
```

- Estado `isFlipped` local en cada `PromptCard`
- Click en la tarjeta togglea el flip
- Duración: 300ms con ease-in-out
- Ambos lados mantienen la misma altura/ancho

### Copiar al Portapapeles
```typescript
const handleCopy = async () => {
  await navigator.clipboard.writeText(prompt.prompt);
  // Mostrar toast de confirmación
};
```

## 📝 Tareas Pendientes (según Roadmap)

### 🔴 Prioridad Alta
1. **Persistencia de datos** 
   - Implementar guardado en GitHub via API
   - Almacenar en archivo JSON en el repo
   - Sincronización automática

2. **Mejorador de prompts con IA**
   - Integrar Anthropic API o OpenAI
   - Analizar y sugerir mejoras
   - Expandir prompts cortos

### 🟡 Prioridad Media
3. **Exportar/Importar colección**
   - Exportar a JSON
   - Importar desde archivo
   - Validación de formato

4. **Validación de formularios**
   - Zod schema validation
   - Mensajes de error claros
   - Prevenir duplicados

### 🟢 Prioridad Baja
5. **Temas personalizables**
   - Light/Dark mode toggle
   - Esquemas de color custom
   - Persistir preferencia

6. **Animaciones mejoradas**
   - Framer Motion para transiciones
   - Stagger animations en grid
   - Page transitions

## 💡 Guía para Modificaciones Comunes

### Agregar Nueva Categoría
```typescript
// En Index.tsx o constants file
const CATEGORIES = [
  'Escritura',
  'Código',
  'Análisis',
  'Creative',
  'Nueva Categoría', // ← Agregar aquí
];
```

### Cambiar Colores del Tema
```typescript
// Buscar y reemplazar en todos los archivos:
// purple-500 → blue-600
// pink-500 → emerald-500
// gray-900 → slate-900

// O modificar en tailwind.config.ts para cambio global
```

### Agregar Nuevo Campo a Prompt
```typescript
// 1. Actualizar interface en types/prompt.ts
interface Prompt {
  // ... campos existentes
  tags?: string[];      // ← Nuevo campo
  createdAt?: Date;     // ← Nuevo campo
}

// 2. Modificar AddPromptModal.tsx
const [tags, setTags] = useState<string[]>([]);

// 3. Actualizar vista en PromptCard.tsx
<div className="tags">
  {prompt.tags?.map(tag => <span key={tag}>{tag}</span>)}
</div>

// 4. Actualizar prompts de ejemplo en samplePrompts.ts
```

### Integrar Persistencia (GitHub API)
```typescript
// Ejemplo básico de implementación
const saveToGitHub = async (prompts: Prompt[]) => {
  const response = await fetch(
    'https://api.github.com/repos/user/repo/contents/prompts.json',
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update prompts',
        content: btoa(JSON.stringify(prompts, null, 2)),
        sha: currentSha, // Obtener primero con GET
      }),
    }
  );
  return response.json();
};
```

## 🐛 Debugging Tips

| Problema | Posible Causa | Solución |
|----------|---------------|----------|
| Tarjeta no voltea | Estado `isFlipped` no cambia | Verificar `onClick` en PromptCard |
| Búsqueda no funciona | `useMemo` dependencies incorrectas | Revisar array de dependencias |
| Imagen no carga | URL inválida o CORS | Verificar URL o usar base64 |
| Favoritos no persisten | Estado solo en memoria | Implementar localStorage o API |
| Rendimiento lento | Re-renders innecesarios | Usar `React.memo` y `useCallback` |

## 🧪 Testing Considerations

### Casos de Prueba Importantes
1. **Crear prompt**: con/sin imagen, validación de campos
2. **Editar prompt**: mantener favoritos, actualizar vista
3. **Eliminar prompt**: confirmación, no romper grid
4. **Búsqueda**: case-insensitive, múltiples palabras
5. **Favoritos**: toggle, ordenamiento correcto
6. **Responsive**: grid adapta a 1/2/3/4 columnas

### Comandos de Testing
```bash
# Cuando se implementen tests
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage report
```

## 🔗 Referencias Útiles

- [Documentación shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Clases de utilidad
- [React Hooks Reference](https://react.dev/reference/react) - Hooks oficiales
- [Lucide Icons](https://lucide.dev/icons/) - Catálogo de iconos
- [Lovable Documentation](https://docs.lovable.dev/) - Plataforma de desarrollo

## 🚀 Performance Tips

- **Lazy loading**: Implementar para imágenes grandes
- **Virtualization**: Considerar para +100 prompts
- **Code splitting**: Separar rutas con React.lazy()
- **Memoization**: Usar React.memo en PromptCard
- **Debouncing**: Agregar a búsqueda si crece la colección

## 📦 Dependencias Clave

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "@radix-ui/react-*": "latest", // shadcn/ui usa Radix
    "lucide-react": "^0.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

## 💬 Notas Finales

- El código prioriza **claridad sobre cleverness**
- Mantener componentes pequeños (<200 líneas)
- Comentar solo lógica compleja, no lo obvio
- Seguir el estilo existente en nuevas contribuciones
- Cuando dudes, pregunta en issues antes de PR grande
