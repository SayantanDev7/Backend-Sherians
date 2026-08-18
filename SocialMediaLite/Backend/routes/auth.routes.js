import express from "express"
import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const router = express.Router();

/*
POST /signup
POST /login
GET /user [protected]
*/

router.post("/signup", async (req, res) => {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all the fields",
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const createdUser = await userModel.create({ username, email, password });
        return res.status(201).json({ success: true, message: "User created successfully", createdUser });

    } catch (error) {
        // Mongoose validation error → return the exact message (e.g. "bad username")
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages[0] });
        }
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

router.post("/login",async (req,res) =>{
    
    let {email,password} = req.body;
    email = email?.trim().toLowerCase();
    
    if(!email || !password){
        return res.status(400).json({success:false,message:"Please enter all the fields"})
    }

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({success:false,message:"User not found"})
    }

    // Your login route decides when to use that logic and the compare logic is in user model
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        return res.status(401).json({
            success:false,
            message:"Invalid password"
        })
    }
    
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
    );

    res.cookie("token",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })


    return res.json({success:true,message:"User logged in successfully",user: {
        id: user._id,
        username: user.username,
        email: user.email,
    }})
    

})



export default router;