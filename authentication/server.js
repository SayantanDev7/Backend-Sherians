import app from "./src/app.js"
import connectToDb from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

connectToDb();

app.listen(process.env.PORT, () => {
    
    console.log(`Server is running on port ${process.env.PORT}`);
});