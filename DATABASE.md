# 🗄️ Diseño de Base de Datos - MercadoLibre Clone (NeonDB)

## 📑 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Modelo de Datos Conceptual](#modelo-de-datos-conceptual)
3. [Tablas Principales](#tablas-principales)
4. [Relaciones Entre Tablas](#relaciones-entre-tablas)
5. [Justificación del Diseño](#justificación-del-diseño)
6. [Ejemplos de Queries Prisma](#ejemplos-de-queries-prisma)
7. [Índices y Optimización](#índices-y-optimización)

---

## 📖 Descripción General

Este documento describe el diseño de la base de datos para la aplicación MercadoLibre Clone usando **NeonDB**, un servicio PostgreSQL serverless en la nube. El sistema está diseñado para manejar:

- 👥 Gestión de usuarios (compradores y vendedores)
- 📦 Catálogo de productos
- 🛒 Carrito de compras y órdenes
- 💬 Sistema de mensajería
- ⭐ Calificaciones y reseñas
- ❤️ Productos favoritos

**Tipo de Base de Datos:** Relacional (SQL)  
**Proveedor:** NeonDB (PostgreSQL Serverless)  
**ORM:** Prisma 5.22+  
**Ventajas de NeonDB:** ✅ Auto-scaling, ✅ Backups automáticos, ✅ SSL seguro, ✅ Sin mantenimiento, ✅ Conexiones branching para desarrollo  

---

## 📊 Modelo de Datos Conceptual (Relacional PostgreSQL)

```
┌──────────────────────────────────────────────────────────────────────┐
│                  MERCADOLIBRE CLONE - NeonDB                         │
│              Modelo de Datos Relacional (PostgreSQL)                 │
└──────────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │  USERS   │
                              └─────┬────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │ PRODUCTS │   │  ORDERS  │   │FAVORITES │
              └─────┬────┘   └────┬─────┘   └──────────┘
                    │             │
        ┌───────────┼─────────┐   │
        │           │         │   │
        ▼           ▼         ▼   ▼
    ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
    │CATEGORY│ │REVIEWS │ │CART_ITEMS│ │MESSAGES  │
    └────────┘ └────────┘ └─────────┘ └──────────┘
```

---

## 🗂️ Tablas Principales

### 1. **USERS (Usuarios)**

Almacena información de todos los usuarios del sistema.

```sql
CREATE TABLE users (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información Personal
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  
  -- Autenticación
  password_hash VARCHAR(255) NOT NULL,
  
  -- Ubicación
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  
  -- Avatar/Perfil
  avatar_url VARCHAR(500),
  bio TEXT,
  
  -- Estadísticas
  seller_rating DECIMAL(3,2) DEFAULT 0.00,
  buyer_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  
  -- Estado
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_seller BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  
  -- Índices
  INDEX idx_email (email),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
);
```

**Descripción de Campos:**
- `id`: Identificador único universal
- `email`: Email único para login
- `password_hash`: Contraseña cifrada (nunca en texto plano)
- `seller_rating`: Calificación promedio como vendedor
- `is_seller`: Indica si puede publicar productos
- `is_verified`: Email verificado

---

### 2. **PRODUCTS (Productos)**

Almacena todos los productos disponibles en el marketplace.

```sql
CREATE TABLE products (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  
  -- Información del Producto
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  condition ENUM('new', 'like-new', 'good', 'fair') DEFAULT 'new',
  
  -- Precios
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Inventario
  quantity_available INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,
  
  -- Imágenes
  main_image_url VARCHAR(500),
  
  -- Estadísticas
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Estados
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_seller_id (seller_id),
  INDEX idx_category (category),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_search (title, description)
);
```

**Descripción de Campos:**
- `seller_id`: Referencia al vendedor
- `category`: Categoría del producto
- `condition`: Estado del producto (nuevo, casi nuevo, etc.)
- `price`: Precio actual
- `quantity_available`: Stock disponible
- `FULLTEXT INDEX`: Para búsqueda rápida

---

### 3. **PRODUCT_IMAGES (Imágenes de Productos)**

Almacena múltiples imágenes por producto.

```sql
CREATE TABLE product_images (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  
  -- Imagen
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  
  -- Orden
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_product_id (product_id)
);
```

---

### 4. **CARTS (Carrito de Compras)**

Almacena los items en el carrito de cada usuario.

```sql
CREATE TABLE carts (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Metadata
  item_count INTEGER DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_user_id (user_id)
);
```

---

### 5. **CART_ITEMS (Items del Carrito)**

Almacena los items individuales en cada carrito.

```sql
CREATE TABLE cart_items (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL,
  product_id UUID NOT NULL,
  
  -- Cantidad y Precio
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  
  -- Timestamps
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_cart_id (cart_id),
  INDEX idx_product_id (product_id),
  UNIQUE KEY unique_cart_product (cart_id, product_id)
);
```

---

### 6. **ORDERS (Órdenes de Compra)**

Almacena todas las órdenes de compra realizadas.

```sql
CREATE TABLE orders (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL,
  
  -- Información de Envío
  shipping_address VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  
  -- Montos
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Estado de la Orden
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  
  -- Información de Pago
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

---

### 7. **ORDER_ITEMS (Items de la Orden)**

Detalle de cada item en una orden.

```sql
CREATE TABLE order_items (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  
  -- Cantidad y Precios
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  
  -- Índices
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);
```

---

### 8. **REVIEWS (Reseñas y Calificaciones)**

Almacena reseñas y calificaciones de productos.

```sql
CREATE TABLE reviews (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  order_item_id UUID,
  
  -- Calificación
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- Interacción
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id),
  
  -- Índices
  INDEX idx_product_id (product_id),
  INDEX idx_reviewer_id (reviewer_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
);
```

---

### 9. **MESSAGES (Mensajes/Chat)**

Almacena mensajes entre usuarios.

```sql
CREATE TABLE messages (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  
  -- Contenido
  content TEXT NOT NULL,
  
  -- Estado
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Contexto
  product_id UUID,
  order_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Índices
  INDEX idx_sender_id (sender_id),
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_conversation (sender_id, recipient_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);
```

---

### 10. **FAVORITES (Productos Favoritos)**

Almacena los productos marcados como favoritos por usuarios.

```sql
CREATE TABLE favorites (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  UNIQUE KEY unique_favorite (user_id, product_id)
);
```

---

## 🔗 Relaciones Entre Tablas

### Diagrama ER (Entity-Relationship)

```
┌─────────────┐
│   USERS     │
├─────────────┤
│ id (PK)     │ 1 ─┐
│ email       │    │
│ password    │    │
│ ...         │    │
└─────────────┘    │
                   │
        ┌──────────┼──────────┬──────────┐
        │          │          │          │
        │          │          │          │
   1 ◄─┤───────┐  │  ◄───┐   │  ◄───┐   │
        │       │  │  ┌───┤   │  ┌───┤   │
        │    (seller_id)N   │   │   │   │
        │       │  │    (reviewer_id, seller_id)
        │       │  │    (user_id)    (user_id)
    ┌───┴───────▼──┴────┐  │   │   │   │
    │   PRODUCTS  │      │  │   │   │   │
    ├─────────────┤      │  │   │   │   │
    │ id (PK)     │◄─┘   │  │   │   │   │
    │seller_id(FK)│      │  │   │   │   │
    │ title       │      │  │   │   │   │
    │ price       │      │  │   │   │   │
    │ ...         │      │  │   │   │   │
    └─────────────┘      │  │   │   │   │
        │ 1               │  │   │   │   │
        │                 │  │   │   │   │
        ├─────N──────┐    │  │   │   │   │
        │     1      ▼    │  │   │   │   │
        │        ┌──────────┤  │   │   │   │
        │        │        REVIEWS│   │   │   │
        │        │        │   │   │   │   │
        │   ┌────┴────────┘   │   │   │   │
        │   │                 │   │   │   │
        │   └─────────────────┤───┼───┼───┘
        │ 1                 1 │   │   │
        │                     │   │   │
    ┌───┴──────────┬─────────┘   │   │
    │              │             │   │
    │          ┌───┴──────────┐  │   │
    │    1     │ N     1      │  │   │
    └──────────┤─ CARTS ──────┴──┼───┼──0..*─ FAVORITES
    │          │              │  ▲
    │          │ (cart_id)    │  │
    │          │              │  │ (user_id,product_id)
    │  ┌───────┴────────────┐ │  │
    │  │                    │ │  │
    │  ▼                    ▼ ▼  │
    │ ┌──────────────────────────┴─┐
    │ │    CART_ITEMS         │
    │ ├─────────────────────────┤
    │ │ id (PK)           │
    │ │ cart_id (FK)      │
    │ │ product_id (FK)   │
    │ │ quantity          │
    │ │ unit_price        │
    │ └───────────────────────────┘
    │       │ 1
    │       │
    │ ┌─────┴─────────────┐
    │ │                   │
    └─┼───────────┬──────┘
    N │ 1         │ 1
    ┌─┴─────┐  ┌─┴────────────┐
    │ ORDERS│  │ ORDER_ITEMS   │
    │──────┼────┼──────────────┤
    │id(PK)│  │ id(PK)        │
    │buyer_│  │ order_id(FK)  │
    │status│  │ product_id(FK)│
    │total │  │ quantity      │
    └──────┘  └───────────────┘
         │
         │ 1
         │
    ┌────┴─────────────────┐
    │   MESSAGES            │
    ├──────────────────────┤
    │ id (PK)              │
    │ sender_id (FK)       │
    │ recipient_id (FK)    │
    │ content              │
    │ created_at           │
    └──────────────────────┘
```

---

## 💡 Justificación del Diseño

### 1. **Normalización**
- Diseño en **3FN (Tercera Forma Normal)**
- Elimina redundancia de datos
- Facilita actualizaciones y mantenimiento

### 2. **Integridad Referencial**
- Foreign Keys aseguran consistencia
- Cascadas ON DELETE para eliminar datos relacionados
- UNIQUE constraints previenen duplicados

### 3. **Separación de Tablas**
- `USERS`: Información de personas
- `PRODUCTS`: Catálogo de productos
- `PRODUCT_IMAGES`: Múltiples imágenes por producto
- `CARTS` y `CART_ITEMS`: Separación de contenedor vs items
- `ORDERS` y `ORDER_ITEMS`: Historial de compras

### 4. **Escalabilidad**
- UUIDs en lugar de auto-increment
- Permite distribución de datos
- Mejor para sistemas distribuidos

### 5. **Auditoría y Timestamps**
- `created_at`: Cuándo se creó el registro
- `updated_at`: Última modificación
- `read_at`: Para mensajes
- Útil para auditoría y análisis

### 6. **Índices Estratégicos**
- Aceleran búsquedas frecuentes
- FULLTEXT para búsqueda de productos
- Índices en ForeignKeys para joins

---

## 🛠️ Scripts SQL

### Script Completo de Creación

```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mercadolibre_clone;
USE mercadolibre_clone;

-- Habilitar extensiones (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  seller_rating DECIMAL(3,2) DEFAULT 0.00,
  buyer_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_seller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_is_active (is_active)
);

-- Tabla: PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  condition VARCHAR(20) DEFAULT 'new',
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  quantity_available INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,
  main_image_url VARCHAR(500),
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_seller_id (seller_id),
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
);

-- Tabla: FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_favorite (user_id, product_id)
);

-- Tabla: REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_reviewer_id (reviewer_id)
);

-- Tabla: CARTS
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  item_count INTEGER DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Tabla: CART_ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_cart_id (cart_id),
  UNIQUE KEY unique_cart_product (cart_id, product_id)
);

-- Tabla: ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL,
  shipping_address VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_status (status)
);

-- Tabla: ORDER_ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  INDEX idx_order_id (order_id)
);

-- Tabla: MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  product_id UUID,
  order_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_conversation (sender_id, recipient_id),
  INDEX idx_is_read (is_read)
);

-- Tabla: PRODUCT_IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id)
);
```

---

## 🚀 Índices y Optimización

### Índices Clave para Rendimiento

| Tabla | Campo | Tipo | Propósito |
|-------|-------|------|----------|
| users | email | UNIQUE | Búsqueda rápida por email durante login |
| users | isActive | INDEX | Filtrar usuarios activos |
| users | isSeller | INDEX | Filtrar vendedores |
| products | sellerId | INDEX | Encontrar productos por vendedor |
| products | categoryId | INDEX | Filtrar por categoría |
| products | isActive | INDEX | Mostrar solo productos activos |
| products | isFeatured | INDEX | Destacados en homepage |
| products | sku | UNIQUE | Búsqueda rápida por SKU |
| carts | userId | UNIQUE | Un carrito por usuario |
| cartItems | cartId, productId | UNIQUE | Evitar duplicados |
| orders | buyerId | INDEX | Historial de compras |
| orders | status | INDEX | Filtrar por estado |
| reviews | productId | INDEX | Reseñas por producto |
| reviews | rating | INDEX | Filtrar por calificación |
| messages | conversation | INDEX | Buscar conversaciones |
| favorites | user, product | UNIQUE | Evitar favoritos duplicados |

### Estrategia de Consultas Comunes

```sql
-- 1. Obtener productos activos con categoría
SELECT p.*, c.name as categoryName, u.firstName as sellerName
FROM products p
JOIN category c ON p.categoryId = c.id
JOIN users u ON p.sellerId = u.id
WHERE p.isActive = true
ORDER BY p.createdAt DESC
LIMIT 20;

-- 2. Carrito completo de usuario
SELECT ci.*, p.title, p.price, p.mainImageUrl
FROM cartItems ci
JOIN carts c ON ci.cartId = c.id
JOIN products p ON ci.productId = p.id
WHERE c.userId = ?
ORDER BY ci.addedAt DESC;

-- 3. Órdenes de usuario
SELECT o.*, COUNT(oi.id) as itemCount, SUM(oi.subtotal) as totalSpent
FROM orders o
LEFT JOIN orderItems oi ON o.id = oi.orderId
WHERE o.buyerId = ?
GROUP BY o.id
ORDER BY o.createdAt DESC;

-- 4. Reseñas de producto
SELECT r.*, u.firstName, u.lastName, u.avatarUrl
FROM reviews r
JOIN users u ON r.reviewerId = u.id
WHERE r.productId = ?
ORDER BY r.createdAt DESC;

-- 5. Mensajes sin leer
SELECT m.*, u.firstName, u.lastName
FROM messages m
JOIN users u ON m.senderId = u.id
WHERE m.recipientId = ? AND m.isRead = false
ORDER BY m.createdAt DESC;
```

### Optimizaciones Recomendadas

1. **Particionamiento Temporal**: Particionar tablas grandes como `messages` y `orders` por fecha
2. **Archivado**: Archivar órdenes completadas de hace más de 2 años
3. **Caché**: Redis para:
   - Listado de categorías
   - Productos destacados
   - Órdenes recientes
4. **Conexión a BD**: Pool de conexiones con límite de 20-50 conexiones
5. **Replicación**: Lectura desde réplica para consultas analíticas

---

## 📋 Migración de Datos Iniciales

### Seed Data

```typescript
// prisma/seed.ts
const seedData = async () => {
  // 1. Crear categorías
  const electronics = await prisma.category.create({
    data: { name: "Electrónica", slug: "electronica" }
  });

  // 2. Crear usuarios
  const seller = await prisma.user.create({
    data: {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@example.com",
      passwordHash: hashedPassword,
      isSeller: true
    }
  });

  // 3. Crear productos
  await prisma.product.create({
    data: {
      title: "Laptop XYZ",
      price: 999.99,
      sellerId: seller.id,
      categoryId: electronics.id
    }
  });
};
```

---

## 🔍 Consultas de Ejemplo en Prisma

```typescript
// Obtener productos con relaciones
const products = await prisma.product.findMany({
  where: { isActive: true },
  include: {
    seller: { select: { firstName: true, lastName: true } },
    category: true,
    images: true,
    reviews: { take: 5 }
  }
});

// Carrito completo
const cart = await prisma.cart.findUnique({
  where: { userId },
  include: {
    items: {
      include: { product: true }
    }
  }
});

// Órdenes del usuario
const orders = await prisma.order.findMany({
  where: { buyerId: userId },
  include: { items: { include: { product: true } } }
});
```

---

## 📊 Diagrama Mermaid ER (Entity-Relationship)

```mermaid
erDiagram
    USERS ||--o{ PRODUCT : sells
    USERS ||--o{ ORDER : places
    USERS ||--o{ CART : has
    USERS ||--o{ REVIEW : writes
    USERS ||--o{ MESSAGE : sends
    USERS ||--o{ FAVORITE : marks
    PRODUCT ||--o{ PRODUCT_IMAGE : "has many"
    PRODUCT ||--o{ CART_ITEM : "added to"
    PRODUCT ||--o{ ORDER_ITEM : "part of"
    PRODUCT ||--o{ REVIEW : "reviewed in"
    CART ||--o{ CART_ITEM : contains
    ORDER ||--o{ ORDER_ITEM : contains
    CATEGORY ||--o{ PRODUCT : "has many"
    SELLER_PROFILE ||--|| USERS : "belongs to"

    USERS {
        string id PK
        string email UK
        string firstName
        string lastName
        string passwordHash
        float sellerRating
        float buyerRating
        boolean isSeller
        boolean isVerified
        datetime createdAt
        datetime updatedAt
    }

    PRODUCT {
        string id PK
        string sellerId FK
        string categoryId FK
        string title
        string description
        decimal price
        decimal originalPrice
        int quantityAvailable
        int quantitySold
        float averageRating
        int reviewCount
        boolean isActive
        boolean isFeatured
        datetime createdAt
    }

    CART {
        string id PK
        string userId FK UK
        int itemCount
        decimal subtotal
    }

    ORDER {
        string id PK
        string buyerId FK
        decimal subtotal
        decimal tax
        decimal totalAmount
        string status
        datetime createdAt
    }

    CATEGORY {
        string id PK
        string name UK
        string slug UK
        string description
        int displayOrder
    }

    REVIEW {
        string id PK
        string productId FK
        string reviewerId FK
        int rating
        string title
        string comment
        datetime createdAt
    }

    MESSAGE {
        string id PK
        string senderId FK
        string recipientId FK
        string content
        boolean isRead
        datetime createdAt
    }
```

---

## 🛡️ Consideraciones de Seguridad

- ✅ Contraseñas hasheadas con bcryptjs (nunca en texto plano)
- ✅ Foreign Keys para integridad referencial
- ✅ Constraints para validación de datos
- ✅ Índices en campos sensibles (email)
- ✅ Logs de auditoría (createdAt, updatedAt)
- ✅ Soft deletes donde sea necesario (is_active, is_banned)

---

## 📈 Crecimiento Esperado

| Métrica | Valores |
|---------|---------|
| Usuarios | 0 → 100K → 1M |
| Productos | 0 → 50K → 1M |
| Órdenes/mes | 0 → 10K → 100K |
| Mensajes | Escala con usuarios |
| Reseñas | 10-20% de órdenes |

**Recomendación**: Con crecimiento esperado a 1M productos, considerar:
- Sharding por categoría o región
- Búsqueda elástica (Elasticsearch)
- Caché distribuido (Redis)
- CDN para imágenes

---

## 🚀 Configuración de NeonDB

### 1. Crear Proyecto en NeonDB

1. Registrarse en [neon.tech](https://neon.tech)
2. Crear un nuevo proyecto
3. Copiar la **Connection String**
4. Guardar en `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### 2. Configurar Prisma para NeonDB

En `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Crear Tablas (Migraciones)

```bash
# Crear migración
npx prisma migrate dev --name init

# Ver estado
npx prisma migrate status

# Aplicar en producción
npx prisma migrate deploy
```

### 4. Acceder a Prisma Studio

```bash
# Interfaz gráfica para ver/editar datos
npx prisma studio
```

---

**Última actualización:** Abril 2026  
**Base de Datos:** NeonDB (PostgreSQL Serverless)  
**ORM:** Prisma 5.22+  
**Tipo:** Relacional (SQL)

### Índices Clave para Rendimiento

```sql
-- Búsqueda frecuentes
CREATE INDEX idx_products_active_category 
ON products(is_active, category);

-- Queries de usuario
CREATE INDEX idx_users_email_active 
ON users(email, is_active);

-- Conversaciones de mensajes
CREATE INDEX idx_messages_conversation 
ON messages(sender_id, recipient_id, created_at DESC);

-- Órdenes del usuario
CREATE INDEX idx_orders_buyer_date 
ON orders(buyer_id, created_at DESC);

-- Favoritos del usuario
CREATE INDEX idx_favorites_user_date 
ON favorites(user_id, created_at DESC);
```

---

## 📈 Estadísticas Estimadas

| Tabla | Registros Estimados | Tamaño |
|-------|-------------------|--------|
| users | 100,000 | 50 MB |
| products | 500,000 | 200 MB |
| reviews | 1,000,000 | 150 MB |
| orders | 250,000 | 100 MB |
| messages | 5,000,000 | 500 MB |
| **Total** | **~7M** | **~1GB** |

---

**Última actualización:** Abril 2026  
**Sistema Gestor:** SQL Relacional  
**Modelo:** Entidad-Relación (ER)
