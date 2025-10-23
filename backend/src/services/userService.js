import { JWT_SECRET } from "../../config.js";
import { User } from "../models/User.js"
// import { findUserByIdAndCheck } from "../utils/userHelpers.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

export const logIn = async(email, password) => {
    if(!(email && password)) {
        const error = new Error("There are missing fields");
        error.statusCode = 400;
        throw error;
    }

    const userFound = await User.findOne({email});

    if(!userFound) {
        const error = new Error("No user found");
        error.statusCode = 204;
        throw error;
    }

    // Comparamos la password que llega contra la guardada en la db
    // Toma la contraseña del cliente la encripta y la compara contra la guardada (encriptada)
    if(!bcrypt.compareSync(password, userFound.password)){
        const error = new Error("User or password are incorrect");
        error.statusCode = 400;
        throw error;
    }

    const payload = {
        userId: userFound._id,
        userEmail: userFound.email
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});

    const userObject = typeof userFound.toObject === 'function' ? userFound.toObject() : userFound;

    const safeUser = {
        id: userObject._id?.toString?.() ?? userObject._id,
        nombre: userObject.nombre ?? "",
        email: userObject.email,
        rol: userObject.rol ?? "user",
        activo: Boolean(userObject.activo ?? true)
    };

    return {message: "logged in succesfuly", token, user: safeUser};
}

export const updateUserService = async(idUser, updateData) => {
    const userExist = await User.findOne({ _id: idUser });
    
    if(!userExist){
        const error = new Error("The product you're trying to update does not exist")
        error.statusCode = 400;
        throw error;
    }

    const isChangingPassword = 'password' in updateData;

    if(isChangingPassword) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        { _id: idUser },
        updateData,
        { new: true }
    )
    
    return {
      product: updatedUser,
      message: "user updated succesfully"
    }
}

export const getRolService = async(idUser) => {
    const userExist = await User.findById(idUser).select('rol');

    if(!userExist){
        const error = new Error("The user you're trying to query does not exist")
        error.statusCode = 400;
        throw error;
    }

    const { rol } = userExist;

    return {
        rol
    };
}