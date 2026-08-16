import express from "express"
import authModel from "../models/auth.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const router = express.Router();

router.post("/signup",async(req,res)=>{
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    
    if (!username || !email || !password) {
    return res.status(400).json({
        success: false,
        message: "Please enter all the fields"
    });
    }

    const user = await authModel.findOne({email});
    if(user){
        return res.status(400).json({success:false,message:"User already exists"})
    }

    

    try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authModel.create({
        username,
        email,
        password: hashedPassword
    });
    res.json({success:true,message:"User created successfully",user: {
        id: user._id,
        username: user.username,
        email: user.email
    }})

    } 
    catch (error) {
    console.log(error);
    if (error.code === 11000) {
        return res.status(409).json({
            message: "Email or username already exists"
        });
    }
    else{
        return res.status(500).json({success:false,message:"Internal server error"})
    }
    }
    
})

router.post("/login",async(req,res)=>{
    let {email,password} = req.body;
    email = email?.trim().toLowerCase();
    if(!email || !password){
        return res.status(400).json({success:false,message:"Please enter all the fields"})
    }
    const user = await authModel.findOne({email});
    if(!user){
        return res.status(400).json({success:false,message:"User not found"})
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if(!matchPassword){
        return res.status(400).json({success:false,message:"Invalid password"})
    }

    //create JWT
    const token = jwt.sign({
        id: user._id,
        username: user.username,
    },process.env.JWT_SECRET,{
        expiresIn: "1h"
    })

    //send the token in cookie
     res.cookie("token", token, {
        httpOnly: true, //to make sure browser cant access the cookie
        secure: process.env.NODE_ENV === "production", //to make sure cookie is only sent in https connection
        sameSite: "strict", //to prevent cross site request forgery
        maxAge: 60 * 60 * 1000 //cookie will expire in 1 hour
    });

    res.json({success:true,message:"User logged in successfully",user: {
        username: user.username,
        email: user.email,
    }})
})

router.get("/user/:username",async(req,res) =>{
    const {username} = req.params;
    const token = req.cookies.token; //now no need of passing token in the request body
    
    if(username==undefined){
        return res.status(400).json({success:false,message:"Please enter username"})
    }

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    //just to verify the token we use jwt.verify nothing else
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(decodedToken.username !== username){
            return res.status(401).json({success:false,message:"Unauthorized"})
        }
        const user = await authModel.findOne({
            _id:decodedToken.id
        })
        if(user){
            return res.json({success:true,message:"User fetched successfully",user})
        }
        else{
            return res.status(404).json({success:false,message:"User not found"})
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false,message:"Unauthorized"})
    }

})

// No need for username or any query parameter during logout.
// Each browser has its own cookie, so when a user requests logout,
// their browser automatically sends its token cookie to the server.
// We simply clear that cookie; the user account remains in MongoDB.
router.get("/logout",async(req,res) =>{
   res.clearCookie("token");
   res.json({success:true,message:"User logged out successfully"})
})

export default router;