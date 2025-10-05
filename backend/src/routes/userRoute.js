import express from "express";
import { createUser, getUsers, validate, updateUser, getRol } from "../controllers/userController.js";



export const userRoute = express.Router();

userRoute.post("/createUser", createUser);
userRoute.get("/getUsers", getUsers);
userRoute.post("/logIn", validate);
userRoute.patch("/update/:id", updateUser);
userRoute.get("/getRol/:id", getRol);