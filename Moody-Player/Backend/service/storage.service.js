// ============================================================
// service/storage.service.js  —  ImageKit file upload service
// ============================================================
//
// ROLE IN THE APP:
//   song.controller.js  →  uploadFile()  →  ImageKit CDN
//
// WHY a separate service?
//   Keeps cloud-storage concerns out of the controller.
//   If we ever switch from ImageKit to S3 / Cloudinary,
//   only this file changes — controllers stay untouched.
//
// FLOW of uploadFile(file):
//   1. Receive a Multer file object  { buffer, originalname, ... }
//   2. Convert the Buffer to a format ImageKit understands (toFile)
//   3. Generate a unique filename using a new MongoDB ObjectId
//      so two uploads of "song.mp3" never collide
//   4. Upload to the /songs folder on ImageKit
//   5. Return the result object  { url, fileId, name, ... }
//      → the controller stores result.url in MongoDB
// ============================================================

import ImageKit, { toFile } from "@imagekit/nodejs";
import dotenv    from "dotenv";
import mongoose  from "mongoose";
dotenv.config();

// ─── ImageKit client ─────────────────────────────────────────
// Initialised once at module load time (singleton).
// Reads credentials from .env — never hard-code secrets.
const imagekit = new ImageKit({
    publicKey  : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ─── uploadFile ──────────────────────────────────────────────
async function uploadFile(file) {
    try {
        const result = await imagekit.files.upload({
            // toFile() wraps the Buffer so the SDK can stream it
            file    : await toFile(file.buffer, file.originalname),

            // Unique filename: <ObjectId>.<original-extension>
            // e.g. "64f1a2b3c4d5e6f7a8b9c0d1.mp3"
            // Using ObjectId avoids collisions even for concurrent uploads
            fileName: `${new mongoose.Types.ObjectId().toString()}.${file.originalname.split(".").pop()}`,

            folder  : "/songs", // logical folder inside your ImageKit media library
        });

        return result; // { url, fileId, name, size, ... }

    } catch (error) {
        console.error("ImageKit upload failed:", error.stack);
        throw error; // bubble up so the controller returns a 500
    }
}

export default uploadFile;