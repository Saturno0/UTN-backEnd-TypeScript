import { Color } from "../models/Color.js";

export const getAllColorsService = async () => {
  const colors = await Color.find();
  if (colors.length === 0) {
    const error = new Error("No colors found");
    error.statusCode = 204;
    throw error;
  }
  return colors;
};

export const getColorByIdService = async (id) => {
  const color = await Color.findById(id);
  if (!color) {
    const error = new Error("No color found");
    error.statusCode = 204;
    throw error;
  }
  return color;
};

export const createColorService = async (colorData) => {
  const existing = await Color.findOne({ nombre: colorData.nombre });
  if (existing) {
    const error = new Error("Color already exists");
    error.statusCode = 409;
    throw error;
  }

  const newColor = new Color(colorData);
  await newColor.save();
  return { message: "Color created successfully" };
};

export const createColorsService = async (colorsData) => {
  const nombres = colorsData.map((c) => c.nombre);
  const existings = await Color.find({ nombre: { $in: nombres } });
  if (existings.length > 0) {
    const error = new Error("Some colors already exist");
    error.statusCode = 409;
    throw error;
  }

  const created = await Color.insertMany(colorsData);
  return { message: "Colors created successfully", colors: created };
};

