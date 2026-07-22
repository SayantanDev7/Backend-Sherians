import mongoose from "mongoose";    // ES module import (not require)

const connectToDb = async () => {  // async so we can properly await the connection
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to database", error);
    }
}

export default connectToDb;        // ES module export (not module.exports)