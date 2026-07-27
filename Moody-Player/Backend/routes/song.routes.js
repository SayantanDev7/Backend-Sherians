import express from "express";
import multer from "multer";
import uploadFile from "../service/storage.service.js";
import songModel from "../models/song.model.js";
const router = express.Router();

//multer is the middleware
const upload = multer({
    storage: multer.memoryStorage(), // stores files temporarily in RAM
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /songs  — Upload MULTIPLE songs in a single request
//
// How to send in Postman (form-data):
//   Key: audio   Type: File   → select file 1
//   Key: audio   Type: File   → select file 2  (same key, different file)
//   Key: title   Type: Text   → "Song 1 Title"
//   Key: title   Type: Text   → "Song 2 Title"   (order must match audio order)
//   Key: artist  Type: Text   → "Artist 1"
//   Key: artist  Type: Text   → "Artist 2"
//   Key: mood    Type: Text   → "happy"
//   Key: mood    Type: Text   → "sad"
//
// upload.array('audio', 20) → accepts up to 20 audio files under the key 'audio'
// req.files → array of file objects [ { buffer, originalname, ... }, ... ]
// req.body.title, .artist, .mood → arrays of strings [ 'title1', 'title2' ]
// ─────────────────────────────────────────────────────────────────────────────
router.post('/songs', upload.array('audio', 20), async (req, res) => {
    try {
        const files = req.files; // array of uploaded audio files

        // Normalize any field to always be an array
        // (if only 1 song is sent, multer gives a string, not an array)
        const toArray = (val) => {
            if (!val) return [];
            return Array.isArray(val) ? val : [val];
        };

        const titles  = toArray(req.body.title);
        const artists = toArray(req.body.artist);
        const albums  = toArray(req.body.album);
        const genres  = toArray(req.body.genre);
        const moods   = toArray(req.body.mood);

        // Validate: number of files must match number of titles/moods
        if (files.length !== titles.length || files.length !== moods.length) {
            return res.status(400).json({
                message: "Mismatch: number of audio files must equal number of titles and moods.",
                filesReceived: files.length,
                titlesReceived: titles.length,
                moodsReceived: moods.length,
            });
        }

        // Upload each file to ImageKit and save each song to MongoDB in parallel
        const uploadPromises = files.map(async (file, index) => {
            const filedata = await uploadFile(file); // upload to ImageKit

            return songModel.create({   // save to MongoDB
                title:   titles[index],
                artist:  artists[index]  || "Unknown Artist",
                album:   albums[index]   || "",
                genre:   genres[index]   || "",
                audio:   filedata.url,
                fileId:  filedata.fileId,
                mood:    moods[index],
            });
        });

        // Wait for all uploads + DB inserts to finish
        const savedSongs = await Promise.all(uploadPromises);

        res.status(201).json({
            message: `${savedSongs.length} song(s) uploaded successfully`,
            songs: savedSongs,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Failed to upload song(s)",
            error: error.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /songs?mood=happy  → fetch songs by mood
// GET /songs             → fetch all songs (no mood filter)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/songs", async (req, res) => {
    const mood = req.query.mood;
    const filter = mood ? { mood: mood } : {}; // if mood is provided, filter by it

    const songs = await songModel.find(filter);

    if (songs.length === 0) {
        return res.status(404).json({
            message: mood ? `No songs found for mood: ${mood}` : "No songs found",
        });
    }

    res.status(200).json({
        message: "Songs fetched successfully",
        songs: songs,
    });
});

export default router;