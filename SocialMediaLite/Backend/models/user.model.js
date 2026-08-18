import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [20, "Username cannot exceed 20 characters"],
            match: [
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers and underscore",
            ],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
        },
        avatar: {
            type: String,
            default: "",   // URL to profile picture (ImageKit)
        },
        bio: {
            type: String,
            maxlength: [150, "Bio cannot exceed 150 characters"],
            default: "",
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;