import express from "express"
import app from "./src/app.js"
import "dotenv/config";
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