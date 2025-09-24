import express from 'express';
import bodyParser from 'body-parser'
import { connectDB } from './db.js'
import { JWT_SECRET, PORT } from './config.js'
import { userRoute } from './src/routes/userRoute.js'
import session from 'express-session'
import { categoryRouter } from './src/routes/categoryRoute.js';
import { productRouter } from './src/routes/productRoute.js';
import { sizeRouter } from './src/routes/sizeRoute.js';
import { colorRouter } from './src/routes/colorRoute.js';

const app = express();

connectDB();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
        secret: JWT_SECRET, // Dato unico de nuestro sistema
        resave: false, // Evita que la sesion se vuelva a guardar si no hay datos
        saveUninitialized: false, // Evita que se guarde una sesion no inicializada
    })
)

app.use('/api/users', userRoute);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/sizes', sizeRouter);
app.use('/api/colors', colorRouter);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})