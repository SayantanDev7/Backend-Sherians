import express from "express"
import authController from "../controllers/auth.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router();

/*
POST /signup
POST /login
GET /user [protected]
*/

router.post("/signup",authController.signupController)

router.post("/login",authController.loginController)

// Protected: returns the currently logged-in user
router.get("/user", authMiddleware, (req, res) => {
    res.json({ success: true, user: req.user });
});


export default router;