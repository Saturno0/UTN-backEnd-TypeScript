import { createUserService, getUsersService, logIn } from "../services/userService.js"




export const createUser = async (req, res) => {
    try {
        const response = await createUserService(req.body);
        res.status(201).json(response);
    } catch (error) {
        if (error.statusCode == 409) {
            return res.status(error.statusCode).json(error.message);
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        res.status(201).json(users);
    } catch (error) {
        if (error.statusCode == 204) {
            return res.status(error.statusCode).json(error.message);
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const validate = async(req, res) => {
    try {
        const {email, password} = req.body;
        const result = await logIn(email, password);
        console.log(result);
        return res.status(200).json({ message: result.message });
    } catch (error) {
        if(error.statusCode === 400){
            return res.status(error.statusCode).json({message: error.message})
        }
        return res.status(500).json({message: "Internal server error", error: error.message})
    }
}