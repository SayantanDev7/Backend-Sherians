// ============================================================
// middleware/auth.middleware.js  —  Route Protection Middleware
// ============================================================
//
// ROLE IN THE APP:
//   Incoming Request  →  cookieParser  →  authMiddleware  →  Protected Route / Controller
//
// HOW IT WORKS:
//   1. Reads JWT `token` from `req.cookies.token`
//   2. If missing → 401 Unauthorized
//   3. Verifies and decodes the token with JWT_SECRET
//   4. Fetches the user from MongoDB (without the password field)
//   5. If user not found → 401 Unauthorized
//   6. Attaches `req.user = user` and calls `next()` to continue
// ============================================================

import jwt       from "jsonwebtoken";
import userModel from "../models/user.model.js";

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token not provided",
            });
        }

        // Verify token signature & expiry
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB and exclude password
        const user = await userModel.findById(decodedToken.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        // Attach user to the request object so downstream controllers can access it
        req.user = user;
        next();

    } catch (error) {
        // Handle invalid / expired JWT specifically with a 401 status
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid or expired token",
            });
        }

        console.error("authMiddleware error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export default authMiddleware;