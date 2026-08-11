import express from "express"
import authModel from "../models/auth.model.js"

const router = express.Router();

router.post("/signup",async(req,res)=>{
    const {username,email,password} = req.body;
    if(username==undefined || email==undefined || password==undefined){
        return res.status(400).json({success:false,message:"Please enter all the fields"})
    }
    const user = await authModel.findOne({email});
    if(user){
        return res.status(400).json({success:false,message:"User already exists"})
    }
    const auth = await authModel.create({username,email,password})
    res.json({success:true,message:"User created successfully",auth})
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
    if(user.password!==password){
        return res.status(400).json({success:false,message:"Invalid password"})
    }
    res.json({success:true,message:"User logged in successfully",user})
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