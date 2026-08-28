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

import express from "express";
import multer  from "multer";

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
// POST /songs
// Upload one or more audio files + metadata in a single request.
//
// How to send in Postman (form-data):
//   Key: audio   Type: File   → select file 1
//   Key: audio   Type: File   → select file 2  (same key, different file)
//   Key: title   Type: Text   → "Song 1 Title"
//   Key: title   Type: Text   → "Song 2 Title"   (order must match audio)
//   Key: artist  Type: Text   → "Artist 1"
//   Key: mood    Type: Text   → "happy"           (can be comma-separated)
//
// upload.array('audio', 20) → accepts up to 20 audio files under key 'audio'
// Multer populates req.files (array) and req.body (text fields)
// then the uploadSongs controller takes over.
// ─────────────────────────────────────────────────────────────
router.post("/", upload.array("audio", 20), uploadSongs);


// ─────────────────────────────────────────────────────────────
// GET /songs           → fetch ALL songs
// GET /songs?mood=happy → fetch songs filtered by mood
//
// The controller reads req.query.mood and builds the DB filter.
// ─────────────────────────────────────────────────────────────
router.get("/", getSongs);


// ─────────────────────────────────────────────────────────────
// GET /songs/:id  → fetch a single song by its MongoDB _id
// ─────────────────────────────────────────────────────────────
router.get("/:id", getSongById);


// ─────────────────────────────────────────────────────────────
// DELETE /songs/:id  → delete a song document from MongoDB
// ─────────────────────────────────────────────────────────────
router.delete("/:id", deleteSong);


export default router;
