import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.Config.js";
import userrouter from "./routers/user.router.js"

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
app.use("/api/auth" , userrouter);

connectDB();

app.listen(process.env.PORT, (req , res) => {
    console.log(`server is running on ${process.env.PORT}`);
});