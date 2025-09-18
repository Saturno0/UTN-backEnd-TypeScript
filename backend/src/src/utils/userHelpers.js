import { User } from "../models/User.js"

export const findUserById = (userId) => {
    const user = User.findOne({_id: userId});

    if(!user) {
        const error = new Error("No user existing");
        error.stateCode(204);
        throw error;
    }

    return user;
}