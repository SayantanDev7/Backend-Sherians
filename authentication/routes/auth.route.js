import express from "express"
import authModel from "../models/auth.model.js"
import bcrypt from "bcrypt"

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
    const {email,password} = req.body;
    if(email==undefined || password==undefined){
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
    res.json({success:true,message:"User logged in successfully",user: {
        username: user.username,
        email: user.email
    }})
})

router.get("/user/:username",async(req,res) =>{
    const {username} = req.params;
    if(username==undefined){
        return res.status(400).json({success:false,message:"Please enter username"})
    }
    const user = await authModel.findOne({username});
    if(user){
        return res.json({success:true,message:"User fetched successfully",user})
    }
    else{
        return res.status(404).json({success:false,message:"User not found"})
    }
})

router.get("/logout/:username",async(req,res) =>{
    const {username} = req.params;
    if(username==undefined){
        return res.status(400).json({success:false,message:"Please enter username to log out"})
    }
    const user = await authModel.findOne({username});
    if(user){
        await authModel.deleteOne({username});
        return res.json({success:true,message:"User logged out successfully",user})
    }
    else{
        return res.status(404).json({success:false,message:"User not found"})
    }
})

export default router;