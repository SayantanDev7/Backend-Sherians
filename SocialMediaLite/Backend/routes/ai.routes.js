import express from "express";
import multer from "multer";
import { generateCaption } from "../controllers/ai.controllers.js";

const router = express.Router();

// Multer takes the uploaded file from multipart/form-data and makes it available to your Express controller as req.file.
// req.file.buffer → actual image bytes
// req.file.mimetype → "image/jpeg"

// Multer, receive uploaded files and keep them in RAM instead of saving them to disk.
const upload = multer({ storage: multer.memoryStorage() });

// For /caption, expect one file whose field name is image, process it with Multer, then run generateCaption
router.post("/caption", upload.single("image"), generateCaption);

export default router;