console.log("APP.JS LOADED");
const express = require('express');

//created a server
const app = express();
app.use(express.json()); //express.json is the middleware which convert req.body to json.format 

app.post('/note',(req,res) =>{
    console.log(req.body);
})

const notes = [];

console.log("NOTES ARRAY INITIALIZED");

//post is the method and notes is the API name
app.post("/notes",(req,res) =>{
    console.log(req.body);
    notes.push(req.body);

    res.status(201).json({ //201 denotes resources added successfully
        message:"Note added successfully",
        note:req.body
    })
})

app.get("/notes",(req,res) =>{
    console.log("GET ROUTE HIT");
    res.status(200).json({ //200 denotes The request was successful.

        message:"Notes fetched successfully",
        notes:notes
    });
})

app.delete("/notes/:index",(req,res) =>{
    console.log("DELETE ROUTE HIT");
    const index = parseInt(req.params.index); //req.params.index gives the index no
    if(index < 0 || index >= notes.length){
        res.status(404).json({
            message:"Invalid index..Notes not found"
        });
        return;
    }
    notes.splice(index,1); //splice is used to remove the element from the array
    console.log(notes);
    res.status(200).json({ 
        //200 denotes The request was successful...
        message:"Notes deleted successfully"
    });
});

//exporting the app
module.exports = app;