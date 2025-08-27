## E‑Commerce Ropa (React + TypeScript + Vite + Express)

Single‑page e‑commerce demo with a React frontend (Vite + TypeScript + Redux Toolkit + React Router) and a simple Express server backed by MySQL.

### Tech stack
- Frontend: React 19, Vite 7, TypeScript, Redux Toolkit, React Router
- Backend: Express 5, `mysql2/promise`, CORS, Dotenv
- Styling: CSS modules and global styles under `src/styles/`

### Prerequisites
- Node.js 18.17+ (Node 20 LTS recommended)
- npm 9+
- Optional for backend: MySQL 8+

If you see `TypeError: crypto.hash is not a function`, upgrade Node (Vite requires modern Node).

### Getting started (frontend only)
```bash
npm install
npm run dev
# opens http://localhost:5173
```

### Run the backend (optional)
1) Configure environment variables (create `.env` from `env.example`):
```
PORT=4000
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=shopdb
```
2) Create schema (optional example under `database/schema.sql`).

3) Start the API:
```bash
npm run server:dev
# server runs on http://localhost:4000
```

Frontend endpoints expect your own data. Adjust any hardcoded URLs (e.g., in `src/components/Checkout.tsx`).

### Scripts
- `npm run dev`: start Vite dev server
- `npm run build`: type‑check and build
- `npm run preview`: preview production build
- `npm run lint`: run ESLint
- `npm run server:dev`: start Express with tsx

### Project structure (high‑level)
```
src/
  components/      # UI components
  pages/           # Route pages
  hooks/           # Redux store & slices
  styles/          # Global CSS
  server.ts        # Express server
public/
database/
```

### Troubleshooting
- Blue links / white text: the app imports `src/styles/Index.css`, and the default Vite `index.css` has been neutralized.
- Missing React/JSX types: install `@types/react @types/react-dom` and set `"jsx": "react-jsx"` in `tsconfig.app.json`.
- Node types/server types: install `@types/node @types/express @types/cors`.

### License
ISC (for educational/demo use).
