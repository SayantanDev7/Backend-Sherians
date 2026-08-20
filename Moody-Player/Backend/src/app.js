import express from "express";
import songroutes from "../routes/song.routes.js";
import authroutes from "../routes/auth.routes.js";
import cors from "cors";
const app = express();

// Allow the frontend (Vite dev server on port 5173) to call this backend
// Without this the browser blocks all requests with a CORS error
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") return res.sendStatus(200); // preflight
//   next();
// });


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // needed for form-data text fields
// app.use(cors()); //by default allows requests from any origin.

//for production ready we use strictly our own domain and origin
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/songs', songroutes);
app.use('/auth', authroutes)

export default app;