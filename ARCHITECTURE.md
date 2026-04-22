# 🏗️ Arquitectura del Sistema - MercadoLibre Clone

## 📑 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tipo de Arquitectura](#tipo-de-arquitectura)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Datos](#flujo-de-datos)
5. [Diagrama de la Arquitectura](#diagrama-de-la-arquitectura)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Comunicación entre Componentes](#comunicación-entre-componentes)

---

## 📖 Descripción General

La aplicación MercadoLibre Clone implementa una arquitectura **Cliente-Servidor (CSR)** basada en componentes modernos de **React** y **Next.js**, con gestión de estado global escalable mediante **Zustand** y **Context API**, respaldada por **NeonDB** (PostgreSQL Serverless) como base de datos.

La arquitectura está diseñada para ser:
- ✅ **Escalable**: Fácil de agregar nuevas funcionalidades con auto-scaling en BD
- ✅ **Mantenible**: Código limpio y bien organizado con Prisma ORM
- ✅ **Performante**: Optimizada para carga rápida con caché y CDN
- ✅ **Type-Safe**: Tipado completo con TypeScript en frontend y backend
- ✅ **Serverless**: Infraestructura sin servidor con NeonDB y Vercel

---

## 🏛️ Tipo de Arquitectura

### Arquitectura **Cliente-Servidor (CSR - Client-Side Rendering)**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (NAVEGADOR)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js / React Application              │  │
│  │          (Rendering y Lógica de Negocio)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕↕↕                                │
│                      HTTP/HTTPS                              │
│                           ↕↕↕                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Endpoints / Backend                 │  │
│  │          (Base de Datos, Lógica de Servidor)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- El cliente maneja la mayoría de la lógica y renderizado
- Comunicación con el servidor mediante llamadas HTTP (Axios)
- Estado compartido entre componentes
- Interactividad inmediata en la UI

---

## 🧩 Componentes Principales

### 1. **Frontend (Cliente)**

#### 🎨 UI Components
```
components/
├── Navbar.tsx           - Barra de navegación global
├── Footer.tsx           - Pie de página
├── AnimatedCard.tsx     - Card con animaciones (Framer Motion)
├── ProtectedRoute.tsx   - HOC para rutas protegidas
├── PageTransition.tsx   - Transiciones entre páginas
└── OptimizedLink.tsx    - Optimización de links
```

**Responsabilidades:**
- Mostrar interfaz de usuario
- Capturar eventos del usuario
- Manejar validaciones en cliente
- Mostrar estados de carga y errores

#### 📄 Pages (Rutas)
```
app/
├── page.tsx                    - Home / Inicio
├── auth/
│   ├── login/page.tsx          - Autenticación
│   └── register/page.tsx       - Registro de usuarios
├── products/
│   ├── page.tsx                - Listado de productos
│   └── [id]/page.tsx           - Detalle del producto
├── cart/page.tsx               - Carrito de compras
├── profile/page.tsx            - Perfil de usuario
├── messages/page.tsx           - Sistema de mensajería
├── favorites/page.tsx          - Productos favoritos
├── categories/page.tsx         - Categorías disponibles
├── deals/page.tsx              - Ofertas especiales
└── search/page.tsx             - Búsqueda y filtros
```

**Router Pattern:**
- Utiliza el **App Router** de Next.js 13+
- Rutas basadas en estructura de carpetas
- Rutas dinámicas con `[id]` para parámetros

#### 🪝 Custom Hooks
```
hooks/
├── useCart.ts           - Gestión del carrito
├── useFavorites.ts      - Gestión de favoritos
├── useShoppingCart.ts   - Estado del carrito
└── useWishlist.ts       - Lista de deseos
```

**Funcionalidades:**
- Encapsulación de lógica reutilizable
- Manejo de estado local
- Simplificación de componentes

#### 📦 State Management

**Context API** (para estado global de autenticación):
```typescript
// context/AuthContext.tsx
- Gestiona información del usuario actual
- Maneja sesiones
- Proporciona métodos de login/logout
```

**Zustand** (para estado más complejo):
- Tienda para carrito
- Tienda para favoritos
- Tienda para preferencias de usuario

**Props & Local State**:
- Para datos específicos de componentes
- Para formularios locales
- Para estados temporales

---

### 2. **Utilidades y Constantes**

#### 📚 lib/
```
lib/
├── constants.ts         - URLs API, categorías, condiciones
└── utils.ts             - Funciones auxiliares
                          (formateo, validaciones, helpers)
```

#### 🔧 types/
```
types/
└── index.ts            - Todas las definiciones TypeScript
                        - Interfaces de User, Product, etc.
                        - tipos enumerados
```

---

### 3. **Configuración y Build**

```
Configuración:
├── next.config.js       - Optimizaciones de Next.js
├── tailwind.config.js   - Tema y configuración de estilos
├── tsconfig.json        - Configuración de TypeScript
├── postcss.config.js    - Procesamiento de CSS
└── .eslintrc.json       - Reglas de linting
```

---

## 🔄 Flujo de Datos

### Flujo Típico de una Acción de Usuario

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUARIO INTERACTÚA                                       │
│    (Click, Input, Formulario)                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. COMPONENTE DETECTA EVENTO                                │
│    (onClick, onChange, onSubmit)                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. VALIDACIÓN EN CLIENTE                                    │
│    (Validar datos, reglas de negocio)                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. LLAMADA A API / ACTUALIZACIÓN DE ESTADO                  │
│    (Axios request o actualizar store/context)              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. RENDER ACTUALIZADO                                       │
│    (React re-renderiza con nuevo estado)                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. NOTIFICACIÓN AL USUARIO                                  │
│    (Toast, Loading, Error message)                          │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo: Agregar Producto al Carrito

```
Usuario Click en "Agregar al Carrito"
    ↓
Componente `AddToCartButton` captura click
    ↓
Valida que el producto sea válido
    ↓
Llama hook `useCart.addItem(product)`
    ↓
Hook actualiza estado de Zustand store
    ↓
React detecta cambio de estado
    ↓
Componentes suscritos se re-renderizan
    ↓
UI muestra: carrito actualizado + toast "Agregado"
    ↓
LocalStorage sincroniza el carrito
```

---

## 📊 Diagrama de la Arquitectura

### Representación Visual General - Client-Server Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      🌐 CLIENTE (NAVEGADOR)                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              📱 UI LAYER (Presentación)                  │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  Pages (Home, Products, Cart, Profile, etc)    │   │ │
│  │  │  Components (Navbar, Card, Button, Form, etc)  │   │ │
│  │  │  Styles (Tailwind CSS + Custom CSS)            │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│  ┌────────────▼───────────────────────────────────────────┐ │
│  │         ⚙️ LOGIC LAYER (Lógica de Negocio)            │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ State Management:                                │  │ │
│  │  │ • Context API (Auth)                             │  │ │
│  │  │ • Zustand (Cart, Favorites)                      │  │ │
│  │  │ • Custom Hooks (useCart, useFavorites)           │  │ │
│  │  │                                                  │  │ │
│  │  │ Utilities:                                       │  │ │
│  │  │ • api-client.ts (Axios)                          │  │ │
│  │  │ • utils.ts (Helpers, Validators)                 │  │ │
│  │  │ • constants.ts (Categorías, URLs)                │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────┬───────────────────────────────────────────┘ │
│               │                                              │
│               │ HTTP/HTTPS                                  │
│               ▼                                              │
└─────────────────────────────────────────────────────────────┘
                 │
                 │ RESTful API Calls
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    🖥️ SERVIDOR (BACKEND)                    │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │       🔌 API LAYER (Next.js API Routes)              │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ GET    /api/products                          │  │ │
│  │  │ GET    /api/categories                        │  │ │
│  │  │ GET    /api/deals                             │  │ │
│  │  │ POST   /api/auth/login                        │  │ │
│  │  │ POST   /api/auth/register                     │  │ │
│  │  │ POST   /api/cart/items                        │  │ │
│  │  │ DELETE /api/cart/items/:id                    │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └────────────┬──────────────────────────────────────────┘ │
│               │                                            │
│  ┌────────────▼──────────────────────────────────────────┐ │
│  │      📊 DATA LAYER (Prisma ORM)                      │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ • Query Builder                                │  │ │
│  │  │ • Type Safety                                  │  │ │
│  │  │ • Migrations Management                        │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └────────────┬──────────────────────────────────────────┘ │
│               │                                            │
│               ▼                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        🗄️ DATABASE (PostgreSQL)                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │ Users    │  │ Products │  │ Orders   │            │ │
│  │  ├──────────┤  ├──────────┤  ├──────────┤            │ │
│  │  │ Messages │  │ Reviews  │  │ Carts    │            │ │
│  │  ├──────────┤  ├──────────┤  ├──────────┤            │ │
│  │  │Favorites │  │ Ratings  │  │ Returns  │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Componente Flow Diagram

```
USER INTERACTION
      │
      ▼
┌─────────────────────────┐
│ Event Handler           │
│ (onClick, onChange...)  │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Validate Input          │
│ (Client-side validation)│
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Update State            │
│ (Zustand/Context)       │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Call API (if needed)    │
│ (Axios requests)        │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Process Response        │
│ Update state again      │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Component Re-render     │
│ (React reconciliation)  │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│ Display Updates         │
│ Show Toast/Notification │
└─────────────────────────┘
```

### Technology Stack Layering

```
┌─────────────────────────────────────────────┐
│         UI Layer                            │
│  React 18, TypeScript, Tailwind CSS        │
│  Framer Motion, Lucide React               │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  State Management Layer                     │
│  Context API, Zustand, Custom Hooks        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  API Client Layer                           │
│  Axios, REST API Communication             │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Server/API Layer                           │
│  Next.js API Routes, Request Handlers      │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Data Access Layer                          │
│  Prisma ORM, Database Queries              │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Database Layer                             │
│  PostgreSQL, Tables, Relations             │
└─────────────────────────────────────────────┘
```

---

## 🎨 Patrones de Diseño Utilizados

### 1. **Componentes (Component Pattern)**
```typescript
// Patrón de componente funcional reutilizable
interface Props {
  title: string;
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ title, onClose }) => {
  return <div>{/* contenido */}</div>;
};

export default Modal;
```

### 2. **Custom Hooks (Hook Pattern)**
```typescript
// Encapsulación de lógica reutilizable
const useAuth = () => {
  const [user, setUser] = useState(null);
  const login = async (email, password) => { /* ... */ };
  return { user, login };
};
```

### 3. **Provider Pattern (Context API)**
```typescript
// Proporciona estado a un árbol de componentes
export const AuthProvider: React.FC = ({ children }) => {
  return <AuthContext.Provider value={/* ... */}>{children}</AuthContext.Provider>;
};
```

### 4. **Store Pattern (Zustand)**
```typescript
// Estado global reactivo y simple
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}));
```

### 5. **Higher-Order Component (HOC)**
```typescript
// ProtectedRoute para rutas autenticadas
const ProtectedRoute: React.FC = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Redirect to="/login" />;
};
```

### 6. **Compound Component Pattern**
```typescript
// Componentes que trabajan juntos
<Form>
  <Form.Input name="email" />
  <Form.Button>Submit</Form.Button>
</Form>
```

---

## 🔗 Comunicación entre Componentes

### 1. **Props (Prop Drilling)**
Para componentes padre-hijo cercanos:
```typescript
<ProductCard 
  title={title}
  price={price}
  onAddToCart={handleAdd}
/>
```

### 2. **Context API**
Para datos globales como autenticación:
```typescript
const { user } = useContext(AuthContext);
```

### 3. **Zustand Store**
Para estado complejo compartido:
```typescript
const items = useCartStore((state) => state.items);
```

### 4. **Callbacks y Event Handlers**
Para comunicación componente a componente:
```typescript
const handleProductClick = (productId) => {
  router.push(`/products/${productId}`);
};
```

### 5. **URL Parameters**
Para pasar datos a través de rutas:
```typescript
// [id].tsx
const { id } = useParams();
```

---

## 🚀 Flujo de Enrutamiento

### App Router de Next.js

```
URL                          Archivo              Componente
─────────────────────────────────────────────────────────────
/                            app/page.tsx         Home
/auth/login                  app/auth/login/page.tsx
/auth/register               app/auth/register/page.tsx
/products                    app/products/page.tsx
/products/123                app/products/[id]/page.tsx
/cart                        app/cart/page.tsx
/profile                     app/profile/page.tsx
/messages                    app/messages/page.tsx
/search?q=laptop             app/search/page.tsx
```

---

## 📈 Escalabilidad

La arquitectura actual permite:

✅ **Agregar nuevas páginas**: Crear carpeta en `app/`  
✅ **Agregar nuevos componentes**: Crear en `components/`  
✅ **Agregar nuevos hooks**: Crear en `hooks/`  
✅ **Agregar nuevo estado**: Extender Zustand stores  
✅ **Agregar nuevos tipos**: Extender `types/index.ts`  
✅ **Agregar nuevas utilidades**: `lib/utils.ts`  

---

## 🔐 Seguridad

- ✅ Validación de entrada en cliente
- ✅ Rutas protegidas con ProtectedRoute
- ✅ Tipado fuerte con TypeScript
- ✅ Variables de entorno para configuración sensible
- ✅ HTTPS para comunicación cliente-servidor

---

**Última actualización:** Abril 2026  
**Arquitectura:** Cliente-Servidor (CSR) Moderna  
**Framework Base:** Next.js 14 + React 18
