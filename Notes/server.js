

const express = require('express');

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

app.get("/notes",(req,res)=>{
    res.json({
        message:"Notes fetched successfully",
        notes:notes
    });
})
app.listen(4000,() =>{
    console.log("Server started on port 4000");
});