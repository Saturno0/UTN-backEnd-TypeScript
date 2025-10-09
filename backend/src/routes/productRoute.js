import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  createProducts,
  updateProduct,
  deleteProduct,
  getAllColorsByProduct,
  getAllSizesByProduct,
} from "../controllers/productController.js";

export const productRouter = express.Router();

productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getProduct/:id", getProductById);
productRouter.post("/createProduct", createProduct);
productRouter.post("/createProducts", createProducts);
productRouter.patch("/updateProduct/:id", updateProduct);
productRouter.delete("/deleteProduct/:id", deleteProduct);
productRouter.get("/getAllColors/:id", getAllColorsByProduct);
productRouter.get("/getAllSizes/:id", getAllSizesByProduct);