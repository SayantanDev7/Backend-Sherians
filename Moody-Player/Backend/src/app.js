import express from "express";       // ES module import (not require)
import songroutes from "../routes/song.routes.js";
const app = express();

app.use(express.json());

app.use('/',songroutes);
export default app;                  // ES module export (not module.exports)