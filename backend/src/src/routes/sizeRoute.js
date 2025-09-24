import express from "express";
import {
  getAllSizes,
  getSizeById,
  createSize,
  createSizes,
} from "../controllers/sizeController.js";

export const sizeRouter = express.Router();

sizeRouter.get("/getAllSizes", getAllSizes);
sizeRouter.get("/getSize/:id", getSizeById);
sizeRouter.post("/createSize", createSize);
sizeRouter.post("/createSizes", createSizes);

