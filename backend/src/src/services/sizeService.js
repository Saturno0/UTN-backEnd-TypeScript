import { Size } from "../models/Size.js";

export const getAllSizesService = async () => {
  const sizes = await Size.find();
  if (sizes.length === 0) {
    const error = new Error("No sizes found");
    error.statusCode = 204;
    throw error;
  }
  return sizes;
};

export const getSizeByIdService = async (id) => {
  const size = await Size.findById(id);
  if (!size) {
    const error = new Error("No size found");
    error.statusCode = 204;
    throw error;
  }
  return size;
};

export const createSizeService = async (sizeData) => {
  const existing = await Size.findOne({ nombre: sizeData.nombre });
  if (existing) {
    const error = new Error("Size already exists");
    error.statusCode = 409;
    throw error;
  }

  const newSize = new Size(sizeData);
  await newSize.save();
  return { message: "Size created successfully" };
};

export const createSizesService = async (sizesData) => {
  const nombres = sizesData.map((s) => s.nombre);
  const existings = await Size.find({ nombre: { $in: nombres } });
  if (existings.length > 0) {
    const error = new Error("Some sizes already exist");
    error.statusCode = 409;
    throw error;
  }

  const created = await Size.insertMany(sizesData);
  return { message: "Sizes created successfully", sizes: created };
};

