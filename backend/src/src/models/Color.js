import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

// Coincide con los objetos de `colores` en products.json
const colorSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Color = models.Color || model('Color', colorSchema);

