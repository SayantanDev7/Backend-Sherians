// ============================================================
// app.js
// ============================================================
//
// ROLE IN THE APP:
//   server.js  →  app.js  →  routes  →  controllers  →  models
//
// This file creates and configures the Express application.
// It does NOT start the HTTP server (that's server.js's job).
// Keeping them separate makes it easy to test the app without
// actually binding to a port.
//
// REQUEST PIPELINE (every request passes through in this order):
//   1. CORS check    → allow/block based on origin
//   2. JSON parser   → turn raw JSON body into req.body object
//   3. URL parser    → turn form-data text fields into req.body
//   4. Route matcher → hand off to the right router
// ============================================================

import express      from "express";
import cors         from "cors";
import cookieParser from "cookie-parser";
import songroutes   from "../routes/song.routes.js";
import authroutes   from "../routes/auth.routes.js";

const app = express();

// ─── CORS ────────────────────────────────────────────────────
// Browser security blocks cross-origin requests by default.
// This tells the browser "requests from localhost:5173 are OK".
// credentials:true is needed so cookies (JWT token) travel with requests.
app.use(cors({
    origin     : "http://localhost:5173",
    credentials: true,
}));

// ─── Body & Cookie parsers ───────────────────────────────────
// express.json()       → parses application/json bodies
// express.urlencoded() → parses form-data TEXT fields
// cookieParser()       → parses cookies from headers and attaches them to req.cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────
// Mount each router under a base path.
// The base path is PREPENDED to every route defined inside that router.
//   app.use('/songs', songroutes)  → /songs, /songs/:id ...
//   app.use('/auth',  authroutes)  → /auth/signup, /auth/login ...
app.use("/songs", songroutes);
app.use("/auth",  authroutes);

export default app;