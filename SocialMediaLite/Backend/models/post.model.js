import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //refer to the User model of mongodb created in userSchema
            required: true,
        },
        imageUrl: {
            type: String,
            required: [true, "Post image is required"],  // URL from ImageKit
        },
        caption: {
            type: String,
            maxlength: [300, "Caption cannot exceed 300 characters"],
            default: "",   // User's own caption (can be empty)
        },
        aiCaption: {
            type: String,
            default: "",   // AI-generated caption from your AI integration
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
