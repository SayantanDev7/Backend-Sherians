// ============================================================
// auth.routes.js  —  Authentication routes
// ============================================================
//
// ROLE IN THE APP:
//   app.js  →  /auth  →  auth.routes.js  →  userModel / bcrypt / jwt
//
// Endpoints:
//   POST /auth/signup   Create a new user account
//   POST /auth/login    Authenticate + issue a JWT cookie
//   GET  /auth/logout   Clear the JWT cookie
//
// NOTE: Unlike song routes, auth logic lives directly in this file
// (no separate controller) because there are only 3 small handlers.
// Once they grow (e.g. forgot-password, refresh-token), extract them
// into controllers/auth.controller.js following the same pattern as
// song.controller.js.
// ============================================================

import express   from "express";
import userModel from "../models/user.model.js";
import bcrypt    from "bcrypt";
import jwt       from "jsonwebtoken";

const router = express.Router();


// ─────────────────────────────────────────────────────────────
// POST /auth/signup  — Register a new user
//
// FLOW:
//   1. Extract & sanitise { username, email, password } from req.body
//   2. Check all fields are present  (400 if missing)
//   3. Check the email isn't already in the DB  (400 if taken)
//   4. userModel.create()  → Mongoose validates + the pre-save hook
//      hashes the password with bcrypt before writing to MongoDB
//   5. Return 201 with the created user document
// ─────────────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
    const username = req.body.username?.trim();
    const email    = req.body.email?.trim().toLowerCase();
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

        // Password is hashed inside userModel's pre-save hook (user.model.js)
        const createdUser = await userModel.create({ username, email, password });
        return res.status(201).json({ success: true, message: "User created successfully", createdUser });

    } catch (error) {
        // Mongoose validation error → return the exact message (e.g. "bad username format")
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages[0] });
        }
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// ─────────────────────────────────────────────────────────────
// POST /auth/login  — Authenticate a user
//
// FLOW:
//   1. Extract & sanitise { email, password } from req.body
//   2. Find the user by email in MongoDB  (400 if not found)
//   3. user.comparePassword()  → bcrypt.compare() inside user.model.js
//      (401 if password doesn't match)
//   4. jwt.sign()  → create a signed token containing { id, username, email }
//      Token expires in 7 days
//   5. res.cookie()  → store token in an httpOnly cookie
//      (httpOnly = JS on the client CANNOT read it → XSS safe)
//   6. Return 200 with basic user info (no password)
// ─────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please enter all the fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
    }

    // comparePassword is defined on the schema in user.model.js
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Sign a JWT with user identity payload
    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Set as httpOnly cookie so the browser sends it automatically on every request
    res.cookie("token", token, {
        httpOnly: true,
        secure  : process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "strict",
        maxAge  : 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return res.json({
        success: true,
        message: "User logged in successfully",
        user: {
            id      : user._id,
            username: user.username,
            email   : user.email,
        },
    });
});


// ─────────────────────────────────────────────────────────────
// GET /auth/logout  — Log out the current user
//
// FLOW:
//   clearCookie("token")  → tells the browser to delete the JWT cookie
//   No DB call needed — the token simply stops being sent.
// ─────────────────────────────────────────────────────────────
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ success: true, message: "User logged out successfully" });
});


export default router;