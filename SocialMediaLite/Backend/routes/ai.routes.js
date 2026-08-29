import express from "express";
import multer from "multer";
import { generateCaption } from "../controllers/ai.controllers.js";

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.post("/caption", upload.single("image"), generateCaption);

export default router;