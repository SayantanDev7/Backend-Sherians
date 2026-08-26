import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";

async function authMiddleware(req, res, next) {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized: Token not found"})
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        if(!user){
            return res.status(401).json({success:false,message:"Unauthorized: User not found"})
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(401).json({success:false,message:"Unauthorized: Invalid token"})
    }
}

export default authMiddleware;