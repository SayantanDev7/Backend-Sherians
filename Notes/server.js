

const express = require('express');

const app = express(); //server created

app.use(express.json()); // parse JSON request body
//Note has title and description

let notes = [];

//to get the notes at first we need to post 

//this server code is for handling one note at a time not multiple notes in an array of notes
app.post("/notes",(req,res) =>{ ///notes is API name
     const {id,title,description} = req.body;

     const note = {
        id: notes.length+1,
        title: title,
        description: description
     }
     notes.push(note);
     console.log(notes)
     res.send("Note added successfully");
     
})

app.get("/notes",(req,res)=>{
    res.send(notes);
})
app.listen(4000,() =>{
    console.log("Server started on port 4000");
});