import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ['user', 'admin'], default: 'user' },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = models.User || model('User', userSchema);

