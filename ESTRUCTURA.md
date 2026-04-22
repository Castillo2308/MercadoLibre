# 📂 Estructura del Proyecto - MercadoLibre Clone

```
mercadolibre/
│
├── 📁 app/                          # App Router de Next.js (todas las páginas)
│   ├── 📁 auth/                     # Rutas de autenticación
│   │   ├── login/
│   │   │   └── page.tsx            # Página de login
│   │   └── register/
│   │       └── page.tsx            # Página de registro
│   │
│   ├── 📁 products/                 # Detalles de productos
│   │   └── [id]/
│   │       └── page.tsx            # Página dinámica de detalles
│   │
│   ├── 📁 messages/                 # Sistema de mensajería
│   │   └── page.tsx                # Chat entre usuarios
│   │
│   ├── 📁 profile/                  # Perfil de usuario
│   │   └── page.tsx                # Perfil completo con pestañas
│   │
│   ├── 📁 cart/                     # Carrito de compras
│   │   └── page.tsx                # Carrito con totales
│   │
│   ├── 📁 sell/                     # Publicar productos
│   │   └── page.tsx                # Formulario de venta
│   │
│   ├── 📁 favorites/                # Productos favoritos
│   │   └── page.tsx                # Lista de favoritos
│   │
│   ├── 📁 categories/               # Categorías de productos
│   │   └── page.tsx                # Todas las categorías
│   │
│   ├── 📁 deals/                    # Ofertas especiales
│   │   └── page.tsx                # Ofertas relámpago
│   │
│   ├── 📁 search/                   # Búsqueda de productos
│   │   └── page.tsx                # Búsqueda con filtros
│   │
│   ├── layout.tsx                   # Layout principal
│   ├── page.tsx                     # Página de inicio
│   └── globals.css                  # Estilos globales
│
├── 📁 components/                   # Componentes reutilizables
│   ├── Navbar.tsx                  # Barra de navegación
│   └── Footer.tsx                  # Pie de página
│
├── 📁 hooks/                        # Hooks personalizados
│   ├── useCart.ts                  # Gestión del carrito
│   └── useFavorites.ts             # Gestión de favoritos
│
├── 📁 lib/                          # Utilidades y configuración
│   ├── constants.ts                # Constantes y endpoints API
│   └── utils.ts                    # Funciones auxiliares
│
├── 📁 types/                        # Definiciones TypeScript
│   └── index.ts                    # Todos los tipos de la app
│
├── 📁 public/                       # Archivos estáticos
│   └── (imágenes, fuentes, etc.)
│
├── 📁 node_modules/                 # Dependencias instaladas
│
├── 📁 .next/                        # Build de producción
│
├── 📄 package.json                  # Dependencias del proyecto
├── 📄 package-lock.json             # Lock de versiones
│
├── 🔧 tsconfig.json                 # Configuración de TypeScript
├── 🔧 next.config.js                # Configuración de Next.js
├── 🔧 tailwind.config.js            # Configuración de Tailwind CSS
├── 🔧 postcss.config.js             # Configuración de PostCSS
├── 🔧 .eslintrc.json                # Configuración de ESLint
│
├── 📝 README.md                     # Documentación principal
├── 📝 DEVELOPMENT.md                # Guía de desarrollo
├── 📝 QUICK_START.md                # Guía rápida
├── 📝 RESUMEN_FINAL.md              # Resumen del proyecto
├── 📝 .env.example                  # Variables de entorno (ejemplo)
├── 📝 .gitignore                    # Archivos ignorados por git
│
└── 📝 ESTRUCTURA.md                 # Este archivo
```

---

## 📊 Conteo de Archivos

| Tipo | Cantidad |
|------|----------|
| Páginas (.tsx) | 13 |
| Componentes | 2 |
| Hooks | 2 |
| Librerías | 2 |
| Tipos | 1 |
| Configuración | 5 |
| Documentación | 5 |
| **Total de archivos** | **30+** |

---

## 🔍 Detalles de Carpetas Importantes

### 📁 `app/` (App Router)
Contiene todas las páginas de la aplicación usando el nuevo App Router de Next.js 13+.
- Cada carpeta = una ruta
- `page.tsx` = componente de esa ruta
- `layout.tsx` = layout compartido
- `[id]` = rutas dinámicas

### 📁 `components/`
Componentes reutilizables en toda la app:
- `Navbar.tsx` - Navegación principal
- `Footer.tsx` - Pie de página

### 📁 `hooks/`
Lógica React reutilizable:
- `useCart.ts` - Gestión del estado del carrito
- `useFavorites.ts` - Gestión de productos favoritos

### 📁 `lib/`
Funciones y configuraciones auxiliares:
- `constants.ts` - Constantes, endpoints de API, categorías
- `utils.ts` - Funciones de formato, cálculos, validaciones

### 📁 `types/`
Definiciones de TypeScript para toda la aplicación:
- Interfaces para User, Product, Order, etc.
- Tipos enumerados
- API Response types

---

## 🛠️ Archivos de Configuración

```
.eslintrc.json          - Reglas de linting
.gitignore              - Archivos no rastreados por git
.env.example            - Variables de entorno (plantilla)
next.config.js          - Configuración de Next.js
tailwind.config.js      - Configuración de estilos Tailwind
tsconfig.json           - Configuración de TypeScript
postcss.config.js       - Configuración de procesamiento CSS
package.json            - Dependencias y scripts
```

---

## 📚 Documentación

```
README.md               - Guía principal del proyecto
DEVELOPMENT.md          - Guía completa de desarrollo
QUICK_START.md          - Inicio rápido y tips
RESUMEN_FINAL.md        - Resumen de lo implementado
ESTRUCTURA.md           - Este archivo (estructura de carpetas)
```

---

## 🔄 Flujo de Datos

```
user interaction
       ↓
   page/component
       ↓
   hooks (useCart, useFavorites)
       ↓
   lib/utils (calculate, format)
       ↓
   types (TypeScript validation)
       ↓
   API endpoint (future backend)
```

---

## 📦 Dependencias Principales

```json
{
  "next": "^14.0.0",              // Framework
  "react": "^18.2.0",             // Librería
  "typescript": "^5.0.0",         // Lenguaje
  "tailwindcss": "^3.3.0",        // Estilos
  "lucide-react": "^0.294.0",     // Iconos
  "axios": "^1.6.0",              // HTTP client
  "zustand": "^4.4.0",            // State management
  "react-hot-toast": "^2.4.0"     // Notificaciones
}
```

---

## 🚀 Scripts Disponibles

```bash
npm run dev              # Desarrollo en localhost:3000
npm run build            # Compilar para producción
npm start               # Iniciar servidor de producción
npm run lint            # Verificar código
```

---

## 📍 Cómo Agregar Nuevas Páginas

1. **Crear carpeta en `app/`**
   ```bash
   mkdir app/nueva-ruta
   ```

2. **Crear `page.tsx`**
   ```bash
   echo "'use client';\n\nexport default function NuevaRuta() { return <div>Contenido</div>; }" > app/nueva-ruta/page.tsx
   ```

3. **Acceder en navegador**
   ```
   http://localhost:3000/nueva-ruta
   ```

---

## 🎯 Arquitectura de Componentes

```
Layout.tsx (Global)
├── Navbar.tsx
├── Main Content (pages)
│   ├── Page 1
│   ├── Page 2
│   └── ...
└── Footer.tsx
```

---

## 💾 Base de Datos (Preparada para)

Estructura de tipos definida para:
- Users (usuarios)
- Products (productos)
- Orders (pedidos)
- Messages (mensajes)
- Reviews (reseñas)
- Favorites (favoritos)

---

## 🔗 Conectar con Backend

Ver `lib/constants.ts` para endpoints API preparados:
```typescript
export const API_ENDPOINTS = {
  AUTH: { ... },
  PRODUCTS: { ... },
  ORDERS: { ... },
  // etc
}
```

---

**Última actualización**: 23 de febrero de 2026
**Versión**: 1.0.0
**Estado**: ✅ Completado
