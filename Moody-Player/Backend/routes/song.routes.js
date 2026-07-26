import express from "express";
import multer from "multer";
import uploadFile from "../service/storage.service.js";
import songModel from "../models/song.model.js";
const router = express.Router();

//multer is the middleware
const upload= multer({
    storage:multer.memoryStorage(),//multer.memoryStorage() is used to store the file in the ram of the server temporarily
    
}); // for form data format to read the data we use multer

//memory storage is the ram of server where multer temporarily stores the audio

//'audio' because in postman we send the data in form data format and the key is 'audio'
router.post('/songs',upload.single('audio'), async (req,res) =>{ //to create and upload song in detabase
    try {
        const {title,artist,album,genre,release_date,duration,coverImage,audio} = req.body;
        console.log(req.body);
        console.log(req.file); //for the file (we can get the metadata of the file)
        const filedata = await uploadFile(req.file);//uploadFIle is the function that will upload the file to the cloud
        
        console.log(filedata)

        //adding song to database
        const song = await songModel.create({
            title:req.body.title,
            artist:req.body.artist,
            album:req.body.album,
            genre:req.body.genre,
            audio:filedata.url,
            fileId:filedata.fileId,
            mood:req.body.mood
        })
        res.status(201).json({
        message : "Song uploaded successfully",
        song:song
    });
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Failed to upload song",
            error:error.message
        })
    }
    
})

router.get("/songs",async (req,res) =>{
    const mood = req.query.mood;
    const songs = await songModel.find({mood:mood});
    if(songs.length === 0){
        return res.status(404).json({
            message:"No songs found",
            
        })
    }
    else{
        const songs = await songModel.find();
        res.status(200).json({
            message:"Songs fetched successfully",
            songs:songs
        })
    }
})

export default router;