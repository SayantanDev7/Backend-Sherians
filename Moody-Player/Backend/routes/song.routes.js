// ============================================================
// song.routes.js
// ============================================================
//
// ROLE IN THE APP:
//   app.js  →  song.routes.js  →  song.controller.js  →  Model/Service
//
// This file is ONLY responsible for:
//   1. Registering the HTTP method + URL path
//   2. Attaching Multer middleware (for multipart/form-data file uploads)
//   3. Calling the right controller function
//
// Business logic (validation, DB calls, responses) lives in
// song.controller.js — keeping routes clean and easy to read.
// ============================================================

import express        from "express";
import multer         from "multer";
import authMiddleware from "../middleware/auth.middleware.js";

// Import named exports from the controller
import {
    uploadSongs,
    getSongs,
    getSongById,
    deleteSong,
} from "../controllers/song.controller.js";

const router = express.Router();

// ─── Multer setup ────────────────────────────────────────────
// memoryStorage() keeps the uploaded file in RAM as a Buffer.
// We pass that Buffer directly to the ImageKit SDK — no temp
// files written to disk.
const upload = multer({ storage: multer.memoryStorage() });


// ─────────────────────────────────────────────────────────────
// POST /songs  [Protected]
// Upload one or more audio files + metadata in a single request.
//
// Middleware pipeline:
//   1. authMiddleware → checks JWT cookie & ensures user is logged in
//   2. upload.array   → parses multipart/form-data & audio buffers
//   3. uploadSongs    → pushes to ImageKit & saves to MongoDB
// ─────────────────────────────────────────────────────────────
router.post("/", authMiddleware, upload.array("audio", 20), uploadSongs);


// ─────────────────────────────────────────────────────────────
// GET /songs           → fetch ALL songs
// GET /songs?mood=happy → fetch songs filtered by mood
//
// Public endpoint: any listener can browse and stream songs.
// ─────────────────────────────────────────────────────────────
router.get("/", getSongs);


// ─────────────────────────────────────────────────────────────
// GET /songs/:id  → fetch a single song by its MongoDB _id
// ─────────────────────────────────────────────────────────────
router.get("/:id", getSongById);


// ─────────────────────────────────────────────────────────────
// DELETE /songs/:id  [Protected]
// Delete a song document from MongoDB
// ─────────────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, deleteSong);


export default router;
