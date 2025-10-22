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
    calificacion: { type: Number, default: 0, min: 0, max: 5 },
    opiniones: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true },
    stock: { type: Boolean, default: true },
    descuento: { type: Number, default: 0, min: 0, max: 100 },
    precio_actual: { type: Number, required: true, min: 0 },
    precio_original: { type: Number, required: true, min: 0 },

    // Relación con Size: talles disponibles para el producto
    talles: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        trim: true,
      }
    ],

    estado: {type: String, enum: ['Activo', 'Inactivo'], default: 'Activo', required: true},

    // Especificaciones embebidas
    especificaciones: especificacionesSchema,

    // Relación con Category
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },

    // Colores disponibles (estructura plana para facilitar su edición desde el frontend)
    colores: [{
        name: { type: String, required: true, trim: true },
        stock: { type: Number, required: true, default: 0, min: 0 },
      }
    ],

    ingreso: { type: String, enum: ['nuevo', 'viejo'], default: 'nuevo' },

    imageUrl: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return v === null || /^https?:\/\/.*\.amazonaws\.com\/.*$/.test(v);
        },
        message: "Invalid S3 image url"
      }
    }
  },
  { timestamps: true }
);

productSchema.methods.decreaseColorStock = async function(colorName, quantity) {
  if(quantity <= 0){
    throw new Error("Amount has to be a positive value")
  }

  const color = this.colores.find(c => c.name === colorName);
  if (!color) {
    throw new Error("Color not found");
  }

  if(color.cantidad < quantity) {
      throw new Error("Not enough quantity")
  }

  // Utilizar updateOne para actualizar el stock
  const result = await this.model('Product').updateOne(
      { _id: this._id, "colores.name": colorName },
      { $inc: { "colores.$.cantidad": -quantity } }
  );

  console.log({result})

  if(result.modifiedCount === 0){
      throw new Error("Failed to update stock")
  }

  // Actualizar el stock general del producto
  this.stock = this.colores.map(c => c.cantidad).reduce((acc, curr) => acc + curr, 0) > 0? true : false;
}

export const Product = models.Product || model('Product', productSchema);