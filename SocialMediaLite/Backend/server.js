// ⚠️ dotenv MUST be the very first import in the entire app.
// ES modules evaluate imports in order — if app.js (and gemini.js inside it)
// loads before dotenv runs, process.env.GEMINI_API_KEY is undefined → ADC fallback error.
import "dotenv/config";

import app         from "./src/app.js";
import connectToDb from "./config/db.js";



const startServer = async () =>{
    try{
        await connectToDb();
        app.listen(process.env.PORT,() => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.log(error);
    }
}

startServer();