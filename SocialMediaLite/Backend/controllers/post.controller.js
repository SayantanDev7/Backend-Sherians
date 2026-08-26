import postModel from "../models/post.model.js";

/* ─────────────────────────────────────────
   POST /posts/create   (protected)
   Body: { imageUrl, caption?, aiCaption? }
───────────────────────────────────────── */
async function createPost(req, res) {
    try {
        const user = req.user; // set by authMiddleware

        const { imageUrl, caption, aiCaption } = req.body;

        if (!imageUrl || !caption) {
            return res.status(400).json({ message: " imageUrl and caption are required" });
        }

        const post = await postModel.create({
            author: user._id,
            imageUrl,
            caption: caption || "",
            aiCaption: aiCaption || "",
        });

        return res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ─────────────────────────────────────────
   GET /posts/all
   Returns all posts, newest first
───────────────────────────────────────── */

//Find ALL posts → get each author's username/email → show newest posts first.
async function getAllPosts(req, res) {
    try {
        const posts = await postModel
            .find() //to get all the posts in form of array
            .populate("author", "username email") // get the user's username and email by using the user's id  passed in author
            .sort({ createdAt: -1 }); //return posts in descending order of creation

        return res.status(200).json({ message: "Posts fetched successfully", posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ─────────────────────────────────────────
   GET /posts/:id
   Returns a single post by ID
───────────────────────────────────────── */

//Find ONE specific post → get its author's username/email.
async function getPost(req, res) {
    try {
        const { id } = req.params;

        const post = await postModel
            .findById(id) // to find by id
            .populate("author", "username email"); // to get username and email of author

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/* ─────────────────────────────────────────
   DELETE /posts/:id   (protected, author only)
───────────────────────────────────────── */
async function deletePost(req, res) {
    try {
        const user = req.user; // set by authMiddleware

        const { id } = req.params;

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Only the author can delete their own post
        if (post.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own posts" });
        }

        await postModel.findByIdAndDelete(id);

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const postController = {
    createPost,
    getAllPosts,
    getPost,
    deletePost,
};

export default postController;