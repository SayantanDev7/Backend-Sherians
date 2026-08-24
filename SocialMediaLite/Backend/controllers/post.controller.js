import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import postModel from "../models/post.model.js";

// Helper: verify JWT from cookie and return the user
async function getAuthenticatedUser(req, res) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized: Login first" });
        return null;
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
        return null;
    }

    const user = await userModel.findById(decodedToken.id);
    if (!user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return null;
    }

    return user;
}

/* ─────────────────────────────────────────
   POST /posts/create   (protected)
   Body: { imageUrl, caption?, aiCaption? }
───────────────────────────────────────── */
async function createPost(req, res) {
    try {
        const user = await getAuthenticatedUser(req, res);
        if (!user) return;

        const { imageUrl, caption, aiCaption } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: "imageUrl is required" });
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
async function getAllPosts(req, res) {
    try {
        const posts = await postModel
            .find()
            .populate("author", "username email") // adjust fields as needed
            .sort({ createdAt: -1 });

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
async function getPost(req, res) {
    try {
        const { id } = req.params;

        const post = await postModel
            .findById(id)
            .populate("author", "username email");

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
        const user = await getAuthenticatedUser(req, res);
        if (!user) return;

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