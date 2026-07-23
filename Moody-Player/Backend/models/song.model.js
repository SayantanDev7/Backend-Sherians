import mongoose from "mongoose";

const songschema = new mongoose.Schema({
    title:{type:String},
    artist:{type:String},
    audio:String,
    mood:{type:String},
})

const song = mongoose.model("song", songschema);
export default song;