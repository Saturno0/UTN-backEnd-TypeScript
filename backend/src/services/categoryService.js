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
    const error = new Error({ message: "Category already exist", detail: categoryExist});
    error.statusCode = 409;
    throw error;
  }

  const newCategory = new Category(categoryData);

  await newCategory.save();

  return { message: "Category created successfully" };
};

export const findCategoryByName = async (name) => {
  const category = await Category.findOne({nombre: name});
  if (!category) {
    return false;
  }
  return category?._id;
}

export const createCategoriesService = async (categoriesData) => {
  const nombres = categoriesData.map((c) => c.nombre);
  console.log(nombres);
    const existings = await Category.find({ nombre: { $in: nombres } });
    if (existings.length > 0) {
      const error = new Error(`Categories already exist`);
      error.statusCode = 409;
      
      throw error;
    }
  
    const created = await Category.insertMany(categoriesData);
    return { message: "Categories created successfully", categories: created };
}