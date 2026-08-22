import express from "express"
import authController from "../controllers/auth.controller.js"

const router = express.Router();

/*
POST /signup
POST /login
GET /user [protected]
*/

router.post("/signup",authController.signupController)

router.post("/login",authController.loginController)



export default router;