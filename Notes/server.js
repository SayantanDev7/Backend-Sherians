const express = require('express');
const connectToDb = require("./src/db/db");
const noteModel = require("./src/models/note.model");

connectToDb(); //production says to call it in server.js file so thats its more readable 
const app = express(); //server created

app.use(express.json()); // parse JSON request body
//Note has title and description

let notes = [];

//to get the notes at first we need to post 

//this server code is for handling one note at a time not multiple notes in an array of notes
app.post("/notes",async (req,res) =>{ ///notes is API name
     
    const newnote = req.body;
    
    //now using model we are creating a new note 
    await noteModel.create(newnote);
    res.json({
        message:"Note added successfully to database",
        notes:newnote //we add this to show that the note is added successfully and also show the note
    })
     
})

app.patch("/notes/:id",(req,res) =>{
    const index = req.params.id;

    //find() is used to find the note with the given id
    const note = notes.find((note) => note.id === index);
    if (!note) {
        return res.status(404).json({ //status 404 means Not Found
            message: "Note not found"
        });
    }
    const {title,description} = req.body;

    //assigning the value from req.body to the note
    note.title = title;
    note.description = description;

    res.json({
        message:"Note updated successfully",
        notes:notes
    })
    
})

app.get("/notes",async (req,res)=>{
    const notes = await noteModel.find(); //now this is interacting with mongo db
    console.log("The notes are ",notes);
    res.json({
        message:"All notes fetched successfully",
        notes:notes
    })
})

app.delete("/notes/:id",async (req,res) =>{
    const {id} = req.params;
    if(!id || id.trim() === ""){
        return res.status(404).json({
            message:"Note id is required",
            success:false
        })
    }
    const note = await noteModel.findByIdAndDelete(id);
    if(!note){
        return res.status(404).json({
            message:"Note not found",
            success:false
        })
    }
    console.log("The deleted note is ",note);
    // const id = req.params.id; // id will be taken from the url path as parameter
    
    // const filteredNotes = notes.filter((note) => note.id !== id); //we only store the notes which are not matching with the id
    // notes = filteredNotes; //then we update the notes
    
    res.json({
        message:"Note deleted successfully",
        note:note
    });
})
app.listen(4000,() =>{
    console.log("Server started on port 4000");
});