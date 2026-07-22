import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectToDb from "./config/db.js";   // default import — no curly braces
connectToDb();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})