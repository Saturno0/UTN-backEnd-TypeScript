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
import { upload, uploadProductImage } from "../middlewares/uploadMiddleware.js";

export const productRouter = express.Router();

productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getProduct/:id", getProductById);
productRouter.post(
  "/createProduct",
  upload.single("image"),
  uploadProductImage,
  createProduct
);
productRouter.post("/createProducts", createProducts);
productRouter.patch("/updateProduct/:id", updateProduct);
productRouter.delete("/deleteProduct/:id", deleteProduct);
productRouter.get("/getAllColors/:id", getAllColorsByProduct);
productRouter.get("/getAllSizes/:id", getAllSizesByProduct);
