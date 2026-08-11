import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDb =  async () =>{
    try{
       await mongoose.connect(process.env.MONGODB_URL)
       console.log("Connected to db");
    }
    catch(error){
        console.log(error)
    }
}

export default connectToDb;