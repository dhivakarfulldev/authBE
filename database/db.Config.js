import mongoose from "mongoose";
import dotenv from "dotenv"

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.DataBaseURL);
    console.log("DB connected");
    
    return connection
};

export default connectDB;