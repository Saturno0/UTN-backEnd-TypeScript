import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const especificacionesSchema = new Schema(
  {
    material: { type: String, trim: true },
    peso: { type: String, trim: true },
    fabricado_en: { type: String, trim: true },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    // Nota: Mongo usa _id. Si necesitas portar `id` numérico del JSON, puedes usar un campo separado.
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    calificacion: { type: Number, default: 0, min: 0, max: 5 },
    opiniones: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true },
    stock: { type: Boolean, default: true },
    descuento: { type: Number, default: 0, min: 0, max: 100 },
    precio_actual: { type: Number, required: true, min: 0 },
    precio_original: { type: Number, required: true, min: 0 },

    // Relación con Size: talles disponibles para el producto
    tamaños: [{ 
      name: { type: String, required: true, trim: true, enum: ["XS", "S", "M", "L", "XL"] },
    }],

    estado: {type: String, enum: ["Activo", "Inactivo"], default: "Activo", required: true},

    // Especificaciones embebidas
    especificaciones: especificacionesSchema,

    // Relación con Category
    category: { type: Schema.Types.ObjectId, ref: 'Category' },

    // Colores disponibles (estructura plana para facilitar su edición desde el frontend)
    colores: [
      {
        name: { type: String, required: true, trim: true },
        cantidad: { type: Number, required: true, default: 0, min: 0 },
        stock: { type: Number, required: true, default: 0, min: 0 },
      },
    ],

    ingreso: { type: String, enum: ['nuevo', 'viejo'], default: 'nuevo' },
  },
  { timestamps: true }
);

export const Product = models.Product || model('Product', productSchema);