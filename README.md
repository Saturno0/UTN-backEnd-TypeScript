## E‑commerce de ropa — Frontend + Backend

Aplicación completa de comercio electrónico con:
- **Frontend**: React 19 + Vite + TypeScript + Redux Toolkit + React Router
- **Backend**: Express 5 + MongoDB + Mongoose + JWT + AWS S3

El frontend consume una API REST ubicada en `backend/` con arquitectura MVC y separación de responsabilidades.

### Tecnologías

#### Frontend
- React 19, Vite 7, TypeScript, Redux Toolkit, React Router
- Estilos: CSS globales bajo `src/styles/`

#### Backend
- Express 5, Mongoose (MongoDB), JWT, Multer, AWS S3
- Arquitectura MVC con separación de responsabilidades
- Autenticación JWT con persistencia de sesión
- Integración completa con AWS S3 para almacenamiento de imágenes
- Validación de datos y manejo de errores robusto

### Requisitos previos
- Node.js 18.17+ (recomendado Node 20 LTS)
- npm 9+
- MongoDB (local o Atlas) para el backend
- Cuenta AWS S3 (opcional, para almacenamiento de imágenes)

Si ves `TypeError: crypto.hash is not a function`, actualiza tu versión de Node (Vite requiere una versión moderna).

### Puesta en marcha completa

#### 1. Frontend
```bash
npm install
npm run dev
# abre http://localhost:5173
```

#### 2. Backend
```bash
cd backend
npm install
npm run dev
# API en http://localhost:4000
```

#### 3. Configuración de variables de entorno

**Frontend** (crear `.env` a partir de `env.example`):
```
VITE_API_BASE_URL=http://localhost:4000/api
```

**Backend** (crear `.env` usando `backend/env.model` como referencia):
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/tu-db
JWT_SECRET=tu_secreto_jwt_muy_seguro
DB=nombre_de_tu_base_de_datos

# AWS S3 (opcional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET_NAME=nombre_de_tu_bucket
```

Asegúrate de que `VITE_API_BASE_URL` coincida con la URL donde corre tu API.

### Scripts disponibles

#### Frontend
- `npm run dev`: inicia el servidor de desarrollo de Vite
- `npm run build`: compila TypeScript y genera el build de producción
- `npm run preview`: previsualiza el build de producción
- `npm run lint`: ejecuta ESLint

#### Backend
- `npm run dev`: ejecuta el servidor con nodemon (desarrollo)
- `npm start`: ejecuta el servidor en modo producción

### Estructura del proyecto

#### Frontend
```
src/
  components/      # Componentes de UI reutilizables
  pages/           # Páginas del router
  hooks/           # Store de Redux y hooks (productos, categorías, usuarios)
  styles/          # Estilos globales
  config/          # Configuración de endpoints (api.ts)
  types/           # Tipos compartidos
public/
```

#### Backend
```
backend/
  api/
    index.js       # Punto de entrada del servidor Express
  src/
    models/        # Esquemas Mongoose (User, Product, Category)
    controllers/   # Lógica HTTP para CRUD y autenticación
    services/      # Capa de negocio/DB para cada recurso
    routes/        # Routers Express montados en `/api/*`
    middlewares/   # Middlewares de autenticación y upload
    utils/         # Helpers (validaciones, etc.)
    config/        # Configuración AWS S3
  config.js        # Carga de variables de entorno
  db.js           # Conexión a MongoDB con Mongoose
  env.model       # Ejemplo de variables esperadas
```

#### Puntos clave del Frontend
- `src/config/api.ts` centraliza rutas REST y las combina con `VITE_API_BASE_URL`
- `src/hooks/store.ts` registra los slices globales (carrito y usuario)
- `src/pages` organiza las vistas principales (inicio, producto, carrito, checkout, login/registro, perfil, etc.)

#### Puntos clave del Backend
- Arquitectura MVC con separación clara de responsabilidades
- Autenticación JWT con middleware `verifyTokenMiddleware`
- Integración AWS S3 para almacenamiento de imágenes de productos
- Validación robusta de datos con esquemas Mongoose
- Manejo de errores centralizado en controladores

### API Endpoints principales

#### Usuarios (`/api/users`)
- `POST /register` - Registro de usuario
- `POST /login` - Autenticación
- `GET /profile` - Obtener perfil (requiere JWT)
- `PUT /update` - Actualizar perfil (requiere JWT)

#### Productos (`/api/products`)
- `GET /getAllProducts` - Listar todos los productos
- `GET /getProduct/:id` - Obtener producto por ID
- `POST /createProduct` - Crear producto (requiere JWT admin)
- `PUT /updateProduct/:id` - Actualizar producto (requiere JWT admin)
- `DELETE /deleteProduct/:id` - Eliminar producto (requiere JWT admin)

#### Categorías (`/api/categories`)
- `GET /getAllCategories` - Listar todas las categorías
- `POST /createCategory` - Crear categoría (requiere JWT admin)

### Características técnicas

#### Autenticación y autorización
- JWT tokens con expiración de 1 hora
- Middleware `verifyTokenMiddleware` para proteger rutas
- Roles de usuario: `user` y `admin`
- Persistencia de sesión en frontend con `localStorage` y `sessionStorage`

#### Gestión de imágenes
- Upload de imágenes con Multer
- Integración AWS S3 para almacenamiento
- Procesamiento de imágenes con Sharp
- URLs de imágenes almacenadas en modelo Product

#### Base de datos
- MongoDB con Mongoose ODM
- Esquemas para User, Product y Category
- Validaciones de datos a nivel de esquema
- Gestión de inventario por colores en productos

### Problemas comunes
- **Tipos de React/JSX**: asegúrate de tener `@types/react` y `@types/react-dom` y que tu TS esté configurado para React
- **Errores por Node antiguo**: actualiza a una versión LTS si Vite arroja errores de compatibilidad
- **Conexión MongoDB**: verifica que MongoDB esté ejecutándose y la URI sea correcta
- **AWS S3**: configura correctamente las credenciales y permisos del bucket
- **CORS**: el backend está configurado para aceptar peticiones desde cualquier origen (`"*"`)

### Licencia
ISC (uso educativo/demostración).

