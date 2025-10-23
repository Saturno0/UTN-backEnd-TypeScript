import mongoose from "mongoose";
import { MONGO_URI, DB } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${MONGO_URI}`);
        console.log("Database connected");
    } catch (error) {
        console.error("Error al conectar: ", error.message);
        process.exit(1);
    }
}
