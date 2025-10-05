import { User } from "../models/User.js"
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

export const findUserById = async(userId) => {
    const user = await User.findOne({_id: userId});

    if(!user) {
        const error = new Error("No user existing");
        error.statusCode(204);
        throw error;
    }

    return user;
}

export const findCategoryById = async(categoryId) => {
    const category = await Category.findOne({_id: categoryId});

    if(!category) {
        const error = new Error("No Category existing");
        error.statusCode(204);
        throw error;
    }

    return category;
}

export const findProductById = async(productId) => {
    const product = await Product.findOne({_id: productId});

    if(!product) {
        const error = new Error("No product existing");
        error.statusCode(404);
        throw error;
    }

    return product;
}