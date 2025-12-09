# Frontend - Sistema de Ventas

Frontend profesional construido con React 17, TypeScript, TSX y SCSS para el sistema de gestión de ventas con funcionalidades completas de CRUD, búsqueda reactiva, ordenamiento de tablas y gestión de clientes. **Optimizado para mobile con navegación adaptativa y notificaciones toast.**

## 🚀 Características

- ✅ React 17 con TypeScript y TSX
- ✅ Arquitectura modular y escalable
- ✅ Estilos SCSS modulares con variables centralizadas
- ✅ React Router v6 para navegación
- ✅ Hooks personalizados para gestión de estado
- ✅ Cliente HTTP con fetch nativo
- ✅ Componentes UI reutilizables (Button, Input, Card, Table, Autocomplete, Modal, Toast)
- ✅ Búsqueda reactiva con filtrado client-side
- ✅ Tablas ordenables por columnas con indicadores visuales
- ✅ Autocomplete con navegación por teclado
- ✅ TypeScript estricto sin uso de `any`
- ✅ **Diseño responsive mobile-first con navegación adaptativa**
- ✅ **Sistema de notificaciones toast (success, error, warning, info)**
- ✅ **PWA ready** con manifest y meta tags iOS

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
│   │   ├── httpClient.ts       # Cliente HTTP base
│   │   ├── clienteApi.ts       # API de clientes
│   │   ├── dashboardApi.ts     # API de estadísticas
│   │   ├── ingredientApi.ts    # API de ingredientes
│   │   ├── metodoPagoApi.ts    # API de métodos de pago
│   │   ├── productApi.ts       # API de productos
│   │   └── ventaApi.ts         # API de ventas
│   ├── components/            # Componentes reutilizables
│   │   ├── MobileMenu.tsx        # Menú hamburger (mobile)
│   │   ├── BottomNavigation.tsx  # Navegación inferior (mobile)
│   │   └── ui/
│   │       ├── Autocomplete.tsx  # Búsqueda con autocompletado
│   │       ├── Button.tsx        # Botón con variantes
│   │       ├── Card.tsx          # Tarjeta contenedora
│   │       ├── Input.tsx         # Campo de entrada
│   │       ├── Modal.tsx         # Diálogo modal
│   │       ├── Table.tsx         # Tabla genérica
│   │       ├── Toast.tsx         # Notificación toast
│   │       └── ToastContainer.tsx # Provider de toasts
│   ├── hooks/                 # Hooks personalizados
│   │   ├── useClientes.ts      # Estado de clientes
│   │   ├── useIngredients.ts   # Estado de ingredientes
│   │   ├── useMetodosPago.ts   # Estado de métodos de pago
│   │   ├── useProducts.ts      # Estado de productos
│   │   └── useVentas.ts        # Estado de ventas
│   ├── pages/                 # Páginas principales
│   │   ├── Home.tsx            # Dashboard principal
│   │   ├── ClienteList.tsx     # Lista de clientes
│   │   ├── ClienteForm.tsx     # Crear/editar cliente
│   │   ├── ClienteDetail.tsx   # Historial de cliente
│   │   ├── ProductList.tsx     # Lista de productos
│   │   ├── ProductCreate.tsx   # Crear producto
│   │   ├── IngredientList.tsx  # Lista de ingredientes
│   │   ├── IngredientCreate.tsx # Crear ingrediente
│   │   ├── MetodoPagoList.tsx  # Lista de métodos de pago
│   │   ├── VentaList.tsx       # Lista de ventas
│   │   └── VentaCreate.tsx     # Crear venta
│   ├── styles/                # Estilos globales
│   │   ├── globals.scss        # Estilos base
│   │   └── variables.scss      # Variables SCSS
│   ├── types/                 # Tipos TypeScript
│   │   ├── cliente.ts          # Tipos de cliente
│   │   ├── common.ts           # Tipos comunes
│   │   ├── ingredient.ts       # Tipos de ingrediente
│   │   ├── metodoPago.ts       # Tipos de método de pago
│   │   ├── product.ts          # Tipos de producto
│   │   └── venta.ts            # Tipos de venta
│   ├── App.tsx
│   ├── App.scss
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## 🎨 Componentes UI

### Toast (Nuevo)
Sistema de notificaciones con 4 tipos:
- **Success** (verde): Confirmación de acciones exitosas
- **Error** (rojo): Errores y fallos
- **Warning** (amarillo): Advertencias
- **Info** (azul): Información general
- Auto-cierre en 3 segundos
- Cierre manual con botón X
- Animación slide-in desde la derecha
- Responsive (full-width en mobile)
- Context API con hook `useToast()`

### MobileMenu
Menú hamburger con:
- Slide-in animation desde la derecha
- Overlay semitransparente
- Touch targets de 56px
- Enlaces a Productos, Ingredientes, Ventas, Métodos de Pago
- Solo visible en mobile (<768px)

### BottomNavigation
Navegación inferior fija con:
- 4 botones principales con íconos y labels
- Active state con color primary y transform
- Touch feedback (scale on press)
- Flex distribution equilibrada
- Solo visible en mobile (<768px)

### Autocomplete
Componente de búsqueda con autocompletado que incluye:
- Filtrado en tiempo real por texto principal y secundario
- Navegación por teclado (↑↓ Enter Escape)
- Click fuera para cerrar
- Resaltado de opción seleccionada
- Limpieza automática al seleccionar

### Button
Botón reutilizable con variantes y tamaños:
- Variantes: `primary`, `secondary`, `danger`
- Tamaños: `small`, `medium` (default), `large`

### Card
Tarjeta contenedora con título opcional y secciones (header, body)

### Input
Campo de entrada con:
- Label y placeholder
- Validación HTML5 (required, min, max, pattern)
- Soporte para tipos: text, number, email, password, tel
- Acepta valores undefined para inicialización

### Modal
Modal/diálogo reutilizable para confirmaciones y formularios

### Table
Tabla genérica tipada con:
- Columnas configurables (header como string o ReactNode)
- Accessor como propiedad o función
- Mensaje de vacío personalizable
- Estado de carga

## 🔌 APIs

Todas las llamadas al backend están centralizadas en la carpeta `api/` con cliente HTTP base:

- **httpClient**: Cliente fetch configurado con base URL y manejo de errores
- **clienteApi**: CRUD completo de clientes + endpoint de búsqueda + bulk creation
- **dashboardApi**: Estadísticas del negocio (ventas del mes, ventas de hoy, productos más vendidos, clientes frecuentes)
- **ingredientApi**: CRUD de ingredientes + bulk creation
- **metodoPagoApi**: Lista y creación de métodos de pago
- **productApi**: CRUD de productos con ingredientes asociados + bulk creation
- **ventaApi**: CRUD de ventas + anulación + bulk creation

## 🎯 Funcionalidades

### Dashboard (Home)
- ✅ Ventas del mes actual (total y cantidad) con comparativa vs mes anterior
- ✅ Ventas de hoy (total y cantidad) con comparativa vs mismo día hace 1 mes
- ✅ Indicadores de diferencia porcentual y absoluta (positivo en verde, negativo en rojo)
- ✅ Total histórico de ventas con cantidad de clientes
- ✅ Top 5 productos más vendidos con cantidades y total generado (formato ranking)
- ✅ Top 5 clientes frecuentes con cantidad de compras y total gastado (formato ranking)
- ✅ Formato de moneda sin decimales con separador de miles
- ✅ Carga paralela optimizada de todas las métricas

### Clientes
- ✅ Lista de clientes con búsqueda reactiva (nombre, teléfono, dirección)
- ✅ Filtrado client-side con useMemo (carga 1000 registros una vez)
- ✅ Ordenamiento por ID, Nombre, Dirección (ascendente/descendente)
- ✅ Badge VIP elegante (dorado) para clientes destacados
- ✅ Crear cliente (nombre, teléfono, dirección, notas)
- ✅ Editar cliente
- ✅ Eliminar cliente (validación si tiene ventas)
- ✅ Ver historial completo del cliente con:
  - Información personal
  - Estadísticas (total gastado, cantidad de compras, ticket promedio)
  - Lista detallada de todas sus ventas con productos
- ✅ Botón "+ Venta" directo desde la lista con estilo profesional
- ✅ Bulk creation endpoint

### Productos
- ✅ Lista de productos con paginación
- ✅ Ordenamiento por ID, Nombre, Precio Base (ascendente/descendente)
- ✅ Crear producto con autocomplete de ingredientes
- ✅ Ingredientes opcionales para combos/bebidas
- ✅ Muestra nombres de ingredientes en la tabla (no solo cantidad)
- ✅ Eliminar producto
- ✅ Bulk creation endpoint

### Ingredientes
- ✅ Lista de ingredientes con badges de uso en productos
- ✅ Indicador visual de popularidad con colores sobrios
- ✅ Crear ingrediente (nombre, unidad de medida, costo, stock)
- ✅ Eliminar ingrediente
- ✅ Bulk creation endpoint

### Ventas
- ✅ Lista de ventas con filtros (estado, fecha inicio, fecha fin)
- ✅ Ordenamiento por ID, Cliente, Total, Fecha (ascendente/descendente)
- ✅ Modal de detalle de venta con información completa:
  - Datos del cliente y dirección de entrega
  - Método de pago y estado con badge
  - Tabla de productos con cantidades y precios
  - Total y fecha de la venta
  - Notas adicionales
- ✅ Crear venta con:
  - Autocomplete de cliente (búsqueda por nombre/teléfono)
  - Auto-llenado de dirección desde cliente
  - Autocomplete de productos
  - Cálculo automático de totales
  - Pre-selección de método "Transferencia"
  - Limpieza automática de campos al agregar items
- ✅ Estados: completado, pendiente, cancelado (backend acepta variantes de nomenclatura)
- ✅ Anular venta (solo si está pendiente)
- ✅ Formateo de moneda COP sin decimales
- ✅ Bulk creation endpoint
- ✅ Botón crear venta con clienteId pre-cargado desde parámetro URL

### Métodos de Pago
- ✅ Lista de métodos de pago
- ✅ Crear método de pago con modal
- ✅ Activar/desactivar métodos

## ⚡ Optimizaciones

- **Búsqueda reactiva client-side**: Carga 1000 registros una vez y filtra localmente con useMemo, evitando múltiples requests al backend
- **Autocomplete con navegación por teclado**: Mejora UX permitiendo selección sin mouse
- **Tablas ordenables**: Ordenamiento in-memory para respuesta instantánea
- **Formato de moneda consistente**: Sin decimales y con separador de miles en todo el sistema
- **Validación con Zod en backend**: z.coerce para conversión automática de tipos
- **Carga paralela en dashboard**: Promise.all para obtener todas las métricas simultáneamente
- **Modal de detalle**: Renderizado condicional sin navegación innecesaria
- **Comparativas en tiempo real**: Cálculos de diferencias porcentuales y absolutas en backend
- **Tolerancia en estados**: Backend acepta 'completado', 'completada', 'Completada' sin errores

## 🛠️ Scripts Disponibles

```bash
npm start       # Inicia el servidor de desarrollo en puerto 3001
npm build       # Compila la aplicación para producción
npm test        # Ejecuta las pruebas
npm eject       # Expone la configuración (no reversible)
```

## 📝 Convenciones de Código

- **Componentes**: PascalCase (ej: `ClienteDetail.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useClientes.ts`)
- **Estilos**: Mismo nombre que el componente (ej: `ClienteDetail.scss`)
- **Tipos**: Interfaces en PascalCase (ej: `Cliente`, `Venta`)
- **Variables**: camelCase (ej: `sortedVentas`)
- **Constantes**: UPPER_SNAKE_CASE

## 🎨 Diseño

- Diseño minimalista y profesional con énfasis en sobriedad
- Paleta de colores definida en `variables.scss`:
  - Primary: Azul para acciones principales
  - Secondary: Gris para acciones secundarias
  - Danger: Rojo para eliminación
  - Success: Verde para confirmación
  - Gold: Dorado elegante para elementos VIP
- Badges con colores sobrios y profesionales
- Grid layouts con CSS Grid y Flexbox
- Componentes SCSS modulares con BEM naming
- Variables centralizadas (`$color-*`, `$border-radius`, `$box-shadow`)
- Modales con overlay semitransparente y animaciones suaves
- Indicadores de comparativa con códigos de color intuitivos (verde/rojo)

## 🔒 TypeScript

Configuración estricta de TypeScript:
- Tipos explícitos en todas las funciones y parámetros
- Interfaces para todas las estructuras de datos
- Validación en tiempo de compilación
## 📱 Mobile-First & Responsive

### Optimizaciones Mobile Implementadas

**Navegación Adaptativa:**
- ✅ **Bottom Navigation** (4 botones principales): 📊 Inicio, 🛒 Nueva Venta, 👥 Clientes, 🍕 Productos
- ✅ **Menú Hamburger** con slide-in animation para opciones secundarias (Ingredientes, Ventas, Métodos de Pago)
- ✅ Navegación desktop oculta automáticamente en mobile (<768px)
- ✅ Touch targets de 44-48px mínimo (cumple WCAG)

**UX/UI Mobile:**
- ✅ **Sistema de Toast notifications** con animaciones slide-in
- ✅ Inputs con `font-size: 16px` para prevenir zoom en iOS
- ✅ Borders de 2px para mejor visibilidad táctil
- ✅ Tablas con scroll horizontal smooth + sombras indicadoras
- ✅ Radio buttons compactos en layout horizontal
- ✅ Botones full-width en formularios mobile
- ✅ Espaciados optimizados para mayor densidad visual
- ✅ Cards de estadísticas en grid 2x2 en mobile
- ✅ Progressive loading en Dashboard (stats primero, charts después)

**PWA Features:**
- ✅ Manifest.json configurado ("Ventas Pizza", standalone, portrait)
- ✅ Meta tags para iOS (apple-mobile-web-app-capable, status-bar-style)
- ✅ Theme color y viewport optimizados
- ✅ Ready para "Add to Home Screen"

**Breakpoints:**
## ✅ Mejoras Implementadas Recientemente

### Mobile Optimization (Diciembre 2024)
- ✅ Navegación Bottom Navigation con 4 acciones principales
- ✅ Menú Hamburger para opciones secundarias
- ✅ Sistema completo de notificaciones Toast
- ✅ Optimización de todos los formularios para mobile
- ✅ Tablas con scroll horizontal smooth
- ✅ Touch targets WCAG compliant (44-48px)
- ✅ PWA manifest y meta tags iOS
- ✅ Progressive loading en Dashboard
- ✅ Espaciados y densidad visual optimizada para pantallas pequeñas

## 🔮 Próximas Mejoras Planificadas

### Funcionalidad General
- [ ] Autenticación con JWT y roles (Admin, Vendedor, Cajero)
- [ ] Edición inline en tablas
- [ ] CRUD completo de métodos de pago
- [ ] Botón "Volver" en todos los formularios
- [ ] Indicador de página activa en navbar desktop
- [ ] Modal de confirmación mejorado con animaciones
- [ ] Gráficos interactivos en dashboard (Recharts)
- [ ] Impresión de ticket/factura (PDF)
- [ ] Reportes automáticos por email
- [ ] Sistema de backup automático
- [ ] Dark mode
## 🚀 Producción

```bash
npm run build
```

Esto genera una carpeta `build/` lista para deployment en servicios como:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

## 🔮 Próximas Mejoras Planificadas

### Funcionalidad General
- [ ] Autenticación con JWT y roles (Admin, Vendedor, Cajero)
- [ ] Edición de productos e ingredientes
- [ ] CRUD completo de métodos de pago
- [ ] Botón "Volver" en todos los formularios
- [ ] Notificaciones toast para feedback visual
- [ ] Indicador de página activa en navbar
- [ ] Modal de confirmación mejorado
- [ ] Gráficos en dashboard (Chart.js o Recharts)
- [ ] Impresión de ticket/factura
- [ ] Reportes automáticos por email
- [ ] Sistema de backup de base de datos
## 📊 Estadísticas del Proyecto

- **Líneas de código**: ~9,500+ líneas
- **Componentes**: 15 componentes (11 UI + 2 mobile navigation + 2 toast)
- **Páginas**: 11 páginas funcionales completamente responsive
- **Hooks personalizados**: 5 hooks de negocio + 1 toast context
- **APIs**: 7 servicios HTTP
- **Tipos TypeScript**: 6 archivos de tipos
- **Archivos SCSS**: 25+ archivos de estilos modulares
- **Mobile-first**: 100% funcional en dispositivos móvilespo real (WebSocket/SSE)
- [ ] **Inventario en tiempo real** con descuento automático al confirmar venta
- [ ] **Tiempos estimados** de entrega por zona
- [ ] **Tracking de repartidores** (opcional: integración con mapas)

## 📊 Estadísticas del Proyecto

- **Líneas de código**: ~8,000+ líneas
- **Componentes**: 11 componentes UI reutilizables
- **Páginas**: 11 páginas funcionales
- **Hooks personalizados**: 5 hooks
- **APIs**: 7 servicios HTTP
- **Tipos TypeScript**: 6 archivos de tipos

## 📄 Licencia

ISC

---

**Desarrollado con ❤️ para gestión de negocios de ventas**
