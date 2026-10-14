import { use } from "react";
import User from "../models/user.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendForgotPasswordEmail, sendWelcomeEmail } from "../services/nodemailer.services.js";

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashPassword,
    });

    sendWelcomeEmail(name, email);

    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(409).json({ message: "Invalid password" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Login SuccessFully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      },
    );
    
    
    sendForgotPasswordEmail(email , token)

    return res.status(200).json({message:"Password reset link sent successfully"});
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
};
export const verifyToken = async(req,res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if(!token){
          return res.status(409).json({message:"Token is missing"})
        }
        
       const decoded =  jwt.verify(token , process.env.SECRET_KEY);
       
       const user = User.findById(decoded._id);
       if(!user){
        return res.status(404).json({message:"User not found"});
       }

       return res.status(200).json({message:"Token verified successfully"});
       
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
}

export const changePassword = async (req , res) => {
  try {
    const {newpassword} = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      return res.status(409).json({message:"Token is Missing"});
    }

   const decoded =  jwt.verify(token , process.env.SECRET_KEY);

   const user = await User.findById(decoded._id);

   if(!user){
    return res.status(404).json({message:"user not found"});
   }

   const hashedPassword = await bcrypt.hash(newpassword , 10);

   user.password = hashedPassword;
   await user.save();

   return res.status(200).json({message:"Password Changed Successfully"});
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}
