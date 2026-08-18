import express from "express"
import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const router = express.Router();

/*
POST /signup
POST /login
GET /user [protected]
*/

router.post("/signup", async (req, res) => {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all the fields",
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const createdUser = await userModel.create({ username, email, password });
        return res.status(201).json({ success: true, message: "User created successfully", createdUser });

    } catch (error) {
        // Mongoose validation error → return the exact message (e.g. "bad username")
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages[0] });
        }
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})



export default router;