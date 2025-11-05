import nodemailer from 'nodemailer';
import {
  PORT,
  EMAIL_USER,
  EMAIL_PASS
} from '../../config.js';

const createTransporter = () => {
    return nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER.trim(),
    pass: EMAIL_PASS.trim(),
  },
});
}

export const sendContactEmail = async (orderData) => {
  const { nombre, email, telefono, direccion, ciudad, codigoPostal, items, total } = orderData;

  // Validación de datos requeridos
  if (!nombre || !email || !telefono || !direccion || !ciudad || !codigoPostal || !items || !total) {
    const error = new Error('Todos los campos son requeridos');
    error.statusCode = 400;
    throw error;
  }

  // Validar el email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Si el email no es valido ...
  if (!emailRegex.test(email)) {
    const error = new Error("El formato del email no es valido");
    error.statusCode = 400;
    throw error;
  }

  try {
    // Ejecutamos el metodo que tiene los datos en top
    const transporter = createTransporter();

    // Generar número de orden único
    const orderNumber = Date.now().toString().slice(-6);

    // Formatear items para la tabla HTML
    const formattedItems = items
      .map(
        (item) => `
            <tr>
                <td>${item.name}</td>
                <td>${item.color}</td>
                <td>${item.quantity}</td>
                <td>$${item.precio_actual}</td>
                <td>$${item.precio_actual * item.quantity}</td>
            </tr>
        `
      )
      .join('');

    const dataPedido = `
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
            </div>`;

    // Configurar opciones del email
    const mailStoreOwner = process.env.EMAIL_USER;

    const storeOwnerMailOptions = {
      from: mailStoreOwner,
      to: mailStoreOwner,
      subject: `Nueva Orden #${orderNumber} - E-Commerce`,
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
                    ${dataPedido}
                </div>
            `,
    };

    const customerMail = {
      from: mailStoreOwner,
      to: email,
      subject: `Resumen del pedido #${orderNumber} - E-Commerce`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333; text-align: center;">¡Gracias por tu compra!</h1>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="color: #333;">Hola ${nombre},</h2>
                        <p>Hemos recibido tu orden #${orderNumber}. A continuación, encontrarás un resumen de tu pedido:</p>
                    </div>
                    ${dataPedido}
                    <p style="text-align: center; margin-top: 30px;">¡Gracias por comprar con nosotros!</p>
                </div>
            `,
    };

    

    // Enviar el email
    const infoStoreOwner = await transporter.sendMail(storeOwnerMailOptions);
    const infoCustomer = await transporter.sendMail(customerMail);

    return {
      success: true,
      message: 'Orden recibida correctamente',
      orderNumber: orderNumber,
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


