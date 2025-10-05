import express from "express";
import { createUser, getUsers, validate } from "../controllers/userController.js";



export const userRoute = express.Router();

userRoute.post("/createUser", createUser);
userRoute.get("/getUsers", getUsers);
userRoute.get("/logIn", validate);
// userRoute.patch("/update", updateUser);