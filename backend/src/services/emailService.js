import nodemailer from 'nodemailer';

// Configurar el transporter de nodemailer
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Error: EMAIL_USER and EMAIL_PASS environment variables are required');
        return null;
    }

    const transporter = nodemailer.createTransporter({
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

    return transporter;
};

export const sendOrderConfirmationEmail = async (orderData) => {
    try {
        const { nombre, email, telefono, direccion, ciudad, codigoPostal, items, total } = orderData;

        // Validación de datos requeridos
        if (!nombre || !email || !telefono || !direccion || !ciudad || !codigoPostal || !items || !total) {
            const error = new Error('Todos los campos son requeridos');
            error.statusCode = 400;
            throw error;
        }

        // Validación de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const error = new Error('El formato del email no es válido');
            error.statusCode = 400;
            throw error;
        }

        // Verificar configuración del transporter
        const transporter = createTransporter();
        if (!transporter) {
            const error = new Error('Email service not configured');
            error.statusCode = 500;
            throw error;
        }

        // Generar número de orden único
        const orderNumber = Date.now().toString().slice(-6);

        // Formatear items para la tabla HTML
        const formattedItems = items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.color}</td>
                <td>${item.quantity}</td>
                <td>$${item.precio_actual}</td>
                <td>$${item.precio_actual * item.quantity}</td>
            </tr>
        `).join('');

        // Configurar opciones del email
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

        // Enviar el email
        await transporter.sendMail(storeOwnerMailOptions);
        
        // Retornar resultado exitoso
        return {
            success: true,
            message: 'Orden recibida correctamente',
            orderNumber: orderNumber
        };

    } catch (error) {
        console.error('Error in sendOrderConfirmationEmail service:', error);
        
        // Si el error ya tiene statusCode, lo mantenemos
        if (error.statusCode) {
            throw error;
        }
        
        // Si no, le asignamos un error genérico del servidor
        const serverError = new Error('Error al procesar la orden');
        serverError.statusCode = 500;
        throw serverError;
    }
};
