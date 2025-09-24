import { Category } from "../models/Category.js";

export const getCategoriesService = async () => {
  const categories = await Category.find();

  if (categories.length === 0) {
    const error = new Error("No categories found");
    error.statusCode = 204;
    throw error;
  }

  return categories;
};

export const getCategoryService = async (id) => {
  const category = findCategoryById(id);
  return category;
};

export const createCategoryService = async (categoryData) => {
  const categoryExist = await Category.findOne({ nombre: categoryData.nombre });

  if (categoryExist) {
    const error = new Error("Category already exist");
    error.statusCode = 409;
    throw error;
  }

  const newCategory = new Category(categoryData);

  await newCategory.save();

  return { message: "Category created successfully" };
};
