# Frontend - Sistema de Ventas de Pizzas

Frontend profesional construido con React 17, TypeScript, TSX y SCSS para el sistema de gestión de ventas de pizzas.

## 🚀 Características

- ✅ React 17 con TypeScript
- ✅ Arquitectura modular y escalable
- ✅ Estilos SCSS modulares
- ✅ React Router v6
- ✅ Hooks personalizados
- ✅ Cliente HTTP con fetch nativo
- ✅ Componentes UI reutilizables
- ✅ TypeScript estricto
- ✅ Diseño responsive y profesional

## 📦 Instalación

```bash
cd frontend
npm install
```

## ⚙️ Configuración

Crear archivo `.env` en la raíz de `frontend/`:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## 🚀 Ejecutar

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3001`

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/                    # Servicios HTTP
│   │   ├── httpClient.ts
│   │   ├── productApi.ts
│   │   ├── ingredientApi.ts
│   │   ├── batchApi.ts
│   │   └── dashboardApi.ts
│   ├── components/            # Componentes reutilizables
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Table.tsx
│   │       └── Modal.tsx
│   ├── hooks/                 # Hooks personalizados
│   │   ├── useProducts.ts
│   │   ├── useIngredients.ts
│   │   └── useBatches.ts
│   ├── pages/                 # Páginas principales
│   │   ├── Home.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductCreate.tsx
│   │   ├── IngredientList.tsx
│   │   ├── IngredientCreate.tsx
│   │   ├── BatchList.tsx
│   │   └── BatchCreate.tsx
│   ├── styles/                # Estilos globales
│   │   ├── globals.scss
│   │   └── variables.scss
│   ├── types/                 # Tipos TypeScript
│   │   ├── product.ts
│   │   ├── ingredient.ts
│   │   ├── batch.ts
│   │   └── common.ts
│   ├── App.tsx
│   ├── App.scss
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## 🎨 Componentes UI

### Button
Botón reutilizable con variantes: `primary`, `secondary`, `danger`, `success`

### Input
Campo de entrada con validación y mensajes de error

### Card
Tarjeta contenedora con título opcional

### Table
Tabla genérica con tipado TypeScript

### Modal
Modal/diálogo reutilizable

## 🔌 APIs

Todas las llamadas al backend están centralizadas en la carpeta `api/`:

- **productApi**: CRUD de productos
- **ingredientApi**: CRUD de ingredientes
- **batchApi**: Gestión de ventas, clientes y métodos de pago
- **dashboardApi**: Estadísticas y reportes

## 🎯 Funcionalidades

### Productos
- ✅ Listar productos
- ✅ Crear producto con ingredientes
- ✅ Editar producto
- ✅ Eliminar producto
- ✅ Ver costo estimado
- ✅ Gestionar ingredientes del producto

### Ingredientes
- ✅ Listar ingredientes
- ✅ Crear ingrediente
- ✅ Editar ingrediente
- ✅ Eliminar ingrediente
- ✅ Actualizar stock
- ✅ Alertas de stock bajo

### Ventas (Batches)
- ✅ Listar ventas
- ✅ Crear nueva venta
- ✅ Ver detalle de venta
- ✅ Anular venta
- ✅ Cálculo automático de totales

### Dashboard
- ✅ Resumen de ventas
- ✅ Productos más vendidos
- ✅ Clientes frecuentes
- ✅ Estadísticas por método de pago

## 🛠️ Scripts Disponibles

```bash
npm start       # Inicia el servidor de desarrollo
npm build       # Compila la aplicación para producción
npm test        # Ejecuta las pruebas
npm eject       # Expone la configuración (no reversible)
```

## 📝 Convenciones de Código

- **Componentes**: PascalCase (ej: `Button.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useProducts.ts`)
- **Estilos**: Mismo nombre que el componente (ej: `Button.scss`)
- **Tipos**: Interfaces en PascalCase
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

## 🎨 Diseño

- Diseño minimalista y profesional
- Paleta de colores coherente
- Responsive design
- Componentes modulares SCSS
- Variables centralizadas

## 🔒 TypeScript

Configuración estricta de TypeScript:
- Tipos explícitos en todas las funciones
- Interfaces para todas las estructuras de datos
- Validación en tiempo de compilación
- Sin uso de `any`

## 📱 Responsive

La aplicación está optimizada para:
- Desktop (>1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🚀 Producción

```bash
npm run build
```

Esto genera una carpeta `build/` lista para deployment.

## 📄 Licencia

ISC
# sistema-ventas-frontend
