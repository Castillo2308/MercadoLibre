# 🔌 Documentación de APIs y Servicios - MercadoLibre Clone

## 📑 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Autenticación](#autenticación)
3. [Usuarios](#usuarios)
4. [Productos](#productos)
5. [Carrito de Compras](#carrito-de-compras)
6. [Órdenes](#órdenes)
7. [Reseñas](#reseñas)
8. [Mensajes](#mensajes)
9. [Favoritos](#favoritos)
10. [Categorías](#categorías)
11. [Códigos de Estado](#códigos-de-estado)
12. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 📖 Descripción General

Esta documentación describe todos los endpoints disponibles en la API de MercadoLibre Clone. La API es **RESTful** y utiliza **JSON** para solicitudes y respuestas.

**Base URL:** `http://localhost:3000/api` (desarrollo)  
**Autenticación:** JWT (JSON Web Tokens)  
**Formato de Datos:** JSON  
**Versionado:** v1  

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren un token JWT en el header `Authorization`.

### Headers Requeridos
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Login
**Método:** `POST`  
**Ruta:** `/auth/login`  
**Descripción:** Autentica un usuario y retorna un JWT token

**Parámetros de Entrada:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-user-id",
      "email": "usuario@example.com",
      "first_name": "Juan",
      "last_name": "Pérez",
      "avatar_url": "https://...",
      "is_seller": false
    }
  }
}
```

**Respuesta Error (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### Registro
**Método:** `POST`  
**Ruta:** `/auth/register`  
**Descripción:** Registra un nuevo usuario

**Parámetros de Entrada:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "password": "contraseña123",
  "phone": "+34 666 777 888"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "uuid-user-id",
    "email": "juan@example.com",
    "first_name": "Juan"
  }
}
```

---

## 👥 Usuarios

### Obtener Perfil Actual
**Método:** `GET`  
**Ruta:** `/users/profile`  
**Descripción:** Obtiene los datos del usuario autenticado  
**Autenticación:** ✅ Requerida

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@example.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+34 666 777 888",
    "address": "Calle Principal 123",
    "city": "Madrid",
    "avatar_url": "https://...",
    "seller_rating": 4.8,
    "buyer_rating": 4.5,
    "total_sales": 42,
    "total_purchases": 15,
    "is_seller": true
  }
}
```

---

### Actualizar Perfil
**Método:** `PUT`  
**Ruta:** `/users/profile`  
**Descripción:** Actualiza información del usuario  
**Autenticación:** ✅ Requerida

**Parámetros de Entrada:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "+34 666 777 888",
  "address": "Calle Nueva 456",
  "city": "Barcelona",
  "bio": "Vendedor de electrónica"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado correctamente",
  "data": { /* usuario actualizado */ }
}
```

---

### Obtener Usuario por ID
**Método:** `GET`  
**Ruta:** `/users/:userId`  
**Descripción:** Obtiene información pública de un usuario  
**Autenticación:** ❌ Opcional

**Parámetros:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| userId | UUID | Sí | ID del usuario |

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "first_name": "Juan",
    "last_name": "Pérez",
    "avatar_url": "https://...",
    "seller_rating": 4.8,
    "total_sales": 42,
    "is_seller": true
  }
}
```

---

## 📦 Productos

### Listar Productos
**Método:** `GET`  
**Ruta:** `/products`  
**Descripción:** Obtiene listado de productos con filtros opcionales  
**Autenticación:** ❌ No requerida

**Parámetros Query:**
| Parámetro | Tipo | Ejemplo | Descripción |
|-----------|------|---------|-------------|
| page | int | 1 | Número de página (default: 1) |
| limit | int | 20 | Productos por página (max: 100) |
| category | string | electronics | Filtrar por categoría |
| min_price | number | 10.00 | Precio mínimo |
| max_price | number | 1000.00 | Precio máximo |
| search | string | laptop | Búsqueda por título/descripción |
| sort | string | price_asc | Ordenamiento |
| condition | string | new | Condición (new, like-new, good, fair) |

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "title": "Laptop DellXPS 13",
        "description": "Laptop de alto rendimiento...",
        "price": 1299.99,
        "original_price": 1499.99,
        "discount_percentage": 13,
        "category": "electronics",
        "condition": "new",
        "main_image_url": "https://...",
        "average_rating": 4.7,
        "review_count": 128,
        "seller_id": "uuid",
        "quantity_available": 5,
        "is_featured": true,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 542,
      "pages": 28
    }
  }
}
```

---

### Obtener Detalle de Producto
**Método:** `GET`  
**Ruta:** `/products/:productId`  
**Descripción:** Obtiene información detallada de un producto  
**Autenticación:** ❌ No requerida

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Laptop Dell XPS 13",
    "description": "Laptop ultraportátil with 13.3 FHD display...",
    "price": 1299.99,
    "original_price": 1499.99,
    "category": "electronics",
    "condition": "new",
    "quantity_available": 5,
    "images": [
      "https://...",
      "https://...",
      "https://..."
    ],
    "seller": {
      "id": "uuid",
      "name": "ElectroShop",
      "rating": 4.8,
      "reviews": 542
    },
    "specs": {
      "processor": "Intel i7",
      "ram": "16GB",
      "storage": "512GB SSD"
    },
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "title": "Excelente producto",
        "comment": "Muy satisfecho con la compra",
        "reviewer_name": "Carlos M.",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "average_rating": 4.7,
    "review_count": 128
  }
}
```

---

### Crear Producto (Publicar)
**Método:** `POST`  
**Ruta:** `/products`  
**Descripción:** Publica un nuevo producto  
**Autenticación:** ✅ Requerida (solo vendedores)

**Parámetros de Entrada:**
```json
{
  "title": "Laptop Dell XPS 13",
  "description": "Laptop ultraportátil con pantalla FHD...",
  "category": "electronics",
  "condition": "new",
  "price": 1299.99,
  "original_price": 1499.99,
  "quantity": 5,
  "images": [
    "https://...",
    "https://..."
  ],
  "specs": {
    "processor": "Intel i7",
    "ram": "16GB",
    "storage": "512GB SSD"
  }
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Producto publicado exitosamente",
  "data": {
    "id": "uuid-product-id",
    "title": "Laptop Dell XPS 13",
    "slug": "laptop-dell-xps-13"
  }
}
```

---

### Actualizar Producto
**Método:** `PUT`  
**Ruta:** `/products/:productId`  
**Descripción:** Actualiza información de un producto  
**Autenticación:** ✅ Requerida (solo dueño o admin)

**Parámetros de Entrada:** (Igual que crear, campos opcionales)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Producto actualizado",
  "data": { /* producto actualizado */ }
}
```

---

### Eliminar Producto
**Método:** `DELETE`  
**Ruta:** `/products/:productId`  
**Descripción:** Elimina un producto  
**Autenticación:** ✅ Requerida (solo dueño o admin)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

## 🛒 Carrito de Compras

### Obtener Carrito
**Método:** `GET`  
**Ruta:** `/cart`  
**Descripción:** Obtiene el carrito del usuario actual  
**Autenticación:** ✅ Requerida

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "product_title": "Laptop Dell XPS 13",
        "quantity": 1,
        "unit_price": 1299.99,
        "subtotal": 1299.99,
        "image_url": "https://..."
      },
      {
        "id": "uuid",
        "product_id": "uuid",
        "product_title": "Mouse Inalámbrico",
        "quantity": 2,
        "unit_price": 25.99,
        "subtotal": 51.98
      }
    ],
    "totals": {
      "subtotal": 1351.97,
      "tax": 283.91,
      "shipping": 0,
      "total": 1635.88
    }
  }
}
```

---

### Agregar al Carrito
**Método:** `POST`  
**Ruta:** `/cart/add`  
**Descripción:** Agrega un producto al carrito  
**Autenticación:** ✅ Requerida

**Parámetros de Entrada:**
```json
{
  "product_id": "uuid",
  "quantity": 1
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Producto añadido al carrito",
  "data": {
    "cart_item_id": "uuid",
    "quantity": 1,
    "unit_price": 1299.99
  }
}
```

---

### Actualizar Cantidad
**Método:** `PUT`  
**Ruta:** `/cart/items/:itemId`  
**Descripción:** Actualiza la cantidad de un item  
**Autenticación:** ✅ Requerida

**Parámetros de Entrada:**
```json
{
  "quantity": 2
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Cantidad actualizada",
  "data": {
    "quantity": 2,
    "subtotal": 2599.98
  }
}
```

---

### Eliminar del Carrito
**Método:** `DELETE`  
**Ruta:** `/cart/items/:itemId`  
**Descripción:** Elimina un item del carrito  
**Autenticación:** ✅ Requerida

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Item eliminado del carrito"
}
```

---

### Vaciar Carrito
**Método:** `DELETE`  
**Ruta:** `/cart`  
**Descripción:** Elimina todos los items del carrito  
**Autenticación:** ✅ Requerida

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Carrito vaciado"
}
```

---

## 📋 Órdenes

### Crear Orden (Checkout)
**Método:** `POST`  
**Ruta:** `/orders`  
**Descripción:** Crea una nueva orden desde el carrito  
**Autenticación:** ✅ Requerida

**Parámetros de Entrada:**
```json
{
  "shipping_address": "Calle Principal 123",
  "shipping_city": "Madrid",
  "shipping_state": "Madrid",
  "shipping_postal_code": "28001",
  "payment_method": "credit_card",
  "payment_token": "tok_visa_4242"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "order_id": "uuid",
    "total_amount": 1635.88,
    "status": "pending",
    "items_count": 3,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Obtener Mis Órdenes
**Método:** `GET`  
**Ruta:** `/orders`  
**Descripción:** Obtiene todas las órdenes del usuario  
**Autenticación:** ✅ Requerida

**Parámetros Query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| page | int | Página (default: 1) |
| limit | int | Por página (default: 10) |
| status | string | Filtrar por estado |

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "total_amount": 1635.88,
        "status": "shipped",
        "items_count": 3,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5
    }
  }
}
```

---

### Obtener Detalle Orden
**Método:** `GET`  
**Ruta:** `/orders/:orderId`  
**Descripción:** Obtiene detalles de una orden específica  
**Autenticación:** ✅ Requerida

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "shipped",
    "total_amount": 1635.88,
    "items": [
      {
        "product_id": "uuid",
        "title": "Laptop Dell XPS 13",
        "quantity": 1,
        "unit_price": 1299.99
      }
    ],
    "shipping": {
      "address": "Calle Principal 123",
      "city": "Madrid",
      "status": "on_the_way",
      "tracking_number": "ES123456789"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "shipped_at": "2024-01-16T14:22:00Z"
  }
}
```

---

## ⭐ Reseñas

### Crear Reseña
**Método:** `POST`  
**Ruta:** `/reviews`  
**Descripción:** Crea una reseña para un producto comprado  
**Autenticación:** ✅ Requerida

**Parámetros de Entrada:**
```json
{
  "product_id": "uuid",
  "order_item_id": "uuid",
  "rating": 5,
  "title": "Excelente producto",
  "comment": "Muy satisfecho con la calidad y el envío"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Reseña publicada",
  "data": {
    "id": "uuid",
    "rating": 5,
    "title": "Excelente producto"
  }
}
```

---

### Obtener Reseñas de Producto
**Método:** `GET`  
**Ruta:** `/products/:productId/reviews`  
**Descripción:** Obtiene todas las reseñas de un producto  
**Autenticación:** ❌ No requerida

**Parámetros Query:**
| Parámetro | Descripción |
|-----------|-------------|
| page | Página (default: 1) |
| sort | Ordenamiento (newest, helpful, rating) |
| rating | Filtrar por rating |

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "title": "Excelente",
        "comment": "Muy bueno",
        "reviewer_name": "Juan P.",
        "helpful_count": 25,
        "created_at": "2024-01-10T08:00:00Z"
      }
    ],
    "average_rating": 4.7,
    "total_count": 128
  }
}
```

---

## 💬 Mensajes

### Enviar Mensaje
**Método:** `POST`  
**Ruta:** `/messages`  
**Descripción:** Envía un mensaje a otro usuario  
**Autenticación:** ✅ Requerida

**Parámetros de Entrada:**
```json
{
  "recipient_id": "uuid",
  "content": "Hola, ¿aún disponible el producto?",
  "product_id": "uuid"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Hola, ¿aún disponible el producto?",
    "sent_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Obtener Conversación
**Método:** `GET`  
**Ruta:** `/messages/conversation/:userId`  
**Descripción:** Obtiene el historial de mensajes con un usuario  
**Autenticación:** ✅ Requerida

**Parámetros Query:**
| Parámetro | Descripción |
|-----------|-------------|
| page | Página (default: 1) |
| limit | Mensajes por página (default: 20) |

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "sender_id": "uuid",
        "content": "Hola, ¿aún disponible?",
        "is_read": true,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15
    }
  }
}
```

---

### Obtener Conversaciones
**Método:** `GET`  
**Ruta:** `/messages/conversations`  
**Descripción:** Obtiene lista de todas las conversaciones del usuario  
**Autenticación:** ✅ Requerida

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "user_id": "uuid",
        "user_name": "Juan Pérez",
        "avatar_url": "https://...",
        "last_message": "¿Cuál es el precio final?",
        "last_message_at": "2024-01-15T14:20:00Z",
        "unread_count": 2
      }
    ]
  }
}
```

---

## ❤️ Favoritos

### Agregar Favorito
**Método:** `POST`  
**Ruta:** `/favorites`  
**Descripción:** Agrega un producto a favoritos  
**Autenticación:** ✅ Requerida

**Parámetros de Entrada:**
```json
{
  "product_id": "uuid"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Agregado a favoritos"
}
```

---

### Obtener Favoritos
**Método:** `GET`  
**Ruta:** `/favorites`  
**Descripción:** Obtiene lista de productos favoritos  
**Autenticación:** ✅ Requerida

**Parámetros Query:**
| Parámetro | Descripción |
|-----------|-------------|
| page | Página (default: 1) |
| limit | Por página (default: 20) |

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "title": "Laptop Dell",
        "price": 1299.99,
        "image_url": "https://...",
        "added_at": "2024-01-10T08:00:00Z"
      }
    ]
  }
}
```

---

### Eliminar Favorito
**Método:** `DELETE`  
**Ruta:** `/favorites/:productId`  
**Descripción:** Elimina un producto de favoritos  
**Autenticación:** ✅ Requerida

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Eliminado de favoritos"
}
```

---

## 🏷️ Categorías

### Obtener Categorías
**Método:** `GET`  
**Ruta:** `/categories`  
**Descripción:** Obtiene todas las categorías disponibles  
**Autenticación:** ❌ No requerida

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "electronics",
        "name": "Electrónica",
        "icon": "laptop",
        "product_count": 1250
      },
      {
        "id": "clothing",
        "name": "Ropa",
        "icon": "shopping-bag",
        "product_count": 2840
      }
    ]
  }
}
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **200** | OK | Solicitud exitosa |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Respuesta exitosa sin contenido |
| **400** | Bad Request | Parámetros inválidos |
| **401** | Unauthorized | No autenticado o token inválido |
| **403** | Forbidden | No autorizado para acceder |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: producto ya en favoritos) |
| **500** | Server Error | Error del servidor |

---

## 💻 Ejemplos de Uso

### JavaScript/Fetch API

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Obtener perfil
const getProfile = async (token) => {
  const response = await fetch('/api/users/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Agregar al carrito
const addToCart = async (productId, quantity, token) => {
  const response = await fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ product_id: productId, quantity })
  });
  return response.json();
};
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Listar productos
const getProducts = (filters = {}) => {
  return api.get('/products', { params: filters });
};

// Agregar al carrito
const addToCart = (productId, quantity) => {
  return api.post('/cart/add', { product_id: productId, quantity });
};

// Crear orden
const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};
```

---

**Última actualización:** Abril 2026  
**Versión API:** v1  
**Estado:** Documentado y Funcional ✅
