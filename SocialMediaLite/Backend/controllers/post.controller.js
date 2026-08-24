import mongoose from "mongoose";

async function createPost(req,res){
    try {
        const {user ,text} = req.body;
        if(!user || !text){
            return res.status(400).json({message:"All fields are required"})
        }
        
    } catch (error) {
        
    }
}

async function getPost(req,res){
    try {
        
    } catch (error) {
        
    }
}

async function getAllPosts(req,res){
    try {
        
    } catch (error) {
        
    }
}

async function deletePost(req,res){
    try {
        
    } catch (error) {
        
    }
}

const postController = {
    createPost,
    getPost,
    getAllPosts,
    deletePost
}
export default postController