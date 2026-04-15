const mongoose = require("mongoose");

async function connectDB(){
    await mongoose.connect("mongodb+srv://Sayantan:996633@yt-backend-sheryians.cowtcu6.mongodb.net/Halley") //Halley is the database name
    console.log("Connected to MongoDB");
}

module.exports = connectDB();