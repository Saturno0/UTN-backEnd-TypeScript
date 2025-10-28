import express from "express";
import { sendConfirmation } from "../controllers/emailController.js";

export const emailRoute = express.Router();

/**
 * @swagger
 * /api/emial/send-confirmation:
 *   post:
 *     summary: Enviar confirmación de orden por email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailOrder'
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailResponse'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
emailRoute.post("/send-confirmation", sendConfirmation);
