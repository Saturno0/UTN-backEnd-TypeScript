# Backend - E-commerce API

Este es el backend de la aplicación de e-commerce desarrollado con Node.js, Express y MongoDB. Proporciona una API RESTful completa para la gestión de usuarios, productos, categorías y manejo de imágenes.

## 🚀 Características Principales

- **API RESTful** completa con documentación Swagger
- **Autenticación JWT** para usuarios
- **Gestión de productos** con colores, tallas y stock
- **Sistema de categorías** para organización de productos
- **Subida de imágenes** a AWS S3 con URLs firmadas
- **Validación de datos** robusta
- **Middleware de seguridad** para rutas protegidas

## 📦 Dependencias Principales

### Dependencias de Producción
- **express** (^5.1.0) - Framework web para Node.js
- **mongoose** (^8.18.1) - ODM para MongoDB
- **mongodb** (^6.19.0) - Driver oficial de MongoDB
- **jsonwebtoken** (^9.0.2) - Generación y verificación de tokens JWT
- **bcrypt** (^6.0.0) - Encriptación de contraseñas
- **cors** (^2.8.5) - Configuración de CORS
- **express-session** (^1.18.2) - Manejo de sesiones
- **body-parser** (^2.2.0) - Parsing de datos del cuerpo de las peticiones
- **multer** (^2.0.2) - Manejo de archivos multipart/form-data
- **sharp** (^0.34.4) - Procesamiento de imágenes
- **@aws-sdk/client-s3** (^3.914.0) - Cliente AWS S3
- **@aws-sdk/s3-request-presigner** (^3.913.0) - Generación de URLs firmadas para S3
- **swagger-jsdoc** (^6.2.8) - Documentación automática de API
- **swagger-ui-express** (^5.0.1) - Interfaz web para Swagger

### Dependencias de Desarrollo
- **dotenv** (^17.2.2) - Variables de entorno
- **nodemon** (^3.1.10) - Reinicio automático del servidor
- **npm-check-updates** (^18.1.0) - Actualización de dependencias

## 🏗️ Estructura del Proyecto

```
backend/
├── api/
│   └── index.js                 # Punto de entrada principal del servidor
├── src/
│   ├── config/
│   │   ├── aws.js              # Configuración de AWS S3
│   │   └── swagger.js          # Configuración de Swagger
│   ├── controllers/
│   │   ├── categoryController.js # Controladores de categorías
│   │   ├── productController.js  # Controladores de productos
│   │   └── userController.js     # Controladores de usuarios
│   ├── middlewares/
│   │   ├── uploadMiddleware.js   # Middleware para subida de archivos
│   │   └── verifyTokemMiddleware.js # Middleware de verificación JWT
│   ├── models/
│   │   ├── Category.js          # Modelo de categorías (Mongoose)
│   │   ├── Product.js           # Modelo de productos (Mongoose)
│   │   └── User.js              # Modelo de usuarios (Mongoose)
│   ├── routes/
│   │   ├── categoryRoute.js     # Rutas de categorías
│   │   ├── productRoute.js      # Rutas de productos
│   │   └── userRoute.js         # Rutas de usuarios
│   ├── services/
│   │   ├── categoryService.js   # Lógica de negocio de categorías
│   │   ├── imageService.js      # Servicios de manejo de imágenes
│   │   ├── productService.js    # Lógica de negocio de productos
│   │   └── userService.js       # Lógica de negocio de usuarios
│   └── utils/
│       ├── helpers.js           # Funciones auxiliares
│       └── validator.js          # Validadores personalizados
├── config.js                    # Configuración de variables de entorno
├── db.js                       # Conexión a la base de datos
├── package.json                # Dependencias y scripts
└── env.model                   # Modelo de variables de entorno
```

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` basado en `env.model`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_jwt_secret_aqui
DB=ecommerce

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key_id
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
AWS_S3_BUCKET_NAME=nombre_de_tu_bucket
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 📚 Servicios y Funcionalidades

### 🔐 Servicio de Usuarios (`userService.js`)

**Funciones principales:**
- `createUserService(userData)` - Crear nuevo usuario con validación de email único
- `getUsersService()` - Obtener todos los usuarios
- `logIn(email, password)` - Autenticación con JWT y verificación de contraseña encriptada
- `updateUserService(idUser, updateData)` - Actualizar datos de usuario
- `getRolService(idUser)` - Obtener rol de usuario específico

**Características:**
- Encriptación de contraseñas con bcrypt
- Generación de tokens JWT con expiración de 1 hora
- Validación de usuarios existentes
- Manejo seguro de datos sensibles

### 🛍️ Servicio de Productos (`productService.js`)

**Funciones principales:**
- `getAllProductsService()` - Obtener todos los productos con categorías pobladas
- `getProductByIdService(id)` - Obtener producto específico por ID
- `createProductService(productData)` - Crear nuevo producto con validaciones
- `updateProductService(productId, updateData)` - Actualizar producto existente
- `deleteProductService(id)` - Eliminar producto y su imagen de S3
- `getAllColorsByProductService(idProduct)` - Obtener colores de un producto
- `getAllSizesByProductService(idProduct)` - Obtener tallas de un producto

**Características:**
- Gestión de stock por color
- Validación de colores duplicados
- Integración con categorías
- Eliminación automática de imágenes de S3
- Formateo de datos para frontend

### 📂 Servicio de Categorías (`categoryService.js`)

**Funciones principales:**
- `getCategoriesService()` - Obtener todas las categorías
- `getCategoryService(id)` - Obtener categoría específica
- `createCategoryService(categoryData)` - Crear nueva categoría
- `createCategoriesService(categoriesData)` - Crear múltiples categorías
- `findCategoryByName(name)` - Buscar categoría por nombre

**Características:**
- Validación de nombres únicos
- Creación masiva de categorías
- Integración con productos

### 🖼️ Servicio de Imágenes (`imageService.js`)

**Funciones principales:**
- `deleteImageFromS3(imageUrl)` - Eliminar imagen de AWS S3
- `generateSignedUrl(imageUrl, expiresIn)` - Generar URL firmada para acceso temporal

**Características:**
- Integración completa con AWS S3
- URLs firmadas con expiración configurable
- Manejo seguro de eliminación de archivos
- Extracción automática de keys de URLs

## 🛡️ Middlewares

### `verifyTokemMiddleware.js`
- Verificación de tokens JWT
- Validación de headers de autorización
- Manejo de errores de autenticación

### `uploadMiddleware.js`
- Configuración de Multer para subida de archivos
- Validación de tipos de archivo
- Procesamiento de imágenes con Sharp

## 🗄️ Modelos de Base de Datos

### User Model
```javascript
{
  nombre: String,
  email: String (único),
  password: String (encriptado),
  rol: String (default: "user"),
  activo: Boolean (default: true)
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ObjectId (ref: Category),
  colores: [{
    name: String,
    cantidad: Number,
    stock: Number
  }],
  talles: [String],
  imageUrl: String,
  stock: Boolean
}
```

### Category Model
```javascript
{
  nombre: String (único),
  description: String
}
```

## 🌐 API Endpoints

### Usuarios (`/api/users`)
- `POST /createUser` - Crear usuario
- `GET /getUsers` - Obtener todos los usuarios
- `POST /logIn` - Iniciar sesión
- `PUT /update/:id` - Actualizar usuario
- `GET /getRol/:id` - Obtener rol de usuario

### Productos (`/api/products`)
- `GET /getAllProducts` - Obtener todos los productos
- `GET /getProduct/:id` - Obtener producto por ID
- `POST /createProduct` - Crear producto
- `POST /createProducts` - Crear múltiples productos
- `PUT /updateProduct/:id` - Actualizar producto
- `DELETE /deleteProduct/:id` - Eliminar producto

### Categorías (`/api/categories`)
- `GET /getCategories` - Obtener todas las categorías
- `GET /getCategory/:id` - Obtener categoría por ID
- `POST /createCategory` - Crear categoría
- `POST /createCategories` - Crear múltiples categorías

## 📖 Documentación API

La documentación completa de la API está disponible en:
```
https://utn-backend-final.onrender.com/api-docs
```

Utiliza Swagger UI para una interfaz interactiva donde puedes probar todos los endpoints.

## 🔒 Seguridad

- **Autenticación JWT** con tokens de 1 hora de duración
- **Encriptación de contraseñas** con bcrypt
- **CORS configurado** para dominios específicos
- **Validación de datos** en todos los endpoints
- **Middleware de autenticación** para rutas protegidas
- **Manejo seguro de archivos** con AWS S3

## 🚀 Scripts Disponibles

```bash
npm start    # Ejecutar en producción
npm run dev  # Ejecutar en desarrollo con nodemon
npm test     # Ejecutar pruebas (no implementado)
```

## 🔧 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **AWS S3** - Almacenamiento de archivos
- **Swagger** - Documentación de API
- **Sharp** - Procesamiento de imágenes
- **Multer** - Manejo de archivos multipart

## 📝 Notas de Desarrollo

- El proyecto utiliza **ES Modules** (import/export)
- Las contraseñas se encriptan con **bcrypt** con salt rounds de 10
- Los tokens JWT expiran en **1 hora**
- Las imágenes se almacenan en **AWS S3** con URLs firmadas
- La documentación se genera automáticamente con **Swagger**
- El servidor se reinicia automáticamente en desarrollo con **nodemon**
