import express from "express"
import postController from "../controllers/post.controller.js";

const router = express.Router();

 /* 
 POST/api/create {for the image file and text} 
 GET/api/posts/all {to get all the posts}
 GET/api/posts/:id {to get the particular post}
 DELETE/api/posts/:id {to delete the post}
 */

 router.post("/create",postController.createPost) //its a protected API as we are verifying using token

 router.get("/all", postController.getAllPosts)

 router.get("/:id", postController.getPost)

 router.delete("/:id", postController.deletePost)

 export default router