import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const categorySchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, unique: true },
    descripcion: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Category = models.Category || model("Category", categorySchema);
