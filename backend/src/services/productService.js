import { Product } from "../models/Product.js";
import { findProductById } from "../utils/helpers.js";
import { findCategoryByName } from "./categoryService.js";
import { deleteImageFromS3, generateSignedUrl } from "./imageService.js";

const productPopulateCategory = { path: "category", select: "nombre" };

const toPlainProduct = (product) =>
  product && typeof product.toObject === "function"
    ? product.toObject()
    : product;

const formatProductForFrontend = (product) => {
  if (!product) return product;

  const plainProduct = toPlainProduct(product);

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
  };
};

export const getAllColorsByProductService =  async(idProduct) => {
  const producExist = await Product.findById(idProduct);

  if(!producExist) {
    const error = new Error("No existing product");
    error.statusCode = 204;
    throw error;
  }

  const colors = producExist.colores;

  return {colors};
}

export const getAllProductsService = async () => {
  const products = await Product.find()
    .populate(productPopulateCategory)
    .lean();

  if (products.length === 0) {
    const error = new Error("No products found");
    error.statusCode = 204;
    throw error;
  }

  return products.map((product) => formatProductForFrontend(product));
};

export const getProductByIdService = async (id) => {
  const product = await Product.findById(id)
    .populate(productPopulateCategory)
    .lean();

  if (!product) {
    const error = new Error("No product existing");
    error.statusCode = 404;
    throw error;
  }

  return formatProductForFrontend(product);
};

export const createProductService = async (productData) => {
  const productExist = await Product.findOne({ name: productData.name });

  if (productExist) {
    const error = new Error("This product already exist");
    error.statusCode = 409;
    throw error;
  }

  const category = await findCategoryByName(productData.category);
  console.log(productData.talles)

  if (category) {
    const idCategory = category._id;
    productData.category = idCategory;
  }

  // Validate duplicate colors in incoming data (by name)
  if (Array.isArray(productData?.colores)) {
    const seen = new Set();
    const duplicates = [];
    for (const c of productData.colores) {
      const key = typeof c === "string" ? c.trim().toLowerCase() : String(c?.name || "").trim().toLowerCase();
      if (!key) continue;
      if (seen.has(key)) duplicates.push(key);
      seen.add(key);
    }
    if (duplicates.length > 0) {
      const error = new Error("Duplicate colors in payload: " + [...new Set(duplicates)].join(", "));
      error.statusCode = 400;
      throw error;
    }
  }

  // Normalize colores: ensure numeric fields and initialize per-color stock from cantidad when creating
  if (Array.isArray(productData?.colores)) {
    productData.colores = productData.colores.map((c) => {
      const name = String(c?.name ?? '').trim();
      const cantidad = Number(c?.cantidad) || 0;
      let stockRaw = c?.stock;
      let stockNum = typeof stockRaw === 'string' ? Number(stockRaw) : stockRaw;
      if (!Number.isFinite(stockNum) || stockNum === undefined || stockNum === null || stockNum < 0) {
        stockNum = cantidad;
      }
      const stock = stockNum;
      return { name, cantidad, stock };
    });
  }

  // Compute overall product stock based on sum of per-color stock
  if (Array.isArray(productData?.colores)) {
    const total = productData.colores.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
    productData.stock = total > 0 ? true : false;
  }

  const newProduct = new Product(productData);

  await newProduct.save();

  return { message: "Product created successfully" };
};

export const getAllSizesByProductService = async (idProduct) => {
  const productExist = await Product.findById(idProduct);

  if (!productExist) {
    const error = new Error("No product existing");
    error.statusCode = 404;
    throw error;
  }

  const sizes = productExist.talles;

  return { sizes };
};

export const createProductsService = async (productsData) => {
  const productsExist = await Product.find({
    name: { $in: productsData.map((p) => p.name) },
  });

  if (productsExist.length > 0) {
    const error = new Error("Some products already exist");
    error.statusCode = 409;
    throw error;
  }

  const formattedProducts = productsData.map((product) => ({ ...product }));

  console.log(formattedProducts);
  const newProducts = await Product.insertMany(formattedProducts);

  return { message: "Products created successfully", products: newProducts };
};

export const updateProductService = async (productId, updateData) => {
  const productExist = await Product.findOne({ _id: productId });

  if (!productExist) {
    const error = new Error(
      "The product you're trying to update does not exist"
    );
    error.statusCode = 404;
    throw error;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: productId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return {
    product: toPlainProduct(updatedProduct),
    message: "product updated successfully",
  };
};

export const deleteProductService = async (id) => {
  console.log(id);
  const product = await findProductById(id);
  if(!product) {
    const error = new Error("No product existing");
    error.statusCode = 404;
    throw error;
  }

  await deleteImageFromS3(product.imageUrl);
  await Product.deleteOne({ _id: id });

  return { message: "Product deleted successfully" };
};
