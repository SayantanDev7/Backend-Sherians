// ============================================================
// config/db.js  —  MongoDB connection helper
// ============================================================
//
// ROLE IN THE APP:
//   server.js calls connectToDb() once at startup.
//   If the connection fails → server.js catches the error and exits.
//
// WHY a separate file?
//   Keeps database concerns isolated. Any file that needs the
//   connection just uses the already-connected mongoose instance
//   (Mongoose is a singleton — one connection shared everywhere).
// ============================================================

import mongoose from "mongoose"; // ES module import (not require)

const connectToDb = async () => {
    try {
        // mongoose.connect returns a promise; we await it so the
        // caller (server.js) knows when the connection is ready.
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to database", error);
        throw error; // re-throw so server.js can catch it and exit
    }
};

export default connectToDb; // ES module export (not module.exports)