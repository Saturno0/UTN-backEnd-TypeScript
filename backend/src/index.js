import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';

import { connectDB } from './db.js';
import { CORS_ORIGIN, JWT_SECRET, PORT } from './config.js';
import { categoryRouter } from './src/routes/categoryRoute.js';
import { colorRouter } from './src/routes/colorRoute.js';
import { productRouter } from './src/routes/productRoute.js';
import { sizeRouter } from './src/routes/sizeRoute.js';
import { userRoute } from './src/routes/userRoute.js';

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = (CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(
    session({
        secret: JWT_SECRET, // Dato unico de nuestro sistema
        resave: false, // Evita que la sesion se vuelva a guardar si no hay datos
        saveUninitialized: false, // Evita que se guarde una sesion no inicializada
    })
)

app.use('/users', userRoute);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/sizes', sizeRouter);
app.use('/colors', colorRouter);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})