import express from "express"
import authRoutes from "../routes/auth.routes.js"
import postRoutes from "../routes/post.routes.js"
import cookieParser from "cookie-parser"
import aiRoutes from "../routes/ai.routes.js";
const app = express();

app.use(express.json()); //  This line tells Express to parse incoming request bodies as JSON. 
app.use(cookieParser()); // This line tells Express to parse incoming request cookies.


// routes for authentication
app.use("/auth",authRoutes)
// routes for posts
app.use("/posts",postRoutes)
// routes for ai
app.use("/api/ai", aiRoutes);

export default app;
