import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';

import { connectDB } from '../db.js';
import { JWT_SECRET, PORT } from '../config.js';
import { categoryRouter } from '../src/routes/categoryRoute.js';
import { productRouter } from '../src/routes/productRoute.js';
import { userRoute } from '../src/routes/userRoute.js';
import { emailRoute } from '../src/routes/emailRoute.js';
import { specs, swaggerUi } from '../src/config/swagger.js';

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ("*");

app.use(cors({
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-commerce API Documentation'
}));

app.use('/api/users', userRoute);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api', emailRoute);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`)
})