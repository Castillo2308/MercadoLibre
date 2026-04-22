# MercadoLibre Clone - Aplicación React

Una aplicación completa tipo MercadoLibre construida con **Next.js** y **React**, que incluye todas las funcionalidades principales de un marketplace.

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

- **Framework**: Next.js 14
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS
- **Iconos**: Lucide React
- **Estado**: Zustand (preparado para futuras implementaciones)
- **Package Manager**: npm

## 📦 Instalación

1. **Navega al directorio del proyecto**:
   ```bash
   cd mercadolibre
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abre tu navegador** y ve a:
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
mercadolibre/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── messages/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── sell/
│   │   └── page.tsx
│   ├── favorites/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── tailwind.config.js
├── tsconfig.json
├── next.config.ts
├── postcss.config.js
└── package.json
```

## 🎨 Colores Principales

- **Amarillo (Primario)**: `#FFE600` - Color principal de MercadoLibre
- **Amarillo Oscuro**: `#FFCF00` - Hover y variantes
- **Azul (Secundario)**: `#3483FA` - Botones y acciones

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm build

# Iniciar servidor de producción
npm start

# Ejecutar linter
npm run lint
```

## 📝 Páginas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/auth/login` | Iniciar sesión |
| `/auth/register` | Crear cuenta |
| `/products/[id]` | Detalles del producto |
| `/messages` | Sistema de mensajería |
| `/profile` | Perfil del usuario |
| `/cart` | Carrito de compras |
| `/sell` | Publicar producto |
| `/favorites` | Productos favoritos |

## 🔄 Próximas Funcionalidades a Implementar

- [ ] Backend con Node.js/Express
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Autenticación real con JWT
- [ ] Pasarela de pagos (Stripe/PayPal)
- [ ] Sistema de notificaciones en tiempo real (Socket.io)
- [ ] Búsqueda y filtros avanzados
- [ ] Sistema de calificaciones y reseñas
- [ ] Rastreo de pedidos
- [ ] Panel de administrador
- [ ] Optimización SEO

## 📖 Características Adicionales

### Responsive Design
La aplicación está completamente optimizada para dispositivos móviles, tablets y computadoras de escritorio.

### Validación de Formularios
Todos los formularios incluyen validación básica del lado del cliente para mejorar la experiencia del usuario.

### UI/UX Intuitiva
Interfaz limpia y fácil de usar, similar a MercadoLibre, con navegación clara.

## 🤝 Contribuir

Este es un proyecto de aprendizaje. Siéntete libre de modificar, mejorar y agregar nuevas funcionalidades.

## 📄 Licencia

Proyecto educativo - Libre de usar para aprendizaje y desarrollo personal.

## 👤 Autor

Proyecto desarrollado como parte del curso final de programación.

---

**¡Disfruta construyendo con MercadoLibre Clone!** 🚀
