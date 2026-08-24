import express from "express"

const router = express.Router;

 /* 
 POST/api/posts {for the image file and text} 
 GET/api/posts/:id {to get the particular post}
 GET/api/posts/all {to get all the posts}
 DELETE/api/posts/:id {to delete the post}
 */

 router.post("/posts",postController.createPost)

 router.get("/posts/:id",postController.getPost)

 router.get("/posts/all",postController.getAllPosts)

 router.delete("/posts/:id",postController.deletePost)

 export default router