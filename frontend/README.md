# Frontend - E-commerce React Application

Este es el frontend de la aplicación de e-commerce desarrollado con React, TypeScript, Vite y Redux Toolkit. Proporciona una interfaz de usuario moderna y responsiva para la gestión de productos, carrito de compras, autenticación de usuarios y administración del catálogo.

## 🚀 Características Principales

- **Interfaz React moderna** con TypeScript
- **Gestión de estado** con Redux Toolkit
- **Routing** con React Router DOM
- **Autenticación JWT** con persistencia de sesión
- **Carrito de compras** con persistencia local
- **Administración de productos** y categorías
- **Diseño responsivo** y componentes reutilizables
- **Hooks personalizados** para gestión de datos

## 📦 Dependencias Principales

### Dependencias de Producción
- **react** (^19.1.1) - Biblioteca principal de React
- **react-dom** (^19.1.1) - Renderizado de React en el DOM
- **react-router-dom** (^7.9.1) - Enrutamiento para aplicaciones React
- **@reduxjs/toolkit** (^2.9.0) - Herramientas modernas para Redux
- **react-redux** (^9.2.0) - Bindings oficiales de Redux para React
- **express** (^5.1.0) - Servidor Express (para SSR opcional)
- **mysql2** (^3.14.3) - Driver MySQL para Node.js
- **cors** (^2.8.5) - Middleware CORS
- **dotenv** (^17.2.1) - Variables de entorno

### Dependencias de Desarrollo
- **typescript** (~5.8.3) - Superset tipado de JavaScript
- **vite** (^7.1.2) - Herramienta de construcción rápida
- **@vitejs/plugin-react** (^5.0.0) - Plugin de React para Vite
- **eslint** (^9.33.0) - Linter de código
- **@types/react** (^19.1.11) - Tipos TypeScript para React
- **@types/react-dom** (^19.1.8) - Tipos TypeScript para React DOM
- **@types/react-redux** (^7.1.34) - Tipos TypeScript para React Redux
- **tsx** (^4.20.4) - Ejecutor TypeScript/JSX
- **ts-node** (^10.9.2) - Ejecutor TypeScript para Node.js

## 🏗️ Estructura del Proyecto

```
frontend/
├── public/
│   └── vite.svg                 # Favicon de Vite
├── src/
│   ├── assets/
│   │   ├── Icons/               # Iconos SVG
│   │   │   ├── facebook-brands-.svg
│   │   │   ├── instagram-brands-.svg
│   │   │   ├── noun-mail-4808363.svg
│   │   │   └── square-twitter-brands-solid.svg
│   │   └── img/                 # Imágenes estáticas
│   │       ├── ChatGPT Image 1 may 2025, 17_48_14.png
│   │       ├── ChatGPT Image 10 jul 2025, 17_09_02.png
│   │       └── logo_creado_250x125_centrado.png
│   ├── components/              # Componentes reutilizables
│   │   ├── Cart.tsx            # Componente del carrito
│   │   ├── CartItems.tsx       # Items del carrito
│   │   ├── Checkout.tsx        # Proceso de checkout
│   │   ├── CheckOutForm.tsx    # Formulario de checkout
│   │   ├── CreateCategory.tsx   # Creación de categorías
│   │   ├── CreateProduct.tsx   # Creación de productos
│   │   ├── CreateProductForm.tsx # Formulario de productos
│   │   ├── EditingProductColors.tsx # Edición de colores
│   │   ├── EditingProductData.tsx # Edición de datos
│   │   ├── EmptyCart.tsx       # Carrito vacío
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── Form.tsx            # Formulario genérico
│   │   ├── LeftMenu.tsx        # Menú lateral izquierdo
│   │   ├── Login.tsx           # Componente de login
│   │   ├── Main.tsx            # Componente principal
│   │   ├── Navbar.tsx          # Barra de navegación
│   │   ├── NewIn.tsx           # Productos nuevos
│   │   ├── ProductCard.tsx     # Tarjeta de producto
│   │   ├── ProductColors.tsx   # Colores de producto
│   │   ├── ProductDetail.tsx   # Detalle de producto
│   │   ├── ProductInfo.tsx     # Información de producto
│   │   ├── ProductsLister.tsx  # Lista de productos
│   │   ├── Profile.tsx         # Perfil de usuario
│   │   ├── Register.tsx        # Registro de usuario
│   │   ├── RightMenu.tsx       # Menú lateral derecho
│   │   ├── ScrollToTop.tsx      # Scroll automático
│   │   └── Slides.tsx          # Carrusel de imágenes
│   ├── config/
│   │   └── api.ts              # Configuración de API
│   ├── hooks/                  # Hooks personalizados y Redux
│   │   ├── cartSlice.ts        # Slice de Redux para carrito
│   │   ├── userSlice.ts        # Slice de Redux para usuario
│   │   ├── store.ts            # Configuración del store Redux
│   │   ├── useSesionWatcher.ts # Hook para monitorear sesión
│   │   ├── useUser.ts          # Hook para gestión de usuario
│   │   ├── useCategories.ts    # Hook para categorías
│   │   ├── useProducts.ts      # Hook para productos
│   │   ├── categories/         # Hooks específicos de categorías
│   │   │   ├── index.ts
│   │   │   ├── useCreateCategory.ts
│   │   │   └── useFetchCategories.ts
│   │   ├── products/           # Hooks específicos de productos
│   │   │   ├── index.ts
│   │   │   ├── useCreateProduct.ts
│   │   │   ├── useDeleteProduct.ts
│   │   │   ├── useFetchProduct.ts
│   │   │   ├── useFetchProducts.ts
│   │   │   └── useUpdateProduct.ts
│   │   └── users/              # Hooks específicos de usuarios
│   │       ├── index.ts
│   │       ├── useCreateUser.ts
│   │       ├── useLoginUser.ts
│   │       └── useUpdateUser.ts
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── CartPage.tsx        # Página del carrito
│   │   ├── CheckoutPage.tsx    # Página de checkout
│   │   ├── CreateProductPage.tsx # Página de crear producto
│   │   ├── FormPage.tsx        # Página de formularios
│   │   ├── LoginPage.tsx       # Página de login
│   │   ├── NewInPage.tsx       # Página de productos nuevos
│   │   ├── PrincipalPage.tsx   # Página principal
│   │   ├── ProductPage.tsx     # Página de producto
│   │   ├── ProfilePage.tsx     # Página de perfil
│   │   └── RegisterPage.tsx    # Página de registro
│   ├── styles/                 # Archivos CSS
│   │   ├── Cart.css
│   │   ├── Checkout.css
│   │   ├── CreateProduct.css
│   │   ├── Footer.css
│   │   ├── Formulario.css
│   │   ├── Index.css
│   │   ├── Login.css
│   │   ├── Navbar.css
│   │   ├── Product.css
│   │   └── Profile.css
│   ├── types/
│   │   ├── css.d.ts            # Declaraciones de tipos CSS
│   │   └── types.ts            # Tipos TypeScript
│   ├── App.tsx                 # Componente principal de la app
│   ├── App.css                 # Estilos globales
│   ├── index.css               # Estilos base
│   ├── main.tsx                # Punto de entrada
│   └── vite-env.d.ts           # Tipos de Vite
├── index.html                  # HTML principal
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración TypeScript
├── tsconfig.app.json           # Configuración TypeScript para app
├── tsconfig.node.json          # Configuración TypeScript para Node
├── tsconfig.server.json        # Configuración TypeScript para servidor
├── vite.config.ts              # Configuración de Vite
├── eslint.config.js            # Configuración de ESLint
└── env.example                 # Ejemplo de variables de entorno
```

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` basado en `env.example`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=shopdb

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Frontend configuration
VITE_API_BASE_URL= https://utn-backend-final.onrender.com/api
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview

# Ejecutar linter
npm run lint
```

## 🎯 Funcionalidades Principales

### 🛒 Sistema de Carrito de Compras

**Archivos principales:**
- `cartSlice.ts` - Estado global del carrito con Redux
- `Cart.tsx` - Componente principal del carrito
- `CartItems.tsx` - Lista de items en el carrito
- `CartPage.tsx` - Página completa del carrito

**Características:**
- Persistencia en localStorage
- Gestión de cantidad y precios
- Eliminación de productos
- Cálculo automático de totales

### 👤 Sistema de Autenticación

**Archivos principales:**
- `userSlice.ts` - Estado global del usuario
- `useLoginUser.ts` - Hook para login
- `useCreateUser.ts` - Hook para registro
- `useSesionWatcher.ts` - Monitoreo de sesión
- `Login.tsx` / `Register.tsx` - Componentes de autenticación

**Características:**
- Autenticación JWT con persistencia
- Gestión de roles de usuario
- Renovación automática de tokens
- Logout seguro

### 🛍️ Gestión de Productos

**Archivos principales:**
- `useFetchProducts.ts` - Obtener productos
- `useCreateProduct.ts` - Crear productos
- `useUpdateProduct.ts` - Actualizar productos
- `useDeleteProduct.ts` - Eliminar productos
- `ProductCard.tsx` - Tarjeta de producto
- `ProductDetail.tsx` - Detalle de producto

**Características:**
- CRUD completo de productos
- Gestión de colores y tallas
- Subida de imágenes
- Filtrado y búsqueda

### 📂 Gestión de Categorías

**Archivos principales:**
- `useFetchCategories.ts` - Obtener categorías
- `useCreateCategory.ts` - Crear categorías
- `CreateCategory.tsx` - Componente de creación

**Características:**
- CRUD de categorías
- Asociación con productos
- Validación de nombres únicos

## 🔄 Gestión de Estado (Redux)

### Store Configuration (`store.ts`)
```typescript
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});
```

### Cart Slice (`cartSlice.ts`)
**Estado:**
```typescript
interface CartState {
  totalItems: number;
  products: CartProduct[];
}
```

**Acciones principales:**
- `addToCart` - Agregar producto al carrito
- `removeFromCart` - Eliminar producto del carrito
- `updateQuantity` - Actualizar cantidad
- `clearCart` - Vaciar carrito

### User Slice (`userSlice.ts`)
**Estado:**
```typescript
interface UserState {
  nombre: string;
  email: string;
  password: string;
  rol: string;
  activo: boolean;
}
```

**Acciones principales:**
- `setUser` - Establecer usuario logueado
- `clearUser` - Limpiar datos de usuario
- `updateUser` - Actualizar datos de usuario

## 🌐 Configuración de API (`api.ts`)

**Estructura de endpoints:**
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://utn-backend-final.onrender.com/api',
  
  USERS: {
    GET_ALL: '/users/getUsers',
    CREATE: '/users/createUser',
    LOGIN: '/users/logIn',
    UPDATE: '/users/update',
    GET_ROLE: '/users/getRol/:id',
  },
  
  CATEGORIES: {
    GET_ALL: '/categories/getCategories',
    CREATE: '/categories/createCategory',
    CREATE_BULK: '/categories/createCategories',
  },
  
  PRODUCTS: {
    GET_ALL: '/products/getAllProducts',
    GET_ONE: '/products/getProduct/:id',
    CREATE: '/products/createProduct',
    UPDATE: '/products/updateProduct/:id',
    DELETE: '/products/deleteProduct/:id',
  },
};
```

## 🎨 Estilos y Diseño

### Archivos CSS Principales
- `Index.css` - Estilos globales y reset
- `Navbar.css` - Estilos de navegación
- `Product.css` - Estilos de productos
- `Cart.css` - Estilos del carrito
- `Login.css` - Estilos de autenticación
- `Profile.css` - Estilos de perfil

### Características de Diseño
- **Diseño responsivo** con CSS Grid y Flexbox
- **Componentes modulares** reutilizables
- **Tema consistente** con variables CSS
- **Animaciones suaves** para mejor UX

## 🧩 Hooks Personalizados

### Hooks de Datos
- `useFetchProducts()` - Gestión de productos
- `useFetchCategories()` - Gestión de categorías
- `useCreateProduct()` - Creación de productos
- `useUpdateProduct()` - Actualización de productos
- `useDeleteProduct()` - Eliminación de productos

### Hooks de Usuario
- `useLoginUser()` - Autenticación
- `useCreateUser()` - Registro
- `useUpdateUser()` - Actualización de perfil
- `useSesionWatcher()` - Monitoreo de sesión

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de la construcción
npm run lint         # Ejecutar linter
npm run server       # Ejecutar servidor SSR
npm run server:dev   # Servidor SSR en desarrollo
npm run server:build # Construir servidor SSR
```

## 🔧 Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción rápida
- **Redux Toolkit** - Gestión de estado
- **React Router DOM** - Enrutamiento
- **CSS3** - Estilos y diseño
- **ESLint** - Linter de código

## 📱 Páginas de la Aplicación

### Páginas Públicas
- **PrincipalPage** (`/`) - Página de inicio con productos destacados
- **ProductPage** (`/producto/:id`) - Detalle de producto individual
- **LoginPage** (`/login`) - Inicio de sesión
- **RegisterPage** (`/register`) - Registro de usuarios

### Páginas de Usuario
- **CartPage** (`/cart`) - Carrito de compras
- **CheckoutPage** (`/checkout`) - Proceso de compra
- **ProfilePage** (`/profile`) - Perfil de usuario
- **NewInPage** (`/newIn`) - Productos nuevos

### Páginas de Administración
- **CreateProductPage** (`/create-product`) - Crear productos
- **FormPage** (`/form`) - Formularios administrativos

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Validación de formularios** en frontend
- **Sanitización de datos** antes de envío
- **Manejo seguro de tokens** con expiración
- **Protección de rutas** basada en roles

## 📝 Notas de Desarrollo

- El proyecto utiliza **TypeScript** para tipado estático
- **Redux Toolkit** para gestión de estado moderna
- **Hooks personalizados** para lógica reutilizable
- **Componentes funcionales** con hooks de React
- **CSS modular** para estilos organizados
- **Configuración de Vite** optimizada para desarrollo rápido
- **ESLint** configurado para mantener calidad de código
