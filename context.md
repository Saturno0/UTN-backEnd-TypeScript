## Descripción general
Aplicación de comercio electrónico para indumentaria organizada como monorepo ligero:
- **Frontend** en la raíz del repositorio con React 19 + Vite + TypeScript, Redux Toolkit para estado global y React Router para navegación.
- **Backend** aislado en `backend/` con Express 5, Mongoose y JWT para API REST sobre MongoDB.
- El proyecto está pensado para ejecutar frontend y backend por separado, comunicándose mediante peticiones HTTP configuradas vía `VITE_API_BASE_URL`.
- El backend incluye integración con AWS S3 para almacenamiento de imágenes de productos.

## Estructura del repositorio
```
├── frontend/               # Código del frontend (React + TS)
│   ├── src/
│   │   ├── assets/         # Imágenes y recursos estáticos
│   │   ├── components/     # Componentes de UI reutilizables (Navbar, Cart, ProductCard, etc.)
│   │   ├── config/         # Configuración de endpoints (`api.ts`)
│   │   ├── hooks/          # Redux slices + hooks asincrónicos para productos, categorías y usuarios
│   │   ├── pages/          # Páginas del router (Principal, Producto, Cart, Checkout, Auth, etc.)
│   │   ├── styles/         # Estilos globales y módulos CSS
│   │   ├── types/          # Tipos compartidos para productos, carrito y usuarios
│   │   ├── App.tsx         # Definición de rutas
│   │   └── main.tsx        # Punto de entrada React + providers (Router, Redux)
│   ├── public/             # Plantilla HTML y assets públicos de Vite
│   ├── package.json        # Configuración del frontend + scripts Vite
│   └── vite.config.ts      # Configuración de Vite
├── backend/                # API REST (Express + Mongoose)
│   ├── api/
│   │   └── index.js        # Punto de entrada del servidor Express
│   ├── config.js           # Carga de variables de entorno (.env)
│   ├── db.js               # Conexión a MongoDB con Mongoose
│   ├── env.model           # Ejemplo de variables esperadas para backend
│   ├── package.json        # Configuración del backend + scripts Express
│   └── src/
│       ├── models/         # Esquemas Mongoose: Product, Category, User
│       ├── controllers/    # Lógica HTTP para CRUD y autenticación
│       ├── services/       # Capa de negocio/DB para cada recurso
│       ├── routes/         # Routers Express montados en `/api/*`
│       ├── middlewares/    # Middlewares de autenticación y upload
│       ├── utils/         # Helpers (validaciones de password, etc.)
│       └── config/        # Configuración AWS S3
├── context.md              # Documentación del proyecto
└── README.md               # Resumen y guías de ejecución rápidas
```

## Frontend (React + Vite)
- **Entradas principales**: `frontend/src/main.tsx` monta React StrictMode, Redux Provider, BrowserRouter y el helper `ScrollToTop` antes de renderizar `<App />`. `frontend/src/App.tsx` define las rutas principales (`/`, `/producto/:id`, `/cart`, `/checkout`, `/login`, `/register`, `/profile`, `/form`, `/newIn`, `/create-product`).
- **Estado global**: `frontend/src/hooks/store.ts` combina `cartSlice` y `userSlice`. `cartSlice` persiste el carrito en `localStorage`, normaliza IDs y expone acciones `addToCart`, `removeFromCart`, `clearCart`. `userSlice` mantiene el usuario autenticado con persistencia en `localStorage` y `sessionStorage`, maneja tokens JWT con expiración y expone acciones `register`, `logout`.
- **Hooks de datos**: bajo `frontend/src/hooks/products`, `categories` y `users` hay hooks que encapsulan peticiones `fetch` hacia los endpoints definidos en `frontend/src/config/api.ts` (`useFetchProducts`, `useCreateProduct`, `useLoginUser`, etc.), devolviendo estados `loading`, `error`, `done` y funciones mutadoras.
- **Configuración de API**: `API_CONFIG` centraliza rutas REST y `buildApiUrl` combina cada endpoint con `VITE_API_BASE_URL` (por defecto `http://localhost:3000/api`). Ajusta la variable en `.env` para apuntar a tu backend.
- **Páginas y componentes**: `frontend/src/pages` organiza contenedores de alto nivel (por ejemplo `PrincipalPage` usa `components/Main`, `Navbar`, `Slides`, `ProductsLister`; `ProductPage` muestra `ProductDetail` con `ProductInfo`, `ProductColors`; `CartPage` usa `Cart`, `CartItems`, `EmptyCart`; `CheckoutPage` integra `Checkout` y `CheckOutForm`; `LoginPage`/`RegisterPage` usan componentes de autenticación). Los componentes consumen los hooks y slices anteriores para renderizar UI y despachar acciones.
- **Estilos**: estilos globales en `frontend/src/styles/Index.css` y archivos CSS específicos (como `App.css`, `index.css`). También hay declaraciones de tipos CSS en `frontend/src/types/css.d.ts` para importar módulos de estilo en TypeScript.

## Backend (Express + MongoDB)
- **Punto de entrada**: `backend/api/index.js` inicializa Express, parseadores de body, CORS (`"*"`), sesiones (`express-session` con `JWT_SECRET`) y monta routers: `/api/users`, `/api/categories`, `/api/products`. Escucha en `PORT` tras conectar a MongoDB (`connectDB`).
- **Configuración y conexión**: `backend/config.js` carga `.env` y expone `PORT`, `MONGO_URI`, `JWT_SECRET`, `DB`. `backend/db.js` usa Mongoose para conectar con reintento y logs.
- **Modelos**: bajo `backend/src/models/` hay esquemas Mongoose para
  - `User`: email único, hash `bcrypt` en hook `pre('save')`, validación de password (regex en `utils/validator.js`), campo `rol` (`user` | `admin`), flag `activo`.
  - `Product`: datos de catálogo, relación con `Category` vía ObjectId, array embebido `colores` con stock por color, array `talles` con tallas disponibles, subdocumento `especificaciones`, campo `imageUrl` para URLs de AWS S3, método `decreaseColorStock` para gestión de inventario.
  - `Category`: estructura simple con `nombre` único y `descripcion`.
- **Servicios y controladores**: cada recurso expone un servicio en `src/services` con lógica de negocio (consultas, validaciones de duplicados, hashing, JWT). Los controladores en `src/controllers` convierten esa lógica en respuestas HTTP (manejo de códigos 200/201/204/400/404/409/500).
- **Autenticación**: `userService.logIn` verifica credenciales, compara password con `bcrypt.compareSync`, y genera token JWT (1h) firmado con `JWT_SECRET`. `getRolService` devuelve el rol del usuario para autorización básica.
- **Rutas**: routers Express en `src/routes` agrupan endpoints RESTful (`/getAllProducts`, `/createProduct`, `/updateProduct/:id`, etc.). Los endpoints coinciden con las claves de `API_CONFIG` para que el frontend consuma la API sin hardcodear URLs.
- **Middlewares**: `verifyTokenMiddleware` para autenticación JWT, `uploadMiddleware` con Multer para manejo de archivos y `uploadProductImage` para integración con AWS S3.
- **Utilidades**: `src/utils/validator.js` centraliza helpers reutilizables (validación de contraseñas, etc.).
- **AWS S3**: integración para almacenamiento de imágenes de productos con configuración en `src/config/aws.js`.

## Variables de entorno
- Frontend usa `.env` (basado en `frontend/env.example`) con `VITE_API_BASE_URL` para apuntar a la API.
- Backend requiere `.env` (ver `backend/env.model`) con `PORT`, `MONGO_URI`, `DB`, `JWT_SECRET` y configuración AWS S3 (`AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`).

## Scripts de ejecución
- **Frontend** (`frontend/package.json`):
  - `npm install` & `npm run dev` → servidor de desarrollo Vite (`http://localhost:5173`).
  - `npm run build` → compila TypeScript y genera build de producción.
  - `npm run preview` → sirve build para pruebas.
  - `npm run lint` → ESLint.
  - `npm run server:dev` / `npm run server` → ejecutar un servidor Express alternativo escrito en TypeScript (si se migra backend dentro del proyecto principal).
- **Backend** (`backend/package.json`):
  - `npm install` dentro de `backend/`.
  - `npm run dev` → ejecuta `nodemon api/index.js` con recarga.
  - `npm start` → servidor Express en modo producción.

## Flujo típico de datos
1. El frontend obtiene `VITE_API_BASE_URL` y construye rutas con `API_CONFIG`.
2. Hooks como `useFetchProducts` realizan `fetch` a `/api/products/getAllProducts`, gestionan estados `loading/error/done` y devuelven datos tipados (`Product`).
3. Redux almacena carrito (`cartSlice`) y usuario (`userSlice`). Acciones de UI (agregar producto, login) despachan acciones que actualizan el store y sincronizan `localStorage`/`sessionStorage`.
4. En el backend, las rutas reciben la petición, delegan al servicio correspondiente. Ejemplo: `createProduct` valida duplicados, sube imagen a AWS S3 y guarda en MongoDB; `logIn` genera JWT.
5. Las respuestas (200/201/204/4xx/5xx) son interpretadas por los hooks para actualizar el estado de la interfaz.
6. Para productos con imágenes, el backend maneja upload con Multer y almacena URLs de S3 en el campo `imageUrl` del modelo Product.

## Recursos adicionales
- `README.md` resume tech stack, scripts y pasos de inicio rápidos.
- `frontend/index.html` define la plantilla Vite (con `<div id="root">`).
- `frontend/public/` contiene activos estáticos adicionales servidos por Vite.
- El proyecto incluye integración completa con AWS S3 para almacenamiento de imágenes de productos.
- Sistema de autenticación JWT con persistencia de sesión en frontend y backend.
- Gestión de inventario por colores con método `decreaseColorStock` en el modelo Product.
