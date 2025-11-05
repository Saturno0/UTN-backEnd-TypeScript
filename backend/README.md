# Backend - E-commerce API

Backend de e-commerce desarrollado con Node.js, Express y MongoDB. Expone una API RESTful para la gestión de usuarios, productos, categorías, envío de emails y manejo de imágenes en S3. Incluye documentación Swagger.

## Características Principales

- API RESTful con documentación Swagger
- Autenticación JWT para usuarios
- Gestión de productos (colores, talles y stock)
- Sistema de categorías
- Subida y gestión de imágenes en AWS S3 (URLs firmadas)
- Validación robusta y middlewares de seguridad

## Dependencias Principales

- express, cors, body-parser, express-session
- mongoose, mongodb
- jsonwebtoken, bcrypt
- multer, sharp
- @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- swagger-jsdoc, swagger-ui-express
- nodemailer

Desarrollo: dotenv, nodemon, npm-check-updates

## Estructura del Proyecto

```
backend/
├─ api/
│  └─ index.js               # Punto de entrada del servidor
├─ src/
│  ├─ config/
│  │  ├─ aws.js              # Configuración AWS S3
│  │  └─ swagger.js          # Configuración Swagger
│  ├─ controllers/
│  │  ├─ categoryController.js
│  │  ├─ productController.js
│  │  └─ userController.js
│  ├─ middlewares/
│  │  ├─ uploadMiddleware.js
│  │  └─ verifyTokemMiddleware.js
│  ├─ models/
│  │  ├─ Category.js
│  │  ├─ Product.js
│  │  └─ User.js
│  ├─ routes/
│  │  ├─ categoryRoute.js
│  │  ├─ productRoute.js
│  │  ├─ userRoute.js
│  │  └─ emailRoute.js
│  └─ services/
│     ├─ categoryService.js
│     ├─ imageService.js
│     ├─ productService.js
│     └─ emailService.js
├─ config.js                  # Variables de entorno
├─ db.js                      # Conexión a la base de datos
├─ package.json
└─ env.model
```

## Configuración

Crear el archivo de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

Variables disponibles (placeholders en `.env.example`):

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

# Email Configuration
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

## Instalación

```bash
npm install        # Instala dependencias
npm run dev        # Modo desarrollo
npm start          # Producción
```

## Modelos de Base de Datos

### User
```javascript
{
  nombre: String,
  email: String, // único
  password: String, // encriptado
  rol: String, // default: "user"
  activo: Boolean // default: true
}
```

### Product
```javascript
{
  name: String,
  calificacion: Number,            // 0..5 (default 0)
  opiniones: Number,               // >= 0 (default 0)
  description: String,
  stock: Boolean,                  // default: true
  descuento: Number,               // 0..100 (default 0)
  precio_actual: Number,           // requerido
  precio_original: Number,         // requerido
  talles: ["XS","S","M","L","XL","XXL"],
  estado: "Activo" | "Inactivo", // default: "Activo"
  especificaciones: {
    material: String,
    peso: String,
    fabricado_en: String
  },
  category: ObjectId,              // ref: Category, requerido
  colores: [{ name: String, stock: Number }],
  ingreso: "nuevo" | "viejo",     // default: "nuevo"
  imageUrl: String | null          // URL S3 válida o null
}
```

### Category
```javascript
{
  nombre: String,     // único
  descripcion: String
}
```

## Endpoints y Verbos HTTP

Prefijo base: `/api`

### Usuarios (`/api/users`)
- POST `/createUser` — Crear usuario
- GET `/getUsers` — Listar usuarios
- POST `/logIn` — Inicio de sesión (JWT)
- PATCH `/update/:id` — Actualizar usuario
- GET `/getRol/:id` — Obtener rol

### Productos (`/api/products`)
- GET `/getAllProducts` — Listar productos
- GET `/getProduct/:id` — Obtener producto por ID
- POST `/createProducts` — Crear múltiples productos
- PATCH `/updateProduct/:id` — Actualizar producto
- DELETE `/deleteProduct/:id` — Eliminar producto
- GET `/getAllColors/:id` — Colores del producto
- GET `/getAllSizes/:id` — Talles del producto

### Categorías (`/api/categories`)
- GET `/getCategories` — Listar categorías
- GET `/getCategory/:id` — Obtener categoría
- POST `/createCategory` — Crear categoría
- POST `/createCategories` — Crear múltiples categorías

### Email (`/api/email`)
- POST `/send-confirmation` — Enviar confirmación de orden por email

## Servicio de Email

- Función: `sendOrderConfirmationEmail(orderData)`
- Valida datos de entrada, genera número de orden y envía dos correos:
  - Al administrador (resumen completo)
  - Al cliente (confirmación y detalle)
- Requiere variables `EMAIL_USER` y `EMAIL_PASS`

## Swagger

- UI: `GET /api-docs`
- Incluye especificaciones generadas por `swagger-jsdoc` a partir de anotaciones JSDoc en rutas (p. ej., `src/routes/emailRoute.js`).

## Ejemplos de Datos Mock (JSON)

### Usuarios

Solicitud: crear usuario (`POST /api/users/createUser`)
```json
{
  "nombre": "Laura Pérez",
  "email": "laura@example.com",
  "password": "Secreta123!",
  "rol": "user"
}
```

Solicitud: login (`POST /api/users/logIn`)
```json
{
  "email": "laura@example.com",
  "password": "Secreta123!"
}
```

Solicitud: actualizar usuario (`PATCH /api/users/update/665fa2e9c5a2f0a9b4f0d1a1`)
```json
{
  "nombre": "Laura P.",
  "rol": "admin",
  "activo": true
}
```

Respuesta (ejemplo genérico)
```json
{
  "success": true,
  "data": {
    "_id": "665fa2e9c5a2f0a9b4f0d1a1",
    "nombre": "Laura Pérez",
    "email": "laura@example.com",
    "rol": "user",
    "activo": true
  }
}
```

### Categorías

Solicitud: crear categoría (`POST /api/categories/createCategory`)
```json
{
  "nombre": "Zapatillas",
  "description": "Calzado deportivo"
}
```

Solicitud: crear múltiples categorías (`POST /api/categories/createCategories`)
```json
[
  { "nombre": "Remeras", "description": "Prendas superiores" },
  { "nombre": "Pantalones", "description": "Prendas inferiores" },
  { "nombre": "Accesorios", "description": "Gorros, medias, etc." }
]
```

### Productos

Solicitud: crear múltiples productos (`POST /api/products/createProducts`)
```json
{
  "products": [
    {
      "name": "Zapatilla Runner Pro",
      "description": "Zapatilla liviana para running",
      "precio_actual": 79999.99,
      "precio_original": 99999.99,
      "category": "6775f2e8c5a2f0a9b4f0d1a1",
      "talles": ["M", "L"],
      "colores": [
        { "name": "Negro", "stock": 10 },
        { "name": "Blanco", "stock": 5 }
      ],
      "especificaciones": { "material": "Sintético", "peso": "250g", "fabricado_en": "AR" },
      "estado": "Activo",
      "ingreso": "nuevo",
      "imageUrl": "https://s3.amazonaws.com/mi-bucket/products/runner-pro.jpg"
    }
  ]
}
```

Solicitud: actualizar producto (`PUT /api/products/updateProduct/665fa3f0c5a2f0a9b4f0d1b2`)
```json
{
  "price": 74999.99,
  "stock": true,
  "colores": [
    { "name": "Rojo", "cantidad": 3, "stock": 3 }
  ]
}
```

Respuesta: colores por producto (`GET /api/products/:id/colors`)
```json
[
  { "name": "Negro", "cantidad": 10, "stock": 10 },
  { "name": "Blanco", "cantidad": 5, "stock": 5 }
]
```

Respuesta: talles por producto (`GET /api/products/:id/sizes`)
```json
["39", "40", "41", "42"]
```

### Email

Solicitud: enviar confirmación de pedido (`POST /api/email/send-confirmation`)
```json
{
  "nombre": "Laura Pérez",
  "email": "laura@example.com",
  "telefono": "+54 9 11 5555-5555",
  "direccion": "Av. Siempre Viva 742",
  "ciudad": "Buenos Aires",
  "codigoPostal": "1000",
  "items": [
    { "name": "Zapatilla Runner Pro", "color": "Negro", "quantity": 2, "precio_actual": 79999.99 },
    { "name": "Remera Tech", "color": "Azul", "quantity": 1, "precio_actual": 19999.99 }
  ],
  "total": 179999.97
}
```

Respuesta (exitosa)
```json
{
  "success": true,
  "message": "Orden recibida correctamente",
  "orderNumber": "123456"
}
```

Respuesta (error de validación)
```json
{
  "success": false,
  "message": "Todos los campos son requeridos"
}
```

### Imágenes (servicio interno)

Entrada: eliminar imagen de S3
```json
{
  "imageUrl": "https://s3.amazonaws.com/mi-bucket/products/runner-pro.jpg"
}
```

Entrada: generar URL firmada
```json
{
  "imageUrl": "https://s3.amazonaws.com/mi-bucket/products/runner-pro.jpg",
  "expiresIn": 900
}
```

## Notas

- Archivo guardado en UTF-8 para evitar problemas de acentuación.
- Endpoint de email aclarado: `POST /api/email/send-confirmation`.
