import mongoose from "mongoose";

//schema for song data
const songschema = new mongoose.Schema({
   title:{type:String,
        required:true,
        trim:true
    },
    artist:{type:String,
        required:true,
        trim:true
    },
    audio:{type:String,
        required:true
    },
    mood: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    enum: {
        values: [
            "energetic",
            "happy",
            "calm",
            "sad",
            "focus",
            "angry"
        ],
        message: "{VALUE} is not a supported mood."
    }
    } // Array — one song can have multiple moods e.g. ["energetic","happy"]
})

const song = mongoose.model("song", songschema); //Model name is song mongoose automatically pluralizes it to songs which is the collection name in the db
export default song; 