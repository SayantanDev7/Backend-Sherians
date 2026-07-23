import express from "express";       // ES module import (not require)
import router from "../routes/song.routes.js";
const app = express();

app.use(express.json());

app.use('/',router);
export default app;                  // ES module export (not module.exports)