import express from "express";
import {
  getAllColors,
  getColorById,
  createColor,
  createColors,
} from "../controllers/colorController.js";

export const colorRouter = express.Router();

colorRouter.get("/getAllColors", getAllColors);
colorRouter.get("/getColor/:id", getColorById);
colorRouter.post("/createColor", createColor);
colorRouter.post("/createColors", createColors);

