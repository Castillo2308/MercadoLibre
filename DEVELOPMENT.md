# Guía de Desarrollo - MercadoLibre Clone

## 🚀 Comenzar

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn

### Pasos Iniciales

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Acceder a la aplicación:**
   - Abre `http://localhost:3000` en tu navegador

## 📂 Estructura de Carpetas

```
mercadolibre/
├── app/                    # Páginas y rutas de Next.js App Router
├── components/             # Componentes reutilizables
├── hooks/                  # Hooks personalizados de React
├── lib/                    # Funciones auxiliares y constantes
├── types/                  # Definiciones de TypeScript
├── public/                 # Archivos estáticos
└── styles/                 # Estilos CSS
```

## 🏗️ Arquitectura

### App Router (Next.js 13+)
La aplicación utiliza el nuevo App Router de Next.js:
- `app/page.tsx` - Página de inicio
- `app/auth/login/page.tsx` - Página de login
- `app/auth/register/page.tsx` - Página de registro
- `app/products/[id]/page.tsx` - Detalles del producto
- etc.

### Estado Global
Para estado global, se puede implementar con:
- **Zustand**: Store management (ya instalado)
- **Context API**: Para estados más simples
- **Props drilling**: Para componentes cercanos

Ejemplo de estructura con Zustand:
```typescript
// stores/cartStore.ts
import create from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}));
```

## 🎨 Diseño y Estilos

### Tailwind CSS
La aplicación utiliza **Tailwind CSS** para estilos. Configuración:
- Tema en `tailwind.config.js`
- Colores principales:
  - Primario (Amarillo): `#FFE600`
  - Secundario (Azul): `#3483FA`

### Componentes

#### Crear un nuevo componente:
```typescript
// components/ProductCard.tsx
'use client';

import { FC } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
}

const ProductCard: FC<ProductCardProps> = ({ id, name, price }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
};

export default ProductCard;
```

## 📝 Pautas de Código

### TypeScript
- Siempre usar tipos explícitos
- Evitar `any`
- Usar interfaces para Props

### Componentes
- Usar componentes funcionales
- Marcar componentes cliente con `'use client'`
- Memoizar cuando sea necesario con `React.memo`

### Archivos
- Nombres en PascalCase para componentes
- Nombres en camelCase para funciones y variables
- Nombres en kebab-case para archivos

## 🔌 Integración con Backend

### Configuración de API

En `lib/constants.ts`:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
  },
  // ...
};
```

### Llamadas API con Axios

```typescript
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/constants';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS.LIST);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
```

## 🧪 Testing

Para añadir tests unitarios:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Crear archivo de test:
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

describe('ProductCard', () => {
  it('should render product name', () => {
    render(<ProductCard id="1" name="Test Product" price={99.99} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

## 📦 Compilación y Despliegue

### Compilar para Producción
```bash
npm run build
npm start
```

### Despliegue en Vercel
1. Push código a GitHub
2. Conectar repositorio en vercel.com
3. Vercel automáticamente deployará

## 🐛 Debugging

### Debug en Navegador
```typescript
console.log('Debug:', variable);
console.warn('Advertencia:', message);
console.error('Error:', error);
```

### Debug en VS Code
Agregar a `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## 📚 Próximas Implementaciones

1. **Backend API**
   - Node.js + Express
   - Base de datos (MongoDB/PostgreSQL)
   - Autenticación con JWT

2. **Características Avanzadas**
   - Notificaciones en tiempo real (Socket.io)
   - Pasarela de pagos
   - Búsqueda con Elasticsearch
   - CDN para imágenes

3. **Optimización**
   - Image Optimization
   - Code Splitting
   - SEO Meta Tags
   - PWA Features

## 🤝 Contribución

Pasos para contribuir:
1. Crear rama: `git checkout -b feature/nueva-feature`
2. Hacer cambios
3. Commit: `git commit -m 'Agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Crear Pull Request

## 📝 Commits

Usar formato convencional:
```
feat: agregar sistema de favoritos
fix: corregir bug en carrito
docs: actualizar README
style: formatear código
refactor: reorganizar componentes
test: agregar tests unitarios
chore: actualizar dependencias
```

## 🆘 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

**¡Feliz desarrollo!** 🚀
