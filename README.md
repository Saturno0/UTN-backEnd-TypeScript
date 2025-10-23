## Frontend — E‑commerce de ropa (React + TypeScript + Vite)

Aplicación SPA de comercio electrónico con frontend en React (Vite + TypeScript + Redux Toolkit + React Router). Este frontend consume una API REST ubicada en `backend/` (Express + MongoDB).

### Tecnologías
- Frontend: React 19, Vite 7, TypeScript, Redux Toolkit, React Router
- Estilos: CSS globales bajo `src/styles/`
- Backend (opcional): Express 5, Mongoose (MongoDB), JWT, Multer, AWS S3 (ver `../backend/`)

### Requisitos previos
- Node.js 18.17+ (recomendado Node 20 LTS)
- npm 9+
- Opcional para backend: MongoDB (local o Atlas)

Si ves `TypeError: crypto.hash is not a function`, actualiza tu versión de Node (Vite requiere una versión moderna).

### Puesta en marcha (solo frontend)
```bash
npm install
npm run dev
# abre http://localhost:5173
```

### Conectar con el backend (opcional)
1) Crea el archivo de entorno del frontend a partir de `env.example`:
```
VITE_API_BASE_URL=http://localhost:4000/api
```

2) Backend (en `backend/`):
```bash
cd ../backend
npm install
npm run dev
# API en http://localhost:4000
```

3) Variables de entorno del backend (crear `.env` usando `backend/env.model` como referencia):
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/tu-db
JWT_SECRET=tu_secreto
# Opcional S3
AWS_REGION=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
```

Asegúrate de que el valor de `VITE_API_BASE_URL` coincida con la URL donde corre tu API.

### Scripts
- `npm run dev`: inicia el servidor de desarrollo de Vite
- `npm run build`: compila TypeScript y genera el build de producción
- `npm run preview`: previsualiza el build de producción
- `npm run lint`: ejecuta ESLint

### Estructura (frontend)
```
src/
  components/      # Componentes de UI
  pages/           # Páginas del router
  hooks/           # Store de Redux y hooks (productos, categorías, usuarios)
  styles/          # Estilos globales
  config/          # Configuración de endpoints (api.ts)
  types/           # Tipos compartidos
public/
```

Puntos clave:
- `src/config/api.ts` centraliza rutas REST y las combina con `VITE_API_BASE_URL`.
- `src/hooks/store.ts` registra los slices globales (carrito y usuario).
- `src/pages` organiza las vistas principales (inicio, producto, carrito, checkout, login/registro, perfil, etc.).

### Problemas comunes
- Tipos de React/JSX: asegúrate de tener `@types/react` y `@types/react-dom` y que tu TS esté configurado para React.
- Errores por Node antiguo: actualiza a una versión LTS si Vite arroja errores de compatibilidad.

### Licencia
ISC (uso educativo/demostración).

