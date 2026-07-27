import mongoose from "mongoose";

//schema for song data
const songschema = new mongoose.Schema({
    title:{type:String},
    artist:{type:String},
    audio:String,
    mood:{type:[String], lowercase:true}, // Array — one song can have multiple moods e.g. ["energetic","happy"]
})

const song = mongoose.model("song", songschema);
export default song;