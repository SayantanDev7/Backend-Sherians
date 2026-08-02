import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectToDb from "./config/db.js";   // default import — no curly braces

const startServer = async () => {
    try {
        await connectToDb(); //promise we await here because this is async function and it returns a promise 

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();