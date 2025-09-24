import express from "express";
import { createCategory, getCategories, getCategory } from "../controllers/categoryController.js";


export const categoryRouter = express.Router();

categoryRouter.get("/getCategories", getCategories);
categoryRouter.get("/getCategory/:id", getCategory);
categoryRouter.post("/createCategory", createCategory);