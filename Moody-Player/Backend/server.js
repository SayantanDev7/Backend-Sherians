// ============================================================
// server.js  —  Entry point of the application
// ============================================================
//
// ROLE IN THE APP:
//   server.js  →  connects DB  →  starts HTTP server
//
// WHY this order matters:
//   We connect to MongoDB FIRST, then start listening.
//   If the DB connection fails, we exit immediately (process.exit(1))
//   rather than accepting requests that would all fail anyway.
//
// STARTUP SEQUENCE:
//   1. Load .env variables (dotenv.config)
//   2. Import configured Express app  (app.js)
//   3. Connect to MongoDB             (config/db.js)
//   4. Start HTTP server on PORT      (app.listen)
// ============================================================

import dotenv from "dotenv";
dotenv.config(); // must run before any process.env.* access

import app         from "./src/app.js";
import connectToDb from "./config/db.js";

const startServer = async () => {
    try {
        await connectToDb(); // wait for DB before accepting traffic

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // non-zero exit signals an error to the OS / process manager
    }
};

startServer();