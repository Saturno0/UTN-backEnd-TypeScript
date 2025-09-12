import express from 'express';
import bodyParser from 'body-parser'
import { connectDB } from './db.js'
import { PORT } from './config.js'
import { userRoute } from './src/routes/userRoute.js'
import session from 'express-session'

const app = express();

connectDB();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
        secret: SECRET, // Dato unico de nuestro sistema
        resave: false, // Evita que la sesion se vuelva a guardar si no hay datos
        saveUninitialized: false, // Evita que se guarde una sesion no inicializada
    })
)

app.use('/api/users', userRoute);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})