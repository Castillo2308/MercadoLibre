# 🚀 INSTALACIÓN Y SETUP FINAL

## ✅ 3 ARCHIVOS CREADOS

### 1. **prisma/schema.prisma**
- 8 modelos (User, Product, Order, etc.)
- Todas las relaciones
- Listo para ejecutar

### 2. **lib/prisma.ts**
- Singleton configurado
- Listo para usar

### 3. **lib/db-queries.ts**
- 20+ funciones pre-hechas
- Copia/pega en tu código

---

## ▶️ EJECUTA EN TERMINAL (Orden Importante)

### Paso 1: Instalar Prisma
```bash
npm install @prisma/client
npm install -D prisma ts-node @types/node
```

### Paso 2: Crear .env.local
```bash
# Copia el contenido de .env.example a .env.local
# Y reemplaza [PASSWORD] con tu contraseña de Supabase
```

**Contenido `env.local`:**
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@db.xqhruptjaionxckniakb.supabase.co:5432/postgres"
NODE_ENV=development
JWT_SECRET=super-secreto-cambiar-en-produccion
```

### Paso 3: Crear Migraciones
```bash
npx prisma migrate dev --name init
```

**Esto va a:**
1. ✅ Crear las 8 tablas
2. ✅ Generar tipos TypeScript
3. ✅ Conectar a Supabase

### Paso 4: Verificar en Supabase
1. Ve a tu dashboard: https://app.supabase.com
2. Abre tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Deberías ver:**
- ✅ _prisma_migrations
- ✅ User
- ✅ Product
- ✅ ProductImage
- ✅ Cart
- ✅ CartItem
- ✅ Order
- ✅ OrderItem
- ✅ Review
- ✅ Message
- ✅ Favorite

---

## 💡 USAR EN TU CÓDIGO

### Ejemplo 1: Crear Usuario en API Route

```typescript
// app/api/auth/register/route.ts
import { createUser } from '@/lib/db-queries';

export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json();
  
  const user = await createUser({
    firstName,
    lastName,
    email,
    passwordHash: hashedPassword,
  });
  
  return Response.json(user);
}
```

### Ejemplo 2: Listar Productos

```typescript
// app/api/products/route.ts
import { getProducts } from '@/lib/db-queries';

export async function GET(req: Request) {
  const products = await getProducts({
    category: 'electronics',
    take: 20,
  });
  
  return Response.json(products);
}
```

### Ejemplo 3: Agregar al Carrito

```typescript
// app/api/cart/add/route.ts
import { addToCart } from '@/lib/db-queries';

export async function POST(req: Request) {
  const { userId, productId, quantity } = await req.json();
  
  const item = await addToCart(userId, productId, quantity);
  
  return Response.json(item);
}
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Ejecutar Paso 1-4 arriba
2. ✅ Usar `lib/db-queries.ts` en tus APIs
3. ✅ Crear más queries según necesites
4. ✅ A producción cuando esté listo

---

## 📞 TROUBLESHOOTING

### Error: "Can't reach database"
```
→ Verifica DATABASE_URL en .env.local
→ Copia/pega exacto de Supabase
```

### Error: "Prisma client not found"
```bash
npx prisma generate
```

### Error: "table already exists"
```bash
# Resetear todo (BORRA DATOS!)
npx prisma migrate reset
```

---

## 📚 PRÓXIMA DOCUMENTACIÓN

Ver: [PRISMA_SETUP.md](./PRISMA_SETUP.md)

---

**¡TODO LISTO PARA EMPEZAR! 🚀**
