const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Error: EMAIL_USER and EMAIL_PASS environment variables are required');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error verifying email configuration:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

app.post('/api/send-confirmation', async (req, res) => {
    try {
        const { nombre, email, telefono, direccion, ciudad, codigoPostal, items, total } = req.body;

        if (!nombre || !email || !telefono || !direccion || !ciudad || !codigoPostal || !items || !total) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        const orderNumber = Date.now().toString().slice(-6);
        const formattedItems = items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.color}</td>
                <td>${item.quantity}</td>
                <td>$${item.precio_actual}</td>
                <td>$${item.precio_actual * item.quantity}</td>
            </tr>
        `).join('');

        const storeOwnerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Nueva Orden #${orderNumber} - CAMEO`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333; text-align: center;">¡Nueva Orden Recibida!</h1>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="color: #333;">Detalles del Cliente:</h2>
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Teléfono:</strong> ${telefono}</p>
                        <p><strong>Dirección:</strong> ${direccion}</p>
                        <p><strong>Ciudad:</strong> ${ciudad}</p>
                        <p><strong>Código Postal:</strong> ${codigoPostal}</p>
                    </div>
                    <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">Detalles del Pedido #${orderNumber}</h2>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 10px; text-align: left;">Producto</th>
                                <th style="padding: 10px; text-align: left;">Color</th>
                                <th style="padding: 10px; text-align: center;">Cantidad</th>
                                <th style="padding: 10px; text-align: right;">Precio</th>
                                <th style="padding: 10px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${formattedItems}
                        </tbody>
                    </table>
                    <div style="text-align: right; margin-top: 20px;">
                        <p><strong>Total del Pedido:</strong> $${total}</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(storeOwnerMailOptions);
        
        res.json({
            success: true,
            message: 'Orden recibida correctamente',
            orderNumber: orderNumber
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la orden'
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});