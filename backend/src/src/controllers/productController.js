import {
  createProductService,
  createProductsService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.status(200).json(products);
  } catch (error) {
    if (error.statusCode === 204) {
      res.status(204).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    res.status(200).json(product);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const response = await createProductService(productData);
    res.status(200).json(response);
  } catch (error) {
    if (error.statusCode === 409) {
      res.status(409).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const createProducts = async (req,res) => {
    try {
        const productsData = req.body;
        const response = await createProductsService(productsData);
    } catch (error) {
        if (error.statusCode === 409) {
            res.status(409).json(error.message);
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const response = await updateProductService(id, productData);
    res.status(200).json(response);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteProductService(id);
    res.status(200).json(response);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
