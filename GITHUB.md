# 📌 GUÍA GITHUB - Publicar el Proyecto

## 🚀 Pasos para Crear el Repositorio en GitHub

### 1. Crear Repositorio en GitHub

**En el navegador:**

1. Ve a [github.com](https://github.com)
2. Inicia sesión en tu cuenta
3. Haz clic en el **+** (arriba a la derecha)
4. Selecciona **New repository**
5. Completa los datos:

```
Repository name: mercadolibre-clone
Description: Plataforma de e-commerce estilo MercadoLibre con Next.js y React
Public / Private: Public (para entrega académica)
Add README: ❌ NO (ya lo tenemos)
Add .gitignore: ✅ SÍ (Node)
Choose a license: MIT
```

6. Click en **Create repository**

---

### 2. Conectar tu Proyecto Local a GitHub

**En tu terminal/PowerShell:**

```bash
# Navegar al proyecto
cd mercadolibre-clone

# Inicializar git (si no lo has hecho)
git init

# Agregar remoto (reemplaza tu-usuario)
git remote add origin https://github.com/tu-usuario/mercadolibre-clone.git

# Verificar remoto
git remote -v
```

---

### 3. Hacer Commit Inicial

```bash
# Ver estado
git status

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit: MercadoLibre Clone - Plataforma e-commerce con Next.js"

# Subir a GitHub
git branch -M main
git push -u origin main
```

---

### 4. Configurar Protecciones de Rama

**En GitHub:**

1. Ve a tu repositorio
2. **Settings** → **Branches**
3. Click **Add rule** bajo "Branch protection rules"
4. Pattern name: `main`
5. Habilita:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

---

### 5. Agregar Documentación al README

**Tu README.md ya contiene:**
- ✅ Descripción general
- ✅ Objetivo del proyecto  
- ✅ Tecnologías
- ✅ Características
- ✅ Instalación
- ✅ Estructura
- ✅ Documentación complementaria

---

## 📊 Estructura Final del Repositorio

```
mercadolibre-clone/
├── 📝 README.md                 ← Documento principal ✅
├── 📝 ARCHITECTURE.md           ← Arquitectura sistema ✅
├── 📝 DATABASE.md               ← Diseño BD ✅
├── 📝 API.md                    ← Documentación APIs ✅
├── 📝 INSTALLATION.md           ← Guía instalación ✅
├── 📝 FUTURE_IMPROVEMENTS.md    ← Mejoras futuras ✅
├── 📝 DEVELOPMENT.md            ← Guía desarrollo
├── 📝 .gitignore
├── 📝 .env.example
├── package.json
├── tsconfig.json
├── next.config.js
├── app/
├── components/
├── context/
├── hooks/
├── lib/
├── types/
└── ... (resto de archivos)
```

---

## ✅ Checklist de GitHub

- [ ] Repositorio creado en GitHub
- [ ] Remoto agregado localmente
- [ ] Commits iniciales pusheados
- [ ] Rama `main` protegida
- [ ] README visible en GitHub
- [ ] Todos los .md archivos en la raíz
- [ ] .gitignore configurado
- [ ] Descripción del repositorio completada
- [ ] Topics agregados (nextjs, react, ecommerce)
- [ ] Licencia MIT configurada

---

## 🏷️ Topics Recomendados para GitHub

En **Settings → About**, agrega estos topics:

```
nextjs
react
typescript
ecommerce
marketplace
tailwindcss
web-development
educational-project
```

---

## 🔗 Badges para el README

Puedes agregar badges para mayor profesionalismo:

```markdown
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)
![Node](https://img.shields.io/badge/node-18+-green)
![Next.js](https://img.shields.io/badge/next.js-14-black)
![React](https://img.shields.io/badge/react-18-blue)
```

---

## 📤 Comandos Útiles de Git

```bash
# Ver historial
git log --oneline

# Ver cambios sin stagear
git diff

# Ver cambios stage ados
git diff --staged

# Crear rama nueva
git checkout -b feature/nueva-funcionalidad

# Cambiar a rama
git checkout main

# Fusionar rama
git merge feature/nueva-funcionalidad

# Ver ramas
git branch -a

# Stash cambios
git stash

# Ver stashes
git stash list

# Aplicar stash
git stash pop
```

---

## 🚀 GitHub Actions (CI/CD Automático)

Crear archivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Build
      run: npm run build
    
    - name: Run tests
      run: npm run test
```

---

## 📱 Usar Desde GitHub

### Clonar en otra máquina

```bash
git clone https://github.com/tu-usuario/mercadolibre-clone.git
cd mercadolibre-clone
npm install
npm run dev
```

### Pull Request (Colaboración)

```bash
# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commit
git add .
git commit -m "Agregar nueva funcionalidad"

# Subir rama
git push origin feature/nueva-funcionalidad

# Abrir PR en GitHub UI
```

---

## 🎓 Para Entrega Académica

### Información Importante

1. **Incluye en la descripción del repo:**
   - Nombre del grupo
   - Integrantes del equipo
   - Institución educativa
   - Fecha del proyecto

2. **Agrega un archivo `TEAM.md` con:**
   ```markdown
   # Integrantes del Equipo
   
   - Nombre 1 - GitHub: @usuario1
   - Nombre 2 - GitHub: @usuario2
   - Nombre 3 - GitHub: @usuario3
   
   ## Roles
   - Líder técnico: Nombre 1
   - Full Stack: Nombre 2
   - Frontend: Nombre 3
   ```

3. **Commit Message con Convención:**
   ```
   feat: agregar sistema de notificaciones
   fix: corregir validación de login
   docs: actualizar README con instrucciones
   refactor: mejorar estructura de componentes
   style: formatear código según ESLint
   ```

---

## 📊 Métricas de GitHub

GitHub muestra automáticamente:
- **Contribuciones:** Gráfico de actividad
- **Commits:** Historial completo
- **Lenguajes:** Porcentaje de código por lenguaje
- **Releases:** Versiones publicadas

---

## 🔐 Secretos y Variables

Para secrets (API keys, etc.):

1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Agregar:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `STRIPE_API_KEY`

Usar en workflows:
```yaml
- run: npm run build
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 📈 Release y Versioning

**Crear primera release:**

```bash
# Tag local
git tag -a v1.0.0 -m "Versión 1.0.0 - MVP"

# Subir tag
git push origin v1.0.0
```

En GitHub, ve a **Releases** y crea una release con:
- Tag: v1.0.0
- Título: MercadoLibre Clone v1.0.0
- Descripción: Changelog

---

## 🎯 Links Útiles

- **GitHub:** https://github.com/tu-usuario/mercadolibre-clone
- **Documentación Local:** Ver archivos .md en el repo
- **GitHub Docs:** https://docs.github.com
- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev

---

## ⚠️ Cosas Importantes

### NO Subas a GitHub

```
❌ .env.local (secrets)
❌ node_modules/
❌ .next/build
❌ dist/
❌ Archivos personales
❌ Contraseñas o tokens
```

Asegúrate que `.gitignore` incluya:
```
node_modules/
.next/
.env.local
.env.*.local
dist/
build/
.DS_Store
```

---

## 🎓 Presentación Final

**Prepare esto para la defensa:**

1. **Demo en vivo:**
   - Usuario registrándose
   - Navegando productos
   - Agregando al carrito
   - Creando orden

2. **Mostrar documentación:**
   - Architecture.md
   - Database.md
   - API.md

3. **Explicar tecnologías:**
   - Next.js y por qué
   - TypeScript y beneficios
   - Tailwind CSS para estilos
   - Zustand para estado

4. **Mostrar GitHub:**
   - Commits y colaboración
   - Ramas y PRs
   - Issues
   - Documentación

---

## 📞 Soporte

Si tienes problemas con Git/GitHub:

```bash
# Verificar configuración
git config --list

# Reconfigurar usuario
git config user.name "Tu Nombre"
git config user.email "tu-email@example.com"

# Ayuda de Git
git help <comando>

# Ejemplo: ayuda de commit
git help commit
```

---

**Última actualización:** Abril 2026  
**Versión:** 1.0.0  
**Listo para entrega académica ✅**
