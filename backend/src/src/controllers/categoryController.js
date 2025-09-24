import {
  createCategoryService,
  getCategoriesService,
  getCategoryService,
} from "../services/categoryService.js";

export const getCategories = async (req, res) => {
  try {
    console.log("getCategories controller");
    const categories = await getCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    if (error.statusCode === 204) {
      res.status(204).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getCategory = async (req, res) => {
  try {
    console.log("getCategory controller");
    const { id } = req.params;
    const category = await getCategoryService(id);
    res.status(200).json(category);
  } catch (error) {
    if (error.statusCode === 204) {
      res.status(204).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const createCategory = async (req, res) => {
  try {
    console.log("createCategory controller");
    const categoryData = req.body;
    const response = await createCategoryService(categoryData);
    res.status(201).json(response);
  } catch (error) {
    if (error.statusCode === 409) {
      res.status(409).json(error.message);
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
