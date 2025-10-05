import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isGoodPassword } from "../utils/validator.js";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    
    email: { type: String, required: true, unique: true,maxlength: 30, minlength: 6, trim: true, match: /^\S+@\S+\.\S+$/ },
    
    password: { type: String,
      required: true,
      validate: {
        validator: function (value) {
          return isGoodPassword(value);
        },
        message: "Password must 8 characters minimum, with at least one number, one uppercase letter and one lowercase letter"
      }
    },

    rol: { 
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    
    activo: { 
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
})

export const User = models.User || model('User', userSchema);

