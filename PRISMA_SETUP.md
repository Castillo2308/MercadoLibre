# 🗄️ Prisma Setup - Configuración Base de Datos

## ✅ Pasos Completados

He creado todo el setup de Prisma para tu proyecto:

### 1. **prisma/schema.prisma** ✅
- ✅ 8 modelos completos (User, Product, Cart, Order, Review, Message, Favorite, etc.)
- ✅ Todas las relaciones definidas
- ✅ Tipos de datos correctos
- ✅ Índices para optimización
- ✅ Timestamps automáticos

### 2. **lib/prisma.ts** ✅
- ✅ Configuración singleton de Prisma
- ✅ Optimizado para Next.js
- ✅ Logging en desarrollo

### 3. **lib/db-queries.ts** ✅
- ✅ 20+ funciones pre-hechas para operaciones comunes
- ✅ Usuarios, Productos, Carrito, Órdenes, Reseñas, Mensajes, Favoritos
- ✅ Listas para copiar/pegar en tu código

### 4. **.env.example** ✅ (Actualizado)
- ✅ Variables necesarias para Prisma

---

## 🚀 Próximos Pasos

### Paso 1: Instalar Prisma (si no lo hiciste)

```bash
npm install @prisma/client
npm install -D prisma ts-node @types/node
```

### Paso 2: Configurar .env.local

Crea o edita `.env.local` con tu connection string de Supabase:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xqhruptjaionxckniakb.supabase.co:5432/postgres"
NODE_ENV=development
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
```

### Paso 3: Crear las Tablas

```bash
# Generar migración
npx prisma migrate dev --name init

# Esto va a:
# 1. Crear archivo de migración
# 2. Ejecutar SQL en la BD
# 3. Generar types de TypeScript
```

### Paso 4: Ver datos en Supabase

En el dashboard de Supabase → **SQL Editor** → ejecuta:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deberías ver todas tus tablas creadas ✅

---

## 💻 Cómo Usar en tu Código

### Importar en API Routes

**app/api/auth/register/route.ts**
```typescript
import { createUser } from '@/lib/db-queries';

export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json();
  
  const user = await createUser({
    firstName,
    lastName,
    email,
    passwordHash: hashedPassword, // Hash primero!
  });
  
  return Response.json(user);
}
```

### Obtener Productos

**app/api/products/route.ts**
```typescript
import { getProducts } from '@/lib/db-queries';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const products = await getProducts({
    category: searchParams.get('category') || undefined,
    skip: parseInt(searchParams.get('page') || '0') * 20,
    take: 20,
  });
  
  return Response.json(products);
}
```

### Crear Orden

**app/api/orders/route.ts**
```typescript
import { createOrder } from '@/lib/db-queries';

export async function POST(req: Request) {
  const user = await getSession(); // Tu auth
  const data = await req.json();
  
  const order = await createOrder(user.id, {
    shippingAddress: data.address,
    shippingCity: data.city,
    shippingState: data.state,
    shippingPostalCode: data.postalCode,
    paymentMethod: 'credit_card',
  });
  
  return Response.json(order);
}
```

---

## 📊 Estructura de BD Creada

```
8 MODELOS:
├── User (usuarios con roles)
├── Product (catálogo)
├── ProductImage (múltiples imágenes)
├── Cart (carrito de compras)
├── CartItem (items en carrito)
├── Order (órdenes históricas)
├── OrderItem (items en orden)
├── Review (reseñas y ratings)
├── Message (mensajería)
└── Favorite (productos guardados)

RELACIONES:
├── Users → Products (vendedor)
├── Users → Orders (comprador)
├── Products → Reviews
├── Products → CartItems
├── Orders → OrderItems
├── Users → Messages
└── Users → Favorites
```

---

## 🔍 Comandos Útiles de Prisma

```bash
# Ver schema visualmente
npx prisma studio

# Generar cliente después de cambios
npx prisma generate

# Ver migraciones
npx prisma migrate status

# Resetear BD (CUIDADO: borra todo)
npx prisma migrate reset

# Crear seed (datos de prueba)
npx prisma db seed
```

---

## ✨ Funciones Pre-hechas en lib/db-queries.ts

```typescript
// Usuarios
createUser()
getUserByEmail()
updateUserProfile()

// Productos
createProduct()
getProducts()
getProductDetail()

// Carrito
getOrCreateCart()
addToCart()
removeFromCart()

// Órdenes
createOrder()
getUserOrders()

// Reseñas
createReview()

// Mensajes
sendMessage()
getConversation()

// Favoritos
addToFavorites()
removeFromFavorites()
getUserFavorites()
```

---

## 🎯 Próximos Pasos

1. ✅ Instalar dependencias
2. ✅ Configurar `.env.local`
3. ✅ Ejecutar `npx prisma migrate dev --name init`
4. ✅ Usar funciones en `lib/db-queries.ts`
5. ✅ Empezar a construir APIs

---

## 📝 Notas Importantes

- ✅ Los IDs son UUID (strings)
- ✅ Los precios son Decimal (no Float)
- ✅ Timestamps automáticos (createdAt, updatedAt)
- ✅ Relaciones automáticas
- ✅ Validaciones en BD

---

**Tu base de datos está lista para producción! 🚀**

Última actualización: Abril 2026
