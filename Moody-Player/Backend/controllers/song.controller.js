// ============================================================
// song.controller.js
// ============================================================
//
// ROLE IN THE APP:
//   Routes  →  Controllers  →  Service / Model  →  DB / ImageKit
//
// This file holds the BUSINESS LOGIC for song-related endpoints.
// The routes file (song.routes.js) only does two things:
//   1. Register the HTTP method + path
//   2. Attach Multer middleware (for file uploads)
// Everything else — validation, DB calls, response shaping —
// lives here so routes stay thin and readable.
// ============================================================

import songModel  from "../models/song.model.js";
import uploadFile from "../service/storage.service.js";

// ─────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────

/**
 * toArray(val)
 * Multer puts a single text field as a plain string and multiple
 * values as an array. This helper normalises both cases so the
 * rest of the code always works with arrays.
 *
 * ""          → []
 * "happy"     → ["happy"]
 * ["a","b"]   → ["a","b"]
 */
const toArray = (val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
};


// ─────────────────────────────────────────────────────────────
// CONTROLLER 1 — Upload Songs
// ─────────────────────────────────────────────────────────────
//
// FLOW:
//   POST /songs
//   │
//   ├─ Multer middleware (in routes)  → puts files in req.files
//   │                                   and text fields in req.body
//   │
//   └─ uploadSongs (this function)
//       ├─ Normalise all text arrays with toArray()
//       ├─ Parse comma-separated moods  ("energetic,happy" → array)
//       ├─ Validate: file count must match title count
//       ├─ For each file (parallel via Promise.all):
//       │     uploadFile()  → sends buffer to ImageKit → gets back URL
//       │     songModel.create() → saves doc to MongoDB
//       └─ Respond 201 with saved song documents
//
// ─────────────────────────────────────────────────────────────
export const uploadSongs = async (req, res) => {
    try {
        const files = req.files; // array of Multer file objects [{buffer, originalname, ...}]

        // --- Normalise body fields to arrays ---
        const titles  = toArray(req.body.title);
        const artists = toArray(req.body.artist);
        const albums  = toArray(req.body.album);
        const genres  = toArray(req.body.genre);

        // Mood can be comma-separated for a single song:
        //   "energetic,happy" means this one song belongs to both moods
        const rawMoods = toArray(req.body.mood);
        const moods    = rawMoods.map(m =>
            m.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        );

        // --- Basic validation ---
        // Every audio file needs at least a title; artists/moods are optional
        if (files.length !== titles.length) {
            return res.status(400).json({
                message       : "Mismatch: number of audio files must equal number of titles.",
                filesReceived : files.length,
                titlesReceived: titles.length,
            });
        }

        // --- Upload each file to ImageKit + save to MongoDB (all in parallel) ---
        // Promise.all waits for every async operation to finish before moving on
        const uploadPromises = files.map(async (file, index) => {
            // Step A: Push the audio buffer to ImageKit → returns { url, fileId, ... }
            const filedata = await uploadFile(file);

            // Step B: Persist song metadata + the returned CDN URL to MongoDB
            return songModel.create({
                title  : titles[index],
                artist : artists[index] || "Unknown Artist",
                audio  : filedata.url,      // CDN URL stored in DB
                mood   : moods[index]?.[0] || "neutral", // takes first mood from array (schema stores one)
            });
        });

        const savedSongs = await Promise.all(uploadPromises);

        return res.status(201).json({
            message: `${savedSongs.length} song(s) uploaded successfully`,
            songs  : savedSongs,
        });

    } catch (error) {
        console.error("uploadSongs error:", error.message);
        return res.status(500).json({
            message: "Failed to upload song(s)",
            error  : error.message,
        });
    }
};


// ─────────────────────────────────────────────────────────────
// CONTROLLER 2 — Get Songs (with optional mood filter)
// ─────────────────────────────────────────────────────────────
//
// FLOW:
//   GET /songs?mood=happy
//   │
//   └─ getSongs (this function)
//       ├─ Read optional ?mood query param
//       ├─ Build Mongoose filter  ({} = all  |  {mood} = filtered)
//       ├─ songModel.find(filter)  → queries MongoDB
//       ├─ 404 if nothing matches
//       └─ 200 with songs array
//
// ─────────────────────────────────────────────────────────────
export const getSongs = async (req, res) => {
    try {
        // ?mood=Happy  → normalised to "happy" (DB stores lowercase)
        const mood   = req.query.mood ? req.query.mood.toLowerCase().trim() : null;
        const filter = mood ? { mood } : {};  // empty filter = fetch everything

        const songs = await songModel.find(filter);

        if (songs.length === 0) {
            return res.status(404).json({
                message: mood
                    ? `No songs found for mood: ${mood}`
                    : "No songs in the database yet",
            });
        }

        return res.status(200).json({
            message: "Songs fetched successfully",
            count  : songs.length,
            songs,
        });

    } catch (error) {
        console.error("getSongs error:", error.message);
        return res.status(500).json({
            message: "Failed to fetch songs",
            error  : error.message,
        });
    }
};


// ─────────────────────────────────────────────────────────────
// CONTROLLER 3 — Get a Single Song by ID
// ─────────────────────────────────────────────────────────────
//
// FLOW:
//   GET /songs/:id
//   │
//   └─ getSongById
//       ├─ Read :id from URL params
//       ├─ songModel.findById(id) → queries MongoDB by _id
//       ├─ 404 if not found
//       └─ 200 with the song document
//
// ─────────────────────────────────────────────────────────────
export const getSongById = async (req, res) => {
    try {
        const song = await songModel.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        return res.status(200).json({
            message: "Song fetched successfully",
            song,
        });

    } catch (error) {
        console.error("getSongById error:", error.message);
        // Mongoose throws CastError when the id format is invalid (not a valid ObjectId)
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid song ID format" });
        }
        return res.status(500).json({
            message: "Failed to fetch song",
            error  : error.message,
        });
    }
};


// ─────────────────────────────────────────────────────────────
// CONTROLLER 4 — Delete a Song by ID
// ─────────────────────────────────────────────────────────────
//
// FLOW:
//   DELETE /songs/:id
//   │
//   └─ deleteSong
//       ├─ Read :id from URL params
//       ├─ songModel.findByIdAndDelete(id) → removes doc from MongoDB
//       ├─ 404 if song did not exist
//       └─ 200 with deleted song data as confirmation
//
// NOTE: This does NOT delete the file from ImageKit.
//       To add that, call imagekit.deleteFile(song.fileId) before
//       removing the DB document.
//
// ─────────────────────────────────────────────────────────────
export const deleteSong = async (req, res) => {
    try {
        const deletedSong = await songModel.findByIdAndDelete(req.params.id);

        if (!deletedSong) {
            return res.status(404).json({ message: "Song not found" });
        }

        return res.status(200).json({
            message: "Song deleted successfully",
            song   : deletedSong,  // return the deleted doc so the client knows what was removed
        });

    } catch (error) {
        console.error("deleteSong error:", error.message);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid song ID format" });
        }
        return res.status(500).json({
            message: "Failed to delete song",
            error  : error.message,
        });
    }
};
