import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDatabase = async () => {
    try {
        if (!DB_URI) {
            throw new Error("Please define the MONGODB_URI environment variable inside .env.<development/production>.local");
        }
        await mongoose.connect(DB_URI);
        console.log(`Connected to database in ${NODE_ENV} mode.`);
    } catch (error) {
        console.error("Error connecting to database: ", error);
        throw error;
    }
}

export default connectToDatabase;

