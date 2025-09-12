import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";
import User from "../models/userModel.js";
import bcrypt from 'bcrypt';


export const createUserService = async (userData) => {

    const userExist = await User.findOne({email: userData.email});

    if(userExist) {
        const error = new Error("User already exist");
        error.statusCode = 409;
        throw error;
    }

    const newUser = new User(userData);

    await newUser.save();

    return { message: "User created succesfully" };
}

export const getUsersService = async () => {
    const usersData = await User.find();

    if (usersData.length === 0) {
        const error = new Error("No user found");
        error.statusCode = 204;
        throw error;
    }

    return usersData;
}