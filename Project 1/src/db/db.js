const mongoose = require("mongoose");

//function to connect to database
const connectDB = async () =>{
    //connecting to database
    try{
       await mongoose.connect("mongodb+srv://Sayantan:996633@yt-backend-sheryians.cowtcu6.mongodb.net/project1");
       console.log("Connected to DB")
    }
    catch(err){
        console.log("DB connection error:", err);
    }
}

module.exports = connectDB;