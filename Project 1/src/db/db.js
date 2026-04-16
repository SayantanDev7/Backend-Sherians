const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
       await mongoose.connect("mongodb+srv://Sayantan:996633@yt-backend-sheryians.cowtcu6.mongodb.net/project1");
       console.log("Connected to DB")
    }
    catch(err){
        console.log("DB connection error:", err);
    }
}

module.exports = connectDB;