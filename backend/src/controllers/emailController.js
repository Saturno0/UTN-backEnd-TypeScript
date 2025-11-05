import { sendContactEmail } from "../services/emailService.js";

export const sendConfirmation = async (req, res) => {
    try {
        const result = await sendContactEmail(req.body);
        res.json(result);
    } catch (error) {
        console.error('Error in sendConfirmation controller:', error);
        
        // Usar el statusCode del error si existe, sino usar 500
        const statusCode = error.statusCode || 500;
        
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Error al procesar la orden'
        });
    }
};
