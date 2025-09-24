import { Product } from "../models/Product.js";
import { findProductById } from "../utils/helpers.js";


export const getAllProductsService = async () => {
    const products = await Product.find();

    if(products.length === 0) {
        const error = new Error("No products found");
        error.statusCode = 204;
        throw error;
    }

    return products;
}

export const getProductByIdService = async(id) => {
    const product = await findProductById(id);
    return product;
}

export const createProductService = async(productData) => {
    const productExist = Product.findOne({name: productData.name});

    if(!productExist) {
        const error = new Error("This product already exist");
        error.statusCode = 409;
        throw error;
    }

    const newProduct = new Product(productData);

    await newProduct.save();

    return { message: "Product created successfully" };
}

export const createProductsService = async(productsData) => {
    const productsExist = await Product.find({ name: { $in: productsData.map(p => p.name) } });

    if(productsExist.length > 0) {
        const error = new Error("Some products already exist");
        error.statusCode = 409;
        throw error;
    }

    const newProducts = await Product.insertMany(productsData);
    return { message: "Products created successfully", products: newProducts };
}

export const updateProductService = async (id, productData) => {
    const product = await findProductById(id);

    const newProduct = await Product.assign(product, productData);
    await newProduct.save();

    return { message: "Product updated successfully" };
}

export const deleteProductService = async(id) => {
    const product = await findProductById(id);

    await Product.deleteOne({_id: id});

    return { message: "Product deleted successfully" };
}