import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [20, "Username cannot exceed 20 characters"],
        match: [
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers and underscore"
        ]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    }
})

const authModel = mongoose.model("authModel", authSchema);
export default authModel;