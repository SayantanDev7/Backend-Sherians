const express = require('express');
const connectToDb = require("./src/db/db");

connectToDb(); //production says to call it in server.js file so thats its more readable 
const app = express(); //server created

app.use(express.json()); // parse JSON request body
//Note has title and description

let notes = [];

//to get the notes at first we need to post 

//this server code is for handling one note at a time not multiple notes in an array of notes
app.post("/notes",(req,res) =>{ ///notes is API name
     
    const newnote = req.body;

    notes.push(...newnote);
     console.log(notes)
     res.json({
        message:"Note added successfully",
        notes:notes //we add this to show that the note is added successfully and also show the note
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

app.get("/notes",(req,res)=>{
    res.json({
        message:"Notes fetched successfully",
        notes:notes
    });
})

app.delete("/notes/:id",(req,res) =>{
    const id = req.params.id; // id will be taken from the url path as parameter
    
    const filteredNotes = notes.filter((note) => note.id !== id); //we only store the notes which are not matching with the id
    notes = filteredNotes; //then we update the notes
    
    res.json({
        message:"Note deleted successfully",
        notes:notes
    });
})
app.listen(4000,() =>{
    console.log("Server started on port 4000");
});