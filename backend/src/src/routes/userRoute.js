import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";



export const userRoute = express.Router();

userRoute.post("/createUser", createUser);
userRoute.get("/getUsers", getUsers);