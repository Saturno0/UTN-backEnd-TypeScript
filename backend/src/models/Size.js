import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const sizeSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    descripcion: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Size = models.Size || model('Size', sizeSchema);

