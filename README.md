# 🛍️ MercadoLibre Clone - Plataforma Marketplace Completa

Una aplicación enterprise-grade tipo MercadoLibre construida con **Next.js 14**, **React 18**, **TypeScript** y **PostgreSQL**. Implementa todas las funcionalidades principales de un marketplace moderno con arquitectura cliente-servidor escalable.

## 📋 Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Objetivos del Proyecto](#objetivos-del-proyecto)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación Rápida](#instalación-rápida)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Evidencia Visual](#evidencia-visual)

## 📖 Descripción General

**MercadoLibre Clone** es una plataforma de e-commerce completa que simula las funcionalidades principales de MercadoLibre. El sistema permite a usuarios comprar y vender productos, gestionar carritos de compra, mantener listas de favoritos, comunicarse en tiempo real, y acceder a un perfil personalizado con historial de transacciones.

### Objetivo del Proyecto

El objetivo es demostrar dominio en:
- ✅ Desarrollo full-stack con Next.js y PostgreSQL
- ✅ Arquitectura cliente-servidor escalable
- ✅ Diseño de base de datos relacional compleja
- ✅ API RESTful con mejores prácticas
- ✅ UI/UX moderna y responsive
- ✅ Gestión de estado y contexto
- ✅ Autenticación y autorización
- ✅ Documentación técnica profesional

## 🎯 Características Principales

### 1. **Autenticación de Usuarios**
- Página de login
- Página de registro con validación
- Gestión de sesiones

### 2. **Catálogo de Productos**
- Página de inicio con productos destacados
- Página de detalles del producto
- Visualización de imágenes
- Sistema de calificaciones y reseñas

### 3. **Sistema de Mensajería**
- Chat en tiempo real entre usuarios
- Historial de conversaciones
- Notificaciones de mensajes sin leer
- Búsqueda de conversaciones

### 4. **Carrito de Compras**
- Agregar/remover productos
- Actualizar cantidades
- Cálculo automático de subtotal, impuestos y envío
- Envío gratis para compras mayores a $100

### 5. **Perfil de Usuario**
- Información personal
- Historial de compras
- Historial de ventas
- Estadísticas del usuario (calificación, nivel)
- Configuración de privacidad

### 6. **Sistema de Ventas**
- Formulario para publicar productos
- Carga de imágenes
- Selección de categoría y condición
- Gestión de cantidad y precio

### 7. **Favoritos**
- Agregar/remover productos favoritos
- Vista de todos los favoritos
- Acceso rápido a productos guardados

### 8. **Navegación**
- Barra de navegación con búsqueda
- Menú de categorías
- Enlaces rápidos a secciones principales
- Footer con información

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Next.js** | 14+ | Framework React con SSR y optimizaciones |
| **React** | 18+ | Librería de componentes UI |
| **TypeScript** | 5+ | Tipado estático para mayor seguridad |
| **Tailwind CSS** | 3.3+ | Estilización utility-first |
| **Framer Motion** | 12+ | Animaciones y transiciones fluidas |
| **Lucide React** | 0.294+ | Iconos SVG modernos |
| **Zustand** | 4.4+ | Gestión de estado global |
| **Axios** | 1.6+ | Cliente HTTP para APIs |

### Backend & Base de Datos
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **NeonDB** | - | PostgreSQL Serverless (Cloud) |
| **PostgreSQL** | 14+ | Motor de base de datos relacional |
| **Prisma** | 5.22+ | ORM y gestión de migraciones |
| **Next.js API Routes** | 14+ | Endpoints serverless |
| **bcryptjs** | 3.0+ | Encriptación de contraseñas |

### Desarrollo
| Herramienta | Propósito |
|-----------|----------|
| **npm/Node.js** | Gestor de paquetes y runtime |
| **ESLint** | Linting de código |
| **ts-node** | Ejecución de scripts TypeScript |
| **Concurrently** | Ejecutar múltiples procesos |

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js 18.0.0 o superior
- npm 8.0.0 o superior
- PostgreSQL 12 o superior
- Git 2.30 o superior

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <url-repositorio>
cd mercadolibre-clone

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu DATABASE_URL y variables necesarias

# 4. Configurar base de datos
npx prisma migrate dev --name init

# 5. Ejecutar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**

## 📁 Estructura del Proyecto

## 📁 Estructura del Proyecto

```
mercadolibre-clone/
│
├── 📄 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes (Backend)
│   │   ├── products/route.ts        # GET productos
│   │   ├── categories/route.ts      # GET categorías
│   │   └── deals/route.ts           # GET ofertas
│   │
│   ├── 📁 auth/                     # Rutas de autenticación
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── 📁 products/                 # Catálogo de productos
│   │   ├── page.tsx                 # Listado
│   │   └── [id]/page.tsx            # Detalle dinámico
│   │
│   ├── 📁 cart/                     # Carrito de compras
│   ├── 📁 profile/                  # Perfil de usuario
│   ├── 📁 favorites/                # Productos favoritos
│   ├── 📁 messages/                 # Mensajería
│   ├── 📁 sell/                     # Publicar productos
│   ├── 📁 categories/               # Categorías
│   ├── 📁 deals/                    # Ofertas
│   ├── 📁 search/                   # Búsqueda
│   │
│   ├── layout.tsx                   # Layout global
│   ├── page.tsx                     # Página inicio
│   └── globals.css                  # Estilos globales
│
├── 📁 components/                   # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── AnimatedCard.tsx
│   ├── PageTransition.tsx
│   └── ProtectedRoute.tsx
│
├── 📁 lib/                          # Utilidades
│   ├── prisma.ts                    # Cliente Prisma
│   ├── api-client.ts                # Cliente HTTP
│   ├── constants.ts                 # Constantes
│   ├── db-queries.ts                # Queries personalizadas
│   └── utils.ts                     # Funciones auxiliares
│
├── 📁 context/                      # Context API
│   └── AuthContext.tsx
│
├── 📁 hooks/                        # Custom Hooks
│   ├── useCart.ts
│   ├── useFavorites.ts
│   └── useWishlist.ts
│
├── 📁 types/                        # Tipos TypeScript
│   └── index.ts                     # Interfaces compartidas
│
├── 📁 prisma/                       # Configuración DB
│   ├── schema.prisma                # Schema de Prisma
│   ├── seed.ts                      # Script de datos iniciales
│   └── migrations/                  # Historial de migraciones
│
├── 📄 package.json                  # Dependencias
├── 📄 tsconfig.json                 # Configuración TypeScript
├── 📄 tailwind.config.js            # Configuración Tailwind
├── 📄 next.config.js                # Configuración Next.js
├── 📄 .env.example                  # Variables de ejemplo
└── 📄 README.md                     # Este archivo
```

## 🎨 Tema de Color

- **Amarillo Primario**: `#FFE600` - Color distintivo de MercadoLibre
- **Amarillo Hover**: `#FFCF00` - Variante más oscura para interacciones
- **Azul Secundario**: `#3483FA` - Botones y elementos de acción
- **Gris Neutro**: `#F5F5F5` - Fondos y divisores
- **Texto Principal**: `#333333` - Legibilidad óptima

## 📚 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor + Prisma Studio
npm run dev:frontend    # Solo servidor (sin DB Studio)
npm run dev:db         # Solo Prisma Studio

# Producción
npm run build           # Compilar para producción
npm start              # Ejecutar servidor producción

# Validación
npm run lint           # Ejecutar ESLint

# Base de datos
npx prisma migrate dev --name <nombre>    # Crear migración
npx prisma generate                        # Generar cliente Prisma
npx prisma db seed                        # Ejecutar seed.ts
```

## 📖 Documentación

La documentación completa del proyecto se encuentra en:

| Documento | Descripción |
|-----------|-------------|
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Arquitectura del sistema, patrones de diseño y diagramas |
| **[DATABASE.md](DATABASE.md)** | Diseño de base de datos, tablas y relaciones |
| **[API.md](API.md)** | Documentación de endpoints REST y servicios |
| **[INSTALLATION.md](INSTALLATION.md)** | Guía detallada de instalación y configuración |
| **[FUTURE_IMPROVEMENTS.md](FUTURE_IMPROVEMENTS.md)** | Roadmap y mejoras planificadas |
| **[ESTRUCTURA.md](ESTRUCTURA.md)** | Descripción detallada de la estructura del proyecto |

## 🖼️ Evidencia Visual

### Pantalla de Inicio
- Catálogo de productos destacados
- Ofertas especiales
- Navegación intuitiva
- Búsqueda de productos

### Página de Producto
- Galería de imágenes
- Información del vendedor
- Calificaciones y reseñas
- Botón "Agregar al carrito"
- Productos relacionados

### Carrito de Compras
- Resumen de items
- Cálculo automático de totales
- Impuestos y envío
- Proceder al pago

### Perfil de Usuario
- Información personal
- Historial de compras
- Historial de ventas (si es vendedor)
- Estadísticas y calificaciones

### Sistema de Mensajería
- Chat en tiempo real
- Historial de conversaciones
- Notificaciones de mensajes no leídos

## 🚦 Rutas Disponibles

| Ruta | Descripción | Autenticación |
|------|-------------|---------------|
| `/` | Página de inicio | No requerida |
| `/auth/login` | Iniciar sesión | No requerida |
| `/auth/register` | Crear cuenta | No requerida |
| `/products` | Catálogo completo | No requerida |
| `/products/[id]` | Detalles del producto | No requerida |
| `/cart` | Carrito de compras | ⚠️ Recomendada |
| `/profile` | Perfil del usuario | ✅ Requerida |
| `/messages` | Sistema de mensajería | ✅ Requerida |
| `/favorites` | Productos favoritos | ✅ Requerida |
| `/sell` | Publicar producto | ✅ Requerida |
| `/categories` | Todas las categorías | No requerida |
| `/deals` | Ofertas especiales | No requerida |
| `/search` | Búsqueda avanzada | No requerida |

## 🔐 Seguridad

- ✅ Contraseñas encriptadas con bcryptjs
- ✅ Rutas protegidas con Context API
- ✅ Validación de datos en cliente y servidor
- ✅ Variables de entorno sensibles protegidas
- ✅ CORS configurado para APIs

## 📊 Estado del Proyecto

- ✅ Frontend completo y funcional
- ✅ Backend API funcional
- ✅ Base de datos con Prisma ORM
- ✅ Autenticación básica
- ✅ Carrito de compras
- ✅ Sistema de mensajería
- ✅ Gestión de favoritos
- 🚧 Pasarela de pagos (Planned)
- 🚧 Notificaciones en tiempo real (Planned)
- 🚧 Sistema de calificaciones avanzado (Planned)

## 🤝 Contribuciones

Este es un proyecto educativo. Se aprecian contribuciones, sugerencias y mejoras.

## 📄 Licencia

Proyecto educativo - Libre para usar y modificar con fines de aprendizaje.

## 👨‍💻 Desarrollador

Proyecto desarrollado con fines académicos y demostración de habilidades full-stack.

---

**¡Disfruta explorando MercadoLibre Clone!** 🚀
