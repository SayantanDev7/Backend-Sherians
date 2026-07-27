import mongoose from "mongoose";

//schema for song data
const songschema = new mongoose.Schema({
    title:{type:String},
    artist:{type:String},
    audio:String,
    mood:{type:String, lowercase:true}, // Mongoose auto-converts to lowercase before saving
})

const song = mongoose.model("song", songschema);
export default song;