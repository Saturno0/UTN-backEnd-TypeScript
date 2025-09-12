import express from "express";
import { createUser, getUsers } from "../controllers/userController";



const userRoute = express.Router();

userRoute.post("/createUsers", createUser);
userRoute.get("/getUsers", getUsers);