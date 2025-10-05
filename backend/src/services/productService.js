import { Product } from "../models/Product.js";
import { findProductById } from "../utils/helpers.js";

const productPopulateOptions = [
  { path: "tamaños", select: "nombre -_id" },
  { path: "category", select: "nombre -_id" },
];

const toPlainProduct = (product) =>
  product && typeof product.toObject === "function" ? product.toObject() : product;

const formatProductForFrontend = (product) => {
  if (!product) return product;

  const plainProduct = toPlainProduct(product);

  const formattedSizes = Array.isArray(plainProduct.tamaños)
    ? plainProduct.tamaños
        .map((size) => {
          if (!size) return null;
          if (typeof size === "string") return size;
          return size.nombre;
        })
        .filter(Boolean)
    : [];

  const formattedColors = Array.isArray(plainProduct.colores)
    ? plainProduct.colores
        .map((color) => {
          if (!color) return null;
          return {
            nombre: color.nombre,
            cantidad: Number.isFinite(Number(color.cantidad))
              ? Number(color.cantidad)
              : 0,
            stock: Number.isFinite(Number(color.stock))
              ? Number(color.stock)
              : 0,
            _id:
              color._id && typeof color._id.toString === "function"
                ? color._id.toString()
                : color._id,
          };
        })
        .filter((color) => color && color.nombre)
    : [];

  const categoryName =
    plainProduct.category && typeof plainProduct.category === "object"
      ? plainProduct.category.nombre
      : plainProduct.category;

  return {
    ...plainProduct,
    _id:
      plainProduct._id && typeof plainProduct._id.toString === "function"
        ? plainProduct._id.toString()
        : plainProduct._id,
    category: categoryName,
    tamaños: formattedSizes,
    colores: formattedColors,
  };
};

export const getAllProductsService = async () => {
  const products = await Product.find()
    .populate(productPopulateOptions)
    .lean();

  if (products.length === 0) {
    const error = new Error("No products found");
    error.statusCode = 204;
    throw error;
  }

  return products.map(formatProductForFrontend);
};

export const getProductByIdService = async (id) => {
  const product = await Product.findById(id)
    .populate(productPopulateOptions)
    .lean();

  if (!product) {
    const error = new Error("No product existing");
    error.statusCode = 404;
    throw error;
  }

  return formatProductForFrontend(product);
};

const normalizeColorsForPersistence = (colors = []) =>
  colors
    .filter((color) => color && color.nombre)
    .map((color) => ({
      nombre: color.nombre.trim(),
      cantidad: Number.isFinite(Number(color.cantidad))
        ? Number(color.cantidad)
        : 0,
      stock: Number.isFinite(Number(color.stock)) ? Number(color.stock) : 0,
    }));

export const createProductService = async (productData) => {
  const productExist = await Product.findOne({ name: productData.name });

  if (productExist) {
    const error = new Error("This product already exist");
    error.statusCode = 409;
    throw error;
  }

  const newProduct = new Product({
    ...productData,
    colores: normalizeColorsForPersistence(productData.colores),
  });

  await newProduct.save();

  return { message: "Product created successfully" };
};

export const createProductsService = async(productsData) => {
    const productsExist = await Product.find({ name: { $in: productsData.map(p => p.name) } });

    if(productsExist.length > 0) {
        const error = new Error("Some products already exist");
        error.statusCode = 409;
        throw error;
    }

    const formattedProducts = productsData.map((product) => ({
      ...product,
      colores: normalizeColorsForPersistence(product.colores),
    }));

    const newProducts = await Product.insertMany(formattedProducts);
    return { message: "Products created successfully", products: newProducts };
}



export const updateProductService = async (productId, updateData) => {
    const productExist = await Product.findOne({ _id: productId })

    if(!productExist){
       const error = new Error("The product you're trying to update does not exist")
        error.statusCode = 400;
        throw error;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: productId },
        updateData,
        { new: true }
    )

    return {
      product: updatedProduct,
      message: "product updated succesfully"
    }
}

export const deleteProductService = async(id) => {
    const product = await findProductById(id);

    await Product.deleteOne({_id: id});

    return { message: "Product deleted successfully" };
}