# 🚀 Guía de Instalación - MercadoLibre Clone

## 📑 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Local](#instalación-local)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Instalación con Docker](#instalación-con-docker)
5. [Verificación de Instalación](#verificación-de-instalación)
6. [Solución de Problemas](#solución-de-problemas)
7. [Próximos Pasos](#próximos-pasos)

---

## 🔧 Requisitos Previos

### Software Necesario

**1. Node.js y npm**
- **Versión recomendada:** Node.js 18.0.0 o superior
- **Descargar:** [nodejs.org](https://nodejs.org)

Verificar instalación:
```bash
node --version
npm --version
```

**2. Git**
- **Versión recomendada:** 2.30.0 o superior
- **Descargar:** [git-scm.com](https://git-scm.com)

Verificar instalación:
```bash
git --version
```

**3. Cuenta NeonDB**
- **Crear cuenta:** [neon.tech](https://neon.tech)
- Crear un proyecto PostgreSQL
- Obtener Connection String

**4. Editor de Código** (opcional, pero recomendado)
- [Visual Studio Code](https://code.visualstudio.com)
- [WebStorm](https://www.jetbrains.com/webstorm/)
- Cualquier editor de tu preferencia

**5. Navegador Web Moderno**
- Chrome, Firefox, Safari o Edge (versiones recientes)

### Requisitos de Sistema

| Requisito | Mínimo | Recomendado |
|-----------|--------|------------|
| RAM | 2 GB | 8 GB |
| Espacio en Disco | 500 MB | 2 GB |
| Procesador | Dual Core | Intel i5 / AMD Ryzen 5 |
| OS | Windows 7+ / macOS / Linux | Windows 10+ / macOS 10.15+ |
| Conexión Internet | Requerida | Banda ancha |

---

## 💻 Instalación Local

### Paso 1: Clonar el Repositorio

```bash
# Usando HTTPS (recomendado para empezar)
git clone https://github.com/tu-usuario/mercadolibre-clone.git

# O usando SSH (si tienes SSH configurado)
git clone git@github.com:tu-usuario/mercadolibre-clone.git

# Navegar al directorio
cd mercadolibre-clone
```

### Paso 2: Instalar Dependencias

```bash
# Usando npm
npm install

# O usando yarn (si lo prefieres)
yarn install

# O usando pnpm
pnpm install
```

**Esto puede tomar 3-5 minutos** dependiendo de tu velocidad de Internet.

**Verifica que se instaló correctamente:**
```bash
npm list
```

### Paso 3: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# O en Windows
copy .env.example .env.local
```

**Editar `.env.local` con tu editor preferido:**

```env
# Configuración General
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Base de Datos - NeonDB (PostgreSQL Serverless)
# Obtener de https://console.neon.tech
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Autenticación
JWT_SECRET=tu-secreto-jwt-muy-seguro-cambiar-en-produccion
NEXT_PUBLIC_JWT_EXPIRY=24h

# APIs Externas (si aplica)
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Email (si aplica)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-app

# Logging
DEBUG=false
```

**Notas Importantes:**
- 🔐 Nunca compartas tu `.env.local`
- 🔑 Genera un `JWT_SECRET` único y seguro
- 📝 Incluye `.env.local` en `.gitignore`
- 🌐 La DATABASE_URL debe incluir `?sslmode=require` para NeonDB
- 🔗 Obtén la CONNECTION STRING de [neon.tech](https://neon.tech)

### Paso 4: Configurar Base de Datos (NeonDB + Prisma)

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Ver base de datos en interfaz gráfica (opcional)
npx prisma studio
```

**Verificar que se ejecutó correctamente:**
```bash
# Debería mostrar las tablas creadas
npx prisma db pull
```

### Paso 5: Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# O con yarn
yarn dev

# O con pnpm
pnpm dev
```

**Esperado:**
```
ready - started server on 0.0.0.0:3000
ready - compiled client and server successfully (1.23 s)
```

### Paso 6: Acceder a la Aplicación

1. Abre tu navegador
2. Navega a: **http://localhost:3000**
3. Deberías ver la página de inicio

**Primera vez que accedes:**
- La página puede tardar un poco en cargar
- Es normal que los estilos tarden un segundo en aplicarse

---

## 🔐 Configuración del Entorno

### Estructura de Archivos .env

```
.env.local (DESARROLLO)
├── Configuración de servidor local
├── URLs de APIs en desarrollo
└── Credenciales de desarrollo

.env (PRODUCCIÓN)
├── URLs de APIs en producción
├── Claves de autenticación
└── Configuraciones de seguridad
```

### Variables Importantes

#### Desarrollo (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
DEBUG=true
```

#### Producción (`.env`)
```env
NEXT_PUBLIC_API_URL=https://tudominio.com
NODE_ENV=production
DEBUG=false
```

---

## 🌐 Conexión a NeonDB

### Crear un Proyecto en NeonDB

1. **Registrarse en [neon.tech](https://neon.tech)**
2. **Crear un nuevo proyecto:**
   - Click en "Create a new project"
   - Seleccionar región
   - Esperar a que se cree la base de datos

3. **Obtener Connection String:**
   - Ir a Dashboard
   - Seleccionar tu proyecto
   - Copy la **Connection string**
   - Guardar en `.env.local` como `DATABASE_URL`

### Formato de Connection String

```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**Componentes:**
- `user`: Usuario de la BD (default: `neondb_owner`)
- `password`: Contraseña (cópiala del dashboard)
- `host`: Host (ej: `ep-xxxxx.us-east-1.aws.neon.tech`)
- `dbname`: Nombre de BD (default: `neondb`)

### Usar Branching de NeonDB (Desarrollo)

NeonDB permite crear branches automáticas para desarrollo:

```bash
# Ver ramas disponibles
neon branches --project-id <project-id>

# Crear rama de desarrollo
neon branches create dev --project-id <project-id>

# Usar rama diferente
DATABASE_URL="postgresql://user:password@dev-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 🐳 Instalación con Docker (Alternativa)

### Requisito Previo: Instalar Docker

- **Descargar:** [docker.com](https://www.docker.com/products/docker-desktop)
- **Verificar:** `docker --version`

### Paso 1: Crear Dockerfile

Si no existe, crear `Dockerfile` en la raíz:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Ejecutar migraciones
RUN npx prisma generate

# Construir aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Iniciar aplicación
CMD ["npm", "start"]
```

### Paso 2: Crear docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:3000
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - .:/app
      - /app/node_modules
```

### Paso 3: Ejecutar con Docker

```bash
# Construir imagen
docker build -t mercadolibre-clone .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env.local mercadolibre-clone

# O usando docker-compose
docker-compose up

# Ejecutar en background
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down
```

---

## ✅ Verificación de Instalación

### Verificar Dependencias Instaladas

```bash
# Verificar Node modules
npm list

# Verificar versión de Next.js
npm list next

# Verificar que todo está ok
npm audit
```

### Ejecutar Tests (si aplica)

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:coverage
```

### Verificar Build

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

---

## 🐛 Solución de Problemas

### Problema: "npm: command not found"

**Solución:**
```bash
# Reinstalar Node.js desde nodejs.org
# O usar gestor de versiones como nvm

# En macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

---

### Problema: "Port 3000 already in use"

**Solución:**

**En Windows:**
```bash
# Encontrar proceso usando puerto 3000
netstat -ano | findstr :3000

# Terminar proceso (reemplazar PID)
taskkill /PID <PID> /F

# O usar diferente puerto
PORT=3001 npm run dev
```

**En macOS/Linux:**
```bash
# Encontrar y matar proceso
lsof -ti:3000 | xargs kill -9

# O usar diferente puerto
PORT=3001 npm run dev
```

---

### Problema: "Module not found" o errores de dependencias

**Solución:**

```bash
# Limpiar instalación
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# En Windows
rmdir /s node_modules
del package-lock.json
npm install
```

---

### Problema: Variables de entorno no se cargan

**Solución:**

```bash
# Asegúrate de que el archivo sea .env.local
# No: .env.local.example o .env (desarrollo)

# Reinicia el servidor de desarrollo
# Presiona Ctrl+C
# Ejecuta npm run dev nuevamente

# Verifica que las variables sean públicas
# Las que comienzan con NEXT_PUBLIC_ son accesibles en cliente
```

---

### Problema: "Cannot find module 'typescript'"

**Solución:**

```bash
# Instalar TypeScript globalmente
npm install -g typescript

# O localmente en el proyecto
npm install --save-dev typescript

# Regenerar configuración
npx tsc --init
```

---

### Problema: Git: "fatal: not a git repository"

**Solución:**

```bash
# Reinicializar git
git init

# Agregar remoto
git remote add origin https://github.com/tu-usuario/repo.git

# Pullear cambios
git pull origin main
```

---

## 📚 Próximos Pasos

### 1. Familiarizarse con la Estructura

```bash
# Ver estructura del proyecto
tree -L 2

# O con powershell en Windows
Get-ChildItem -Path . -Recurse -Depth 2
```

Consultar: [ESTRUCTURA.md](./ESTRUCTURA.md)

---

### 2. Leer Documentación Principal

- 📖 [README.md](./README.md) - Overview del proyecto
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema
- 🗄️ [DATABASE.md](./DATABASE.md) - Diseño de BD
- 🔌 [API.md](./API.md) - Documentación de APIs

---

### 3. Crear tu Primer Componente

```bash
# Navegar a components
cd app/components

# Crear nuevo componente
touch MyComponent.tsx
```

---

### 4. Configurar Git

```bash
# Configurar usuario
git config user.name "Tu Nombre"
git config user.email "tu-email@example.com"

# O globalmente
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@example.com"

# Crear rama de desarrollo
git checkout -b develop
git push -u origin develop
```

---

### 5. Deploying a Producción

#### Vercel (Recomendado para Next.js)

```bash
# Instalar CLI de Vercel
npm i -g vercel

# Deployar
vercel

# O conectar GitHub y deployar automáticamente
```

#### Heroku

```bash
# Crear archivo Procfile
echo "web: npm start" > Procfile

# Deploy
heroku login
heroku create mercadolibre-clone
git push heroku main
```

#### Manual (Linux/VPS)

```bash
# En servidor
npm install --production
npm run build
npm start
```

---

## 📋 Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] Repositorio clonado
- [ ] `npm install` completado
- [ ] `.env.local` creado
- [ ] `npm run dev` funcionando
- [ ] http://localhost:3000 accesible
- [ ] Página de inicio visible
- [ ] Consola del navegador sin errores críticos
- [ ] Variables de entorno cargadas

---

## 📞 Soporte

Si encuentras problemas:

1. Consulta [DEVELOPMENT.md](./DEVELOPMENT.md) para tips de desarrollo
2. Revisa [ARCHITECTURE.md](./ARCHITECTURE.md) para entender la estructura
3. Abre un [Issue en GitHub](https://github.com/tu-usuario/repo/issues)
4. Consulta la [Documentación de Next.js](https://nextjs.org/docs)

---

**Última actualización:** Abril 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para Instalar
