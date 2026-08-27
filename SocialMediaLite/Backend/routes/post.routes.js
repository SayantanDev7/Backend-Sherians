import express from "express"
import postController from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() }) // using in memory storage to store the image temporarily in main memory


const router = express.Router();

 /* 
 POST/api/create {for the image file and text} 
 GET/api/posts/all {to get all the posts}
 GET/api/posts/:id {to get the particular post}
 DELETE/api/posts/:id {to delete the post}
 */

 router.post("/create", authMiddleware, upload.single("image"), postController.createPost) // protected: must be logged in

 router.get("/all", postController.getAllPosts)

 router.get("/:id", postController.getPost)

 router.delete("/:id", authMiddleware, postController.deletePost) // protected: author only

 export default router