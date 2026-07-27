import express from "express";
import songroutes from "../routes/song.routes.js";

const app = express();

// Allow the frontend (Vite dev server on port 5173) to call this backend
// Without this the browser blocks all requests with a CORS error
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200); // preflight
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // needed for form-data text fields

app.use('/', songroutes);

export default app;