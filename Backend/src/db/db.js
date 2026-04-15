// const mongoose = require("mongoose");

// async function connectDB(){
//     await mongoose.connect("mongodb+srv://Sayantan:996633@yt-backend-sheryians.cowtcu6.mongodb.net/Halley") //Halley is the database name
//     console.log("Connected to MongoDB");
// }

// module.exports = connectDB();

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Sayantan:996633@yt-backend-sheryians.cowtcu6.mongodb.net/Halley") //Halley is the database name
        console.log("MongoDB connected");
    } catch (error) {
        console.log("DB connection error:", error);
    }
};

module.exports = connectDB; // ✅ VERY IMPORTANT