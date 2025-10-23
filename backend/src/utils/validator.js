import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config.js'

// Creamos una funcion que verifica y valida que el token sea correcto y funcional sin estar vencido
export function verifyToken(token) {
    try {
        // Decodificamos
       const decoded = jwt.verify(token, JWT_SECRET)
       return decoded
    } catch (error) {
        throw new Error("Invalid Token")
    }
}

export const isGoodPassword = value => {
    // minimo 8 caracteres, minimo un digito numerico, una letra minuscula y una letra mayuscula
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    return regex.test(value);
}